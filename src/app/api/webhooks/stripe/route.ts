import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

const stripe = env.STRIPE_SECRET_KEY 
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Rate limiting protection
  const clientIP = getClientIP(request);
  const rateLimitResult = rateLimit(`webhook:${clientIP}`, {
    windowMs: 60 * 1000, // 1 minute window
    maxRequests: 100, // Max 100 webhook requests per minute per IP
  });

  if (!rateLimitResult.success) {
    console.warn(`Rate limit exceeded for webhook from IP: ${clientIP}`);
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  // Always require webhook secret - no exceptions
  if (!webhookSecret) {
    console.error('Webhook secret not configured - rejecting request');
    return NextResponse.json(
      { error: 'Webhook configuration error' },
      { status: 500 }
    );
  }

  try {
    // Always verify webhook signature for security
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ Payment succeeded:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          customer: paymentIntent.metadata.customerEmail,
          orderBump: paymentIntent.metadata.orderBump === 'true',
        });
        
        // Here you would:
        // 1. Update your database with the successful payment
        // 2. Send confirmation email to customer
        // 3. Trigger fulfillment process
        // 4. Update analytics/metrics
        
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment failed:', {
          id: paymentIntent.id,
          customer: paymentIntent.metadata.customerEmail,
          error: paymentIntent.last_payment_error?.message,
        });
        
        // Handle failed payment:
        // 1. Log the failure
        // 2. Potentially send recovery email
        // 3. Update metrics
        
        break;
      }
      
      case 'payment_intent.requires_action': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('🔄 Payment requires action:', {
          id: paymentIntent.id,
          customer: paymentIntent.metadata.customerEmail,
        });
        
        // Handle 3D Secure or other authentication requirements
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Error handling webhook:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhooks
export const runtime = 'nodejs';