import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dtf-uv")({
  head: () => ({
    meta: [
      { title: "DTF UV — Stickers premium para packaging y objetos rígidos | Luchozam.OK" },
      { name: "description", content: "Impresión DTF UV por metro y medio metro para frascos, termos, vasos, packaging y merchandising. Envíos a toda Argentina." },
      { property: "og:title", content: "DTF UV — Luchozam.OK" },
      { property: "og:description", content: "DTF UV para superficies rígidas. Subí tu archivo y recibí en todo el país." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl">DTF UV para superficies rígidas</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Stickers premium resistentes para packaging, frascos, termos, vasos, acrílicos, merchandising y más.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/productos/$slug" params={{ slug: "dtf-uv-metro-58x100" }}>Comprar metro 58×100</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/productos/$slug" params={{ slug: "dtf-uv-medio-metro-58x50" }}>Medio metro 58×50</Link></Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <h2 className="text-2xl font-bold">¿Para qué sirve?</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {["Packaging y etiquetas", "Frascos, vasos y termos", "Acrílicos y vidrios", "Merchandising personalizado", "Lanzamientos de marca", "Pruebas y tiradas chicas"].map((t) => (
            <li key={t} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" /> {t}
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  ),
});