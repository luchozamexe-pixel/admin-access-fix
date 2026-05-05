import { supabase } from "@/integrations/supabase/client";

const ALLOWED_MIME = [
  "image/png",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream", // algunos navegadores envían los .zip así
];
const ALLOWED_EXT = ["png", "pdf", "zip"];
const MAX_BYTES = 100 * 1024 * 1024; // 100MB

export async function uploadCustomerFile(
  file: File,
  prefix: "orders" | "wholesale" = "orders",
): Promise<{ path: string; name: string }> {
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const mimeOk = ALLOWED_MIME.includes(file.type);
  const extOk = ALLOWED_EXT.includes(ext);
  if (!mimeOk && !extOk) {
    throw new Error("Solo se aceptan archivos PNG, PDF o ZIP");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("El archivo supera el límite de 100MB");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = `${prefix}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage
    .from("customer-files")
    .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
  if (error) throw new Error("No se pudo subir el archivo: " + error.message);
  return { path, name: file.name };
}

export { ALLOWED_MIME, MAX_BYTES };
