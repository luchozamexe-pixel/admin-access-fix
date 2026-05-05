import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { business } from "@/config/business";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/productos", label: "Comprar" },
  { to: "/dtf-uv", label: "DTF UV" },
  { to: "/dtf-textil", label: "DTF Textil" },
  { to: "/mayoristas", label: "Mayoristas" },
  { to: "/faq", label: "Archivo y FAQ" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            L
          </span>
          <div className="leading-tight">
            <div className="text-base">{business.brand}</div>
            <div className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
              DTF UV · DTF Textil
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild>
            <Link to="/productos">Comprar ahora</Link>
          </Button>
        </div>

        <button
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden rounded-md p-2 hover:bg-accent"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link to="/productos" onClick={() => setOpen(false)}>
                Comprar ahora
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}