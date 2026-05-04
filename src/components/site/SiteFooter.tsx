import { Link } from "@tanstack/react-router";
import { business, whatsappLink } from "@/config/business";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="text-lg font-bold">{business.brand}</div>
          <p className="mt-2 text-sm text-muted-foreground">{business.tagline}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            {business.productionAddress} · {business.shippingScope}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Productos</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dtf-textil" className="hover:text-foreground">DTF Textil</Link></li>
            <li><Link to="/dtf-uv" className="hover:text-foreground">DTF UV</Link></li>
            <li><Link to="/productos" className="hover:text-foreground">Catálogo completo</Link></li>
            <li><Link to="/mayoristas" className="hover:text-foreground">Mayoristas</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Ayuda</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/como-enviar-archivo" className="hover:text-foreground">Cómo enviar tu archivo</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">Preguntas frecuentes</Link></li>
            <li><Link to="/contacto" className="hover:text-foreground">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contacto</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={whatsappLink("Hola, quiero consultar por impresión DTF.")} target="_blank" rel="noreferrer" className="hover:text-foreground">
                WhatsApp {business.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="hover:text-foreground">{business.email}</a>
            </li>
            <li><Link to="/admin/login" className="text-xs hover:text-foreground">Panel admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {business.brand} · Todos los derechos reservados
      </div>
    </footer>
  );
}