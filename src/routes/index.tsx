import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileUp,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { business } from "@/config/business";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luchozam.OK — DTF UV y DTF Textil con envíos a todo Argentina" },
      {
        name: "description",
        content:
          "Impresión DTF UV y DTF Textil para marcas, negocios y emprendedores. Subí tu archivo, pagá online y te lo despachamos a todo el país.",
      },
      { property: "og:title", content: "Luchozam.OK — DTF UV y DTF Textil" },
      {
        property: "og:description",
        content: "Impresión DTF UV y DTF Textil con envíos a todo el país.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Producción en Jujuy · Envíos a todo el país
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              DTF UV y DTF Textil <span className="text-primary">listo para imprimir tu marca</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Subí tu archivo, elegí el formato, pagá online y recibí tu pedido en cualquier punto del país. Ideal para emprendedores, marcas, talleres, negocios y mayoristas.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/productos">
                  Comprar ahora <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/mayoristas">Soy mayorista</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/como-enviar-archivo">Ver cómo enviar mi archivo</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Compra simple online</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Revisión técnica incluida</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Envíos a todo el país</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-3xl bg-[image:var(--gradient-primary)] opacity-20 blur-3xl" />
            <Card className="relative">
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: ShoppingBag, title: "DTF Textil", desc: "Para remeras, buzos y prendas." },
                    { icon: PackageCheck, title: "DTF UV", desc: "Para frascos, termos y packaging." },
                    { icon: Users, title: "Mayoristas", desc: "Cotizaciones por volumen." },
                    { icon: Truck, title: "Envío nacional", desc: "Despacho a todo el país." },
                  ].map((it) => (
                    <div key={it.title} className="rounded-lg border border-border p-4">
                      <it.icon className="h-6 w-6 text-primary" />
                      <div className="mt-3 font-semibold">{it.title}</div>
                      <div className="text-sm text-muted-foreground">{it.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Cómo funciona</h2>
          <p className="mt-2 text-muted-foreground">Cuatro pasos. Sin vueltas.</p>
        </div>
        <ol className="grid gap-6 md:grid-cols-4">
          {[
            { n: 1, icon: ShoppingBag, title: "Elegí tu producto", desc: "DTF UV o DTF Textil, en metro o medio metro." },
            { n: 2, icon: FileUp, title: "Subí tu archivo", desc: "PNG o PDF en tamaño real, fondo transparente." },
            { n: 3, icon: CreditCard, title: "Pagá online", desc: "Mercado Pago, transferencia o pedí cotización mayorista." },
            { n: 4, icon: Truck, title: "Producimos y despachamos", desc: "Producción en 24-72hs hábiles + envío a todo el país." },
          ].map((s) => (
            <li key={s.n} className="relative rounded-xl border border-border bg-card p-6">
              <div className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                Paso {s.n}
              </div>
              <s.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Elegí qué necesitás */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Elegí qué necesitás</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                to: "/dtf-textil",
                title: "DTF Textil",
                desc: "Impresión por metro para remeras, buzos, uniformes y prendas.",
                cta: "Ver DTF Textil",
              },
              {
                to: "/dtf-uv",
                title: "DTF UV",
                desc: "Stickers premium para frascos, termos, vasos, packaging y objetos rígidos.",
                cta: "Ver DTF UV",
              },
              {
                to: "/mayoristas",
                title: "Mayoristas",
                desc: "¿Comprás por volumen? Cotización especial y trato directo.",
                cta: "Soy mayorista",
              },
            ].map((c) => (
              <Card key={c.to} className="group flex flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.desc}</p>
                  <Button asChild className="mt-4 w-full" variant="outline">
                    <Link to={c.to}>
                      {c.cta} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            "Compra simple y online",
            "Envíos a todo el país",
            "Revisión técnica básica incluida",
            "Ideal para marcas, packaging y prendas",
            "WhatsApp solo para dudas o mayoristas",
          ].map((t) => (
            <div key={t} className="rounded-xl border border-border p-5 text-sm">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <p className="mt-2 font-medium">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advertencia diseño */}
      <section className="mx-auto max-w-5xl px-4 pb-16 lg:px-8">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">No hacemos diseño gratis</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Si tu archivo no está listo, podés contratar revisión técnica, armado simple, o derivarte a un diseñador.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/como-enviar-archivo">Ver requisitos</Link>
              </Button>
              <Button asChild>
                <Link to="/productos">Contratar revisión / armado</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA final */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-12 text-center lg:px-8">
          <h2 className="text-3xl font-bold">¿Listo para imprimir tu marca?</h2>
          <p className="max-w-xl text-sm opacity-80">
            {business.shortDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/productos">Ver productos</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-background/30 text-background hover:bg-background hover:text-foreground">
              <Link to="/faq">Preguntas frecuentes</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
