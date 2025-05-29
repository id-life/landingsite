import { cn } from '@/utils';
import { useRef, useEffect, PropsWithChildren, MouseEvent, ReactNode } from 'react';
import gsap from 'gsap';

interface RippleButtonProps {
  className?: string;
  onClick?: (e: MouseEvent) => void;
}

export default function RippleButton({ className, children, onClick }: PropsWithChildren<RippleButtonProps>) {
  const rippleRef1 = useRef<HTMLDivElement>(null);
  const rippleRef2 = useRef<HTMLDivElement>(null);
  const rippleRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ripple1 = rippleRef1.current;
    const ripple2 = rippleRef2.current;
    const ripple3 = rippleRef3.current;

    if (!ripple1 || !ripple2 || !ripple3) return;

    // Create looping animation
    const createRippleAnim = (el: HTMLElement, delay: number) => {
      gsap.to(el, {
        width: 138,
        height: 76,
        opacity: 0,
        duration: 2,
        delay,
        repeat: -1,
        ease: 'none',
        onStart: () => {
          gsap.set(el, { width: 0, height: 0, opacity: 1 });
        },
      });
    };

    // Set different delays for each ripple
    createRippleAnim(ripple1, 0);
    createRippleAnim(ripple2, 0.6);
    createRippleAnim(ripple3, 1.2);

    return () => {
      gsap.killTweensOf([ripple1, ripple2, ripple3]);
    };
  }, []);

  return (
    <div className={cn('pointer-events-auto z-10 cursor-pointer', className)} onClick={onClick}>
      <div className="relative h-10 w-[6.375rem]">
        <div ref={rippleRef1} className="ripple-button-ripple-init" />
        <div ref={rippleRef2} className="ripple-button-ripple-init" />
        <div ref={rippleRef3} className="ripple-button-ripple-init" />
        <div className="flex-center absolute inset-0 gap-1 rounded-full bg-[#2e2f31]">{children}</div>
      </div>
    </div>
  );
}
