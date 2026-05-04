-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');
CREATE TYPE public.product_category AS ENUM ('dtf_textil', 'dtf_uv', 'servicio_adicional', 'especial');
CREATE TYPE public.order_status AS ENUM (
  'recibido','pago_pendiente','pago_confirmado',
  'archivo_pendiente','archivo_aprobado','archivo_observaciones',
  'en_produccion','listo_retiro','listo_despacho','despachado','entregado','cancelado'
);
CREATE TYPE public.payment_status AS ENUM ('pendiente','pagado','fallido','reembolsado');
CREATE TYPE public.payment_method AS ENUM ('mercadopago','transferencia','manual');
CREATE TYPE public.delivery_method AS ENUM ('retiro_jujuy','envio_nacional');

-- USER ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category public.product_category NOT NULL,
  short_description text NOT NULL,
  long_description text NOT NULL,
  price_ars integer NOT NULL,
  is_quote boolean NOT NULL DEFAULT false,
  is_addon boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 100,
  cta_label text NOT NULL DEFAULT 'Comprar',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ORDERS
CREATE SEQUENCE public.order_number_seq START 1001;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('LZ-' || nextval('public.order_number_seq')::text),
  customer_name text NOT NULL,
  customer_whatsapp text NOT NULL,
  customer_email text NOT NULL,
  customer_city text,
  customer_province text,
  customer_postal_code text,
  shipping_address text,
  shipping_phone text,
  delivery_method public.delivery_method NOT NULL DEFAULT 'envio_nacional',
  shipping_notes text,
  observations text,
  file_path text,
  file_name text,
  has_ready_file boolean NOT NULL DEFAULT true,
  wants_review boolean NOT NULL DEFAULT false,
  wants_assembly boolean NOT NULL DEFAULT false,
  uv_use_type text,
  status public.order_status NOT NULL DEFAULT 'recibido',
  payment_method public.payment_method,
  payment_status public.payment_status NOT NULL DEFAULT 'pendiente',
  payment_reference text,
  subtotal_ars integer NOT NULL DEFAULT 0,
  shipping_cost_ars integer NOT NULL DEFAULT 0,
  total_ars integer NOT NULL DEFAULT 0,
  shipping_carrier text,
  tracking_number text,
  tracking_url text,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_slug text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price_ars integer NOT NULL,
  total_price_ars integer NOT NULL,
  is_addon boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update order items" ON public.order_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete order items" ON public.order_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- WHOLESALE LEADS
CREATE TABLE public.wholesale_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  business_name text,
  city text,
  province text,
  whatsapp text NOT NULL,
  email text NOT NULL,
  product_interest text NOT NULL,
  monthly_volume text,
  has_artwork boolean NOT NULL DEFAULT false,
  needs_invoice boolean NOT NULL DEFAULT false,
  is_reseller boolean NOT NULL DEFAULT false,
  observations text,
  file_path text,
  file_name text,
  status text NOT NULL DEFAULT 'nuevo',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.wholesale_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit wholesale leads" ON public.wholesale_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view wholesale leads" ON public.wholesale_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update wholesale leads" ON public.wholesale_leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete wholesale leads" ON public.wholesale_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- TRIGGERS updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_orders_updated_at  BEFORE UPDATE ON public.orders   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- STORAGE customer-files (privado)
INSERT INTO storage.buckets (id, name, public) VALUES ('customer-files','customer-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload customer files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'customer-files');
CREATE POLICY "Admins can read customer files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'customer-files' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete customer files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'customer-files' AND public.has_role(auth.uid(),'admin'));

-- AUTO-PROMOTE admin: si se registra el email de Lucho, queda como admin
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email = 'luchozam.exe@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_signup();