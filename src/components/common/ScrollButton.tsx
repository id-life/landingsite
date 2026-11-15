import VisionDecorationBottomScrollSVG from '@/../public/svgs/vision/vision-decoration-2.svg?component';
import { navigateToAtom } from '@/atoms';
import { cn } from '@/utils';
import { useSetAtom } from 'jotai';
import { NAV_LIST } from '../nav/nav';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { EASE, LOOP } from '@/motion/tokens';

interface ScrollButtonProps {
  className?: string;
}

export default function ScrollButton({ className }: ScrollButtonProps) {
  const setNavigateTo = useSetAtom(navigateToAtom);
  const rippleRef1 = useRef<HTMLSpanElement>(null);
  const rippleRef2 = useRef<HTMLSpanElement>(null);
  const rippleRef3 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ripple1 = rippleRef1.current;
    const ripple2 = rippleRef2.current;
    const ripple3 = rippleRef3.current;

    if (!ripple1 || !ripple2 || !ripple3) return;

    // 创建循环动画
    const createRippleAnim = (el: HTMLElement, delay: number) => {
      gsap.to(el, {
        // 9.875 x 4.75 of the 7.625 x 2.5 box, as before, measured from the box (it has px floors on tablets).
        width: (el.parentElement?.offsetWidth ?? 0) * (9.875 / 7.625),
        height: (el.parentElement?.offsetHeight ?? 0) * (4.75 / 2.5),
        opacity: 0,
        duration: LOOP.ripple,
        delay,
        repeat: -1,
        ease: EASE.linear,
        onStart: () => {
          gsap.set(el, { width: 0, height: 0, opacity: 1 });
        },
      });
    };

    // 为每个波纹设置不同的延迟
    createRippleAnim(ripple1, 0);
    createRippleAnim(ripple2, 0.6);
    createRippleAnim(ripple3, 1.2);

    return () => {
      gsap.killTweensOf([ripple1, ripple2, ripple3]);
    };
  }, []);

  return (
    // A real button (it was a clickable div); px floors so it stays a readable, tappable control on tablets (RWD-01,
    // RWD-06), the same size as before from 1440 px up.
    <button
      type="button"
      className={cn('pointer-events-auto z-10 cursor-pointer tap-area', className)}
      onClick={() => setNavigateTo(NAV_LIST[1])}
    >
      <span className="relative block h-[max(2.5rem,40px)] w-[max(7.625rem,120px)]">
        <span ref={rippleRef1} className="scroll-button-ripple-init block" />
        <span ref={rippleRef2} className="scroll-button-ripple-init block" />
        <span ref={rippleRef3} className="scroll-button-ripple-init block" />
        <span className="flex-center absolute inset-0 gap-1.5 rounded-full bg-tone-750">
          <VisionDecorationBottomScrollSVG className="h-7.5 w-6 fill-white" />
          <span className="font-button text-label font-bold uppercase text-white">SCROLL</span>
        </span>
      </span>
    </button>
  );
}
