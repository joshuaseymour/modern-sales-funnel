export type Step = "landing" | "checkout" | "thankyou";

export type Purchase = {
  tripwire: boolean;
  bump: boolean;
  upsell: boolean;
  downsell: boolean;
};

export type CheckoutForm = {
  name: string;
  email: string;
  card: string;
  expiry: string;
  cvc: string;
};

// Safe version for persistence - excludes sensitive payment data
export type SafeCheckoutForm = {
  name: string;
  email: string;
};

export type PurchasedItem = {
  label: string;
  price: number;
  value: number;
};
