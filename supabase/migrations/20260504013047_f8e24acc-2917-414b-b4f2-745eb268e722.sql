
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'pedido_recibido';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'archivo_pendiente_revision';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'archivo_con_observaciones';

ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'rechazado';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'manual_confirmado';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'mercado_pago_pendiente';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'mercado_pago_aprobado';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'mercado_pago_rechazado';
