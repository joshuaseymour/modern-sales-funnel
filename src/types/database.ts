// =====================================================
// TypeScript Type Definitions for Supabase Schema
// Auto-generated types compatible with Supabase CLI
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          created_at: string
          updated_at: string
          consent_given: boolean
          consent_timestamp: string | null
          marketing_consent: boolean
          total_spent: number
          order_count: number
          last_purchase_at: string | null
          is_active: boolean
          source: string | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
          consent_given?: boolean
          consent_timestamp?: string | null
          marketing_consent?: boolean
          total_spent?: number
          order_count?: number
          last_purchase_at?: string | null
          is_active?: boolean
          source?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
          consent_given?: boolean
          consent_timestamp?: string | null
          marketing_consent?: boolean
          total_spent?: number
          order_count?: number
          last_purchase_at?: string | null
          is_active?: boolean
          source?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          type: Database["public"]["Enums"]["product_type"]
          price: number
          perceived_value: number | null
          is_active: boolean
          created_at: string
          updated_at: string
          features: Json
          metadata: Json
          display_order: number
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: Database["public"]["Enums"]["product_type"]
          price: number
          perceived_value?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          features?: Json
          metadata?: Json
          display_order?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: Database["public"]["Enums"]["product_type"]
          price?: number
          perceived_value?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          features?: Json
          metadata?: Json
          display_order?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          subtotal: number
          discount_amount: number
          tax_amount: number
          created_at: string
          updated_at: string
          notes: string | null
          source: string | null
          session_id: string | null
          guarantee_expires_at: string
          payment_method: string | null
          last_four_digits: string | null
          fulfilled_at: string | null
          tracking_number: string | null
          currency: string
        }
        Insert: {
          id?: string
          customer_id: string
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          subtotal?: number
          discount_amount?: number
          tax_amount?: number
          created_at?: string
          updated_at?: string
          notes?: string | null
          source?: string | null
          session_id?: string | null
          guarantee_expires_at?: string
          payment_method?: string | null
          last_four_digits?: string | null
          fulfilled_at?: string | null
          tracking_number?: string | null
          currency?: string
        }
        Update: {
          id?: string
          customer_id?: string
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          subtotal?: number
          discount_amount?: number
          tax_amount?: number
          created_at?: string
          updated_at?: string
          notes?: string | null
          source?: string | null
          session_id?: string | null
          guarantee_expires_at?: string
          payment_method?: string | null
          last_four_digits?: string | null
          fulfilled_at?: string | null
          tracking_number?: string | null
          currency?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
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
      payments: {
        Row: {
          id: string
          order_id: string
          status: Database["public"]["Enums"]["payment_status"]
          amount: number
          payment_method: string
          processor_transaction_id: string | null
          processor_name: string | null
          created_at: string
          updated_at: string
          processed_at: string | null
          processor_response: Json | null
          refunded_amount: number
          refunded_at: string | null
          refund_reason: string | null
        }
        Insert: {
          id?: string
          order_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          amount: number
          payment_method: string
          processor_transaction_id?: string | null
          processor_name?: string | null
          created_at?: string
          updated_at?: string
          processed_at?: string | null
          processor_response?: Json | null
          refunded_amount?: number
          refunded_at?: string | null
          refund_reason?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          amount?: number
          payment_method?: string
          processor_transaction_id?: string | null
          processor_name?: string | null
          created_at?: string
          updated_at?: string
          processed_at?: string | null
          processor_response?: Json | null
          refunded_amount?: number
          refunded_at?: string | null
          refund_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_sessions: {
        Row: {
          id: string
          session_id: string
          customer_id: string | null
          current_step: Database["public"]["Enums"]["funnel_step"]
          started_at: string
          completed_at: string | null
          abandoned_at: string | null
          converted: boolean
          conversion_value: number
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          referrer: string | null
          ip_address: string | null
          user_agent: string | null
          device_type: string | null
          browser: string | null
          os: string | null
          country: string | null
          city: string | null
          variant: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          session_id: string
          customer_id?: string | null
          current_step?: Database["public"]["Enums"]["funnel_step"]
          started_at?: string
          completed_at?: string | null
          abandoned_at?: string | null
          converted?: boolean
          conversion_value?: number
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          referrer?: string | null
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          variant?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          session_id?: string
          customer_id?: string | null
          current_step?: Database["public"]["Enums"]["funnel_step"]
          started_at?: string
          completed_at?: string | null
          abandoned_at?: string | null
          converted?: boolean
          conversion_value?: number
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          referrer?: string | null
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          variant?: string | null
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "funnel_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_events: {
        Row: {
          id: string
          session_id: string
          event_type: string
          step: Database["public"]["Enums"]["funnel_step"]
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          event_type: string
          step: Database["public"]["Enums"]["funnel_step"]
          data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          event_type?: string
          step?: Database["public"]["Enums"]["funnel_step"]
          data?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funnel_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "funnel_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscriptions: {
        Row: {
          id: string
          customer_id: string
          email: string
          subscribed: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          source: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          email: string
          subscribed?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          source?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          email?: string
          subscribed?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          source?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          id: string
          order_id: string
          payment_id: string | null
          amount: number
          reason: string
          status: string
          requested_at: string
          processed_at: string | null
          processor_refund_id: string | null
          notes: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          order_id: string
          payment_id?: string | null
          amount: number
          reason: string
          status?: string
          requested_at?: string
          processed_at?: string | null
          processor_refund_id?: string | null
          notes?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          payment_id?: string | null
          amount?: number
          reason?: string
          status?: string
          requested_at?: string
          processed_at?: string | null
          processor_refund_id?: string | null
          notes?: string | null
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          id: string
          name: string
          description: string | null
          enabled: boolean
          rollout_percentage: number
          target_audience: Json
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          enabled?: boolean
          rollout_percentage?: number
          target_audience?: Json
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          enabled?: boolean
          rollout_percentage?: number
          target_audience?: Json
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      customer_summary: {
        Row: {
          id: string | null
          email: string | null
          name: string | null
          created_at: string | null
          total_spent: number | null
          order_count: number | null
          last_purchase_at: string | null
          is_active: boolean | null
          source: string | null
          orders_last_30_days: number | null
          revenue_last_30_days: number | null
          avg_order_value: number | null
        }
        Relationships: []
      }
      funnel_analytics: {
        Row: {
          date: string | null
          total_sessions: number | null
          reached_checkout: number | null
          conversions: number | null
          total_revenue: number | null
          checkout_rate_percent: number | null
          conversion_rate_percent: number | null
          avg_order_value: number | null
        }
        Relationships: []
      }
      product_performance: {
        Row: {
          id: string | null
          name: string | null
          type: Database["public"]["Enums"]["product_type"] | null
          price: number | null
          total_sold: number | null
          total_revenue: number | null
          unique_orders: number | null
          avg_selling_price: number | null
        }
        Relationships: []
      }
      order_details: {
        Row: {
          order_id: string | null
          order_number: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number | null
          created_at: string | null
          guarantee_expires_at: string | null
          customer_email: string | null
          customer_name: string | null
          items: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_customer_by_email: {
        Args: {
          customer_email: string
        }
        Returns: string
      }
      upsert_customer: {
        Args: {
          customer_email: string
          customer_name: string
          customer_phone?: string
          customer_source?: string
          customer_ip?: string
          customer_user_agent?: string
        }
        Returns: string
      }
      has_feature_access: {
        Args: {
          feature_name: string
        }
        Returns: boolean
      }
      create_order_with_items: {
        Args: {
          customer_email: string
          customer_name: string
          product_ids: string[]
          quantities: number[]
          session_id?: string
          order_source?: string
        }
        Returns: string
      }
    }
    Enums: {
      order_status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
      payment_status: "pending" | "processing" | "completed" | "failed" | "refunded"
      product_type: "tripwire" | "bump" | "upsell" | "downsell"
      funnel_step: "landing" | "checkout" | "thankyou"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// =====================================================
// APPLICATION-SPECIFIC TYPES
// =====================================================

export type Customer = Database["public"]["Tables"]["customers"]["Row"]
export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"]
export type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"]

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"]
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"]

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
export type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"]
export type OrderItemUpdate = Database["public"]["Tables"]["order_items"]["Update"]

export type Payment = Database["public"]["Tables"]["payments"]["Row"]
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"]
export type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"]

export type FunnelSession = Database["public"]["Tables"]["funnel_sessions"]["Row"]
export type FunnelSessionInsert = Database["public"]["Tables"]["funnel_sessions"]["Insert"]
export type FunnelSessionUpdate = Database["public"]["Tables"]["funnel_sessions"]["Update"]

export type FunnelEvent = Database["public"]["Tables"]["funnel_events"]["Row"]
export type FunnelEventInsert = Database["public"]["Tables"]["funnel_events"]["Insert"]
export type FunnelEventUpdate = Database["public"]["Tables"]["funnel_events"]["Update"]

export type EmailSubscription = Database["public"]["Tables"]["email_subscriptions"]["Row"]
export type EmailSubscriptionInsert = Database["public"]["Tables"]["email_subscriptions"]["Insert"]
export type EmailSubscriptionUpdate = Database["public"]["Tables"]["email_subscriptions"]["Update"]

export type Refund = Database["public"]["Tables"]["refunds"]["Row"]
export type RefundInsert = Database["public"]["Tables"]["refunds"]["Insert"]
export type RefundUpdate = Database["public"]["Tables"]["refunds"]["Update"]

export type FeatureFlag = Database["public"]["Tables"]["feature_flags"]["Row"]
export type FeatureFlagInsert = Database["public"]["Tables"]["feature_flags"]["Insert"]
export type FeatureFlagUpdate = Database["public"]["Tables"]["feature_flags"]["Update"]

// View types
export type CustomerSummary = Database["public"]["Views"]["customer_summary"]["Row"]
export type FunnelAnalytics = Database["public"]["Views"]["funnel_analytics"]["Row"]
export type ProductPerformance = Database["public"]["Views"]["product_performance"]["Row"]
export type OrderDetails = Database["public"]["Views"]["order_details"]["Row"]

// Enum types
export type OrderStatus = Database["public"]["Enums"]["order_status"]
export type PaymentStatus = Database["public"]["Enums"]["payment_status"]
export type ProductType = Database["public"]["Enums"]["product_type"]
export type FunnelStep = Database["public"]["Enums"]["funnel_step"]

// =====================================================
// HELPER TYPES FOR FRONTEND
// =====================================================

export interface ProductWithFeatures extends Product {
  features: string[]
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[]
  customer: Customer
}

export interface OrderSummary {
  id: string
  order_number: string
  total_amount: number
  status: OrderStatus
  created_at: string
  items: {
    product_name: string
    product_type: ProductType
    quantity: number
    total_price: number
  }[]
}

export interface CheckoutData {
  customer: {
    email: string
    name: string
  }
  products: {
    id: string
    quantity: number
  }[]
  session_id?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export interface FunnelAnalyticsData {
  sessions: number
  conversions: number
  revenue: number
  conversion_rate: number
  avg_order_value: number
}

// Real-time subscription types
export type RealtimePayload<T> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T | null
  old: T | null
  schema: string
  table: string
}

export type OrderRealtimePayload = RealtimePayload<Order>
export type PaymentRealtimePayload = RealtimePayload<Payment>
export type FunnelSessionRealtimePayload = RealtimePayload<FunnelSession>

// Error types
export interface DatabaseError {
  code: string
  message: string
  details: string | null
  hint: string | null
}

export interface SupabaseResponse<T> {
  data: T | null
  error: DatabaseError | null
}