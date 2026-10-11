'use client';

import { useEffect } from 'react';

/**
 * Custom hook to execute a callback when the Escape key is pressed.
 * @param onEscape Callback to invoke upon pressing Escape
 * @param enabled Whether the listener is active (default true)
 */
export function useEscapeKey(onEscape: () => void, enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape, enabled]);
}