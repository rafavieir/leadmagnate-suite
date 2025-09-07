export type Lead = {
  id: string; name: string; email: string; company: string;
  phone?: string; source: string; score: number;
  status: "novo" | "potencial" | "descartado";
  pipeline_stage: "prospecto" | "qualificado" | "proposta" | "negociacao" | "fechado" | "perdido";
  value: number; proposalValue: number; createdAt: string;
  notes?: string; position?: string; linkedinUrl?: string; lastContact?: string; lossReason?: string;
};

export async function fetchLeadsFromSheets(): Promise<Lead[]> {
  const r = await fetch("/api/leads-from-sheets");
  if (!r.ok) throw new Error("Falha ao buscar leads do Sheets");
  const { leads } = await r.json();
  return leads as Lead[];
}
