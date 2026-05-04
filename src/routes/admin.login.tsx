import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin · Luchozam.OK" }] }),
  component: () => {
    const { signIn, user, isAdmin, loading } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (!loading && user && isAdmin) nav({ to: "/admin/pedidos" });
    }, [loading, user, isAdmin, nav]);

    async function submit(e: React.FormEvent) {
      e.preventDefault();
      setSubmitting(true);
      const { error } = await signIn(email, password);
      setSubmitting(false);
      if (error) toast.error(error);
      else toast.success("Bienvenido");
    }

    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-4 py-16 lg:px-8">
          <h1 className="text-2xl font-bold">Acceso administradores</h1>
          <p className="mt-1 text-sm text-muted-foreground">Solo para el equipo de Luchozam.OK.</p>
          <Card className="mt-6">
            <CardContent className="p-6">
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Contraseña</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando…</> : "Iniciar sesión"}
                </Button>
              </form>
              {user && !isAdmin && (
                <p className="mt-4 rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                  Tu cuenta no tiene rol de admin. Pedile al equipo que te asigne el rol.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </SiteLayout>
    );
  },
});