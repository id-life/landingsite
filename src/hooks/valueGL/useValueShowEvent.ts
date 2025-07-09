import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';

export function useValueShowEvent() {
  const { trackEvent } = useGA();

  const sendValueShowEvent = (index: number, action: 'click' | 'scroll') => {
    trackEvent({
      name: GA_EVENT_NAMES.VALUE_VIEW,
      label: index.toString(),
      landingsite_action: 'click',
    });
  };

  return { sendValueShowEvent };
}
