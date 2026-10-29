'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
    }
  }, [key]);

  const setValue = (val: T) => {
    try {
      setStoredValue(val);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (err) {
      console.warn(`Error setting localStorage key "${key}":`, err);
    }
  };

  return [storedValue, setValue];
}
