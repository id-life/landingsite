'use client';

import { useEffect, useRef } from 'react';

/**
 * Returns focus to the control that had it when a dialog opened, without scrolling. The experience is a deck: the
 * browser's scroll-into-view on a returned focus moved it to whichever section held that control. Use with
 * FloatingFocusManager's returnFocus={false}.
 */
export function useReturnFocusWithoutScroll(open: boolean) {
  const openerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      return;
    }
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && opener.isConnected) queueMicrotask(() => opener.focus({ preventScroll: true }));
  }, [open]);
}
