import { z } from "zod";

// Define environment variable schema
const envSchema = z.object({
  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Modern Sales Funnel"),
  
  // Supabase (Future Backend)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // Email (Resend)
  RESEND_API_KEY: z.string().optional(),
  
  // Payment (Stripe) - Required for live payments
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, "Stripe publishable key is required"),
  STRIPE_SECRET_KEY: z.string().min(1, "Stripe secret key is required"),
  STRIPE_WEBHOOK_SECRET: z.string().optional(), // Optional for basic payments
  
  // Analytics
  VERCEL_ANALYTICS_ID: z.string().optional(),
  
  // System
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Invalid environment variables");
  }
};

// Export validated environment variables
export const env = parseEnv();

// Helper functions for feature checks
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";

// Feature flags based on environment variables
export const features = {
  supabase: !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  email: !!env.RESEND_API_KEY,
  payment: !!(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.STRIPE_SECRET_KEY),
  analytics: !!env.VERCEL_ANALYTICS_ID,
} as const;

// Type-safe environment variable access
export type Environment = typeof env;
export type Features = typeof features;