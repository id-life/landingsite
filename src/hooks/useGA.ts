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
  sendGAEvent('event', options.name, { event_label: options.label, ...options });
}

export function useGA() {
  const trackEvent = useCallback((options: TrackEventOptions) => {
    const { name, label, ...rest } = options;
    sendGAEvent('event', name, { event_label: label, ...rest });
  }, []);

  return { trackEvent };
}
