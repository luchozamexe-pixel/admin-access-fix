import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dtf-textil")({
  head: () => ({
    meta: [
      { title: "DTF Textil — Impresión por metro para prendas y telas | Luchozam.OK" },
      { name: "description", content: "Impresión DTF Textil por metro 58×100 cm para remeras, buzos, uniformes y todo tipo de prendas. Envíos a toda Argentina." },
      { property: "og:title", content: "DTF Textil — Luchozam.OK" },
      { property: "og:description", content: "DTF Textil por metro para marcas de ropa, talleres y emprendedores." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl">DTF Textil para prendas y telas</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Impresión por metro lista para aplicar sobre remeras, buzos, uniformes, gorros y todo tipo de productos textiles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/productos/$slug" params={{ slug: "dtf-textil-metro-58x100" }}>Comprar metro 58×100</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/como-enviar-archivo">Cómo enviar mi archivo</Link></Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <h2 className="text-2xl font-bold">Ideal para</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {["Marcas de ropa", "Talleres textiles", "Uniformes y workwear", "Eventos y promociones", "Equipos deportivos", "Emprendedores y revendedores"].map((t) => (
            <li key={t} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" /> {t}
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  ),
});