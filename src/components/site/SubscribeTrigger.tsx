'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { SUBSCRIBE_TRIGGER } from '@/hooks/subscribe-trigger';
import { requestSubscribe, SUBSCRIBE_STATE_EVENT } from './subscribe-events';

/**
 * A SUBSCRIBE button (the header's and the phone menu's). Its look and label are server-rendered children; it only
 * asks for the popup and reflects whether it is open (aria-expanded, data-open for the accent colour).
 */
export default function SubscribeTrigger({
  className,
  children,
  onBeforeOpen,
}: {
  className?: string;
  children: ReactNode;
  /** Run before asking (the phone menu closes itself first: one modal at a time). */
  onBeforeOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onState = (event: Event) => setOpen((event as CustomEvent<boolean>).detail);
    window.addEventListener(SUBSCRIBE_STATE_EVENT, onState);
    return () => window.removeEventListener(SUBSCRIBE_STATE_EVENT, onState);
  }, []);

  return (
    <button
      type="button"
      {...SUBSCRIBE_TRIGGER}
      aria-haspopup="dialog"
      aria-expanded={open}
      data-open={open}
      onClick={() => {
        if (onBeforeOpen) {
          onBeforeOpen();
          requestSubscribe({ type: 'open', placement: 'nav' });
        } else requestSubscribe({ type: 'toggle', placement: 'nav' });
      }}
      className={className}
    >
      {children}
    </button>
  );
}
