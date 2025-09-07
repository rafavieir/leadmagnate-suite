// /api/leads-from-sheets.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { createHash } from "node:crypto";

/** COLE AQUI SEU JSON COMPLETO (igual ao script) */
const KEY_JSON = String.raw`key_json = '''{
  "type": "service_account",
  "project_id": "apt-task-462520-h1",
  "private_key_id": "5919f23c72945ef058833bbc6956b20c2c50fc94",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDu2vdQU9HNhQyN\\n6oDg98PPdCZuHHpVNBH8jyh9WrUgwYE5SwTFG0wfVu+BG2SfgOsYGfQX1Bm8c3E6\\nyL7dzEYstQMQUUnAqZDHkP9Tq4i/WShaPWkC1d3C7WDiQN6y9jUqJSnoOWRQ7FzA\\nsx4/nQGZ0uSBLfYKm7he0MvtdzyO18NAB7z/dNiV+slKK6mqEgHeoRgA6TNZXKG0\\nFmDTMpq04PgNXZz0hPI21iobzzGUEPNFJeHsQ2TRLMj4jLLPCOR/ytctwRSW0bPn\\n9EGfYDweaXfRXN2SJa/MJxSURaf3JCp8wCRz9InttVQyZUfpGphfYxzLCay8BryG\\nXHUoUwiZAgMBAAECggEAFyO1Y93K7HsgPTtjoue924IoGvC9VTXHLE1+Ia7A71xv\\ntWo0GxhK5ppYd4x80gr+O4aAJDLTD3Orm4NJIlmgzsH2ewU0/OowcXT1l1h91fPA\\nOgXK/5BSfIjcou6f5Hx/qAaTqcCtnD1Zuv1fR9BhEFLi+jTGqj5tvRnDN80eW8QR\\nZHsrOX+Io4QMkoIgrCGcpyd5NXyl34NP4vyeT2KryCs+YLdCxGacOk4lI/aYRm4r\\nqu8k7k7CmyhxoGs9A6s0cSJjY/k9xCY4S/VD+y3OWlLTBXGXfRdciFwRL9pizp7m\\n83G/LRVFTI+5yU20sY1bOY3WBmwvWgoW2bOx720aJQKBgQD9JhpgYlgWbqeeeRLm\\npAc3XrWlJRm4VemgZy7DS7dsOQDgGsVHMcYWmLF/FCLPsZ6omSaVQOpEgIlTR+Gy\\nCrzLVv/qOOSHdHUhpM3mKymHfWZw0EDIoz9ES761Ao0nvC36jNbCCxOk7zLUB/vo\\nx9enD1heXgQEJZjF5vm9u0igNwKBgQDxi6amakbjf1GNBFtyKz9MTaydCUx2ShWv\\nefau/Ppty3f2PZt16RNtOK4GWna0gHzuvCx2/Q00Zfdq2WXf8vCvdqj0MyHqGXN/\\nBZjKpGf/QitBDmQZLgJMD+1pXto5JMGgIywXVphM/VbmN7z1Mgh8WBqRGCMkfGeO\\nhXoyuT8VrwKBgDwrR0+rcFZ8nJidHHH3gMOXXkNPayqWOP5oKARBReqSLfQWSNeg\\nK/4I8v9KcO++vwBBzprhIA2CI6HIzws7ZB5Mom0wcpkDhCen/Ux869UJaETeKtfF\\nfW8lNcHeRmCwaJlJym26pkOomwMslqKAhXBuxElBvWCi8wnu2WNQVXXHAoGBAKBW\\nEg5fd6Tly81uugEEIiVVXiJznLTcop5zuEMaHGYrbPsglARl7gZPXH1NKYTR0Zxr\\nfpyRh2Vj1iOwIYbR7eCbRLWtB3Ms59TGc1D4Zywy0SGDGwD34IB7Bh4u326VLo5N\\nKqRnT/uzIy74is68IpPfq+rqedFrXxZlFeN7whtzAoGAUsOP6rcGBOVVNDnqcR25\\nVzs0b28yJwSpJuw8cTzAUHgc2r650v5qiBoxF51LAxdn7X3ZIpZib+Zv1jZbHYlW\\nePEhtuVSqgNdvDc3f4NFGv5x0auKnF0/nOCN3zAj2+YlU21GRuCc5YaWxB6yHRdQ\\nU0OndAWiXjPY7k3BkQzsOAA=\\n-----END PRIVATE KEY-----\\n",
  "client_email": "entasklead@apt-task-462520-h1.iam.gserviceaccount.com",
  "client_id": "115041629334121088517",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/entasklead%40apt-task-462520-h1.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

'''
`;
// Ex.: const KEY_JSON = String.raw`{ "type": "service_account", ... }`;

const SERVICE_ACCOUNT = (() => {
  const obj = JSON.parse(KEY_JSON);
  // Corrige '\n' da chave
  obj.private_key = String(obj.private_key).replace(/\\n/g, "\n");
  return obj;
})();

/** Ajuste estes dois conforme sua planilha */
const SHEET_ID = "COLOQUE_AQUI_O_ID_DA_PLANILHA"; // o hash da URL do Google Sheets
const SHEET_RANGE = "Página1!A1:Z20000"; // ou a aba/intervalo que você usa

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

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    if (!SERVICE_ACCOUNT?.client_email || !SERVICE_ACCOUNT?.private_key) {
      return res.status(400).json({ error: "Service Account inválida" });
    }
    if (!SHEET_ID) {
      return res.status(400).json({ error: "Defina SHEET_ID" });
    }

    const auth = new google.auth.JWT(
      SERVICE_ACCOUNT.client_email,
      undefined,
      SERVICE_ACCOUNT.private_key,
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );
    const sheets = google.sheets({ version: "v4", auth });

    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
    });

    const values = data.values ?? [];
    if (!values.length) return res.status(200).json({ leads: [] });

    const [header, ...rows] = values;
    const idx = (h: string) =>
      header.findIndex((k) => String(k).trim().toLowerCase() === h.toLowerCase());

    // Cabeçalhos do seu crawler:
    // ["Nome","Telefone","Endereço","Horário","Categoria","Nota","Avaliações","Site","Tem Site","Termo"]
    const col = {
      nome: idx("nome") > -1 ? idx("nome") : idx("Nome"),
      telefone: idx("telefone") > -1 ? idx("telefone") : idx("Telefone"),
      endereco: idx("endereço") > -1 ? idx("endereço") : idx("Endereço"),
      horario: idx("horário") > -1 ? idx("horário") : idx("Horário"),
      categoria: idx("categoria") > -1 ? idx("categoria") : idx("Categoria"),
      nota: idx("nota") > -1 ? idx("nota") : idx("Nota"),
      avaliacoes: idx("avaliações") > -1 ? idx("avaliações") : idx("Avaliações"),
      site: idx("site"),
      temSite: idx("tem site"),
      termo: idx("termo") > -1 ? idx("termo") : idx("Termo"),
    };
    const get = (r: any[], i: number) => (i >= 0 ? String(r[i] ?? "").trim() : "");

    const today = new Date().toISOString().slice(0, 10);

    const leads: Lead[] = rows
      .filter((r) => r && r.some((c) => c && String(c).trim() !== ""))
      .map((r) => {
        const nome = get(r, col.nome);
        const telefone = get(r, col.telefone);
        const endereco = get(r, col.endereco);
        const nota = Number(get(r, col.nota) || 0);
        const site = get(r, col.site);
        const termo = get(r, col.termo);

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
    console.error("[/api/leads-from-sheets] error:", err);
    res.status(500).json({ error: err?.message || "Sheets error" });
  }
}
