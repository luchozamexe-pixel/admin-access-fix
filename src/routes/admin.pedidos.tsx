import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_OPTIONS,
  formatARS,
  whatsappLink,
} from "@/config/business";
import type { Order, OrderItem } from "@/types/product";

export const Route = createFileRoute("/admin/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos · Admin Luchozam.OK" }] }),
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav({ to: "/admin/login" });
  }, [loading, user, isAdmin, nav]);

  async function load() {
    setBusy(true);
    let q = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter as Order["status"]);
    const { data, error } = await q;
    setBusy(false);
    if (error) {
      toast.error("Error al cargar pedidos");
      return;
    }
    setOrders((data ?? []) as Order[]);
  }

  useEffect(() => {
    if (isAdmin) load();
    /* eslint-disable-next-line */
  }, [isAdmin, filter]);

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(s) ||
      o.customer_name.toLowerCase().includes(s) ||
      o.customer_whatsapp.toLowerCase().includes(s) ||
      o.customer_email.toLowerCase().includes(s)
    );
  });

  if (loading || !isAdmin) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-3 px-4 py-8 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold">Pedidos</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut().then(() => nav({ to: "/admin/login" }))}
          >
            Cerrar sesión
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            placeholder="Buscar por nombre, WhatsApp, email o N°…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {ORDER_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={load} disabled={busy}>
            {busy ? "Cargando…" : "Refrescar"}
          </Button>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin pedidos.</p>
          )}
          {filtered.map((o) => (
            <Card key={o.id}>
              <CardContent className="p-4">
                <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                  <div>
                    <div className="font-semibold">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString("es-AR")}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-muted-foreground">
                      {o.customer_whatsapp} · {o.customer_email}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {ORDER_STATUS_LABELS[o.status] ?? o.status}
                      </Badge>
                      <Badge variant="secondary">
                        {PAYMENT_STATUS_LABELS[o.payment_status] ?? o.payment_status}
                      </Badge>
                      <Badge>{formatARS(o.total_ars)}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={whatsappLink(
                          `Hola ${o.customer_name}, te escribo por tu pedido ${o.order_number}.`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setExpanded((e) => (e === o.id ? null : o.id))
                      }
                    >
                      {expanded === o.id ? (
                        <>
                          <ChevronUp className="mr-1 h-4 w-4" /> Cerrar
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-1 h-4 w-4" /> Detalle
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {expanded === o.id && (
                  <OrderDetail order={o} onSaved={load} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function OrderDetail({ order, onSaved }: { order: Order; onSaved: () => void }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: order.status as string,
    payment_status: order.payment_status as string,
    payment_reference: order.payment_reference ?? "",
    shipping_carrier: order.shipping_carrier ?? "",
    tracking_number: order.tracking_number ?? "",
    tracking_url: order.tracking_url ?? "",
    shipping_cost_ars: order.shipping_cost_ars ?? 0,
    internal_notes: order.internal_notes ?? "",
  });

  useEffect(() => {
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .then(({ data }) => {
        setItems((data ?? []) as OrderItem[]);
        setLoadingItems(false);
      });
  }, [order.id]);

  async function openFile() {
    if (!order.file_path) return;
    const { data, error } = await supabase.storage
      .from("customer-files")
      .createSignedUrl(order.file_path, 60 * 10);
    if (error || !data) {
      toast.error("No se pudo generar el link");
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("orders")
      .update({
        status: form.status as Order["status"],
        payment_status: form.payment_status as Order["payment_status"],
        payment_reference: form.payment_reference || null,
        shipping_carrier: form.shipping_carrier || null,
        tracking_number: form.tracking_number || null,
        tracking_url: form.tracking_url || null,
        shipping_cost_ars: Number(form.shipping_cost_ars) || 0,
        internal_notes: form.internal_notes || null,
      })
      .eq("id", order.id);
    setSaving(false);
    if (error) {
      toast.error("No se pudo guardar");
      return;
    }
    toast.success("Pedido actualizado");
    onSaved();
  }

  return (
    <div className="mt-4 grid gap-4 border-t border-border pt-4 lg:grid-cols-2">
      {/* Cliente + items */}
      <div className="space-y-3 text-sm">
        <div>
          <h3 className="font-semibold">Cliente</h3>
          <p className="text-muted-foreground">
            {order.customer_name}
            <br />
            {order.customer_email} · {order.customer_whatsapp}
            {order.shipping_phone ? ` · ${order.shipping_phone}` : ""}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Entrega</h3>
          <p className="text-muted-foreground">
            {order.delivery_method === "retiro_jujuy"
              ? "Retiro en Jujuy"
              : "Envío nacional"}
            {order.shipping_address ? (
              <>
                <br />
                {order.shipping_address}
              </>
            ) : null}
            {order.customer_city || order.customer_province ? (
              <>
                <br />
                {[order.customer_city, order.customer_province, order.customer_postal_code]
                  .filter(Boolean)
                  .join(", ")}
              </>
            ) : null}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Productos</h3>
          {loadingItems ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ul className="space-y-1 text-muted-foreground">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between gap-3">
                  <span>
                    {it.quantity} × {it.product_name}
                    {it.is_addon ? " (adicional)" : ""}
                  </span>
                  <span>{formatARS(it.total_price_ars)}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-border pt-1 font-semibold text-foreground">
                <span>Total</span>
                <span>{formatARS(order.total_ars)}</span>
              </li>
            </ul>
          )}
        </div>
        <div>
          <h3 className="font-semibold">Archivo</h3>
          {order.file_path ? (
            <Button size="sm" variant="outline" onClick={openFile}>
              Abrir {order.file_name ?? "archivo"}
            </Button>
          ) : (
            <p className="text-muted-foreground">Sin archivo subido</p>
          )}
        </div>
        {order.observations && (
          <div>
            <h3 className="font-semibold">Observaciones del cliente</h3>
            <p className="text-muted-foreground">{order.observations}</p>
          </div>
        )}
      </div>

      {/* Form admin */}
      <div className="space-y-3 text-sm">
        <div>
          <Label>Estado del pedido</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Estado de pago</Label>
          <Select
            value={form.payment_status}
            onValueChange={(v) => setForm((f) => ({ ...f, payment_status: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Referencia de pago</Label>
          <Input
            value={form.payment_reference}
            onChange={(e) =>
              setForm((f) => ({ ...f, payment_reference: e.target.value }))
            }
            placeholder="ID transferencia / Mercado Pago"
          />
        </div>

        <div className="rounded-md border border-border p-3">
          <h3 className="mb-2 font-semibold">Envío</h3>
          <div className="space-y-2">
            <div>
              <Label>Operador logístico</Label>
              <Input
                value={form.shipping_carrier}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shipping_carrier: e.target.value }))
                }
                placeholder="Correo Argentino, Andreani…"
              />
            </div>
            <div>
              <Label>Costo de envío (ARS)</Label>
              <Input
                type="number"
                value={form.shipping_cost_ars}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    shipping_cost_ars: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div>
              <Label>Número de tracking</Label>
              <Input
                value={form.tracking_number}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tracking_number: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>URL de tracking</Label>
              <Input
                value={form.tracking_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tracking_url: e.target.value }))
                }
                placeholder="https://…"
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Notas internas</Label>
          <Textarea
            rows={3}
            value={form.internal_notes}
            onChange={(e) =>
              setForm((f) => ({ ...f, internal_notes: e.target.value }))
            }
          />
        </div>

        <Button onClick={save} disabled={saving} className="w-full">
          {saving ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
