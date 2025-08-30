// =====================================================
// Supabase Client Configuration
// Production-ready client with proper typing
// =====================================================

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Public client for client-side operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We handle our own session management
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limit for real-time events
    },
  },
})

// Service role client for server-side operations (use carefully!)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Utility functions for common operations
export const supabaseHelpers = {
  // Get products by type
  async getProductsByType(type: Database['public']['Enums']['product_type']) {
    return supabase
      .from('products')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('display_order')
  },

  // Create customer and order in one transaction
  async createOrder(orderData: {
    customer_email: string
    customer_name: string
    product_ids: string[]
    quantities: number[]
    session_id?: string
    source?: string
  }) {
    return supabase.rpc('create_order_with_items', {
      customer_email: orderData.customer_email,
      customer_name: orderData.customer_name,
      product_ids: orderData.product_ids,
      quantities: orderData.quantities,
      session_id: orderData.session_id,
      order_source: orderData.source,
    })
  },

  // Track funnel events
  async trackFunnelEvent(eventData: {
    session_id: string
    event_type: string
    step: Database['public']['Enums']['funnel_step']
    data?: Record<string, any>
  }) {
    return supabase
      .from('funnel_events')
      .insert({
        session_id: eventData.session_id,
        event_type: eventData.event_type,
        step: eventData.step,
        data: eventData.data || {},
      })
  },

  // Update funnel session
  async updateFunnelSession(sessionId: string, updates: {
    current_step?: Database['public']['Enums']['funnel_step']
    converted?: boolean
    conversion_value?: number
    completed_at?: string
    abandoned_at?: string
  }) {
    return supabase
      .from('funnel_sessions')
      .update(updates)
      .eq('session_id', sessionId)
  },

  // Get customer summary
  async getCustomerSummary(email: string) {
    return supabase
      .from('customer_summary')
      .select('*')
      .eq('email', email)
      .single()
  },

  // Check feature flag
  async checkFeatureFlag(flagName: string) {
    return supabase.rpc('has_feature_access', {
      feature_name: flagName,
    })
  },

  // Subscribe to order updates
  subscribeToOrder(orderId: string, callback: (order: any) => void) {
    return supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => callback(payload.new)
      )
      .subscribe()
  },

  // Subscribe to funnel analytics
  subscribeToFunnelAnalytics(callback: () => void) {
    return supabase
      .channel('funnel-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funnel_sessions',
        },
        callback
      )
      .subscribe()
  },
}

// Error handling utility
export function handleSupabaseError(error: any): string {
  if (error?.code === 'PGRST116') {
    return 'No data found'
  }
  if (error?.code === '23505') {
    return 'This record already exists'
  }
  return error?.message || 'An unexpected error occurred'
}