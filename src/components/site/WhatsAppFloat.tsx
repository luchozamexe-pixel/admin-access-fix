import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/config/business";

export function WhatsAppFloat({ message }: { message?: string }) {
  return (
    <a
      href={whatsappLink(message ?? "Hola, quiero consultar por impresión DTF.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}