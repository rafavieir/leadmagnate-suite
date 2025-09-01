// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">CRM Dashboard</h1>
        <p className="text-xl text-muted-foreground">Gerencie seus leads e potenciais clientes</p>
        <a 
          href="/dashboard" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Acessar Dashboard
        </a>
      </div>
    </div>
  );
};

export default Index;
