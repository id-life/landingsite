import { isSubscribeShowAtom, subscribePopupAtom } from '@/atoms/footer';
import { useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useId } from 'react';
import { SUBSCRIBE_TRIGGER } from '@/hooks/subscribe-trigger';

export { SUBSCRIBE_TRIGGER };

/**
 * Dialog behaviour shared by the desktop and phone SUBSCRIBE popups (APG modal dialog): role="dialog"
 * labelled by its heading, Escape and a press outside close it, and the caller wraps it in a
 * FloatingFocusManager so focus moves in, stays inside and returns to the control that opened it.
 */
export function useSubscribeDialog() {
  const open = useAtomValue(isSubscribeShowAtom);
  const dispatch = useSetAtom(subscribePopupAtom);
  const titleId = useId();

  const { refs, context } = useFloating({
    open,
    onOpenChange: (next, _event, reason) => {
      if (next) return;
      dispatch({ type: 'close', method: reason === 'escape-key' ? 'escape' : 'outside' });
    },
  });
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'pointerdown',
    outsidePress: (event) => !(event.target instanceof Element && event.target.closest('[data-subscribe-trigger]')),
  });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const closeWithX = () => dispatch({ type: 'close', method: 'x' });

  // A closed popup stays mounted for its closing animation; `inert` keeps it out of the Tab order and away
  // from assistive technology. Set as a render attribute so it is gone before the focus manager moves focus in.
  // React 19 types inert as a boolean and treats the empty string React 18 needed as false.
  const closedProps: { inert?: boolean; 'aria-hidden'?: 'true' } = open ? {} : { inert: true, 'aria-hidden': 'true' };

  return { open, refs, context, getFloatingProps, titleId, closeWithX, closedProps };
}
