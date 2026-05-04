import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "¿Qué diferencia hay entre DTF UV y DTF textil?", a: "DTF UV se usa para superficies rígidas como frascos, termos, vasos, packaging, acrílicos, plásticos, vidrios y objetos. DTF textil se usa para prendas y telas." },
  { q: "¿El precio incluye diseño?", a: "No. El precio incluye impresión y revisión técnica básica. El diseño, redibujo, vectorización o armado complejo se cobra aparte." },
  { q: "¿Qué archivo tengo que enviar?", a: "PNG o PDF en buena calidad, tamaño real y con fondo transparente cuando corresponda." },
  { q: "¿Puedo mandar una captura de pantalla?", a: "No es recomendable. Las capturas suelen tener baja calidad y pueden salir pixeladas." },
  { q: "¿Qué pasa si mi archivo está mal?", a: "Te avisamos antes de producir. Podés corregirlo o contratar revisión/armado." },
  { q: "¿Hacen envíos?", a: "Sí, enviamos a todo el país por Correo Argentino u operador disponible." },
  { q: "¿Venden por mayor?", a: "Sí. Los clientes mayoristas deben completar el formulario mayorista." },
  { q: "¿Cuánto demora?", a: "Con archivo correcto, la producción estimada es de 24 a 72 horas hábiles." },
  { q: "¿Puedo pedir medio metro?", a: "Sí, en DTF UV ofrecemos medio metro." },
  { q: "¿Puedo pedir diseño personalizado?", a: "Sí, pero no está incluido en el precio base. Puede cotizarse aparte o derivarse a un diseñador." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Preguntas frecuentes — DTF UV y DTF Textil | Luchozam.OK" },
      { name: "description", content: "Respuestas a las preguntas más comunes sobre impresión DTF UV y DTF Textil, archivos, envíos, tiempos y mayoristas." },
      { property: "og:title", content: "Preguntas frecuentes — Luchozam.OK" },
      { property: "og:description", content: "Todo lo que necesitás saber antes de comprar DTF." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <section className="border-b border-border bg-accent/30">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  ),
});