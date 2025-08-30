"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { LandingPage } from "@/components/funnel/landing-page";
import { SecureCheckoutForm } from "@/components/funnel/secure-checkout-form";
import { ThankYouPage } from "@/components/funnel/thank-you-page";
import { FunnelProvider, useFunnel } from "@/components/providers/funnel-provider";

function FunnelContent() {
  const { step, bump, setBump, completeCheckout } = useFunnel();
  
  return (
    <MainLayout step={step}>
      {step === "landing" && <LandingPage />}
      {step === "checkout" && (
        <SecureCheckoutForm 
          bump={bump} 
          setBump={setBump} 
          onComplete={completeCheckout} 
        />
      )}
      {step === "thankyou" && <ThankYouPage />}
    </MainLayout>
  );
}

export default function FunnelPage() {
  return (
    <FunnelProvider>
      <FunnelContent />
    </FunnelProvider>
  );
}
