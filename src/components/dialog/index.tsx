'use client';

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';
import CloseSVG from '@/../public/svgs/close.svg?component';
import React, { cloneElement, useEffect, useState } from 'react';

type DialogProps = {
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  render: (props: { close: () => void }) => React.ReactNode;
  children?: React.JSX.Element;
  isDismiss?: boolean;
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
}: React.PropsWithChildren<DialogProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const onChange = (status: boolean) => {
    setIsOpen(status);
    onOpenChange?.(status);
  };

  const { refs, context } = useFloating({ open: isOpen, onOpenChange: onChange });
  const { setReference, setFloating } = refs;
  const dismiss = useDismiss(context, { enabled: isDismiss, outsidePressEvent: 'mousedown' });

  const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useRole(context), dismiss]);

  useEffect(() => {
    if (passedOpen === undefined) return;
    setIsOpen(passedOpen);
  }, [passedOpen]);

  return (
    <>
      {children && cloneElement(children, getReferenceProps({ ref: setReference, ...children.props }))}
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay lockScroll className={clsx('z-[100] grid place-items-center bg-gray-400/50', overlayClassName)}>
            <FloatingFocusManager context={context}>
              <div
                className={clsx('overflow-visible border border-gray-800 bg-white', className)}
                {...getFloatingProps({ ref: setFloating })}
              >
                <div
                  className={clsx(
                    'mobile:min-h-[20.375rem] mobile:min-w-[18.25rem] relative min-h-28 min-w-56',
                    contentClassName,
                  )}
                >
                  <div className="absolute right-7 top-7 size-3.5 cursor-pointer">
                    <CloseSVG onClick={() => onChange(false)} className="size-3.5" />
                  </div>
                  {render({
                    close: () => onChange(false),
                  })}
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
}

export default React.memo(Dialog);
