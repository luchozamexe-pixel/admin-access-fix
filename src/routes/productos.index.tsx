import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatARS } from "@/config/business";
import type { Product } from "@/types/product";

export const Route = createFileRoute("/productos/")({
  head: () => ({
    meta: [
      { title: "Productos — DTF UV y DTF Textil | Luchozam.OK" },
      {
        name: "description",
        content:
          "Catálogo de impresión DTF UV y DTF Textil por metro y medio metro. Servicios de revisión y armado simple. Comprá online y recibí en todo el país.",
      },
      { property: "og:title", content: "Productos — Luchozam.OK" },
      {
        property: "og:description",
        content: "DTF UV y DTF Textil por metro con envíos a todo Argentina.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setProducts((data ?? []) as Product[]);
        setLoading(false);
      });
  }, []);

  const main = products.filter((p) => !p.is_addon && !p.is_quote);
  const addons = products.filter((p) => p.is_addon);
  const quotes = products.filter((p) => p.is_quote);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Productos y servicios</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Elegí el tipo de impresión, sumá servicios opcionales y completá tu pedido en minutos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold">Impresión DTF</h2>
        {loading && <p className="text-muted-foreground">Cargando productos…</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {main.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {addons.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold">Servicios adicionales</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addons.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {quotes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold">¿Necesitás diseño?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {quotes.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-2">A cotizar</Badge>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.short_description}</p>
                  <p className="mt-3 text-sm">Desde <strong>{formatARS(p.price_ars)}</strong></p>
                  <Button asChild className="mt-4" variant="outline">
                    <Link to="/contacto">{p.cta_label}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs">
            {product.category === "dtf_uv"
              ? "DTF UV"
              : product.category === "dtf_textil"
                ? "DTF Textil"
                : "Servicio"}
          </Badge>
          <span className="text-lg font-bold text-primary">{formatARS(product.price_ars)}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{product.short_description}</p>
        <Button asChild className="mt-4 w-full">
          <Link to="/productos/$slug" params={{ slug: product.slug }}>
            {product.cta_label} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}