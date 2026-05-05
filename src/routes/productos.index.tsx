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

  const dtfUv = products.filter((p) => p.category === "dtf_uv" && !p.is_addon && !p.is_quote);
  const dtfTextil = products.filter((p) => p.category === "dtf_textil" && !p.is_addon && !p.is_quote);
  const preparacion = products.filter(
    (p) => p.category === "servicio_adicional" && !p.is_addon && p.slug.startsWith("preparacion-"),
  );
  const otherAddons = products.filter((p) => p.is_addon);
  const quotes = products.filter((p) => p.is_quote);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Productos y servicios</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Elegí DTF UV, DTF Textil o sumá un plan de preparación de archivo.
          </p>
        </div>
      </section>

      {loading && (
        <p className="mx-auto max-w-7xl px-4 py-8 text-muted-foreground lg:px-8">
          Cargando productos…
        </p>
      )}

      {dtfUv.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
          <h2 className="mb-2 text-xl font-semibold">DTF UV</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Stickers premium para packaging, frascos, termos, vasos, objetos rígidos y merchandising.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dtfUv.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {dtfTextil.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
          <h2 className="mb-2 text-xl font-semibold">DTF Textil</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Para remeras, buzos, uniformes, ropa, talleres textiles y marcas.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dtfTextil.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {preparacion.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Preparación de archivo</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Si tu archivo no está 100% listo, sumá un plan. El diseño completo o branding avanzado se cotiza aparte.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {preparacion.map((p) => (
              <ProductCard key={p.id} product={p} highlight={p.is_featured} />
            ))}
          </div>
        </section>
      )}

      {otherAddons.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold">Servicios adicionales</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherAddons.map((p) => (
              <ProductCard key={p.id} product={p} />
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