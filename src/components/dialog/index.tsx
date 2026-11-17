'use client';

import CloseSVG from '@/../public/svgs/close.svg?component';
import { cn } from '@/utils';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import React, { cloneElement, useCallback, useEffect, useState } from 'react';
import { pauseSmoother } from '@/utils/smoother';

type DialogProps = {
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  fixClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  render: (props: { close: () => void }) => React.ReactNode;
  children?: React.JSX.Element;
  isDismiss?: boolean;
  showCloseButton?: boolean;
  anim?: 'fade' | 'slide' | 'none';
  /** Which tabbable element inside the dialog takes focus when it opens (FloatingFocusManager's initialFocus). */
  initialFocus?: number;
  /** Whether a press outside the dialog closes it (with isDismiss); return false for presses that should not. */
  outsidePress?: (event: MouseEvent) => boolean;
};

function Dialog({
  className,
  overlayClassName,
  fixClassName,
  contentClassName,
  render,
  open: passedOpen = false,
  children,
  onOpenChange,
  isDismiss = false,
  showCloseButton = true,
  anim = 'fade',
  initialFocus = 0,
  outsidePress,
}: React.PropsWithChildren<DialogProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const onChange = (status: boolean) => {
    setIsOpen(status);
    onOpenChange?.(status);
  };

  const { refs, context } = useFloating({ open: isOpen, onOpenChange: onChange });
  const { setReference, setFloating } = refs;
  const dismiss = useDismiss(context, {
    enabled: isDismiss,
    outsidePressEvent: 'mousedown',
    outsidePress: outsidePress ?? true,
  });

  const getTransitionStyles = useCallback(() => {
    switch (anim) {
      case 'none':
        return {};
      case 'fade':
        return {
          initial: {
            opacity: 0,
          },
          open: {
            opacity: 1,
          },
        };
      case 'slide':
        return {
          initial: {
            opacity: 0,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          },
          open: {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
          },
        };
    }
  }, [anim]);
  const { isMounted, styles } = useTransitionStyles(context, getTransitionStyles());

  const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useRole(context), dismiss]);

  useEffect(() => {
    if (passedOpen === undefined) return;
    setIsOpen(passedOpen);
  }, [passedOpen]);

  useEffect(() => {
    pauseSmoother(isOpen);
  }, [isOpen]);

  return (
    <>
      {children && cloneElement(children, getReferenceProps({ ref: setReference, ...children.props }))}
      <FloatingPortal>
        {isMounted && (
          <>
            <FloatingOverlay className={cn('z-[100] bg-tone-400/50 backdrop-blur', overlayClassName)} style={styles} />
            <FloatingFocusManager context={context} initialFocus={initialFocus}>
              <div className={cn('fixed inset-0 z-[100] grid place-items-center', fixClassName)} style={styles}>
                <div
                  className={cn('overflow-visible border border-tone-800 bg-white', className)}
                  {...getFloatingProps({ ref: setFloating })}
                >
                  <div className={cn('relative min-h-28 min-w-56 mobile:min-w-[18.25rem]', contentClassName)}>
                    {showCloseButton && (
                      <div className="absolute right-7 top-7 size-3.5 cursor-pointer">
                        <CloseSVG onClick={() => onChange(false)} className="size-3.5" />
                      </div>
                    )}
                    {render({
                      close: () => onChange(false),
                    })}
                  </div>
                </div>
              </div>
            </FloatingFocusManager>
          </>
        )}
      </FloatingPortal>
    </>
  );
}

export default React.memo(Dialog);
