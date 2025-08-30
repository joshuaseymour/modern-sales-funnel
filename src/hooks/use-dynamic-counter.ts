"use client";
import { useState, useEffect } from "react";

interface UseDynamicCounterOptions {
  baseCount: number;
  incrementRange: [number, number];
  intervalMs?: number;
  maxIncrement?: number;
}

export function useDynamicCounter({
  baseCount,
  incrementRange: [min, max],
  intervalMs = 5000, // 5 seconds default
  maxIncrement = 100
}: UseDynamicCounterOptions) {
  const [count, setCount] = useState(baseCount);
  const [totalIncrement, setTotalIncrement] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (totalIncrement >= maxIncrement) return;
      
      const increment = Math.floor(Math.random() * (max - min + 1)) + min;
      const newIncrement = Math.min(increment, maxIncrement - totalIncrement);
      
      setCount(prev => prev + newIncrement);
      setTotalIncrement(prev => prev + newIncrement);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [min, max, intervalMs, maxIncrement, totalIncrement]);

  return count;
}

// Hook for social proof text generation
export function useSocialProof() {
  const customerCount = useDynamicCounter({
    baseCount: 2847,
    incrementRange: [1, 3],
    intervalMs: 8000,
    maxIncrement: 50
  });

  const recentPurchases = useDynamicCounter({
    baseCount: 23,
    incrementRange: [1, 2],
    intervalMs: 12000,
    maxIncrement: 20
  });

  const getSocialProofText = () => {
    if (customerCount < 1000) {
      return `${customerCount} entrepreneurs`;
    } else if (customerCount < 5000) {
      return `${Math.floor(customerCount / 100) * 100}+ businesses`;
    } else {
      return `${Math.floor(customerCount / 1000)}k+ customers`;
    }
  };

  const getRecentActivity = () => {
    return `${recentPurchases} people purchased in the last 24 hours`;
  };

  return {
    customerCount,
    recentPurchases,
    getSocialProofText,
    getRecentActivity
  };
}