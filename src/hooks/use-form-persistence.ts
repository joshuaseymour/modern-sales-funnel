"use client";
import { useState, useEffect, useCallback } from "react";

interface UseFormPersistenceOptions<T> {
  key: string;
  defaultValues: T;
  ttl?: number; // Time to live in minutes
}

interface StorageData<T> {
  data: T;
  timestamp: number;
}

export function useFormPersistence<T extends Record<string, unknown>>({
  key,
  defaultValues,
  ttl = 60 // Default 1 hour
}: UseFormPersistenceOptions<T>) {
  const [data, setData] = useState<T>(defaultValues);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed: StorageData<T> = JSON.parse(stored);
        const now = Date.now();
        const expiryTime = parsed.timestamp + (ttl * 60 * 1000);
        
        if (now < expiryTime) {
          setData(parsed.data);
        } else {
          // Expired, remove from storage
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('Error loading form data from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [key, ttl]);

  // Save data to localStorage
  const saveData = useCallback((newData: Partial<T>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    
    try {
      if (typeof window === 'undefined') return;
      
      const storageData: StorageData<T> = {
        data: updatedData,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(storageData));
    } catch (error) {
      console.warn('Error saving form data to localStorage:', error);
    }
  }, [data, key]);

  // Clear stored data
  const clearData = useCallback(() => {
    setData(defaultValues);
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error clearing form data from localStorage:', error);
    }
  }, [key, defaultValues]);

  // Update a single field
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    saveData({ [field]: value } as unknown as Partial<T>);
  }, [saveData]);

  return {
    data,
    isLoaded,
    saveData,
    clearData,
    updateField,
  };
}