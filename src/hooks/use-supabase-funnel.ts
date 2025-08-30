// =====================================================
// Custom Hooks for Supabase Funnel Operations
// Production-ready hooks with error handling and caching
// =====================================================

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, supabaseHelpers, handleSupabaseError } from '@/lib/supabase-client'
import type { 
  Product, 
  Order, 
  Customer, 
  FunnelSession, 
  FunnelAnalytics,
  ProductType,
  FunnelStep,
  OrderStatus 
} from '@/types/database'

// =====================================================
// PRODUCT HOOKS
// =====================================================

export function useProducts(type?: ProductType) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        const query = supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('display_order')

        if (type) {
          query.eq('type', type)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError
        setProducts(data || [])
      } catch (err) {
        setError(handleSupabaseError(err))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [type])

  return { products, loading, error }
}

// =====================================================
// FUNNEL SESSION HOOKS
// =====================================================

export function useFunnelSession(sessionId: string) {
  const [session, setSession] = useState<FunnelSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize or get existing session
  const initializeSession = useCallback(async (utmParams?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }) => {
    try {
      setError(null)
      
      // Check if session exists
      const { data: existingSession } = await supabase
        .from('funnel_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (existingSession) {
        setSession(existingSession)
        return existingSession
      }

      // Create new session
      const { data: newSession, error: insertError } = await supabase
        .from('funnel_sessions')
        .insert({
          session_id: sessionId,
          current_step: 'landing',
          ...utmParams,
          metadata: {
            user_agent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: Date.now(),
          },
        })
        .select()
        .single()

      if (insertError) throw insertError
      
      setSession(newSession)
      return newSession
    } catch (err) {
      setError(handleSupabaseError(err))
      return null
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  // Update session step
  const updateStep = useCallback(async (step: FunnelStep) => {
    try {
      const { data, error: updateError } = await supabaseHelpers.updateFunnelSession(sessionId, {
        current_step: step,
      })

      if (updateError) throw updateError
      
      // Track step change event
      await supabaseHelpers.trackFunnelEvent({
        session_id: sessionId,
        event_type: 'step_change',
        step,
        data: { previous_step: session?.current_step, timestamp: Date.now() },
      })

    } catch (err) {
      setError(handleSupabaseError(err))
    }
  }, [sessionId, session?.current_step])

  // Mark as converted
  const markConverted = useCallback(async (conversionValue: number) => {
    try {
      const { data, error: updateError } = await supabaseHelpers.updateFunnelSession(sessionId, {
        converted: true,
        conversion_value: conversionValue,
        completed_at: new Date().toISOString(),
      })

      if (updateError) throw updateError

      // Track conversion event
      await supabaseHelpers.trackFunnelEvent({
        session_id: sessionId,
        event_type: 'conversion',
        step: session?.current_step || 'thankyou',
        data: { conversion_value: conversionValue, timestamp: Date.now() },
      })

    } catch (err) {
      setError(handleSupabaseError(err))
    }
  }, [sessionId, session?.current_step])

  // Track custom event
  const trackEvent = useCallback(async (eventType: string, eventData?: Record<string, any>) => {
    try {
      await supabaseHelpers.trackFunnelEvent({
        session_id: sessionId,
        event_type: eventType,
        step: session?.current_step || 'landing',
        data: { ...eventData, timestamp: Date.now() },
      })
    } catch (err) {
      console.error('Error tracking event:', err)
    }
  }, [sessionId, session?.current_step])

  return {
    session,
    loading,
    error,
    initializeSession,
    updateStep,
    markConverted,
    trackEvent,
  }
}

// =====================================================
// ORDER HOOKS
// =====================================================

export function useCreateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = useCallback(async (orderData: {
    customer_email: string
    customer_name: string
    products: { id: string; quantity: number }[]
    session_id?: string
    source?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      const { data: orderId, error: createError } = await supabaseHelpers.createOrder({
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        product_ids: orderData.products.map(p => p.id),
        quantities: orderData.products.map(p => p.quantity),
        session_id: orderData.session_id,
        source: orderData.source,
      })

      if (createError) throw createError

      return orderId
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { createOrder, loading, error }
}

export function useOrderTracking(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        setError(null)
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (fetchError) throw fetchError
        setOrder(data)
      } catch (err) {
        setError(handleSupabaseError(err))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()

    // Set up real-time subscription
    subscriptionRef.current = supabaseHelpers.subscribeToOrder(orderId, (updatedOrder) => {
      setOrder(updatedOrder)
    })

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [orderId])

  return { order, loading, error }
}

// =====================================================
// CUSTOMER HOOKS
// =====================================================

export function useCustomer(email: string) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCustomer() {
      try {
        setError(null)
        const { data, error: fetchError } = await supabase
          .from('customers')
          .select('*')
          .eq('email', email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError
        setCustomer(data || null)
      } catch (err) {
        setError(handleSupabaseError(err))
      } finally {
        setLoading(false)
      }
    }

    if (email) {
      fetchCustomer()
    }
  }, [email])

  return { customer, loading, error }
}

// =====================================================
// ANALYTICS HOOKS
// =====================================================

export function useFunnelAnalytics(days: number = 30) {
  const [analytics, setAnalytics] = useState<FunnelAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<any>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('funnel_analytics')
        .select('*')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: false })

      if (fetchError) throw fetchError
      setAnalytics(data || [])
    } catch (err) {
      setError(handleSupabaseError(err))
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchAnalytics()

    // Set up real-time updates
    subscriptionRef.current = supabaseHelpers.subscribeToFunnelAnalytics(fetchAnalytics)

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [fetchAnalytics])

  return { analytics, loading, error, refetch: fetchAnalytics }
}

// =====================================================
// FEATURE FLAG HOOKS
// =====================================================

export function useFeatureFlag(flagName: string) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkFlag() {
      try {
        setError(null)
        const { data, error: checkError } = await supabaseHelpers.checkFeatureFlag(flagName)
        
        if (checkError) throw checkError
        setEnabled(data || false)
      } catch (err) {
        setError(handleSupabaseError(err))
        setEnabled(false) // Default to disabled on error
      } finally {
        setLoading(false)
      }
    }

    checkFlag()
  }, [flagName])

  return { enabled, loading, error }
}

// =====================================================
// UTILITY HOOKS
// =====================================================

export function useSupabaseConnection() {
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error: pingError } = await supabase
          .from('products')
          .select('id')
          .limit(1)

        setConnected(!pingError)
        setError(pingError ? handleSupabaseError(pingError) : null)
      } catch (err) {
        setConnected(false)
        setError(handleSupabaseError(err))
      }
    }

    checkConnection()

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  return { connected, error }
}

// Hook for managing multiple subscriptions
export function useSubscriptions() {
  const subscriptions = useRef<Map<string, any>>(new Map())

  const addSubscription = useCallback((key: string, subscription: any) => {
    // Unsubscribe from existing subscription with same key
    const existing = subscriptions.current.get(key)
    if (existing) {
      existing.unsubscribe()
    }
    
    subscriptions.current.set(key, subscription)
  }, [])

  const removeSubscription = useCallback((key: string) => {
    const subscription = subscriptions.current.get(key)
    if (subscription) {
      subscription.unsubscribe()
      subscriptions.current.delete(key)
    }
  }, [])

  const cleanup = useCallback(() => {
    subscriptions.current.forEach((subscription) => {
      subscription.unsubscribe()
    })
    subscriptions.current.clear()
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  return { addSubscription, removeSubscription, cleanup }
}