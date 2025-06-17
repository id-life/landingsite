'use client';

import { useRef, useEffect, MouseEventHandler } from 'react';
import gsap from 'gsap';
import { cn } from '@/utils';
import { ArrowSVG } from '../svg';

interface BackButtonProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function BackButton({ className, onClick }: BackButtonProps) {
  const rippleRef1 = useRef<HTMLDivElement>(null);
  const rippleRef2 = useRef<HTMLDivElement>(null);
  const rippleRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ripple1 = rippleRef1.current;
    const ripple2 = rippleRef2.current;
    const ripple3 = rippleRef3.current;

    if (!ripple1 || !ripple2 || !ripple3) return;

    const createRippleAnim = (el: HTMLElement, delay: number, initialOpacity: number) => {
      gsap.to(el, {
        width: '9.875rem',
        height: '4.75rem',
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

    createRippleAnim(ripple1, 0, 0.65);
    createRippleAnim(ripple2, 0.6, 0.55);
    createRippleAnim(ripple3, 1.2, 0.45);

    return () => {
      gsap.killTweensOf([ripple1, ripple2, ripple3]);
    };
  }, []);

  return (
    <div className={cn('pointer-events-auto z-10 cursor-pointer', className)} onClick={onClick}>
      <div className="relative h-10 w-[7.625rem]">
        <div ref={rippleRef1} className="back-button-ripple-init"></div>
        <div ref={rippleRef2} className="back-button-ripple-init"></div>
        <div ref={rippleRef3} className="back-button-ripple-init"></div>
        <div className="flex-center absolute inset-0 gap-1.5 rounded-full bg-white">
          <ArrowSVG className="w-4 rotate-90 fill-gray-800" />
          <p className="text-center font-migrena text-base font-bold uppercase leading-[16px] text-gray-800">BACK</p>
        </div>
      </div>
    </div>
  );
}
