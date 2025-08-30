import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  card: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
});

export const orderBumpSchema = z.object({
  bump: z.boolean(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type OrderBumpData = z.infer<typeof orderBumpSchema>;
