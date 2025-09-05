import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lead } from "@/contexts/LeadsContext";

interface WhatsAppButtonProps {
  lead: Lead;
  message?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary";
}

const WhatsAppButton = ({ lead, message, size = "sm", variant = "outline" }: WhatsAppButtonProps) => {
  const defaultMessage = `Olá ${lead.name}! Tudo bem? Sou da nossa equipe comercial e gostaria de conversar com você sobre nossas soluções. Você tem um tempo para conversarmos?`;
  
  const finalMessage = message || defaultMessage;
  
  const handleWhatsAppClick = () => {
    // Remove caracteres especiais do telefone
    const cleanPhone = lead.phone?.replace(/[^\d]/g, '') || '';
    
    // Adiciona código do país se não tiver
    const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    // Encode da mensagem para URL
    const encodedMessage = encodeURIComponent(finalMessage);
    
    // Monta URL do WhatsApp
    const whatsappUrl = `https://wa.me/${phoneWithCountryCode}?text=${encodedMessage}`;
    
    // Abre em nova aba
    window.open(whatsappUrl, '_blank');
  };

  // Não renderiza o botão se não houver telefone
  if (!lead.phone) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleWhatsAppClick}
      className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
    >
      <MessageCircle className="h-4 w-4 mr-1" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;