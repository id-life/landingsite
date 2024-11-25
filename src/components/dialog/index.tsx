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
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import React, { cloneElement, useCallback, useEffect, useState } from 'react';

type DialogProps = {
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  render: (props: { close: () => void }) => React.ReactNode;
  children?: React.JSX.Element;
  isDismiss?: boolean;
  showCloseButton?: boolean;
  anim?: 'fade' | 'slide' | 'none';
};

function Dialog({
  className,
  overlayClassName,
  contentClassName,
  render,
  open: passedOpen = false,
  children,
  onOpenChange,
  isDismiss = false,
  showCloseButton = true,
  anim = 'fade',
}: React.PropsWithChildren<DialogProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const onChange = (status: boolean) => {
    setIsOpen(status);
    onOpenChange?.(status);
  };

  const { refs, context } = useFloating({ open: isOpen, onOpenChange: onChange });
  const { setReference, setFloating } = refs;
  const dismiss = useDismiss(context, { enabled: isDismiss, outsidePressEvent: 'mousedown' });

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
    const smoother = ScrollSmoother.get();
    if (!smoother) return;
    smoother.paused(isOpen);
  }, [isOpen]);

  return (
    <>
      {children && cloneElement(children, getReferenceProps({ ref: setReference, ...children.props }))}
      <FloatingPortal>
        {isMounted && (
          <>
            <FloatingOverlay className={cn('z-[100] bg-gray-400/50 backdrop-blur', overlayClassName)} style={styles} />
            <FloatingFocusManager context={context}>
              <div className="fixed inset-0 z-[100] grid place-items-center" style={styles}>
                <div
                  className={cn('overflow-visible border border-gray-800 bg-white', className)}
                  {...getFloatingProps({ ref: setFloating })}
                >
                  <div
                    className={cn(
                      'relative min-h-28 min-w-56 mobile:min-h-[20.375rem] mobile:min-w-[18.25rem]',
                      contentClassName,
                    )}
                  >
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
