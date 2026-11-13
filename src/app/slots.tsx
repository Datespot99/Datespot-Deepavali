import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Same deployed Apps Script endpoint used by lead and screenshot submissions.
export const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw7OeduUEDoxGa3386C9wTyHmw8JgUie4elqyOlyzYf_IWWG5Zxb0NBLR6t6xmQCriX8w/exec';

type SlotReply = { slots?: number; status?: 'saved' | 'error' | 'pending'; message?: string };
type SlotContextValue = {
  slots: number | null;
  isLive: boolean;
  refresh: () => Promise<void>;
  setConfirmedSlots: (count: number) => void;
};

const SlotsContext = createContext<SlotContextValue | null>(null);

function requestStatus(params: Record<string, string>): Promise<SlotReply> {
  return new Promise((resolve, reject) => {
    // Apps Script JSONP avoids CORS while exposing ONLY the public count and
    // an opaque receipt status; names, phones and images are never returned.
    const key = '__dsSlots_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const callbacks = window as unknown as Record<string, ((response: SlotReply) => void) | undefined>;
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Slots service timed out'));
    }, 6500);
    const cleanup = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete callbacks[key];
    };
    callbacks[key] = (response: SlotReply) => {
      cleanup();
      resolve(response);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error('Slots service unavailable'));
    };
    const url = new URL(SHEET_URL);
    Object.entries({ ...params, callback: key, _: String(Date.now()) }).forEach(([k, v]) => url.searchParams.set(k, v));
    script.src = url.toString();
    document.head.appendChild(script);
  });
}

function validSlotCount(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === 'number' && value >= 0;
}

export async function waitForScreenshotReceipt(id: string): Promise<number> {
  for (let attempt = 0; attempt < 7; attempt++) {
    const response = await requestStatus({ action: 'upload-status', id });
    if (response.status === 'error') throw new Error(response.message || 'Upload not saved');
    if (response.status === 'saved' && validSlotCount(response.slots)) return response.slots;
    await new Promise<void>(resolve => window.setTimeout(resolve, 1200));
  }
  throw new Error('Upload confirmation timed out. Please try again.');
}

export function SlotsProvider({ children }: { children: React.ReactNode }) {
  // Show the user-provided starting value until the server's first response.
  const [slots, setSlots] = useState<number | null>(26);
  const [isLive, setIsLive] = useState(false);
  const requestVersion = useRef(0);

  const refresh = useCallback(async () => {
    const version = ++requestVersion.current;
    try {
      const response = await requestStatus({ action: 'slots' });
      if (!validSlotCount(response.slots)) throw new Error('Invalid slots response');
      if (version !== requestVersion.current) return;
      setSlots(response.slots);
      setIsLive(true);
    } catch {
      if (version !== requestVersion.current) return;
      // Never present a cached number as live availability after failed reads.
      setSlots(null);
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30000);
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  const setConfirmedSlots = useCallback((count: number) => {
    if (validSlotCount(count)) {
      // Invalidate earlier status requests that might return a stale count.
      requestVersion.current++;
      setSlots(count);
      setIsLive(true);
    }
  }, []);

  return <SlotsContext.Provider value={{ slots, isLive, refresh, setConfirmedSlots }}>{children}</SlotsContext.Provider>;
}

export function useSlots(): SlotContextValue {
  const value = useContext(SlotsContext);
  if (!value) throw new Error('useSlots must be used inside SlotsProvider');
  return value;
}
