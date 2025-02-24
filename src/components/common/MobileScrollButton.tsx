import VisionDecorationBottomScrollSVG from '@/../public/svgs/vision/vision-decoration-2.svg?component';
import { navigateToAtom } from '@/atoms';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { NAV_LIST } from '../nav/nav';

interface ScrollButtonProps {
  className?: string;
}

export default function MobileScrollButton({ className }: ScrollButtonProps) {
  const setNavigateTo = useSetAtom(navigateToAtom);
  const rippleRef1 = useRef<HTMLDivElement>(null);
  const rippleRef2 = useRef<HTMLDivElement>(null);
  const rippleRef3 = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { mobileNavChange } = useMobileNavigation();

  const onClick = useCallback(() => {
    if (isMobile) {
      mobileNavChange(NAV_LIST[1]);
    } else {
      setNavigateTo(NAV_LIST[1]);
    }
  }, [isMobile, mobileNavChange, setNavigateTo]);

  useEffect(() => {
    const ripple1 = rippleRef1.current;
    const ripple2 = rippleRef2.current;
    const ripple3 = rippleRef3.current;

    if (!ripple1 || !ripple2 || !ripple3) return;

    // 创建循环动画
    const createRippleAnim = (el: HTMLElement, delay: number) => {
      gsap.to(el, {
        width: 158, // 7.625rem = 122px
        height: 76, // 2.5rem = 40px
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

    // 为每个波纹设置不同的延迟
    createRippleAnim(ripple1, 0);
    createRippleAnim(ripple2, 0.6);
    createRippleAnim(ripple3, 1.2);

    return () => {
      gsap.killTweensOf([ripple1, ripple2, ripple3]);
    };
  }, []);

  return (
    <div className={cn('pointer-events-auto z-10 cursor-pointer', className)} onClick={onClick}>
      <div className="relative h-10 w-[7.625rem]">
        <div ref={rippleRef1} className="scroll-button-ripple-init" />
        <div ref={rippleRef2} className="scroll-button-ripple-init" />
        <div ref={rippleRef3} className="scroll-button-ripple-init" />
        <div className="flex-center absolute inset-0 gap-1.5 rounded-full bg-black">
          <VisionDecorationBottomScrollSVG className="h-7.5 w-6 fill-white" />
          <p className="font-migrena text-base/4 font-bold uppercase text-white">SCROLL</p>
        </div>
      </div>
    </div>
  );
}
