// Datos editables del negocio.
export const business = {
  brand: "luchozam.ok",
  tagline: "DTF UV y DTF Textil listo para imprimir tu marca",
  shortDescription:
    "Subí tu archivo en PNG o PDF, elegí el formato, generá tu pedido y recibí tu impresión en cualquier punto del país.",
  whatsappNumber: "5493885856180",
  whatsappDisplay: "+54 9 388 585-6180",
  email: "luchozam.exe@gmail.com",
  pickupAddress: "General Alvear 1090, San Salvador de Jujuy",
  productionAddress: "Producción y retiro en Jujuy, Argentina",
  shippingScope: "Envíos a todo el país por Correo Argentino",
  shippingCarrier: "Correo Argentino",
  defaultShippingCost: 0,
  city: "San Salvador de Jujuy",
  province: "Jujuy",
  hours: "Lunes a sábado de 7:00 a 22:00. Domingo cerrado.",
  payment: {
    alias: "luciano.339.giga.mp",
    cbu: "0000003100033006813190",
    accountHolder: "Luciano",
  },
  adminEmail: "luchozam.exe@gmail.com",
} as const;

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${business.whatsappNumber}${text}`;
}

export function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  recibido: "Pedido recibido",
  pedido_recibido: "Pedido recibido",
  pago_pendiente: "Pago pendiente",
  pago_confirmado: "Pago confirmado",
  archivo_pendiente: "Archivo pendiente de revisión",
  archivo_pendiente_revision: "Archivo pendiente de revisión",
  archivo_aprobado: "Archivo aprobado",
  archivo_observaciones: "Archivo con observaciones",
  archivo_con_observaciones: "Archivo con observaciones",
  en_produccion: "En producción",
  listo_retiro: "Listo para retirar",
  listo_despacho: "Listo para despachar",
  despachado: "Despachado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pendiente: "Pago pendiente",
  pagado: "Pago confirmado",
  fallido: "Pago fallido",
  reembolsado: "Reembolsado",
  rechazado: "Pago rechazado",
  manual_confirmado: "Confirmado manualmente",
  mercado_pago_pendiente: "Mercado Pago: pendiente",
  mercado_pago_aprobado: "Mercado Pago: aprobado",
  mercado_pago_rechazado: "Mercado Pago: rechazado",
};

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);
