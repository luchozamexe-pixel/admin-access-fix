export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          id: string
          is_addon: boolean
          order_id: string
          product_id: string | null
          product_name: string
          product_slug: string | null
          quantity: number
          total_price_ars: number
          unit_price_ars: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_addon?: boolean
          order_id: string
          product_id?: string | null
          product_name: string
          product_slug?: string | null
          quantity?: number
          total_price_ars: number
          unit_price_ars: number
        }
        Update: {
          created_at?: string
          id?: string
          is_addon?: boolean
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_slug?: string | null
          quantity?: number
          total_price_ars?: number
          unit_price_ars?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_city: string | null
          customer_email: string
          customer_name: string
          customer_postal_code: string | null
          customer_province: string | null
          customer_whatsapp: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          file_name: string | null
          file_path: string | null
          has_ready_file: boolean
          id: string
          internal_notes: string | null
          observations: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          shipping_address: string | null
          shipping_carrier: string | null
          shipping_cost_ars: number
          shipping_notes: string | null
          shipping_phone: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal_ars: number
          total_ars: number
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          uv_use_type: string | null
          wants_assembly: boolean
          wants_review: boolean
        }
        Insert: {
          created_at?: string
          customer_city?: string | null
          customer_email: string
          customer_name: string
          customer_postal_code?: string | null
          customer_province?: string | null
          customer_whatsapp: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          file_name?: string | null
          file_path?: string | null
          has_ready_file?: boolean
          id?: string
          internal_notes?: string | null
          observations?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address?: string | null
          shipping_carrier?: string | null
          shipping_cost_ars?: number
          shipping_notes?: string | null
          shipping_phone?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_ars?: number
          total_ars?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          uv_use_type?: string | null
          wants_assembly?: boolean
          wants_review?: boolean
        }
        Update: {
          created_at?: string
          customer_city?: string | null
          customer_email?: string
          customer_name?: string
          customer_postal_code?: string | null
          customer_province?: string | null
          customer_whatsapp?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          file_name?: string | null
          file_path?: string | null
          has_ready_file?: boolean
          id?: string
          internal_notes?: string | null
          observations?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address?: string | null
          shipping_carrier?: string | null
          shipping_cost_ars?: number
          shipping_notes?: string | null
          shipping_phone?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_ars?: number
          total_ars?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          uv_use_type?: string | null
          wants_assembly?: boolean
          wants_review?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          cta_label: string
          id: string
          is_addon: boolean
          is_featured: boolean
          is_quote: boolean
          long_description: string
          name: string
          price_ars: number
          short_description: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          cta_label?: string
          id?: string
          is_addon?: boolean
          is_featured?: boolean
          is_quote?: boolean
          long_description: string
          name: string
          price_ars: number
          short_description: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          cta_label?: string
          id?: string
          is_addon?: boolean
          is_featured?: boolean
          is_quote?: boolean
          long_description?: string
          name?: string
          price_ars?: number
          short_description?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wholesale_leads: {
        Row: {
          business_name: string | null
          city: string | null
          created_at: string
          email: string
          file_name: string | null
          file_path: string | null
          full_name: string
          has_artwork: boolean
          id: string
          is_reseller: boolean
          monthly_volume: string | null
          needs_invoice: boolean
          observations: string | null
          product_interest: string
          province: string | null
          status: string
          whatsapp: string
        }
        Insert: {
          business_name?: string | null
          city?: string | null
          created_at?: string
          email: string
          file_name?: string | null
          file_path?: string | null
          full_name: string
          has_artwork?: boolean
          id?: string
          is_reseller?: boolean
          monthly_volume?: string | null
          needs_invoice?: boolean
          observations?: string | null
          product_interest: string
          province?: string | null
          status?: string
          whatsapp: string
        }
        Update: {
          business_name?: string | null
          city?: string | null
          created_at?: string
          email?: string
          file_name?: string | null
          file_path?: string | null
          full_name?: string
          has_artwork?: boolean
          id?: string
          is_reseller?: boolean
          monthly_volume?: string | null
          needs_invoice?: boolean
          observations?: string | null
          product_interest?: string
          province?: string | null
          status?: string
          whatsapp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff"
      delivery_method: "retiro_jujuy" | "envio_nacional"
      order_status:
        | "recibido"
        | "pago_pendiente"
        | "pago_confirmado"
        | "archivo_pendiente"
        | "archivo_aprobado"
        | "archivo_observaciones"
        | "en_produccion"
        | "listo_retiro"
        | "listo_despacho"
        | "despachado"
        | "entregado"
        | "cancelado"
        | "pedido_recibido"
        | "archivo_pendiente_revision"
        | "archivo_con_observaciones"
      payment_method: "mercadopago" | "transferencia" | "manual"
      payment_status:
        | "pendiente"
        | "pagado"
        | "fallido"
        | "reembolsado"
        | "rechazado"
        | "manual_confirmado"
        | "mercado_pago_pendiente"
        | "mercado_pago_aprobado"
        | "mercado_pago_rechazado"
      product_category:
        | "dtf_textil"
        | "dtf_uv"
        | "servicio_adicional"
        | "especial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
      delivery_method: ["retiro_jujuy", "envio_nacional"],
      order_status: [
        "recibido",
        "pago_pendiente",
        "pago_confirmado",
        "archivo_pendiente",
        "archivo_aprobado",
        "archivo_observaciones",
        "en_produccion",
        "listo_retiro",
        "listo_despacho",
        "despachado",
        "entregado",
        "cancelado",
        "pedido_recibido",
        "archivo_pendiente_revision",
        "archivo_con_observaciones",
      ],
      payment_method: ["mercadopago", "transferencia", "manual"],
      payment_status: [
        "pendiente",
        "pagado",
        "fallido",
        "reembolsado",
        "rechazado",
        "manual_confirmado",
        "mercado_pago_pendiente",
        "mercado_pago_aprobado",
        "mercado_pago_rechazado",
      ],
      product_category: [
        "dtf_textil",
        "dtf_uv",
        "servicio_adicional",
        "especial",
      ],
    },
  },
} as const
