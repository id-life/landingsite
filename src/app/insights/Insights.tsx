'use client';

import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import NewsAndTalksSection from '@/app/insights/_components/NewsAndTalksSection';
import PodcastSection from '@/app/insights/_components/PodcastSection';
import { useGSAP } from '@gsap/react';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInsightsData, useInsightsWithGeoData } from '@/hooks/insights/fetch';

export default function Insights() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  // Insights 向上滚动 → 回到 Twin 页面
  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    scrollFn: () => {
      if (!enableUpJudge || window.isNavScrolling || window.isSmootherScrolling || window.isResizing) return;
      const st = ScrollTrigger.getById('twin-scroll-trigger');
      if (!st) return;
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.SLOW / 1000,
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        scrollTo: { y: st.labelToScroll('twin-show') || st.end },
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
        },
      });
    },
    isUp: true,
  });

  // Insights 向下滚动 → 前往 Connect 页面
  const { setEnableJudge: setEnableDownJudge, enableJudge: enableDownJudge } = useScrollSmootherAction({
    scrollFn: () => {
      if (!enableDownJudge || window.isNavScrolling || window.isSmootherScrolling || window.isResizing) return;
      const st = ScrollTrigger.getById('connect-page1-scroll-trigger');
      if (!st) return;
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.SLOW / 1000,
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        scrollTo: { y: st.end + 50 },
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
        },
      });
    },
    isUp: false,
  });

  // 添加页面锁定效果（与其他页面一致）
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'insights-scroll-trigger',
        trigger: `#${NAV_LIST[5].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          if (window.isResizing) return;
          setCurrentPage(NAV_LIST[5]);
        },
        onEnterBack: () => {
          if (window.isResizing) return;
          setCurrentPage(NAV_LIST[5]);
        },
      },
    });

    const factor = 10; // 动画因子，与 Engagement 保持一致

    // 确保初始状态可见（解决从 Connect 返回时的问题）
    tl.fromTo('.insights-content', { y: 0, opacity: 1 }, { y: 0, opacity: 1, duration: 2 * factor });

    // 出场动画（向下滚动时淡出）
    const exitDuration = 2 * factor;
    tl.to('.insights-content', {
      y: -30,
      opacity: 0,
      ease: 'power2.out',
      duration: exitDuration,
    });
  }, []);

  // 根据当前页面启用/禁用滚动判断
  useEffect(() => {
    if (currentPage.id === NAV_LIST[5].id) {
      setEnableUpJudge(true);
      setEnableDownJudge(true);
    } else {
      setEnableUpJudge(false);
      setEnableDownJudge(false);
    }
  }, [currentPage, setEnableUpJudge, setEnableDownJudge]);

  // Use the old API for podcasts (will be migrated to /podcast/list separately)
  const { podcasts, isLoading: isPodcastsLoading } = useInsightsData();
  // Use the new API for news & talks
  const { items: insightItems, isLoading: isInsightsLoading } = useInsightsWithGeoData();

  return (
    <div id={NAV_LIST[5].id} className="page-container insights h-screen">
      <div className="insights-content mt-30 flex h-[calc(100dvh-14rem)] flex-col justify-center gap-9 px-[20rem]">
        {/* NEWS & TALKS section (top) - takes most of the space for 4x2 grid */}
        <div className="-mt-10">
          <NewsAndTalksSection items={insightItems} isLoading={isInsightsLoading} />
        </div>
        {/* PODCAST section (bottom) - single row */}
        <div className="shrink-0">
          <PodcastSection podcasts={podcasts} isLoading={isPodcastsLoading} />
        </div>
      </div>
    </div>
  );
}
