import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

const ALLOWED_ADMIN_EMAIL = "luchozam.exe@gmail.com";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin · Luchozam.OK" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { signIn, signUp, resetPassword, user, isAdmin, loading } = useAuth();
  const nav = useNavigate();

  const [tab, setTab] = useState<"login" | "signup" | "reset">("login");

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // signup
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);

  // reset
  const [resetEmail, setResetEmail] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) nav({ to: "/admin/pedidos" });
  }, [loading, user, isAdmin, nav]);

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Bienvenido");
    }
  }

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault();
    const normalized = signupEmail.trim().toLowerCase();
    if (normalized !== ALLOWED_ADMIN_EMAIL) {
      toast.error("Este email no está autorizado como administrador.");
      return;
    }
    if (signupPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setSigningUp(true);
    const { error, needsConfirmation } = await signUp(normalized, signupPassword);
    setSigningUp(false);
    if (error) {
      const msg = error.toLowerCase();
      if (msg.includes("registered") || msg.includes("exists") || msg.includes("already")) {
        toast.error("Esta cuenta ya existe. Iniciá sesión con tu contraseña o recuperá acceso.");
        setTab("login");
        setEmail(normalized);
      } else {
        toast.error(error);
      }
      return;
    }
    if (needsConfirmation) {
      toast.success("Cuenta creada. Revisá tu bandeja de entrada y spam. Después volvé a iniciar sesión.");
      setTab("login");
      setEmail(normalized);
    } else {
      toast.success("Cuenta creada. Revisá tu email para confirmar la cuenta si Supabase lo solicita.");
    }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    setResetting(true);
    const { error } = await resetPassword(resetEmail.trim().toLowerCase());
    setResetting(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Te enviamos un email para recuperar la contraseña. Revisá bandeja de entrada y spam.");
      setTab("login");
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 py-16 lg:px-8">
        <h1 className="text-2xl font-bold">Acceso administradores</h1>
        <p className="mt-1 text-sm text-muted-foreground">Solo para el equipo de Luchozam.OK.</p>

        <Card className="mt-6">
          <CardContent className="p-6">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="signup">Crear cuenta admin</TabsTrigger>
                <TabsTrigger value="reset">Recuperar</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4">
                <form onSubmit={submitLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando…
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setTab("reset")}
                    className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Olvidé mi contraseña
                  </button>
                </form>
                {user && !isAdmin && (
                  <p className="mt-4 rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                    Tu cuenta no tiene permisos de administrador.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <form onSubmit={submitSignup} className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Solo el email autorizado puede registrarse como administrador.
                  </p>
                  <div className="space-y-1.5">
                    <Label>Email autorizado</Label>
                    <Input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder={ALLOWED_ADMIN_EMAIL}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={signingUp}>
                    {signingUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando…
                      </>
                    ) : (
                      "Crear cuenta admin"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset" className="mt-4">
                <form onSubmit={submitReset} className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Te enviaremos un email para restablecer tu contraseña.
                  </p>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={resetting}>
                    {resetting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando…
                      </>
                    ) : (
                      "Enviar email de recuperación"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
