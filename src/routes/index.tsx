import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileUp,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
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
      { title: "Luchozam.OK — DTF UV y DTF Textil sin vueltas" },
      {
        name: "description",
        content:
          "DTF UV y DTF Textil. Imprimí tu archivo, comprá del catálogo o pedí stickers personalizados con tu logo. Producimos en Jujuy y enviamos a todo el país.",
      },
      { property: "og:title", content: "Luchozam.OK — DTF UV y DTF Textil" },
      {
        property: "og:description",
        content: "Imprimí tu archivo, comprá del catálogo o pedí personalizados.",
      },
    ],
  }),
  component: HomePage,
});

const CHOICE_CARDS = [
  {
    icon: FileUp,
    title: "Tengo archivo listo",
    desc: "Subí tu PNG, PDF o ZIP y lo imprimimos.",
    cta: "Imprimir archivo",
    to: "/productos" as const,
  },
  {
    icon: ShoppingBag,
    title: "Quiero elegir del catálogo",
    desc: "Diseños listos para comprar rápido.",
    cta: "Ver catálogo",
    to: "/productos" as const,
  },
  {
    icon: Sparkles,
    title: "Quiero stickers con mi logo",
    desc: "Te armamos una opción personalizada para tu marca.",
    cta: "Ver personalizados",
    to: "/productos" as const,
  },
  {
    icon: Users,
    title: "Compro por volumen",
    desc: "Para empresas, marcas, talleres y revendedores.",
    cta: "Mayoristas",
    to: "/mayoristas" as const,
  },
];

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
              DTF UV y DTF Textil <span className="text-primary">sin vueltas</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Elegí si querés imprimir tu archivo, comprar del catálogo o pedir stickers personalizados con tu logo. Producimos en Jujuy y enviamos a todo el país.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/productos">
                  Comprar ahora <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/productos">Ver catálogo</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/mayoristas">Soy mayorista</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Compra simple online</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Producción en 24-72hs</span>
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
                    { icon: Sparkles, title: "Personalizados", desc: "Con tu logo o idea." },
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

      {/* Elegí cómo querés comprar */}
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Elegí cómo querés comprar</h2>
            <p className="mt-2 text-muted-foreground">Cuatro caminos. Vos elegís el que te queda mejor.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CHOICE_CARDS.map((c) => (
              <Card key={c.title} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <c.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.desc}</p>
                  <Button asChild className="mt-4 w-full">
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

      {/* Cómo funciona */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Cómo funciona</h2>
          <p className="mt-2 text-muted-foreground">Cuatro pasos. Sin vueltas.</p>
        </div>
        <ol className="grid gap-6 md:grid-cols-4">
          {[
            { n: 1, icon: ShoppingBag, title: "Elegí tu producto", desc: "DTF UV o DTF Textil, en metro o medio metro." },
            { n: 2, icon: FileUp, title: "Subí tu archivo", desc: "PNG, PDF o ZIP en tamaño real." },
            { n: 3, icon: CreditCard, title: "Pagá online", desc: "Mercado Pago o transferencia." },
            { n: 4, icon: Truck, title: "Producimos y despachamos", desc: "Producción en 24-72hs hábiles + envío." },
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
              <Link to="/faq">Archivo y FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
