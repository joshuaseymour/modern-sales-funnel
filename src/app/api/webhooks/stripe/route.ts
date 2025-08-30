import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/lib/env';

const stripe = env.STRIPE_SECRET_KEY 
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
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

  try {
    if (webhookSecret) {
      // Verify webhook signature in production
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Parse without verification in development (not recommended for production)
      event = JSON.parse(body) as Stripe.Event;
      console.warn('⚠️ Webhook signature verification disabled. Set STRIPE_WEBHOOK_SECRET for production.');
    }
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