"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PRICES, OFFERS } from "@/lib/constants";
import { fmtUSD } from "@/lib/utils";
import { useFunnel } from "@/components/providers/funnel-provider";
import { useCheckout } from "@/hooks/use-checkout";
import { useState } from "react";

export function CheckoutForm() {
  const { completeCheckout } = useFunnel();
  const [bump, setBump] = useState(true);
  
  const {
    form,
    touched,
    submitting,
    emailOk,
    cardOk,
    expiryOk,
    cvcOk,
    nameOk,
    canSubmit,
    onInput,
    onBlur,
    handleSubmit,
  } = useCheckout(setBump);

  const tripwirePrice = PRICES.TRIPWIRE;
  const bumpPrice = PRICES.BUMP;
  const total = tripwirePrice + (bump ? bumpPrice : 0);

  const onFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, () => {
      completeCheckout();
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Order Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <div className="font-medium">{OFFERS.TRIPWIRE.title}</div>
              <div className="text-sm text-muted-foreground">{OFFERS.TRIPWIRE.description}</div>
            </div>
            <div className="font-semibold">{fmtUSD(tripwirePrice)}</div>
          </div>
          {bump && (
            <div className="flex justify-between items-start text-green-600">
              <div className="flex-1 pr-4">
                <div className="font-medium">✅ {OFFERS.BUMP.title}</div>
                <div className="text-sm opacity-80">{OFFERS.BUMP.description}</div>
              </div>
              <div className="font-semibold">{fmtUSD(bumpPrice)}</div>
            </div>
          )}
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{fmtUSD(total)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Checkout Form */}
      <Card className="p-6">
        <form onSubmit={onFormSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">Checkout Information</h2>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={onInput("name")}
              onBlur={() => onBlur("name")}
              className={touched.name && !nameOk ? "border-red-500" : ""}
            />
            {touched.name && !nameOk && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={onInput("email")}
              onBlur={() => onBlur("email")}
              className={touched.email && !emailOk ? "border-red-500" : ""}
            />
            {touched.email && !emailOk && (
              <p className="text-red-500 text-sm mt-1">Valid email is required</p>
            )}
          </div>

          <div>
            <label htmlFor="card" className="block text-sm font-medium mb-2">Card Number</label>
            <Input
              id="card"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={form.card}
              onChange={onInput("card")}
              onBlur={() => onBlur("card")}
              className={touched.card && !cardOk ? "border-red-500" : ""}
              maxLength={19}
            />
            {touched.card && !cardOk && (
              <p className="text-red-500 text-sm mt-1">Valid 16-digit card number is required</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium mb-2">Expiry Date</label>
              <Input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={onInput("expiry")}
                onBlur={() => onBlur("expiry")}
                className={touched.expiry && !expiryOk ? "border-red-500" : ""}
                maxLength={5}
              />
              {touched.expiry && !expiryOk && (
                <p className="text-red-500 text-sm mt-1">Valid expiry required (MM/YY)</p>
              )}
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium mb-2">CVC</label>
              <Input
                id="cvc"
                type="text"
                placeholder="CVC"
                value={form.cvc}
                onChange={onInput("cvc")}
                onBlur={() => onBlur("cvc")}
                className={touched.cvc && !cvcOk ? "border-red-500" : ""}
                maxLength={4}
              />
              {touched.cvc && !cvcOk && (
                <p className="text-red-500 text-sm mt-1">Valid CVC required</p>
              )}
            </div>
          </div>

          {/* Enhanced Order Bump with Psychology */}
          <div className="p-4 border-2 border-green-300 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 relative overflow-hidden">
            {/* Limited quantity badge */}
            <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
              Only 47 left!
            </div>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={bump}
                onChange={(e) => setBump(e.target.checked)}
                className="mt-1.5 h-5 w-5 text-green-600 focus:ring-green-500 border-border rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <div className="font-bold text-green-800 text-lg">
                    YES! Add Bonus Templates Pack 
                    <span className="bg-yellow-200 px-2 py-1 rounded text-sm ml-2">LIMITED TIME</span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-green-200 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-green-700">Today Only: {fmtUSD(bumpPrice)}</span>
                    <span className="text-muted-foreground line-through text-sm">Normally {fmtUSD(97)}</span>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">
                    ⚡ Save {fmtUSD(97 - bumpPrice)} (52% OFF) ⚡
                  </div>
                </div>
                
                <div className="text-sm text-green-700 space-y-1">
                  <p>📧 <strong>50+ high-converting email templates</strong></p>
                  <p>📋 <strong>Proven swipe files from $2.3M+ campaigns</strong></p>
                  <p>📈 <strong>Social media content calendar (30 days)</strong></p>
                  <p className="font-semibold text-green-800 mt-2">
                    🔥 This offer disappears after checkout - grab it now!
                  </p>
                </div>
              </div>
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Processing...</span>
              </div>
            ) : (
              `Complete Order - ${fmtUSD(total)}`
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            🔒 Secure 256-bit SSL encryption
          </div>
        </form>
      </Card>
    </div>
  );
}