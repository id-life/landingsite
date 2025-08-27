import { currentPageAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import { NAV_LIST } from '@/components/nav/nav';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

export default function Vision() {
  const wrapperRef = useRef(null);
  const visionBottomRef = useRef<HTMLDivElement>(null);
  const globalLoaded = useAtomValue(globalLoadedAtom);

  const currentPage = useAtomValue(currentPageAtom);
  const { setEnableJudge: setEnableDownJudge, enableJudge: enableDownJudge } = useScrollSmootherAction({
    scrollFn: () => {
      // console.log('[DEBUG] [Vision] DOWN scrollFn called - enableDownJudge:', enableDownJudge, 'isNavScrolling:', window.isNavScrolling);
      if (!enableDownJudge || window.isNavScrolling) return;
      const st = ScrollTrigger.getById('portfolio-trigger');
      if (!st) {
        // console.log('[DEBUG] [Vision] portfolio-trigger not found');
        return;
      }
      // console.log('[DEBUG] [Vision] Starting auto-scroll to Portfolio');
      window.isNavScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.95 },
        onComplete: () => {
          window.isNavScrolling = false;
          // console.log('[DEBUG] [Vision] Auto-scroll completed');
        },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
      });
    },
    isUp: false,
  });

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: `#${NAV_LIST[0].id}`,
        start: 'top bottom',
        endTrigger: `#${NAV_LIST[1].id}`,
        end: 'top top',
        id: 'vision-trigger',
        onEnter: () => {
          console.log('vision onEnter');
          setEnableDownJudge(true);
        },
        onLeave: () => {
          console.log('vision onLeave');
          setEnableDownJudge(false);
        },
        onEnterBack: () => {
          console.log('vision onEnterBack');
          setEnableDownJudge(false);
        },
        onLeaveBack: () => {
          console.log('vision onLeaveBack');
          setEnableDownJudge(false);
        },
      });
    },

    { scope: wrapperRef },
  );

  useEffect(() => {
    if (!globalLoaded) return;
    if (currentPage.id === NAV_LIST[0].id) {
      console.log('vision setEnableDownJudge true');
      setEnableDownJudge(true);
    } else {
      setEnableDownJudge(false);
    }
  }, [currentPage, globalLoaded, setEnableDownJudge]);

  return (
    <div ref={wrapperRef} id={NAV_LIST[0].id} className="page-container">
      <div ref={visionBottomRef} className="group pointer-events-none absolute inset-0 -z-10 select-none"></div>
    </div>
  );
}
