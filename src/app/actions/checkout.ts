"use server";

import { z } from "zod";
import { sanitizeFormData } from "@/lib/utils";

// Modern form schema with Zod
const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  card: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
  bump: z.boolean().default(true),
});

type FormValues = {
  name: string;
  email: string;
  card: string;
  expiry: string;
  cvc: string;
  bump: boolean;
};

export type CheckoutState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  formData?: Omit<FormValues, 'card' | 'cvc'> & {
    card: string;
    cvc: string;
  };
};

// Server action for form submission
export async function submitCheckout(prevState: CheckoutState, formDataParam: FormData): Promise<CheckoutState> {
  // Convert FormData to plain object with proper type conversion
  const formDataObj = Object.fromEntries(formDataParam.entries());
  
  // Sanitize all string inputs to prevent XSS
  const sanitizedData = sanitizeFormData(formDataObj);
  
  // Prepare data with proper type conversion
  const formValues = {
    ...sanitizedData,
    // Convert string 'true'/'false' to boolean
    bump: sanitizedData.bump === 'true' || sanitizedData.bump === 'on'
  } as FormValues;
  
  // Validate form data against schema
  const result = checkoutSchema.safeParse(formValues);
  
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors,
      error: "Please fix the form errors and try again."
    };
  }
  
  const { name, email, card, expiry, bump } = result.data;
  // CVC is validated but not stored for security

  // SECURITY: This action is deprecated - use Stripe Elements in SecureCheckoutForm
  // This endpoint should not process real payments
  console.warn('⚠️ Legacy checkout action called - use SecureCheckoutForm instead');
  
  return {
    success: false,
    error: "This payment method is no longer supported. Please use the secure checkout form.",
  };
}