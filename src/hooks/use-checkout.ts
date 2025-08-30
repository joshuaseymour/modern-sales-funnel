import { useState, useEffect } from "react";
import { type CheckoutForm, type SafeCheckoutForm } from "@/types/funnel";
import { useFormPersistence } from "./use-form-persistence";
import { formatCardNumber, formatExpiry, formatCVC } from "@/lib/format";
import { sanitizeInput } from "@/lib/utils";

export function useCheckout(setBump: (value: boolean) => void) {
  // Only persist non-sensitive data (name and email)
  const { data: persistedSafeForm, isLoaded, updateField: updateSafeField, clearData } = useFormPersistence<SafeCheckoutForm>({
    key: 'checkout-safe-form',
    defaultValues: {
      name: "",
      email: ""
    },
    ttl: 30 // 30 minutes
  });
  
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    card: "",
    expiry: "",
    cvc: ""
  });
  const [touched, setTouched] = useState<Record<keyof CheckoutForm, boolean>>({
    name: false,
    email: false,
    card: false,
    expiry: false,
    cvc: false,
  });
  const [submitting, setSubmitting] = useState(false);

  // Update form when persisted safe data loads (only name and email)
  useEffect(() => {
    if (isLoaded) {
      setForm(prevForm => ({
        ...prevForm,
        name: persistedSafeForm.name,
        email: persistedSafeForm.email
      }));
    }
  }, [persistedSafeForm, isLoaded]);

  // Order bump starts unchecked (ethical practice)
  useEffect(() => {
    setBump(false);
  }, [setBump]);

  // Clean up any existing sensitive data from old localStorage key
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('checkout-form'); // Remove old insecure key
      }
    } catch (error) {
      console.warn('Error cleaning up old form data:', error);
    }
  }, []);

  const emailOk = /.+@.+\..+/.test(form.email);
  const cardDigits = form.card.replace(/\s+/g, "");
  const cardOk = /^\d{16}$/.test(cardDigits);
  const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry);
  const cvcOk = /^\d{3,4}$/.test(form.cvc);
  const nameOk = form.name.trim().length > 1;
  const canSubmit = nameOk && emailOk && cardOk && expiryOk && cvcOk && !submitting;

  const onInput = (k: keyof CheckoutForm) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Sanitize input first (especially important for name/email fields)
      if (k === 'name' || k === 'email') {
        value = sanitizeInput(value);
      }
      
      // Apply formatting based on field type
      if (k === 'card') {
        value = formatCardNumber(value);
      } else if (k === 'expiry') {
        value = formatExpiry(value);
      } else if (k === 'cvc') {
        value = formatCVC(value);
      }
      
      const newForm = { ...form, [k]: value };
      setForm(newForm);
      
      // Only persist non-sensitive fields
      if (k === 'name' || k === 'email') {
        updateSafeField(k, value);
      }
      // Sensitive fields (card, expiry, cvc) are never persisted
    };

  const onBlur = (k: keyof CheckoutForm) => 
    setTouched(prev => ({ ...prev, [k]: true }));

  const handleSubmit = (e: React.FormEvent, onComplete: () => void) => {
    e.preventDefault();
    setTouched({ name: true, email: true, card: true, expiry: true, cvc: true });
    if (!canSubmit) return;
    
    setSubmitting(true);
    setTimeout(() => {
      clearData(); // Clear form data after successful submission
      onComplete();
      setSubmitting(false);
    }, 500);
  };

  return {
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
  };
}
