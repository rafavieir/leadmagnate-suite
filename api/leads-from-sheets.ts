// /api/leads-from-sheets.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { createHash } from "node:crypto";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  source: string;
  score: number;
  status: "novo" | "potencial" | "descartado";
  pipeline_stage: "prospecto" | "qualificado" | "proposta" | "negociacao" | "fechado" | "perdido";
  value: number;
  proposalValue: number;
  createdAt: string;
  notes?: string;
  position?: string;
  linkedinUrl?: string;
  lastContact?: string;
  lossReason?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL!;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY!;
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
    const range = process.env.GOOGLE_SHEETS_RANGE || "Página1!A1:Z1000";

    if (!clientEmail || !privateKey || !spreadsheetId) {
      return res.status(400).json({ error: "Missing Google Sheets credentials/ids" });
    }

    privateKey = privateKey.replace(/\\n/g, "\n");

    const auth = new google.auth.JWT(clientEmail, undefined, privateKey, [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ]);
    const sheets = google.sheets({ version: "v4", auth });

    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const values = data.values ?? [];
    if (values.length === 0) return res.status(200).json({ leads: [] });

    const [header, ...rows] = values;
    const idx = (h: string) => header.findIndex((k) => String(k).trim().toLowerCase() === h.toLowerCase());
    const col = {
      nome: idx("Nome"), telefone: idx("Telefone"), endereco: idx("Endereço"),
      horario: idx("Horário"), categoria: idx("Categoria"), nota: idx("Nota"),
      avaliacoes: idx("Avaliações"), site: idx("Site"), temSite: idx("Tem Site"), termo: idx("Termo"),
    };

    const today = new Date().toISOString().slice(0, 10);

    const leads: Lead[] = rows
      .filter(r => r && r.some(c => c && String(c).trim() !== ""))
      .map((r) => {
        const get = (i: number) => (i >= 0 ? String(r[i] ?? "").trim() : "");
        const nome = get(col.nome);
        const telefone = get(col.telefone);
        const endereco = get(col.endereco);
        const nota = Number(get(col.nota) || 0);
        const site = get(col.site);
        const termo = get(col.termo);

        const id = createHash("sha1")
          .update(`${nome}|${telefone}|${site}|${termo}`)
          .digest("hex")
          .slice(0, 12);

        return {
          id,
          name: nome || "Lead",
          email: "",
          company: nome || "—",
          phone: telefone || undefined,
          source: "Google Sheets",
          score: Number.isFinite(nota) ? nota : 0,
          status: "novo",
          pipeline_stage: "prospecto",
          value: 0,
          proposalValue: 0,
          createdAt: today,
          notes: [endereco, site, termo].filter(Boolean).join(" | ") || undefined,
        };
      });

    res.status(200).json({ leads });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || "Sheets error" });
  }
}
