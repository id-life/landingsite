import { currentPageAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { PAGE_IDS } from '@/constants/pages';

const PAGE_ID = 'vision_page';

export default function Vision() {
  const wrapperRef = useRef(null);
  const visionBottomRef = useRef<HTMLDivElement>(null);
  const globalLoaded = useAtomValue(globalLoadedAtom);

  const currentPage = useAtomValue(currentPageAtom);
  const { setEnableJudge: setEnableDownJudge, enableJudge: enableDownJudge } = useScrollSmootherAction({
    scrollFn: () => {
      // console.log('[DEBUG] [Vision] DOWN scrollFn called - enableDownJudge:', enableDownJudge, 'isNavScrolling:', window.isNavScrolling);
      if (!enableDownJudge || window.isNavScrolling || window.isSmootherScrolling || window.isResizing) return;
      const st = ScrollTrigger.getById('portfolio-trigger');
      if (!st) {
        // console.log('[DEBUG] [Vision] portfolio-trigger not found');
        return;
      }
      // console.log('[DEBUG] [Vision] Starting auto-scroll to Portfolio');
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.95 },
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
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
        trigger: `#${PAGE_ID}`,
        start: 'top bottom',
        endTrigger: `#${PAGE_IDS.PORTFOLIO}`,
        end: 'top top',
        id: 'vision-trigger',
      });
    },

    { scope: wrapperRef },
  );

  useEffect(() => {
    if (!globalLoaded) return;
    if (currentPage.id === PAGE_ID) {
      setEnableDownJudge(true);
    } else {
      setEnableDownJudge(false);
    }
  }, [currentPage, globalLoaded, setEnableDownJudge]);

  return (
    <div ref={wrapperRef} id={PAGE_ID} className="page-container">
      <div ref={visionBottomRef} className="group pointer-events-none absolute inset-0 -z-10 select-none"></div>
    </div>
  );
}
