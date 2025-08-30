"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { StripeCheckoutForm } from "@/components/ui/stripe-checkout-form";
import { createPaymentIntent } from "@/app/actions/create-payment-intent";
import { PRICES } from "@/lib/constants";
import { fmtUSD } from "@/lib/utils";
import { sanitizeInput } from "@/lib/utils";
import { toast } from "sonner";

interface SecureCheckoutFormProps {
  bump: boolean;
  setBump: (value: boolean) => void;
  onComplete: () => void;
}

export function SecureCheckoutForm({ bump, setBump, onComplete }: SecureCheckoutFormProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const tripwirePrice = PRICES.TRIPWIRE;
  const bumpPrice = PRICES.BUMP;
  const total = bump ? tripwirePrice + bumpPrice : tripwirePrice;

  // Validation
  const nameOk = customerInfo.name.trim().length > 1;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email);
  const canProceedToPayment = nameOk && emailOk;

  const handleInputChange = (field: 'name' | 'email') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeInput(e.target.value);
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: 'name' | 'email') => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const createPayment = async () => {
    if (!canProceedToPayment) return;

    setIsCreatingPayment(true);
    setPaymentError(null);

    try {
      const response = await createPaymentIntent({
        amount: total * 100, // Convert to cents
        currency: 'usd',
        orderBump: bump,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
      });

      if (response.success && response.clientSecret) {
        setClientSecret(response.clientSecret);
      } else {
        setPaymentError(response.error || 'Failed to initialize payment');
        toast.error(response.error || 'Failed to initialize payment');
      }
    } catch {
      setPaymentError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setClientSecret(null); // Reset to show customer info form again
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <SuccessAnimation />
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="text-gray-600 mt-2">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Secure Checkout
        </h1>
        <p className="text-gray-600">
          Complete your purchase safely with our encrypted payment system
        </p>
      </div>

      {!clientSecret ? (
        // Customer Information Form
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                id="name"
                type="text"
                value={customerInfo.name}
                onChange={handleInputChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Enter your full name"
                className={touched.name && !nameOk ? "border-red-500" : ""}
              />
              {touched.name && !nameOk && (
                <ErrorMessage message="Please enter your full name" />
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={handleInputChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Enter your email address"
                className={touched.email && !emailOk ? "border-red-500" : ""}
              />
              {touched.email && !emailOk && (
                <ErrorMessage message="Please enter a valid email address" />
              )}
            </div>
          </div>

          {/* Order Bump */}
          <div className="mt-6 p-4 border-2 border-green-300 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="order-bump"
                checked={bump}
                onChange={(e) => setBump(e.target.checked)}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor="order-bump" className="font-semibold text-gray-900 cursor-pointer">
                  🎁 Add Bonus Templates Pack
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  50+ high-converting templates and swipe files
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-green-700">Today Only: {fmtUSD(bumpPrice)}</span>
                  <span className="text-muted-foreground line-through text-sm">Normally {fmtUSD(97)}</span>
                </div>
                <p className="text-xs text-green-600 font-medium mt-1">
                  ⚡ Save {fmtUSD(97 - bumpPrice)} (52% OFF) ⚡
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Sales Funnel Accelerator</span>
                <span className="font-semibold">{fmtUSD(tripwirePrice)}</span>
              </div>
              {bump && (
                <div className="flex justify-between text-green-700">
                  <span>Bonus Templates Pack</span>
                  <span className="font-semibold">{fmtUSD(bumpPrice)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{fmtUSD(total)}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={createPayment}
            disabled={!canProceedToPayment || isCreatingPayment}
            className="w-full mt-6"
            size="lg"
          >
            {isCreatingPayment ? 'Preparing Payment...' : `Continue to Payment - ${fmtUSD(total)}`}
          </Button>

          {paymentError && (
            <ErrorMessage message={paymentError} />
          )}
        </Card>
      ) : (
        // Stripe Payment Form
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          
          <StripeCheckoutForm
            clientSecret={clientSecret}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            total={total}
            orderBump={bump}
          />

          <Button
            variant="outline"
            onClick={() => setClientSecret(null)}
            className="w-full mt-4"
          >
            ← Back to Customer Information
          </Button>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500">
        <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
        <p>💳 We accept all major credit cards and digital wallets</p>
      </div>
    </div>
  );
}