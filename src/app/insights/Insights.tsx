'use client';

import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import NewsSection from '@/app/insights/_components/NewsSection';
import TalksSection from '@/app/insights/_components/TalksSection';
import PodcastSection from '@/app/insights/_components/PodcastSection';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInsightsData } from '@/hooks/insights/fetch';

export default function Insights() {
  const currentPage = useAtomValue(currentPageAtom);

  // Insights 向上滚动 → 回到 Twin 页面
  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    scrollFn: () => {
      if (!enableUpJudge || window.isNavScrolling || window.isSmootherScrolling) return;
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
      if (!enableDownJudge || window.isNavScrolling || window.isSmootherScrolling) return;
      const st = ScrollTrigger.getById('connect-page1-scroll-trigger');
      if (!st) return;
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.SLOW / 1000,
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        scrollTo: { y: st.end },
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
        },
      });
    },
    isUp: false,
  });

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

  const { news, talks, podcasts, isLoading } = useInsightsData();

  return (
    <div id={NAV_LIST[5].id} className="page-container insights h-screen">
      <div className="flex h-[calc(100vh-10rem)] gap-16 px-32 pt-30">
        <div className="relative flex flex-col">
          <NewsSection data={news} isLoading={isLoading} />
        </div>
        <div className="relative flex flex-col">
          <TalksSection data={talks} isLoading={isLoading} />
        </div>

        <div className="relative flex flex-col">
          <PodcastSection podcasts={podcasts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
