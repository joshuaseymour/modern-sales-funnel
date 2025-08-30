"use server";

import { env } from "@/lib/env";
import Stripe from 'stripe';

const stripe = env.STRIPE_SECRET_KEY 
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

export interface CreatePaymentIntentRequest {
  amount: number; // in cents
  currency: string;
  orderBump: boolean;
  customerEmail?: string;
  customerName?: string;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  error?: string;
}

export async function createPaymentIntent({
  amount,
  currency = 'usd',
  orderBump,
  customerEmail,
  customerName,
}: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> {
  
  if (!stripe) {
    return {
      success: false,
      error: "Payment processing is not configured",
    };
  }

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderBump: orderBump ? 'true' : 'false',
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        product: 'sales-funnel-accelerator',
      },
      description: orderBump 
        ? 'Sales Funnel Accelerator + Bonus Templates Pack'
        : 'Sales Funnel Accelerator',
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent',
    };
  }
}