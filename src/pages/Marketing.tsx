import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus, Trash2, Edit3, Image } from "lucide-react";

interface MessageTemplate {
  id: string;
  title: string;
  message: string;
  image?: string;
  createdAt: string;
}

const Marketing = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      title: "Apresentação da Empresa",
      message: "Olá! Somos uma empresa especializada em soluções inovadoras. Que tal conhecer nossos serviços? 🚀",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      title: "Follow-up Proposta",
      message: "Oi! Como está a análise da nossa proposta? Estamos aqui para esclarecer qualquer dúvida! 💼",
      createdAt: "2024-01-14"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    message: "",
    image: ""
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.title || !newTemplate.message) return;

    const template: MessageTemplate = {
      id: Date.now().toString(),
      title: newTemplate.title,
      message: newTemplate.message,
      image: newTemplate.image || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTemplates([...templates, template]);
    setNewTemplate({ title: "", message: "", image: "" });
    setIsCreating(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <MessageCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketing WhatsApp</h1>
            <p className="text-muted-foreground">Gerencie seus templates de mensagens</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templates.length}</p>
                <p className="text-sm text-muted-foreground">Templates Criados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Image className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templates.filter(t => t.image).length}</p>
                <p className="text-sm text-muted-foreground">Com Imagem</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Edit3 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templates.filter(t => !t.image).length}</p>
                <p className="text-sm text-muted-foreground">Apenas Texto</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Template */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Criar Novo Template
            <Button 
              onClick={() => setIsCreating(!isCreating)}
              variant={isCreating ? "destructive" : "default"}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? "Cancelar" : "Novo Template"}
            </Button>
          </CardTitle>
          <CardDescription>
            Crie templates personalizados para suas campanhas
          </CardDescription>
        </CardHeader>
        
        {isCreating && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Template</Label>
              <Input
                id="title"
                value={newTemplate.title}
                onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                placeholder="Ex: Apresentação da Empresa"
              />
            </div>
            
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={newTemplate.message}
                onChange={(e) => setNewTemplate({ ...newTemplate, message: e.target.value })}
                placeholder="Digite sua mensagem aqui..."
                className="min-h-[120px]"
              />
            </div>
            
            <div>
              <Label htmlFor="image">URL da Imagem (opcional)</Label>
              <Input
                id="image"
                value={newTemplate.image}
                onChange={(e) => setNewTemplate({ ...newTemplate, image: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateTemplate}>
                Criar Template
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>
                    Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {template.image && (
                <div className="relative">
                  <img 
                    src={template.image} 
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    <Image className="h-3 w-3 mr-1" />
                    Imagem
                  </Badge>
                </div>
              )}
              
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {template.message}
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Usar Template
                </Button>
                <Button variant="outline" size="sm">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum template criado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro template de mensagem
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Marketing;