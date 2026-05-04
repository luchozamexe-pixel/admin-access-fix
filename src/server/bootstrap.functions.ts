import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ALLOWED_ADMIN_EMAIL = "luchozam.exe@gmail.com";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  bootstrap_code: z.string().min(1).max(200),
});

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_BOOTSTRAP_CODE;
    if (!expected) {
      throw new Error("Bootstrap no está configurado en el servidor.");
    }
    if (data.bootstrap_code !== expected) {
      throw new Error("Código de bootstrap inválido.");
    }
    if (data.email !== ALLOWED_ADMIN_EMAIL) {
      throw new Error("Este email no está autorizado como administrador.");
    }

    // Buscar si ya existe el usuario
    let userId: string | null = null;
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw new Error("No se pudo consultar usuarios: " + listErr.message);
    const existing = list.users.find((u) => (u.email ?? "").toLowerCase() === data.email);

    if (existing) {
      userId = existing.id;
      // Confirmar email + actualizar contraseña
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: data.password,
        email_confirm: true,
      });
      if (updErr) throw new Error("No se pudo actualizar el usuario: " + updErr.message);
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });
      if (createErr || !created.user) {
        throw new Error("No se pudo crear el usuario: " + (createErr?.message ?? "desconocido"));
      }
      userId = created.user.id;
    }

    // Asignar rol admin (idempotente)
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    if (roleErr) throw new Error("No se pudo asignar rol admin: " + roleErr.message);

    return { ok: true, user_id: userId };
  });
