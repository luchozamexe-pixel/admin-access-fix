import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bootstrapAdmin } from "@/server/bootstrap.functions";

const ALLOWED_ADMIN_EMAIL = "luchozam.exe@gmail.com";

export const Route = createFileRoute("/admin/bootstrap")({
  head: () => ({ meta: [{ title: "Bootstrap admin · Luchozam.OK" }] }),
  component: BootstrapPage,
});

function BootstrapPage() {
  const nav = useNavigate();
  const run = useServerFn(bootstrapAdmin);
  const [email, setEmail] = useState(ALLOWED_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await run({
        data: {
          email: email.trim().toLowerCase(),
          password,
          bootstrap_code: code,
        },
      });
      setDone(true);
      toast.success("Admin creado correctamente. Ya podés iniciar sesión.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 py-16 lg:px-8">
        <h1 className="text-2xl font-bold">Bootstrap admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inicializa la cuenta de administrador sin depender del email de confirmación.
          Eliminá esta ruta cuando termines.
        </p>

        <Card className="mt-6">
          <CardContent className="p-6">
            {done ? (
              <div className="space-y-4">
                <p className="rounded-md bg-primary/10 p-3 text-sm">
                  ✅ Admin creado correctamente. Ya podés iniciar sesión.
                </p>
                <Button className="w-full" onClick={() => nav({ to: "/admin/login" })}>
                  Ir a iniciar sesión
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Email autorizado</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Contraseña inicial</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Código bootstrap</Label>
                  <Input
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Configurado como secret <code>ADMIN_BOOTSTRAP_CODE</code> en el servidor.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando…
                    </>
                  ) : (
                    "Crear / confirmar admin"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
