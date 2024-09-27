'use client';

import React, { cloneElement, useEffect, useState } from 'react';
import CloseSVG from '@/../public/svgs/close-2.svg?component';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';

type ChartWrapperProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  render: (props: { close: () => void }) => React.ReactNode;
  children?: React.JSX.Element;
};

export default function ChartWrapper({
  open: passedOpen = false,
  onOpenChange,
  render,
  children,
}: React.PropsWithChildren<ChartWrapperProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const onChange = (status: boolean) => {
    setIsOpen(status);
    onOpenChange?.(status);
  };

  const { refs, context } = useFloating({ open: isOpen, onOpenChange: onChange });
  const { setReference, setFloating } = refs;
  const { isMounted, styles } = useTransitionStyles(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([useClick(context), useRole(context)]);

  useEffect(() => {
    if (passedOpen === undefined) return;
    setIsOpen(passedOpen);
  }, [passedOpen]);

  return (
    <>
      {children && cloneElement(children, getReferenceProps({ ref: setReference, ...children.props }))}
      <FloatingPortal>
        {isMounted && (
          <FloatingOverlay className="z-50 bg-white" style={styles}>
            <FloatingFocusManager context={context}>
              <div {...getFloatingProps({ ref: setFloating })} className="flex h-full flex-col items-center gap-5 py-15">
                <div className="flex w-full flex-1">{render({ close: () => onChange(false) })}</div>
                <div className="">
                  <CloseSVG onClick={() => onChange(false)} className="size-15 cursor-pointer" />
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
}
