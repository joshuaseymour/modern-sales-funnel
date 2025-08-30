// =====================================================
// Supabase Integration Example for Checkout Form
// Shows how to integrate the new schema with existing components
// =====================================================

'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { 
  useProducts, 
  useFunnelSession, 
  useCreateOrder,
  useFeatureFlag 
} from '@/hooks/use-supabase-funnel'
import type { Product } from '@/types/database'

interface CheckoutFormData {
  name: string
  email: string
  card: string
  expiry: string
  cvc: string
}

export function SupabaseCheckoutExample() {
  // Generate or get session ID
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = sessionStorage.getItem('funnel_session_id')
      if (!id) {
        id = uuidv4()
        sessionStorage.setItem('funnel_session_id', id)
      }
      return id
    }
    return uuidv4()
  })

  // Get URL parameters for UTM tracking
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const utmParams = {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
  }

  // Hooks
  const { products: tripwireProducts, loading: productsLoading } = useProducts('tripwire')
  const { products: bumpProducts } = useProducts('bump')
  const { session, initializeSession, updateStep, markConverted, trackEvent } = useFunnelSession(sessionId)
  const { createOrder, loading: orderLoading } = useCreateOrder()
  const { enabled: orderBumpEnabled } = useFeatureFlag('order_bump_default')

  // Component state
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    card: '',
    expiry: '',
    cvc: '',
  })
  const [includeBump, setIncludeBump] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  // Initialize funnel session on mount
  useEffect(() => {
    initializeSession(utmParams)
  }, [initializeSession])

  // Update funnel step when component mounts
  useEffect(() => {
    if (session) {
      updateStep('checkout')
      trackEvent('page_view', { page: 'checkout' })
    }
  }, [session, updateStep, trackEvent])

  // Set bump default based on feature flag
  useEffect(() => {
    setIncludeBump(orderBumpEnabled)
  }, [orderBumpEnabled])

  // Handle form input changes
  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Track form interactions
    trackEvent('form_interaction', { 
      field, 
      step: 'checkout',
      session_id: sessionId 
    })
  }

  // Handle order bump toggle
  const handleBumpToggle = (checked: boolean) => {
    setIncludeBump(checked)
    trackEvent('order_bump_toggle', { 
      enabled: checked,
      product_id: bumpProducts[0]?.id 
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setProcessing(true)

    try {
      // Validate form data (you can use Zod here)
      if (!formData.name || !formData.email || !formData.card) {
        throw new Error('Please fill in all required fields')
      }

      // Prepare products for order
      const orderProducts = []
      let totalAmount = 0

      // Add tripwire product
      if (tripwireProducts.length > 0) {
        orderProducts.push({
          id: tripwireProducts[0].id,
          quantity: 1
        })
        totalAmount += tripwireProducts[0].price
      }

      // Add bump product if selected
      if (includeBump && bumpProducts.length > 0) {
        orderProducts.push({
          id: bumpProducts[0].id,
          quantity: 1
        })
        totalAmount += bumpProducts[0].price
      }

      // Track checkout attempt
      await trackEvent('checkout_attempt', {
        products: orderProducts,
        total_amount: totalAmount,
        includes_bump: includeBump
      })

      // Create order in Supabase
      const orderId = await createOrder({
        customer_email: formData.email,
        customer_name: formData.name,
        products: orderProducts,
        session_id: sessionId,
        source: utmParams.utm_source || 'direct'
      })

      // Simulate payment processing (replace with actual payment processor)
      await simulatePaymentProcessing(formData)

      // Mark funnel session as converted
      await markConverted(totalAmount)

      // Track successful purchase
      await trackEvent('purchase_completed', {
        order_id: orderId,
        total_amount: totalAmount,
        products: orderProducts
      })

      // Update order status to completed (in real app, this would be done by payment webhook)
      // This is just for demo purposes
      
      // Redirect to thank you page
      window.location.href = `/thankyou?order=${orderId}&session=${sessionId}`

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      
      // Track error
      trackEvent('checkout_error', {
        error: errorMessage,
        form_data: {
          has_name: !!formData.name,
          has_email: !!formData.email,
          has_card: !!formData.card
        }
      })
    } finally {
      setProcessing(false)
    }
  }

  // Simulate payment processing
  const simulatePaymentProcessing = async (data: CheckoutFormData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate random failures for testing
    if (Math.random() < 0.1) { // 10% failure rate
      throw new Error('Payment processing failed. Please try again.')
    }
  }

  if (productsLoading) {
    return <div className="flex items-center justify-center p-8">Loading products...</div>
  }

  if (!tripwireProducts.length) {
    return <div className="flex items-center justify-center p-8">No products available</div>
  }

  const tripwireProduct = tripwireProducts[0]
  const bumpProduct = bumpProducts[0]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{tripwireProduct.name}</span>
              <span>${tripwireProduct.price}</span>
            </div>
            
            {bumpProduct && (
              <div className="border-t pt-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeBump}
                    onChange={(e) => handleBumpToggle(e.target.checked)}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <span className="font-medium">{bumpProduct.name}</span>
                    <p className="text-sm text-gray-600">{bumpProduct.description}</p>
                  </div>
                  <span className="font-semibold">${bumpProduct.price}</span>
                </label>
              </div>
            )}
            
            <div className="border-t pt-2 font-bold flex justify-between">
              <span>Total:</span>
              <span>
                ${tripwireProduct.price + (includeBump && bumpProduct ? bumpProduct.price : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="font-semibold">Your Information</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="font-semibold">Payment Information</h3>
          
          <div>
            <label htmlFor="card" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="card"
              value={formData.card}
              onChange={(e) => handleInputChange('card', e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                MM/YY
              </label>
              <input
                type="text"
                id="expiry"
                value={formData.expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '')
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4)
                  }
                  handleInputChange('expiry', value)
                }}
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                CVC
              </label>
              <input
                type="text"
                id="cvc"
                value={formData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing || orderLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors"
        >
          {processing || orderLoading ? 'Processing...' : `Complete Order - $${tripwireProduct.price + (includeBump && bumpProduct ? bumpProduct.price : 0)}`}
        </button>

        <div className="text-center text-sm text-gray-600">
          <p>🔒 Secure checkout • 30-day money-back guarantee</p>
          <p className="mt-1">Session ID: {sessionId}</p>
        </div>
      </form>
    </div>
  )
}

// Thank You Page Component Example
export function SupabaseThankYouExample() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const orderId = searchParams.get('order')
  const sessionId = searchParams.get('session')

  const { order, loading } = useOrderTracking(orderId!)
  const { trackEvent } = useFunnelSession(sessionId!)

  useEffect(() => {
    if (order) {
      trackEvent('thankyou_page_view', {
        order_id: orderId,
        order_total: order.total_amount
      })
    }
  }, [order, orderId, trackEvent])

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading order...</div>
  }

  if (!order) {
    return <div className="flex items-center justify-center p-8">Order not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Thank You!</h1>
        <p className="text-lg text-gray-600">Your order has been confirmed</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Order Details</h2>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span>Order Number:</span>
            <span className="font-mono">{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-semibold">${order.total_amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Guarantee Expires:</span>
            <span>{new Date(order.guarantee_expires_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          You'll receive a confirmation email shortly with your order details and access information.
        </p>
        <p className="text-sm text-gray-500">
          Session ID: {sessionId}
        </p>
      </div>
    </div>
  )
}