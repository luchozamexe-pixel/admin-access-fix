import { supabase } from "@/integrations/supabase/client";

const ALLOWED_MIME = ["image/png", "application/pdf"];
const MAX_BYTES = 50 * 1024 * 1024; // 50MB

export async function uploadCustomerFile(
  file: File,
  prefix: "orders" | "wholesale" = "orders",
): Promise<{ path: string; name: string }> {
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new Error("Solo se aceptan archivos PNG o PDF");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("El archivo supera el límite de 50MB");
  }
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = `${prefix}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage
    .from("customer-files")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("No se pudo subir el archivo: " + error.message);
  return { path, name: file.name };
}

export { ALLOWED_MIME, MAX_BYTES };