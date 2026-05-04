import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(500),
  is_addon: z.boolean().default(false),
});

const createOrderSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_whatsapp: z.string().trim().min(6).max(40),
  customer_email: z.string().trim().email().max(200),
  customer_city: z.string().trim().max(120).optional().nullable(),
  customer_province: z.string().trim().max(120).optional().nullable(),
  customer_postal_code: z.string().trim().max(20).optional().nullable(),
  shipping_address: z.string().trim().max(300).optional().nullable(),
  shipping_phone: z.string().trim().max(40).optional().nullable(),
  delivery_method: z.enum(["retiro_jujuy", "envio_nacional"]),
  observations: z.string().trim().max(2000).optional().nullable(),
  shipping_notes: z.string().trim().max(500).optional().nullable(),
  has_ready_file: z.boolean().default(true),
  wants_review: z.boolean().default(false),
  wants_assembly: z.boolean().default(false),
  uv_use_type: z.string().trim().max(120).optional().nullable(),
  file_path: z.string().trim().max(500).optional().nullable(),
  file_name: z.string().trim().max(300).optional().nullable(),
  payment_method: z.enum(["mercadopago", "transferencia", "manual"]).default("transferencia"),
  items: z.array(orderItemSchema).min(1).max(20),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createOrderSchema.parse(input))
  .handler(async ({ data }) => {
    // Cargamos los productos para fijar precio del lado servidor
    const productIds = data.items.map((i) => i.product_id);
    const { data: products, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id, name, slug, price_ars, is_addon, is_quote, active")
      .in("id", productIds);

    if (prodErr) throw new Error("No se pudieron cargar los productos");
    if (!products || products.length === 0) throw new Error("Productos no encontrados");

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const itemRows = data.items.map((item) => {
      const p = productMap.get(item.product_id);
      if (!p) throw new Error("Producto inválido en el carrito");
      if (!p.active) throw new Error(`El producto "${p.name}" no está disponible`);
      if (p.is_quote) throw new Error(`El producto "${p.name}" requiere cotización por WhatsApp`);
      const total = p.price_ars * item.quantity;
      subtotal += total;
      return {
        product_id: p.id,
        product_name: p.name,
        product_slug: p.slug,
        quantity: item.quantity,
        unit_price_ars: p.price_ars,
        total_price_ars: total,
        is_addon: !!p.is_addon,
      };
    });

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        customer_whatsapp: data.customer_whatsapp,
        customer_email: data.customer_email,
        customer_city: data.customer_city ?? null,
        customer_province: data.customer_province ?? null,
        customer_postal_code: data.customer_postal_code ?? null,
        shipping_address: data.shipping_address ?? null,
        shipping_phone: data.shipping_phone ?? null,
        delivery_method: data.delivery_method,
        observations: data.observations ?? null,
        shipping_notes: data.shipping_notes ?? null,
        has_ready_file: data.has_ready_file,
        wants_review: data.wants_review,
        wants_assembly: data.wants_assembly,
        uv_use_type: data.uv_use_type ?? null,
        file_path: data.file_path ?? null,
        file_name: data.file_name ?? null,
        payment_method: data.payment_method,
        subtotal_ars: subtotal,
        shipping_cost_ars: 0,
        total_ars: subtotal,
        status: "recibido",
        payment_status: "pendiente",
      })
      .select("id, order_number")
      .single();

    if (orderErr || !order) throw new Error("No se pudo crear el pedido");

    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(itemRows.map((row) => ({ ...row, order_id: order.id })));

    if (itemsErr) {
      // rollback manual del pedido
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      throw new Error("No se pudieron guardar los items del pedido");
    }

    return {
      order_number: order.order_number,
      total_ars: subtotal,
    };
  });

const wholesaleSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  business_name: z.string().trim().max(160).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  province: z.string().trim().max(120).optional().nullable(),
  whatsapp: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(200),
  product_interest: z.string().trim().min(2).max(60),
  monthly_volume: z.string().trim().max(120).optional().nullable(),
  has_artwork: z.boolean().default(false),
  needs_invoice: z.boolean().default(false),
  observations: z.string().trim().max(2000).optional().nullable(),
  file_path: z.string().trim().max(500).optional().nullable(),
  file_name: z.string().trim().max(300).optional().nullable(),
});

export const createWholesaleLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => wholesaleSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("wholesale_leads").insert({
      full_name: data.full_name,
      business_name: data.business_name ?? null,
      city: data.city ?? null,
      province: data.province ?? null,
      whatsapp: data.whatsapp,
      email: data.email,
      product_interest: data.product_interest,
      monthly_volume: data.monthly_volume ?? null,
      has_artwork: data.has_artwork,
      needs_invoice: data.needs_invoice,
      observations: data.observations ?? null,
      file_path: data.file_path ?? null,
      file_name: data.file_name ?? null,
    });
    if (error) throw new Error("No se pudo enviar la consulta mayorista");
    return { ok: true };
  });

export const getOrderByNumber = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ order_number: z.string().trim().min(1).max(40) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_number, status, payment_status, payment_reference, customer_name, customer_email, customer_whatsapp, customer_city, customer_province, shipping_address, delivery_method, subtotal_ars, shipping_cost_ars, total_ars, shipping_carrier, tracking_number, tracking_url, created_at",
      )
      .eq("order_number", data.order_number)
      .maybeSingle();
    if (error) throw new Error("No se pudo cargar el pedido");
    if (!order) return null;
    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("id, product_name, quantity, unit_price_ars, total_price_ars, is_addon")
      .eq("order_id", order.id);
    return { order, items: items ?? [] };
  });