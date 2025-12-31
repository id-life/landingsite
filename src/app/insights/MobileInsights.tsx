'use client';

import { innerPageIndexAtom, innerPageNavigateToAtom, mobileCurrentPageAtom } from '@/atoms';
import { useMobileInsightsAnim } from '@/hooks/anim/useMobileInsightsAnim';
import { useInsightsWithGeoData } from '@/hooks/insights/fetch';
import { cn } from '@/utils';
import { useAtom, useAtomValue } from 'jotai';
import { memo, useEffect } from 'react';
import PodcastSection from './_components/PodcastSection';
import NewsAndTalksSection from './_components/NewsAndTalksSection';

const PAGE_ID = 'insights_page';

function MobileInsights() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [innerPageIndex, setInnerPageIndex] = useAtom(innerPageIndexAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const { enterAnimate, leaveAnimate } = useMobileInsightsAnim();
  // Use the new API for news & talks
  const { items: insightItems, isLoading: isInsightsLoading } = useInsightsWithGeoData();

  // 监听 innerPageNavigateTo 变化来切换页面
  useEffect(() => {
    if (innerPageNavigateTo !== null && currentPage?.id === PAGE_ID) {
      setInnerPageIndex(innerPageNavigateTo);
      setInnerPageNavigateTo(null);
    }
  }, [innerPageNavigateTo, currentPage, setInnerPageIndex, setInnerPageNavigateTo]);

  // 页面进入/离开动画
  useEffect(() => {
    if (currentPage?.id === PAGE_ID) {
      enterAnimate();
    } else {
      leaveAnimate();
      setInnerPageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div
      id={PAGE_ID}
      className={cn('page-container-mobile mt-20 flex h-[calc(100svh-8.75rem)] flex-col', {
        hidden: currentPage?.id !== PAGE_ID,
      })}
    >
      {/* Content Area with Flip Animation */}
      <div className="mobile-insights-content relative flex-1 overflow-hidden">
        {/* News & Talks Section */}
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto px-5 pb-4 transition-all duration-500 ease-in-out',
            innerPageIndex === 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
          )}
        >
          <NewsAndTalksSection items={insightItems} isLoading={isInsightsLoading} isMobile />
        </div>

        {/* Podcast Section */}
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto px-5 pb-4 transition-all duration-500 ease-in-out',
            innerPageIndex === 1 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
          )}
        >
          <PodcastSection isMobile />
        </div>
      </div>
    </div>
  );
}

export default memo(MobileInsights);
