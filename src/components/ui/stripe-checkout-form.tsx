"use client";

import { useState } from "react";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "./button";
import { LoadingSpinner } from "./loading-spinner";
import { toast } from "sonner";

interface StripeCheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  total: number;
  orderBump: boolean;
}

export function StripeCheckoutForm({
  onSuccess,
  onError,
  total,
  orderBump,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe has not loaded yet.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
        },
        redirect: "if_required",
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          onError(error.message ?? "Payment failed");
          toast.error(error.message ?? "Payment failed");
        } else {
          onError("An unexpected error occurred.");
          toast.error("An unexpected error occurred.");
        }
      } else {
        onSuccess();
        toast.success("Payment successful!");
      }
    } catch {
      onError("Payment processing failed");
      toast.error("Payment processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Address */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Billing Address
        </h3>
        <AddressElement 
          options={{
            mode: 'billing',
            allowedCountries: ['US', 'CA'], // Restrict to supported countries
            fields: {
              phone: 'always',
            },
            validation: {
              phone: {
                required: 'always',
              },
            },
          }}
        />
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Payment Information
        </h3>
        <PaymentElement 
          options={{
            layout: "tabs",
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
            fields: {
              billingDetails: 'never', // We collect this via AddressElement
            },
          }}
        />
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Order Summary
        </h3>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Sales Funnel Accelerator</span>
            <span>$97.00</span>
          </div>
          {orderBump && (
            <div className="flex justify-between text-sm">
              <span>Bonus Templates Pack</span>
              <span>$47.00</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            Processing Payment...
          </div>
        ) : (
          `Complete Order - $${total.toFixed(2)}`
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is securely processed by Stripe.
        We do not store your payment details on our servers.
      </p>
    </form>
  );
}