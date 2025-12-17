'use client';

import { GA_EVENT_NAMES } from '@/constants/ga';
import { STORAGE_KEY } from '@/constants/storage';
import { sendGAEvent } from '@next/third-parties/google';
import { useEffect } from 'react';

export function SubscribePopupStorageReporter() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    const popupDismissed = localStorage.getItem(STORAGE_KEY.SUBSCRIBE_POPUP_DISMISSED_LEGACY);
    if (popupDismissed === null) {
      sendGAEvent('event', GA_EVENT_NAMES.SUBSCRIBE_POPUP_STORAGE, { storage_empty: true });
    } else {
      sendGAEvent('event', GA_EVENT_NAMES.SUBSCRIBE_POPUP_STORAGE, { storage_empty: false, popup_dismissed: popupDismissed });
    }
  }, []);
  return null;
}
