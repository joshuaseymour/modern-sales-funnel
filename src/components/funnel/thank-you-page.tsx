"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { PRICES, VALUES, OFFERS } from "@/lib/constants";
import { fmtUSD } from "@/lib/utils";
import { useFunnel } from "@/components/providers/funnel-provider";

export function ThankYouPage() {
  const { purchase, handlePrint, acceptUpsell, acceptDownsell } = useFunnel();
  const [showUpsell, setShowUpsell] = useState(true);
  const [showDownsell, setShowDownsell] = useState(false);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialAnimation(false);
    }, 3000); // Show animation for 3 seconds

    return () => clearTimeout(timer);
  }, []);
  
  const purchased = [
    purchase.tripwire && { 
      label: OFFERS.TRIPWIRE.title, 
      price: PRICES.TRIPWIRE, 
      value: VALUES.TRIPWIRE,
      description: OFFERS.TRIPWIRE.description
    },
    purchase.bump && { 
      label: OFFERS.BUMP.title, 
      price: PRICES.BUMP, 
      value: VALUES.BUMP,
      description: OFFERS.BUMP.description
    },
    purchase.upsell && {
      label: OFFERS.UPSELL.title,
      price: PRICES.UPSELL,
      value: VALUES.UPSELL,
      description: OFFERS.UPSELL.description
    },
    purchase.downsell && {
      label: OFFERS.DOWNSELL.title,
      price: PRICES.DOWNSELL,
      value: VALUES.DOWNSELL,
      description: OFFERS.DOWNSELL.description
    },
  ].filter(Boolean) as { label: string; price: number; value: number; description: string }[];

  const totalPaid = purchased.reduce((sum, item) => sum + item.price, 0);
  const totalValue = purchased.reduce((sum, item) => sum + item.value, 0);
  const savings = totalValue - totalPaid;

  const handleUpsellAccept = () => {
    acceptUpsell();
    setShowUpsell(false);
  };

  const handleDownsellAccept = () => {
    acceptDownsell();
    setShowDownsell(false);
  };

  const handleNotInterested = () => {
    setShowUpsell(false);
    setShowDownsell(true);
  };

  // Show success animation first
  if (showInitialAnimation) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <SuccessAnimation
          title="Order Complete!"
          message="Thank you for your purchase. You're about to unlock something amazing!"
          icon="trophy"
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Celebration Section */}
      <Card className="p-6 sm:p-8 lg:p-10 space-y-6 text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl mb-6">
            🔓
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-4">
            Access Granted
          </Badge>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome to the Inner Circle!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Your exclusive access has been activated. Get ready to experience the transformation.
          </p>
          
          {/* Value Stacking */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg mx-auto mt-8 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h3 className="font-semibold text-lg text-gray-800">Your Purchase Summary</h3>
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                {purchased.length} {purchased.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            
            <div className="space-y-4">
              {purchased.map((p) => (
                <div key={p.label} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{p.label}</p>
                    <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${p.value}</p>
                    <p className="text-xs text-green-600 line-through">${Math.round(p.value * 0.9)}</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>You Paid:</span>
                  <div>
                    <span className="text-2xl text-blue-600">${totalPaid}</span>
                    <span className="text-sm text-gray-500 ml-2 font-normal">
                      (Saved ${savings})
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                  <span>Total Value:</span>
                  <span className="font-medium">${totalValue}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-start">
                <span className="mr-2">🎁</span>
                <span>Your login details have been sent to your email. Check your inbox for instant access!</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Confirmation */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Thank you for your purchase. Your order has been received and is being processed.
          You'll receive an email with all the details shortly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={handlePrint} variant="outline">
            Print Receipt
          </Button>
          <Button disabled className="opacity-50 cursor-not-allowed">
            Access Instructions Sent to Email
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
        <div className="space-y-4">
          {purchased.map((item, index) => (
            <div key={index} className="flex justify-between pb-4 border-b">
              <div>
                <h3 className="font-medium">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{fmtUSD(item.price)}</div>
                <div className="text-sm text-green-600">
                  Save {fmtUSD(item.value - item.price)}
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4">
            <div className="flex justify-between py-2">
              <span>Subtotal</span>
              <span>{fmtUSD(totalPaid)}</span>
            </div>
            <div className="flex justify-between py-2 text-green-600">
              <span>Total Savings</span>
              <span>-{fmtUSD(savings)}</span>
            </div>
            <div className="flex justify-between py-2 font-semibold text-lg border-t mt-4 pt-4">
              <span>You Paid</span>
              <span>{fmtUSD(totalPaid)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
        <ol className="space-y-4 list-decimal list-inside">
          <li>Check your email for order confirmation and access instructions</li>
          <li>Log in to your account to access your purchase</li>
          <li>If you have any questions, contact our support team</li>
        </ol>
      </div>

      {/* Upsell/Cross-sell */}
      {showUpsell && !purchase.upsell && !purchase.downsell && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Badge variant="outline" className="mb-2 bg-blue-100 text-blue-800 border-blue-200">
                Special One-Time Offer
              </Badge>
              <h3 className="text-xl font-semibold mb-2">
                {OFFERS.UPSELL.title} - Just {fmtUSD(PRICES.UPSELL)} (Save {fmtUSD(VALUES.UPSELL - PRICES.UPSELL)})
              </h3>
              <p className="text-muted-foreground mb-4">
                {OFFERS.UPSELL.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleUpsellAccept}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Yes, Add to My Order
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNotInterested}
                >
                  No Thanks
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Downsell */}
      {showDownsell && !purchase.downsell && !purchase.upsell && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Badge variant="outline" className="mb-2 bg-blue-100 text-blue-800 border-blue-200">
                Limited Time Offer
              </Badge>
              <h3 className="text-xl font-semibold mb-2">
                {OFFERS.DOWNSELL.title} - Just {fmtUSD(PRICES.DOWNSELL)} (Save {fmtUSD(VALUES.DOWNSELL - PRICES.DOWNSELL)})
              </h3>
              <p className="text-muted-foreground mb-4">
                {OFFERS.DOWNSELL.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleDownsellAccept}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Yes, I Want This
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDownsell(false)}
                >
                  No Thanks
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
