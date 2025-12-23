import { useCallback } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export interface TrackEventOptions {
  /**
   * event_name
   */
  name: string;
  /**
   * event_label
   */
  label?: string;

  /**
   * rest data you'd like to send
   * add the `event_` prefix to the key manually if needed
   */
  [key: string]: string | undefined;
}

export function trackEvent(options: TrackEventOptions) {
  const { name, label, ...rest } = options;
  const payload = { event_label: label, ...rest };
  // console.log('[GA]', name, payload);
  sendGAEvent('event', name, payload);
}

export function useGA() {
  const track = useCallback((options: TrackEventOptions) => {
    const { name, label, ...rest } = options;
    const payload = { event_label: label, ...rest };
    // console.log('[GA]', name, payload);
    sendGAEvent('event', name, payload);
  }, []);

  return { trackEvent: track };
}
