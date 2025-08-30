import { useState } from "react";
import { type Step, type Purchase } from "@/types/funnel";

export function useFunnelState() {
  const [step, setStep] = useState<Step>("landing");
  const [bump, setBump] = useState(false);
  const [purchase, setPurchase] = useState<Purchase>({
    tripwire: false,
    bump: false,
    upsell: false,
    downsell: false,
  });

  const startCheckout = () => setStep("checkout");
  
  const completeCheckout = () => {
    setPurchase({ tripwire: true, bump, upsell: false, downsell: false });
    setStep("thankyou");
  };

  const acceptUpsell = () => {
    setPurchase((prev) => ({ ...prev, upsell: true, downsell: false }));
  };

  const acceptDownsell = () => {
    setPurchase((prev) => ({ ...prev, downsell: true }));
  };

  return {
    step,
    bump,
    setBump,
    purchase,
    setPurchase,
    startCheckout,
    completeCheckout,
    acceptUpsell,
    acceptDownsell,
  };
}
