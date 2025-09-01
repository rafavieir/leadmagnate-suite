import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, Star, UserX, TrendingUp, Eye } from "lucide-react";
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
  createdAt: string;
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
    status: "novo",
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
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@empresa2.com",
    company: "InnovateCorp",
    phone: "(11) 77777-7777",
    source: "Email Campaign",
    score: 45,
    status: "descartado",
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@bigcompany.com",
    company: "BigCompany Ltd",
    phone: "(11) 66666-6666",
    source: "Referral",
    score: 78,
    status: "novo",
    createdAt: "2024-01-12"
  },
];

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const updateLeadStatus = (leadId: string, newStatus: "potencial" | "descartado") => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    novos: leads.filter(l => l.status === "novo").length,
    potenciais: leads.filter(l => l.status === "potencial").length,
    descartados: leads.filter(l => l.status === "descartado").length,
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard CRM</h1>
          <p className="text-muted-foreground">Gerencie seus leads e potenciais clientes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.novos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potenciais</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.potenciais}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Descartados</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.descartados}</div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Section */}
        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>
              Categorize seus leads como potenciais ou descarte-os
            </CardDescription>
            
            {/* Filters */}
            <div className="flex gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="novo">Novos</SelectItem>
                  <SelectItem value="potencial">Potenciais</SelectItem>
                  <SelectItem value="descartado">Descartados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/lead/${lead.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        {lead.status !== "potencial" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLeadStatus(lead.id, "potencial")}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Star className="h-3 w-3" />
                          </Button>
                        )}
                        {lead.status !== "descartado" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLeadStatus(lead.id, "descartado")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserX className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;