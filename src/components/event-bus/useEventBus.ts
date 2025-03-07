import { useEffect } from 'react';
import { filter } from 'rxjs/operators';
import { eventBus } from './eventBus';

export const useEventBus = (eventType: string, callback: (payload: any) => void) => {
  useEffect(() => {
    const subscription = eventBus
      .pipe(
        filter(message => message.type === eventType)
      )
      .subscribe(message => callback(message.payload));

    return () => {
      subscription.unsubscribe();
    };
  }, [eventType, callback]);
};