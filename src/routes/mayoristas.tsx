import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadCustomerFile } from "@/lib/uploadFile";
import { createWholesaleLead } from "@/server/orders.functions";

export const Route = createFileRoute("/mayoristas")({
  head: () => ({
    meta: [
      { title: "Mayoristas DTF UV y DTF Textil | Luchozam.OK" },
      { name: "description", content: "Cotización mayorista de impresión DTF UV y DTF Textil para negocios, marcas, revendedores y talleres en toda Argentina." },
      { property: "og:title", content: "Mayoristas — Luchozam.OK" },
      { property: "og:description", content: "DTF por mayor para negocios y revendedores." },
    ],
  }),
  component: WholesalePage,
});

function WholesalePage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    business_name: "",
    city: "",
    province: "",
    whatsapp: "",
    email: "",
    product_interest: "ambos",
    monthly_volume: "",
    has_artwork: false,
    needs_invoice: false,
    observations: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name || !form.whatsapp || !form.email) {
      toast.error("Completá nombre, WhatsApp y email"); return;
    }
    setSubmitting(true);
    try {
      let file_path: string | null = null;
      let file_name: string | null = null;
      if (file) {
        const up = await uploadCustomerFile(file, "wholesale");
        file_path = up.path; file_name = up.name;
      }
      await createWholesaleLead({ data: { ...form, file_path, file_name } });
      setDone(true);
      toast.success("Consulta enviada. Te respondemos por WhatsApp.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al enviar la consulta");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">¡Consulta enviada!</h1>
          <p className="mt-3 text-muted-foreground">Te vamos a contactar por WhatsApp con tu cotización mayorista.</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">DTF UV y DTF Textil por mayor</h1>
          <p className="mt-3 text-muted-foreground">
            Si comprás por volumen, tenés pedidos frecuentes o necesitás cotización especial, completá el formulario y te respondemos por WhatsApp.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <FieldS label="Nombre y apellido *"><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={120} /></FieldS>
              <FieldS label="Nombre del negocio"><Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} maxLength={160} /></FieldS>
              <FieldS label="Ciudad"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={120} /></FieldS>
              <FieldS label="Provincia"><Input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} maxLength={120} /></FieldS>
              <FieldS label="WhatsApp *"><Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} maxLength={40} /></FieldS>
              <FieldS label="Email *"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={200} /></FieldS>
              <FieldS label="Tipo de producto">
                <Select value={form.product_interest} onValueChange={(v) => setForm({ ...form, product_interest: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dtf_uv">DTF UV</SelectItem>
                    <SelectItem value="dtf_textil">DTF Textil</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </FieldS>
              <FieldS label="Cantidad estimada mensual"><Input value={form.monthly_volume} onChange={(e) => setForm({ ...form, monthly_volume: e.target.value })} placeholder="Ej: 20 metros / mes" maxLength={120} /></FieldS>
              <div className="sm:col-span-2 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.has_artwork} onCheckedChange={(v) => setForm({ ...form, has_artwork: !!v })} /> Ya tengo archivo listo
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.needs_invoice} onCheckedChange={(v) => setForm({ ...form, needs_invoice: !!v })} /> Necesito factura
                </label>
              </div>
              <FieldS label="Observaciones" full>
                <Textarea rows={3} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} maxLength={2000} />
              </FieldS>
              <FieldS label="Subir archivo o logo (opcional, PNG/PDF)" full>
                <Input type="file" accept="image/png,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </FieldS>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando…</> : "Solicitar cotización mayorista"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          El canal mayorista es para negocios, revendedores, marcas y talleres con pedidos por volumen. Para pedidos normales, comprá directamente desde la web.
        </p>
      </section>
    </SiteLayout>
  );
}

function FieldS({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}