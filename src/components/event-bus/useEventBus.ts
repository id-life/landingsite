import { useEffect } from 'react';
import { eventBus } from './eventBus';

export const useEventBus = (eventType: string, callback: (payload: any) => void) => {
  useEffect(() => {
    const subscription = eventBus.subscribe((message) => {
      if (message.type === eventType) callback(message.payload);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [eventType, callback]);
};
