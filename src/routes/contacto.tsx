import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { business, whatsappLink } from "@/config/business";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Luchozam.OK" },
      { name: "description", content: "Contactanos por WhatsApp o email para consultas de impresión DTF UV y DTF Textil." },
      { property: "og:title", content: "Contacto — Luchozam.OK" },
      { property: "og:description", content: "Hablanos por WhatsApp." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Contacto</h1>
          <p className="mt-3 text-muted-foreground">El WhatsApp es para mayoristas, urgencias, archivos con problemas o dudas antes de comprar.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-10 sm:grid-cols-2 lg:px-8">
        <Card>
          <CardContent className="space-y-3 p-6">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h2 className="font-semibold">WhatsApp</h2>
            <p className="text-sm text-muted-foreground">{business.whatsappDisplay}</p>
            <Button asChild><a href={whatsappLink("Hola, quiero consultar por impresión DTF.")} target="_blank" rel="noreferrer">Abrir WhatsApp</a></Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <Mail className="h-6 w-6 text-primary" />
            <h2 className="font-semibold">Email</h2>
            <p className="text-sm text-muted-foreground">{business.email}</p>
            <Button asChild variant="outline"><a href={`mailto:${business.email}`}>Escribir email</a></Button>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardContent className="space-y-2 p-6">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="font-semibold">Ubicación</h2>
            <p className="text-sm text-muted-foreground">{business.productionAddress}. {business.shippingScope}.</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 bg-muted/40">
          <CardContent className="p-6">
            <h3 className="font-semibold">Opciones rápidas</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
              <li>Quiero comprar por la web</li>
              <li>Soy mayorista</li>
              <li>Necesito plantilla</li>
              <li>Necesito ayuda con mi archivo</li>
              <li>Quiero saber tiempos y envíos</li>
            </ol>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  ),
});