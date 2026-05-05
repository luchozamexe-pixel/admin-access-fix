import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileUp, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatARS, business, whatsappLink } from "@/config/business";
import { uploadCustomerFile } from "@/lib/uploadFile";
import { createOrder } from "@/server/orders.functions";
import type { Product } from "@/types/product";

export const Route = createFileRoute("/productos/$slug")({
  component: ProductDetailPage,
});

const formSchema = z.object({
  customer_name: z.string().trim().min(2, "Ingresá tu nombre"),
  customer_whatsapp: z.string().trim().min(6, "WhatsApp inválido"),
  customer_email: z.string().trim().email("Email inválido"),
  customer_city: z.string().trim().optional(),
  customer_province: z.string().trim().optional(),
  customer_postal_code: z.string().trim().optional(),
  shipping_address: z.string().trim().optional(),
  shipping_phone: z.string().trim().optional(),
  delivery_method: z.enum(["retiro_jujuy", "envio_nacional"]),
  quantity: z.number().int().min(1).max(500),
  uv_use_type: z.string().optional(),
  observations: z.string().optional(),
  shipping_notes: z.string().optional(),
  has_ready_file: z.boolean(),
  wants_review: z.boolean(),
  wants_assembly: z.boolean(),
  payment_method: z.enum(["mercadopago", "transferencia"]),
  confirm_payment_first: z.literal(true, { errorMap: () => ({ message: "Tenés que aceptar las condiciones" }) }),
  confirm_extras_paid: z.literal(true, { errorMap: () => ({ message: "Tenés que aceptar las condiciones" }) }),
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [addons, setAddons] = useState<Product[]>([]);
  const [prepPlans, setPrepPlans] = useState<Product[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_whatsapp: "",
    customer_email: "",
    customer_city: "",
    customer_province: "",
    customer_postal_code: "",
    shipping_address: "",
    shipping_phone: "",
    delivery_method: "envio_nacional" as "retiro_jujuy" | "envio_nacional",
    quantity: 1,
    uv_use_type: "",
    observations: "",
    shipping_notes: "",
    has_ready_file: true,
    wants_review: false,
    wants_assembly: false,
    payment_method: "transferencia" as "mercadopago" | "transferencia",
    confirm_payment_first: false,
    confirm_extras_paid: false,
  });
  const [prepPlan, setPrepPlan] = useState<string>("none");

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("*").eq("slug", slug).maybeSingle(),
      supabase.from("products").select("*").eq("is_addon", true).eq("active", true).order("sort_order"),
      supabase.from("products").select("*").eq("active", true).like("slug", "preparacion-%").order("sort_order"),
    ]).then(([prodRes, addonRes, prepRes]) => {
      setProduct((prodRes.data ?? null) as Product | null);
      setAddons((addonRes.data ?? []) as Product[]);
      setPrepPlans((prepRes.data ?? []) as Product[]);
      setLoading(false);
    });
  }, [slug]);

  const isUV = product?.category === "dtf_uv";
  const selectedPrep = prepPlans.find((p) => p.id === prepPlan) ?? null;

  const total = useMemo(() => {
    if (!product) return 0;
    let t = product.price_ars * form.quantity;
    for (const a of addons) {
      if (selectedAddons[a.id]) t += a.price_ars;
    }
    if (selectedPrep) t += selectedPrep.price_ars;
    return t;
  }, [product, addons, selectedAddons, form.quantity, selectedPrep]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          <p className="mt-3">Cargando producto…</p>
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <Button asChild className="mt-4">
            <Link to="/productos">Ver catálogo</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revisá el formulario");
      return;
    }
    if (form.has_ready_file && !file) {
      toast.error("Subí tu archivo PNG o PDF, o marcá que necesitás ayuda con el archivo");
      return;
    }
    if (form.delivery_method === "envio_nacional" && !form.shipping_address) {
      toast.error("Completá la dirección de envío");
      return;
    }

    setSubmitting(true);
    try {
      let uploaded: { path: string; name: string } | null = null;
      if (file) {
        uploaded = await uploadCustomerFile(file, "orders");
      }
      const items: Array<{ product_id: string; quantity: number; is_addon: boolean }> = [
        { product_id: product.id, quantity: form.quantity, is_addon: false },
      ];
      for (const a of addons) {
        if (selectedAddons[a.id]) {
          items.push({ product_id: a.id, quantity: 1, is_addon: true });
        }
      }
      // Si pidió revisión o armado y no estaban seleccionados como addon, sumarlos
      const reviewAddon = addons.find((a) => a.slug === "revision-tecnica");
      const assemblyAddon = addons.find((a) => a.slug === "armado-simple");
      if (form.wants_review && reviewAddon && !selectedAddons[reviewAddon.id]) {
        items.push({ product_id: reviewAddon.id, quantity: 1, is_addon: true });
      }
      if (form.wants_assembly && assemblyAddon && !selectedAddons[assemblyAddon.id]) {
        items.push({ product_id: assemblyAddon.id, quantity: 1, is_addon: true });
      }

      const result = await createOrder({
        data: {
          customer_name: form.customer_name,
          customer_whatsapp: form.customer_whatsapp,
          customer_email: form.customer_email,
          customer_city: form.customer_city || null,
          customer_province: form.customer_province || null,
          customer_postal_code: form.customer_postal_code || null,
          shipping_address: form.shipping_address || null,
          shipping_phone: form.shipping_phone || null,
          delivery_method: form.delivery_method,
          observations: form.observations || null,
          shipping_notes: form.shipping_notes || null,
          has_ready_file: form.has_ready_file,
          wants_review: form.wants_review,
          wants_assembly: form.wants_assembly,
          uv_use_type: isUV ? form.uv_use_type || null : null,
          file_path: uploaded?.path ?? null,
          file_name: uploaded?.name ?? null,
          payment_method: form.payment_method,
          items,
        },
      });

      toast.success("¡Pedido recibido!");
      navigate({ to: "/pedido/$numero", params: { numero: result.order_number } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear el pedido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout
      whatsappMessage={`Hola, quiero consultar por: ${product.name}`}
    >
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <Link to="/productos" className="text-sm text-muted-foreground hover:text-foreground">
            ← Volver al catálogo
          </Link>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category === "dtf_uv" ? "DTF UV" : product.category === "dtf_textil" ? "DTF Textil" : "Servicio"}
              </Badge>
              <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">{product.short_description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{formatARS(product.price_ars)}</div>
              <div className="text-xs text-muted-foreground">por unidad</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Detalles</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{product.long_description}</p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">Tus datos</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre y apellido" required>
                    <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} maxLength={120} />
                  </Field>
                  <Field label="WhatsApp" required>
                    <Input value={form.customer_whatsapp} onChange={(e) => setForm({ ...form, customer_whatsapp: e.target.value })} maxLength={40} placeholder="Ej: 388 555 0000" />
                  </Field>
                  <Field label="Email" required>
                    <Input type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} maxLength={200} />
                  </Field>
                  <Field label="Ciudad">
                    <Input value={form.customer_city} onChange={(e) => setForm({ ...form, customer_city: e.target.value })} maxLength={120} />
                  </Field>
                  <Field label="Provincia">
                    <Input value={form.customer_province} onChange={(e) => setForm({ ...form, customer_province: e.target.value })} maxLength={120} />
                  </Field>
                  <Field label="Cantidad" required>
                    <Input type="number" min={1} max={500} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Math.max(1, Number(e.target.value) || 1) })} />
                  </Field>
                </div>
                {isUV && (
                  <Field label="Tipo de uso">
                    <Select value={form.uv_use_type} onValueChange={(v) => setForm({ ...form, uv_use_type: v })}>
                      <SelectTrigger><SelectValue placeholder="Elegí una opción" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="packaging">Packaging</SelectItem>
                        <SelectItem value="termos">Termos</SelectItem>
                        <SelectItem value="frascos">Frascos</SelectItem>
                        <SelectItem value="vasos">Vasos</SelectItem>
                        <SelectItem value="merchandising">Merchandising</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                <Field label="Observaciones">
                  <Textarea rows={3} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} maxLength={2000} placeholder="Notas, urgencias, indicaciones especiales…" />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">Tu archivo</h2>
                <p className="text-sm text-muted-foreground">
                  PNG o PDF, en tamaño real, fondo transparente cuando corresponda. Máx 50 MB.{" "}
                  <Link to="/como-enviar-archivo" className="text-primary underline">
                    Ver requisitos
                  </Link>
                </p>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-accent/30 p-4 text-sm hover:bg-accent">
                  <FileUp className="h-5 w-5 text-primary" />
                  <span className="flex-1">{file ? file.name : "Seleccionar archivo PNG o PDF"}</span>
                  <input
                    type="file"
                    accept="image/png,application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                <div className="space-y-3 pt-2">
                  <div className="rounded-md border border-border p-3">
                    <p className="text-sm font-medium">¿Tenés tu archivo listo para imprimir?</p>
                    <RadioGroup
                      value={form.has_ready_file ? "si" : "no"}
                      onValueChange={(v) => setForm({ ...form, has_ready_file: v === "si" })}
                      className="mt-2 grid gap-2 sm:grid-cols-2"
                    >
                      <DeliveryOption value="si" title="Sí, tengo el archivo listo" desc="Lo subo ahora en PNG o PDF." />
                      <DeliveryOption value="no" title="No, necesito ayuda" desc="Sumá revisión técnica o armado simple." />
                    </RadioGroup>
                    {!form.has_ready_file && (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <CheckLine
                          checked={form.wants_review}
                          onChange={(v) => setForm({ ...form, wants_review: v })}
                          label="Quiero revisión técnica (+ $5.000)"
                        />
                        <CheckLine
                          checked={form.wants_assembly}
                          onChange={(v) => setForm({ ...form, wants_assembly: v })}
                          label="Quiero armado simple (+ $15.000)"
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Condiciones del pedido</p>
                  <CheckLine
                    checked={form.confirm_no_design}
                    onChange={(v) => setForm({ ...form, confirm_no_design: v })}
                    label="Entiendo que el precio no incluye diseño, redibujo, vectorización ni armado complejo."
                  />
                  <CheckLine
                    checked={form.confirm_format}
                    onChange={(v) => setForm({ ...form, confirm_format: v })}
                    label="Mi archivo está listo para imprimir en PNG o PDF, con buena calidad y tamaño real."
                  />
                  <CheckLine
                    checked={form.confirm_errors}
                    onChange={(v) => setForm({ ...form, confirm_errors: v })}
                    label="Entiendo que si el archivo está mal, puede requerir corrección paga antes de producir."
                  />
                  <CheckLine
                    checked={form.confirm_production}
                    onChange={(v) => setForm({ ...form, confirm_production: v })}
                    label="Acepto que el pedido pasa a producción cuando el pago esté confirmado y el archivo aprobado."
                  />
                </div>
              </CardContent>
            </Card>

            {addons.length > 0 && (
              <Card>
                <CardContent className="space-y-3 p-6">
                  <h2 className="text-lg font-semibold">Sumar servicios opcionales</h2>
                  {addons.map((a) => (
                    <label key={a.id} className="flex items-start gap-3 rounded-md border border-border p-3 hover:bg-accent">
                      <Checkbox
                        checked={!!selectedAddons[a.id]}
                        onCheckedChange={(v) => setSelectedAddons({ ...selectedAddons, [a.id]: !!v })}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between gap-2">
                          <span className="font-medium">{a.name}</span>
                          <span className="font-semibold text-primary">+ {formatARS(a.price_ars)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{a.short_description}</p>
                      </div>
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">Entrega</h2>
                <RadioGroup
                  value={form.delivery_method}
                  onValueChange={(v) => setForm({ ...form, delivery_method: v as typeof form.delivery_method })}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  <DeliveryOption value="envio_nacional" title="Envío nacional" desc="Despacho por Correo Argentino. Costo cotizado aparte." />
                  <DeliveryOption value="retiro_jujuy" title="Retiro en Jujuy" desc="Coordinamos el retiro por WhatsApp." />
                </RadioGroup>
                {form.delivery_method === "retiro_jujuy" ? (
                  <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                    Retiro en General Alvear 1090, San Salvador de Jujuy. Te avisamos cuando el pedido esté listo.
                  </p>
                ) : (
                  <>
                    <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                      Hacemos envíos a todo el país por Correo Argentino. El costo de envío se confirma manualmente según destino, tamaño del pedido y modalidad.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Dirección de envío" required>
                        <Input value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} maxLength={300} />
                      </Field>
                      <Field label="Código postal">
                        <Input value={form.customer_postal_code} onChange={(e) => setForm({ ...form, customer_postal_code: e.target.value })} maxLength={20} />
                      </Field>
                      <Field label="Teléfono de contacto">
                        <Input value={form.shipping_phone} onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })} maxLength={40} />
                      </Field>
                      <Field label="Observaciones de entrega">
                        <Input value={form.shipping_notes} onChange={(e) => setForm({ ...form, shipping_notes: e.target.value })} maxLength={500} />
                      </Field>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">Método de pago</h2>
                <RadioGroup
                  value={form.payment_method}
                  onValueChange={(v) => setForm({ ...form, payment_method: v as typeof form.payment_method })}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  <DeliveryOption value="transferencia" title="Transferencia / Link manual" desc="Te pasamos los datos por WhatsApp." />
                  <DeliveryOption value="mercadopago" title="Mercado Pago" desc="Te enviamos el link de pago tras confirmar el archivo." />
                </RadioGroup>
                <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                  Una vez confirmado el pago y aprobado el archivo, el pedido pasa a producción (24 a 72 hs hábiles).
                </p>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando…</> : `Finalizar pedido · ${formatARS(total)}`}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              ¿Dudas antes de comprar?{" "}
              <a href={whatsappLink(`Hola, tengo una consulta sobre ${product.name}`)} target="_blank" rel="noreferrer" className="text-primary underline">
                Consultar por WhatsApp
              </a>
            </p>
          </form>
        </div>

        {/* Resumen lateral */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="space-y-3 p-6">
              <h3 className="font-semibold">Resumen del pedido</h3>
              <div className="flex justify-between text-sm">
                <span>{product.name} × {form.quantity}</span>
                <span>{formatARS(product.price_ars * form.quantity)}</span>
              </div>
              {addons.filter((a) => selectedAddons[a.id]).map((a) => (
                <div key={a.id} className="flex justify-between text-sm text-muted-foreground">
                  <span>+ {a.name}</span>
                  <span>{formatARS(a.price_ars)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatARS(total)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  El costo de envío se cotiza aparte una vez confirmado el destino.
                </p>
              </div>
              <div className="rounded-md bg-success/10 p-3 text-xs text-success-foreground">
                <CheckCircle2 className="mb-1 inline h-4 w-4 text-success" /> {business.shippingScope}.
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </SiteLayout>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      {children}
    </div>
  );
}

function CheckLine({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-start gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-0.5" />
      <span>{label}</span>
    </label>
  );
}

function DeliveryOption({ value, title, desc }: { value: string; title: string; desc: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5">
      <RadioGroupItem value={value} className="mt-0.5" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </label>
  );
}