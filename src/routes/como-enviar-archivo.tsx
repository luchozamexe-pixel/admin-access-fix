import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { whatsappLink } from "@/config/business";

export const Route = createFileRoute("/como-enviar-archivo")({
  head: () => ({
    meta: [
      { title: "Cómo preparar y enviar tu archivo DTF | Luchozam.OK" },
      { name: "description", content: "Requisitos técnicos para enviar tu archivo de impresión DTF UV o DTF Textil: formato, resolución, tamaño y fondo." },
      { property: "og:title", content: "Cómo enviar tu archivo — Luchozam.OK" },
      { property: "og:description", content: "Checklist técnico para que tu pedido salga rápido y sin errores." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Cómo preparar tu archivo para imprimir</h1>
          <p className="mt-3 text-muted-foreground">
            Para que tu pedido salga rápido y sin errores, enviá tu archivo listo. Si no sabés prepararlo, podés contratar revisión o armado simple.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-2 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-success-foreground">✅ Sí enviar</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {["Formato PNG o PDF", "Fondo transparente cuando corresponda", "Archivo en tamaño real", "Buena resolución (300 dpi ideal)", "Ortografía revisada", "Márgenes de seguridad si corresponde"].map((t) => (
                <li key={t} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" /> {t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-destructive">❌ No enviar</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {["Capturas de pantalla", "Imágenes pixeladas", "Logos bajados de WhatsApp o Instagram en baja", "Diseños espejados (salvo indicación específica)", "Archivos sin tamaño real definido"].map((t) => (
                <li key={t} className="flex items-start gap-2"><XCircle className="mt-0.5 h-4 w-4 text-destructive" /> {t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 lg:px-8">
        <Card>
          <CardContent className="flex flex-wrap gap-3 p-6">
            <Button variant="outline" disabled title="Plantilla disponible próximamente">Descargar plantilla 58×100</Button>
            <Button variant="outline" disabled title="Plantilla disponible próximamente">Descargar plantilla 58×50</Button>
            <Button asChild><Link to="/productos/$slug" params={{ slug: "armado-simple-plancha-metro" }}>Contratar armado simple</Link></Button>
            <Button asChild variant="ghost"><a href={whatsappLink("Hola, necesito ayuda con mi archivo para imprimir.")} target="_blank" rel="noreferrer">Consultar por WhatsApp</a></Button>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 lg:px-8">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold">¿Qué pasa si mi archivo está mal?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Te avisamos antes de producir. Podés corregirlo vos, contratar revisión / armado simple, o pedirnos derivación a un diseñador.
            </p>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  ),
});