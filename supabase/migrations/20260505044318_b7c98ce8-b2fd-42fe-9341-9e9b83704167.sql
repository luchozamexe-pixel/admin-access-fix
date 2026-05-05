
-- 1) Desactivar productos viejos que se reemplazan por planes de Preparación de archivo
UPDATE public.products SET active = false, updated_at = now()
WHERE slug IN ('revision-tecnica', 'armado-simple');

-- 2) Insertar 3 planes nuevos (categoría 'servicio_adicional', NO addon: aparecen como productos principales en su sección)
INSERT INTO public.products (slug, name, category, short_description, long_description, price_ars, is_quote, is_addon, is_featured, active, sort_order, cta_label)
VALUES
  ('preparacion-basico', 'Preparación de archivo · Básico', 'servicio_adicional',
   'Para quien tiene un archivo casi listo. Revisión, ajuste menor y 1 corrección chica.',
   E'Incluye:\n• Revisión técnica del archivo\n• Ajuste menor (tamaño, posición)\n• Acomodado simple en plancha\n• 1 corrección chica\n\nNo incluye: diseño desde cero, vectorización compleja ni cambios ilimitados.',
   19500, false, false, false, true, 50, 'Elegir Básico'),
  ('preparacion-pro', 'Preparación de archivo · Pro', 'servicio_adicional',
   'Para quien tiene logos o diseños y necesita la plancha bien armada.',
   E'Incluye:\n• Armado de plancha\n• Limpieza básica\n• Orden visual y tamaños\n• Aprovechamiento del espacio\n• Hasta 2 ajustes\n\nNo incluye: identidad de marca ni ilustraciones desde cero.',
   37500, false, false, false, true, 51, 'Elegir Pro'),
  ('preparacion-premium', 'Preparación de archivo · Premium', 'servicio_adicional',
   'Más elegido. Para dejar el archivo listo para vender y producir.',
   E'Incluye:\n• Preparación completa del archivo\n• Mejora visual simple\n• Armado premium de plancha\n• Mockup básico\n• Prioridad en la cola\n• Revisión final\n\nNo incluye: branding completo ni cambios ilimitados.',
   50000, false, false, true, true, 52, 'Elegir Premium')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  price_ars = EXCLUDED.price_ars,
  is_addon = EXCLUDED.is_addon,
  is_featured = EXCLUDED.is_featured,
  active = true,
  sort_order = EXCLUDED.sort_order,
  cta_label = EXCLUDED.cta_label,
  updated_at = now();

-- 3) Cerrar RLS público de orders y order_items (PII expuesto)
DROP POLICY IF EXISTS "Anyone can view orders by number" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;

CREATE POLICY "Admins can view orders"
ON public.orders FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view order items"
ON public.order_items FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4) Restringir storage por path (orders/ o wholesale/)
DROP POLICY IF EXISTS "Anyone can upload customer files" ON storage.objects;
CREATE POLICY "Public can upload to orders or wholesale"
ON storage.objects FOR INSERT TO public
WITH CHECK (
  bucket_id = 'customer-files'
  AND (name LIKE 'orders/%' OR name LIKE 'wholesale/%')
);
