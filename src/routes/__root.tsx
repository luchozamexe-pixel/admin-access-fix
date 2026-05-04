import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Luchozam.OK — DTF UV y Textil en Argentina" },
      {
        name: "description",
        content:
          "Impresión DTF UV y DTF Textil para marcas, negocios y emprendedores. Subí tu archivo, pagá online y recibí tu pedido en cualquier punto de Argentina.",
      },
      { name: "author", content: "Luchozam.OK" },
      { property: "og:title", content: "Luchozam.OK — DTF UV y Textil en Argentina" },
      {
        property: "og:description",
        content: "Impresión DTF UV y DTF Textil con envíos a todo el país.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Luchozam.OK — DTF UV y Textil en Argentina" },
      { name: "description", content: "Planchas DTF UV y DTF textil para marcas, negocios y emprendedores. Comprá online, subí tu archivo y recibí tu pedido en cualquier punto del país." },
      { property: "og:description", content: "Planchas DTF UV y DTF textil para marcas, negocios y emprendedores. Comprá online, subí tu archivo y recibí tu pedido en cualquier punto del país." },
      { name: "twitter:description", content: "Planchas DTF UV y DTF textil para marcas, negocios y emprendedores. Comprá online, subí tu archivo y recibí tu pedido en cualquier punto del país." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/upWMXEMTbeXrfB8cP4wvKh5aU8E2/social-images/social-1777573511897-ChatGPT_Image_30_abr_2026,_03_25_05_p.m..webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/upWMXEMTbeXrfB8cP4wvKh5aU8E2/social-images/social-1777573511897-ChatGPT_Image_30_abr_2026,_03_25_05_p.m..webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
}
