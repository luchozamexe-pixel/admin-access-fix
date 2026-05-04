import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { whatsappLink } from "@/config/business";

export const Route = createFileRoute("/pedido/$numero")({
  head: () => ({
    meta: [
      { title: "Pedido confirmado | Luchozam.OK" },
      { name: "description", content: "Tu pedido fue recibido. Te contactamos por WhatsApp para coordinar pago y producción." },
    ],
  }),
  component: () => {
    const { numero } = Route.useParams();
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-16 text-center lg:px-8">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <h1 className="mt-4 text-3xl font-bold">¡Pedido recibido!</h1>
          <p className="mt-3 text-muted-foreground">Tu número de pedido es:</p>
          <p className="mt-2 text-2xl font-bold text-primary">{numero}</p>
          <Card className="mt-8 text-left">
            <CardContent className="space-y-3 p-6 text-sm">
              <p><strong>Próximos pasos:</strong></p>
              <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                <li>Revisamos tu archivo (te avisamos si hay observaciones).</li>
                <li>Te enviamos el link de pago o los datos de transferencia por WhatsApp.</li>
                <li>Una vez confirmado el pago, pasamos a producción (24-72 hs hábiles).</li>
                <li>Despachamos tu pedido a la dirección indicada.</li>
              </ol>
              <p className="rounded-md bg-muted p-3 text-xs">Guardá este número de pedido para cualquier consulta.</p>
            </CardContent>
          </Card>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href={whatsappLink(`Hola, mi pedido es ${numero}.`)} target="_blank" rel="noreferrer">Contactar por WhatsApp</a>
            </Button>
            <Button asChild variant="outline"><Link to="/">Volver al inicio</Link></Button>
          </div>
        </section>
      </SiteLayout>
    );
  },
});