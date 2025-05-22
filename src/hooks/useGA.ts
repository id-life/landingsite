import { useIsMobile } from './useIsMobile';
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

export function useGA() {
  const isMobile = useIsMobile();

  const trackEvent = (options: TrackEventOptions) => {
    const { name, label, ...rest } = options;

    sendGAEvent('event', name, {
      event_category: isMobile ? 'mobile' : 'pc',
      event_label: label,
      ...rest,
    });
  };

  return {
    trackEvent,
  };
}
