import { currentPageAtom } from '@/atoms';
import { WorldMap } from '@/components/engagement/WorldMap';
import { NAV_LIST } from '@/components/nav/nav';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom } from 'jotai';
import { memo, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PAGE_ID = 'engagement_page';
const engagementNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

function Engagement() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    // engagement auto scroll to portfolio
    scrollFn: () => {
      // console.log(
      //   '[DEBUG] [Engagement] UP scrollFn called - enableUpJudge:',
      //   enableUpJudge,
      //   'isNavScrolling:',
      //   window.isNavScrolling,
      // );
      if (!enableUpJudge || window.isNavScrolling || window.isSmootherScrolling || window.isResizing) return;
      const st = ScrollTrigger.getById('spectrum-trigger');
      if (!st) {
        // console.log('[DEBUG] [Engagement] spectrum-trigger not found');
        return;
      }
      // console.log('[DEBUG] [Engagement] Starting UP auto-scroll to Spectrum');
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.965 },
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
          // console.log('[DEBUG] [Engagement] UP Auto-scroll completed');
        },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
      });
    },
    isUp: true,
  });
  const { setEnableJudge: setEnableDownJudge, enableJudge: enableDownJudge } = useScrollSmootherAction({
    // engagement auto scroll to twin
    scrollFn: () => {
      // console.log(
      //   '[DEBUG] [Engagement] DOWN scrollFn called - enableDownJudge:',
      //   enableDownJudge,
      //   'isNavScrolling:',
      //   window.isNavScrolling,
      // );
      if (!enableDownJudge || window.isNavScrolling || window.isSmootherScrolling || window.isResizing) return;
      const st = ScrollTrigger.getById('twin-scroll-trigger');
      if (!st) {
        // console.log('[DEBUG] [Engagement] twin-scroll-trigger not found');
        return;
      }
      // console.log('[DEBUG] [Engagement] Starting DOWN auto-scroll to Twin');
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.SLOW / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.5 },
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
          // console.log('[DEBUG] [Engagement] DOWN Auto-scroll completed');
        },
      });
    },
    isUp: false,
  });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'engagement-scroll-trigger',
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          if (window.isResizing) return;
          setCurrentPage(engagementNavItem);
        },
        onEnterBack: () => {
          if (window.isResizing) return;
          setCurrentPage(engagementNavItem);
        },
      },
    });
    tl.set('.world-map-img', { y: 50, opacity: 0 });
    tl.set(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 0,
    });
    tl.set('.world-map-dot-content', {
      opacity: 0,
      height: 0,
    });

    // 使用进度位置控制动画时机
    const factor = 10; // 动画因子

    // tl.add(() => {
    //   setEnableUpJudge(true);
    // });
    // 入场动画序列
    const entranceDuration = 2 * factor;
    tl.to('.world-map-img', {
      y: 0,
      opacity: 1,
      ease: 'none',
      duration: entranceDuration,
    });
    tl.to(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 1,
      scale: 1,
      ease: 'power2.out',
      stagger: entranceDuration * 0.05,
      duration: entranceDuration,
    });

    // 停留一阵子
    tl.to(() => {}, { duration: 2 * factor });
    // tl.add(() => {
    //   setEnableDownJudge(true);
    // });
    // 出场动画序列
    const exitDuration = 2 * factor;
    tl.to(
      ['.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor', '.world-map-region'],
      {
        opacity: 0,
        // y: -10,
        ease: 'power2.out',
        stagger: exitDuration * 0.1,
        duration: exitDuration,
      },
      '+=105',
    );

    // tl.to(
    //   ['.world-map-img'],
    //   {
    //     y: -50,
    //     opacity: 0,
    //     ease: 'power2.out',
    //     duration: exitDuration * 5,
    //   },
    //   '<',
    // );
  }, []);

  useEffect(() => {
    if (currentPage.id === PAGE_ID) {
      setEnableUpJudge(true);
      setEnableDownJudge(true);
    } else {
      setEnableUpJudge(false);
      setEnableDownJudge(false);
    }
  }, [currentPage, setEnableUpJudge, setEnableDownJudge]);

  return (
    <div id={PAGE_ID} className="page-container engagement">
      <div id="map-container" className="relative flex h-[100svh] flex-col items-center justify-center">
        <WorldMap
          dots={WORLD_MAP_DOTS}
          regionDots={WORLD_MAP_REGION_DOTS}
          bookDots={MAP_BOOK_DOTS}
          sponsorDots={MAP_SPONSOR_DOTS}
        />
      </div>
    </div>
  );
}

export default memo(Engagement);
