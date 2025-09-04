import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Mail, Building } from "lucide-react";
import { Link } from "react-router-dom";

interface Lead {
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
  createdAt: string;
}

const mockPipelineLeads: Lead[] = [
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
    createdAt: "2024-01-15"
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
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@megacorp.com",
    company: "MegaCorp",
    phone: "(11) 77777-7777",
    source: "Indicação",
    score: 78,
    status: "potencial",
    pipeline_stage: "proposta",
    value: 50000,
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@inovacao.com",
    company: "Inovação Ltda",
    phone: "(11) 66666-6666",
    source: "Google Ads",
    score: 88,
    status: "potencial",
    pipeline_stage: "negociacao",
    value: 35000,
    createdAt: "2024-01-12"
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
    createdAt: "2024-01-10"
  }
];

const pipelineStages = [
  { 
    key: "prospecto", 
    title: "Prospectos", 
    description: "Leads identificados",
    color: "bg-slate-100 text-slate-900 border-slate-200"
  },
  { 
    key: "qualificado", 
    title: "Qualificados", 
    description: "Leads com interesse confirmado",
    color: "bg-blue-100 text-blue-900 border-blue-200"
  },
  { 
    key: "proposta", 
    title: "Proposta Enviada", 
    description: "Proposta comercial enviada",
    color: "bg-yellow-100 text-yellow-900 border-yellow-200"
  },
  { 
    key: "negociacao", 
    title: "Em Negociação", 
    description: "Negociando termos e valores",
    color: "bg-orange-100 text-orange-900 border-orange-200"
  },
  { 
    key: "fechado", 
    title: "Fechado", 
    description: "Negócio concluído",
    color: "bg-green-100 text-green-900 border-green-200"
  },
  { 
    key: "perdido", 
    title: "Perdido", 
    description: "Oportunidade perdida",
    color: "bg-red-100 text-red-900 border-red-200"
  }
];

const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>(mockPipelineLeads);

  const moveLeadToStage = (leadId: string, newStage: Lead["pipeline_stage"]) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, pipeline_stage: newStage }
        : lead
    ));
  };

  const getLeadsByStage = (stage: Lead["pipeline_stage"]) => {
    return leads.filter(lead => lead.pipeline_stage === stage);
  };

  const getTotalValue = (stage: Lead["pipeline_stage"]) => {
    return getLeadsByStage(stage).reduce((sum, lead) => sum + lead.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pipeline de Vendas</h1>
              <p className="text-muted-foreground">
                Gerencie suas oportunidades através do funil de vendas
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total em Negociação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(leads.filter(l => !['fechado', 'perdido'].includes(l.pipeline_stage)).reduce((sum, lead) => sum + lead.value, 0))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fechado este Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(getTotalValue("fechado"))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.length > 0 ? Math.round((getLeadsByStage("fechado").length / leads.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-x-auto">
          {pipelineStages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.key as Lead["pipeline_stage"]);
            const stageValue = getTotalValue(stage.key as Lead["pipeline_stage"]);
            
            return (
              <Card key={stage.key} className={`min-h-[600px] ${stage.color}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {stage.title}
                    <Badge variant="secondary" className="bg-white/50">
                      {stageLeads.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {stage.description}
                  </CardDescription>
                  {stageValue > 0 && (
                    <div className="text-xs font-semibold">
                      {formatCurrency(stageValue)}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {stageLeads.map((lead) => (
                    <Card key={lead.id} className="bg-white/80 hover:bg-white/90 transition-colors cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(lead.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <Link to={`/lead/${lead.id}`}>
                              <p className="text-sm font-medium text-gray-900 truncate hover:text-primary">
                                {lead.name}
                              </p>
                            </Link>
                            <div className="flex items-center space-x-1 mt-1">
                              <Building className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-500 truncate">
                                {lead.company}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-semibold text-green-600">
                                {formatCurrency(lead.value)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                Score: {lead.score}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                asChild
                              >
                                <Link to={`/lead/${lead.id}`}>
                                  Ver
                                </Link>
                              </Button>
                              <select
                                className="text-xs border rounded px-1 py-0.5 bg-white"
                                value={lead.pipeline_stage}
                                onChange={(e) => moveLeadToStage(lead.id, e.target.value as Lead["pipeline_stage"])}
                              >
                                {pipelineStages.map(s => (
                                  <option key={s.key} value={s.key}>
                                    {s.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;