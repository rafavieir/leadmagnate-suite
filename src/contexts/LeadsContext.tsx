import React, { createContext, useContext, useState } from "react";

export interface Lead {
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
}

interface LeadsContextType {
  leads: Lead[];
  updateLeadStatus: (leadId: string, newStatus: "novo" | "potencial" | "descartado") => void;
  moveLeadToStage: (leadId: string, newStage: Lead["pipeline_stage"], lossReason?: string) => void;
  addLead: (newLead: Omit<Lead, "id">) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  removeLead: (leadId: string) => void;
  getLeadsByStage: (stage: Lead["pipeline_stage"]) => Lead[];
  getTotalValue: (stage: Lead["pipeline_stage"]) => number;
  getActiveLeadsValue: () => number;
  getActiveLeads: () => Lead[];
  syncFromSheets: () => Promise<void>;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

async function fetchLeadsFromSheets(): Promise<Lead[]> {
  const r = await fetch("/api/leads-from-sheets");
  if (!r.ok) throw new Error("Falha ao buscar leads do Sheets");
  const data = await r.json();
  return (data?.leads ?? []) as Lead[];
}

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const syncFromSheets = async () => {
    try {
      const next = await fetchLeadsFromSheets();
      setLeads(next);
    } catch (e) {
      console.error(e);
    }
  };

  const updateLeadStatus = (leadId: string, newStatus: "novo" | "potencial" | "descartado") => {
    if (newStatus === "descartado") {
      removeLead(leadId);
    } else {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    }
  };

  const moveLeadToStage = (leadId: string, newStage: Lead["pipeline_stage"], lossReason?: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, pipeline_stage: newStage, ...(lossReason && { lossReason }) } : l))
    );
  };

  const addLead = (newLead: Omit<Lead, "id">) => {
    setLeads((prev) => [...prev, { ...newLead, id: Date.now().toString() }]);
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...updates } : l)));
  };

  const removeLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const getLeadsByStage = (stage: Lead["pipeline_stage"]) => leads.filter((l) => l.pipeline_stage === stage);

  const getTotalValue = (stage: Lead["pipeline_stage"]) =>
    getLeadsByStage(stage).reduce((sum, l) => sum + l.proposalValue, 0);

  const getActiveLeads = () => leads.filter((l) => l.status !== "descartado" && l.pipeline_stage !== "perdido");

  const getActiveLeadsValue = () => getActiveLeads().reduce((sum, l) => sum + l.proposalValue, 0);

  return (
    <LeadsContext.Provider
      value={{
        leads,
        updateLeadStatus,
        moveLeadToStage,
        addLead,
        updateLead,
        removeLead,
        getLeadsByStage,
        getTotalValue,
        getActiveLeads,
        getActiveLeadsValue,
        syncFromSheets,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within a LeadsProvider");
  return ctx;
};
