"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import type { Step, Purchase } from "@/types/funnel";

interface FunnelContextType {
  step: Step;
  bump: boolean;
  purchase: Purchase;
  startCheckout: () => void;
  setBump: (value: boolean) => void;
  completeCheckout: () => void;
  acceptUpsell: () => void;
  acceptDownsell: () => void;
  handlePrint: () => void;
}

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

interface FunnelProviderProps {
  children: ReactNode;
}

export function FunnelProvider({ children }: FunnelProviderProps) {
  const [step, setStep] = useState<Step>("landing");
  const [bump, setBump] = useState(false);
  const [purchase, setPurchase] = useState<Purchase>({
    tripwire: false,
    bump: false,
    upsell: false,
    downsell: false,
  });

  const startCheckout = useCallback(() => {
    setStep("checkout");
  }, []);

  const completeCheckout = useCallback(() => {
    setPurchase(prev => ({ ...prev, tripwire: true, bump }));
    setStep("thankyou");
    toast.success("🎉 Purchase successful! Unlocking your access...", {
      duration: 3000,
    });
  }, [bump]);

  const acceptUpsell = useCallback(() => {
    setPurchase(prev => ({ ...prev, upsell: true, downsell: false }));
    toast.success("🎉 DFY Service Unlocked! Access granted immediately.", {
      duration: 3000,
    });
  }, []);

  const acceptDownsell = useCallback(() => {
    setPurchase(prev => ({ ...prev, downsell: true }));
    toast.success("🎉 DWY Service Unlocked! Let's get started together.", {
      duration: 3000,
    });
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print();
      toast.success("📄 Receipt ready for printing", {
        duration: 2000,
      });
    }
  }, []);

  const value = {
    step,
    bump,
    purchase,
    startCheckout,
    setBump,
    completeCheckout,
    acceptUpsell,
    acceptDownsell,
    handlePrint,
  };

  return (
    <FunnelContext.Provider value={value}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  const context = useContext(FunnelContext);
  if (context === undefined) {
    throw new Error("useFunnel must be used within a FunnelProvider");
  }
  return context;
}
