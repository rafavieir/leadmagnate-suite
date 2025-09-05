import React, { createContext, useContext, useState } from 'react';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
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

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    company: "TechCorp",
    phone: "(11) 99999-9999",
    source: "Website",
    score: 85,
    status: "potencial",
    pipeline_stage: "prospecto",
    value: 15000,
    proposalValue: 15000,
    createdAt: "2024-01-15",
    position: "CEO",
    notes: "Interessado em soluções de automação para empresa",
    linkedinUrl: "https://linkedin.com/in/joaosilva"
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@startup.com",
    company: "StartupXYZ",
    phone: "(11) 88888-8888",
    source: "LinkedIn",
    score: 92,
    status: "potencial",
    pipeline_stage: "qualificado",
    value: 25000,
    proposalValue: 25000,
    createdAt: "2024-01-14",
    position: "CTO",
    notes: "Empresa em crescimento, orçamento aprovado"
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@bigcompany.com",
    company: "BigCompany Ltd",
    phone: "(11) 66666-6666",
    source: "Referral",
    score: 78,
    status: "potencial",
    pipeline_stage: "proposta",
    value: 35000,
    proposalValue: 35000,
    createdAt: "2024-01-12",
    position: "Diretora de TI"
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    email: "carlos@solucoes.com",
    company: "Soluções Tech",
    phone: "(11) 55555-5555",
    source: "Website",
    score: 95,
    status: "potencial",
    pipeline_stage: "fechado",
    value: 80000,
    proposalValue: 80000,
    createdAt: "2024-01-10"
  }
];

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
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const updateLeadStatus = (leadId: string, newStatus: "novo" | "potencial" | "descartado") => {
    if (newStatus === "descartado") {
      removeLead(leadId);
    } else {
      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    }
  };

  const moveLeadToStage = (leadId: string, newStage: Lead["pipeline_stage"], lossReason?: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, pipeline_stage: newStage, ...(lossReason && { lossReason }) }
          : lead
      )
    );
  };

  const addLead = (newLead: Omit<Lead, "id">) => {
    const lead: Lead = {
      ...newLead,
      id: Date.now().toString()
    };
    setLeads(prev => [...prev, lead]);
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId ? { ...lead, ...updates } : lead
      )
    );
  };

  const getLeadsByStage = (stage: Lead["pipeline_stage"]) => {
    return leads.filter(lead => lead.pipeline_stage === stage);
  };

  const getTotalValue = (stage: Lead["pipeline_stage"]) => {
    return getLeadsByStage(stage).reduce((sum, lead) => sum + lead.proposalValue, 0);
  };

  const removeLead = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  const getActiveLeads = () => {
    return leads.filter(lead => lead.status !== "descartado" && lead.pipeline_stage !== "perdido");
  };

  const getActiveLeadsValue = () => {
    return getActiveLeads().reduce((sum, lead) => sum + lead.proposalValue, 0);
  };

  return (
    <LeadsContext.Provider value={{
      leads,
      updateLeadStatus,
      moveLeadToStage,
      addLead,
      updateLead,
      removeLead,
      getLeadsByStage,
      getTotalValue,
      getActiveLeads,
      getActiveLeadsValue
    }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};