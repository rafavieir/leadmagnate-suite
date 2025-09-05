import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Star, UserX, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLeads, type Lead } from "@/contexts/LeadsContext";
import WhatsAppButton from "@/components/WhatsAppButton";

const pipelineStages = [
  { key: "prospecto", title: "Prospecto" },
  { key: "qualificado", title: "Qualificado" },
  { key: "proposta", title: "Proposta" },
  { key: "negociacao", title: "Negociação" },
  { key: "fechado", title: "Fechado" },
  { key: "perdido", title: "Perdido" }
];

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { leads, updateLeadStatus, moveLeadToStage, updateLead } = useLeads();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    // Busca o lead nos dados compartilhados
    const foundLead = leads.find(l => l.id === id);
    if (foundLead) {
      setLead(foundLead);
      setFormData(foundLead);
    }
  }, [id, leads]);

  if (!lead || !formData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <p>Lead não encontrado</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (lead?.id && formData) {
      updateLead(lead.id, formData);
      setLead(formData);
      setIsEditing(false);
      toast({
        title: "Lead atualizado",
        description: "As informações do lead foram salvas com sucesso.",
      });
    }
  };

  const handleSaveNotes = () => {
    if (lead?.id && formData) {
      updateLead(lead.id, { notes: formData.notes });
      setLead(formData);
      setIsEditingNotes(false);
      toast({
        title: "Observações salvas",
        description: "As observações foram atualizadas com sucesso.",
      });
    }
  };

  const updateStatus = (newStatus: "potencial" | "descartado") => {
    if (lead?.id) {
      updateLeadStatus(lead.id, newStatus);
      const updatedLead = { ...formData!, status: newStatus };
      setFormData(updatedLead);
      setLead(updatedLead);
      toast({
        title: "Status atualizado",
        description: `Lead marcado como ${newStatus === "potencial" ? "potencial" : "descartado"}.`,
      });
    }
  };

  const updatePipelineStage = (newStage: Lead["pipeline_stage"]) => {
    if (lead?.id) {
      if (newStage === "perdido" && !formData?.notes?.trim()) {
        toast({
          title: "Observação obrigatória",
          description: "Para marcar como perdido, é necessário adicionar uma observação explicando o motivo.",
          variant: "destructive"
        });
        return;
      }
      
      moveLeadToStage(lead.id, newStage);
      const updatedLead = { ...formData!, pipeline_stage: newStage };
      setFormData(updatedLead);
      setLead(updatedLead);
      toast({
        title: "Estágio atualizado",
        description: `Lead movido para ${pipelineStages.find(s => s.key === newStage)?.title}.`,
      });
    }
  };

  const getStatusBadge = (status: Lead["status"]) => {
    const variants = {
      novo: "secondary",
      potencial: "default",
      descartado: "destructive"
    } as const;
    
    const labels = {
      novo: "Novo",
      potencial: "Potencial",
      descartado: "Descartado"
    };
    
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{lead.name}</h1>
              <p className="text-muted-foreground">{lead.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(lead.status)}
            {lead.pipeline_stage && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Pipeline: {pipelineStages.find(s => s.key === lead.pipeline_stage)?.title}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <WhatsAppButton lead={lead} />
          {lead.status !== "potencial" && (
            <Button
              variant="outline"
              onClick={() => updateStatus("potencial")}
              className="text-green-600 hover:text-green-700"
            >
              <Star className="h-4 w-4 mr-2" />
              Marcar como Potencial
            </Button>
          )}
          {lead.status !== "descartado" && (
            <Button
              variant="outline"
              onClick={() => updateStatus("descartado")}
              className="text-red-600 hover:text-red-700"
            >
              <UserX className="h-4 w-4 mr-2" />
              Descartar Lead
            </Button>
          )}
          
          {/* Pipeline Stage Selector */}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="pipeline-stage" className="text-sm">
              Estágio da Pipeline:
            </Label>
            <Select
              value={lead.pipeline_stage || "prospecto"}
              onValueChange={(value) => updatePipelineStage(value as Lead["pipeline_stage"])}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pipelineStages.map(stage => (
                  <SelectItem key={stage.key} value={stage.key}>
                    {stage.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lead Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados principais do lead</CardDescription>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                ) : (
                  "Editar"
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{lead.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company">Empresa</Label>
                  {isEditing ? (
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{lead.company}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="position">Cargo</Label>
                  {isEditing ? (
                    <Input
                      id="position"
                      value={formData.position || ""}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{lead.position || "Não informado"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="source">Fonte</Label>
                  {isEditing ? (
                    <Select
                      value={formData.source}
                      onValueChange={(value) => setFormData({ ...formData, source: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Cold Call">Cold Call</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground">{lead.source}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="score">Score</Label>
                  {isEditing ? (
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{lead.score}/100</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="proposalValue">Valor da Proposta</Label>
                  {isEditing ? (
                    <Input
                      id="proposalValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.proposalValue}
                      onChange={(e) => setFormData({ ...formData, proposalValue: parseFloat(e.target.value) || 0 })}
                      placeholder="R$ 0,00"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground font-semibold text-green-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(lead.proposalValue)}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn</Label>
                  {isEditing ? (
                    <Input
                      id="linkedinUrl"
                      value={formData.linkedinUrl || ""}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {lead.linkedinUrl ? (
                        <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {lead.linkedinUrl}
                        </a>
                      ) : (
                        "Não informado"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Observações</CardTitle>
                <CardDescription>Anotações sobre o lead</CardDescription>
              </div>
              <Button
                variant={isEditingNotes ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (isEditingNotes) {
                    handleSaveNotes();
                  } else {
                    setIsEditingNotes(true);
                  }
                }}
              >
                {isEditingNotes ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                ) : (
                  "Editar"
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {isEditingNotes || isEditing ? (
                <Textarea
                  placeholder="Adicione suas observações sobre este lead..."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={10}
                />
              ) : (
                <div className="min-h-[200px] cursor-pointer" onClick={() => setIsEditingNotes(true)}>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {lead.notes || "Clique aqui para adicionar observações..."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline/History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
            <CardDescription>Atividades e interações com o lead</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-border">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Lead criado</p>
                  <p className="text-xs text-muted-foreground">{lead.createdAt}</p>
                  <p className="text-xs text-muted-foreground">Fonte: {lead.source}</p>
                </div>
              </div>
              {/* Aqui você pode adicionar mais eventos do timeline */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadDetails;