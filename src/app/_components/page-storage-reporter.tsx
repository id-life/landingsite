'use client';

import { GA_EVENT_NAMES } from '@/constants/ga';
import { STORAGE_KEY } from '@/constants/storage';
import { sendGAEvent } from '@next/third-parties/google';
import { useEffect } from 'react';

export function PageStorageReporter() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    const reports = Object.values(STORAGE_KEY).map((key) => [key, localStorage.getItem(key)] as const);
    if (reports.every(([_, value]) => value === null)) {
      sendGAEvent('event', GA_EVENT_NAMES.PAGE_STORAGE, { storage_empty: true });
    } else {
      sendGAEvent('event', GA_EVENT_NAMES.PAGE_STORAGE, { ...Object.fromEntries(reports), storage_empty: false });
    }
  }, []);
  return null;
}
