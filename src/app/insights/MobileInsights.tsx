'use client';

import { mobileCurrentPageAtom } from '@/atoms';
import { useMobileInsightsAnim } from '@/hooks/anim/useMobileInsightsAnim';
import { useInsightsWithGeoData } from '@/hooks/insights/fetch';
import { cn } from '@/utils';
import { ensureMobileUIVisible } from '@/utils/ui';
import { useAtomValue } from 'jotai';
import { memo, useEffect } from 'react';
import PodcastSection from './_components/PodcastSection';
import NewsAndTalksSection from './_components/NewsAndTalksSection';

const PAGE_ID = 'insights_page';

function MobileInsights() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const isVisible = currentPage?.id === PAGE_ID;
  const { enterAnimate, leaveAnimate } = useMobileInsightsAnim();
  // Use the new API for news & talks
  const { items: insightItems, isLoading: isInsightsLoading } = useInsightsWithGeoData();

  // Ensure fixed UI elements are visible when page becomes visible
  useEffect(() => {
    if (isVisible) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        ensureMobileUIVisible();
      });
    }
  }, [isVisible]);

  // 页面进入/离开动画
  useEffect(() => {
    if (currentPage?.id === PAGE_ID) {
      enterAnimate();
    } else {
      leaveAnimate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div
      id={PAGE_ID}
      className={cn('page-container-mobile mt-20 flex h-[calc(100svh-10rem)] flex-col', {
        hidden: currentPage?.id !== PAGE_ID,
      })}
    >
      {/* Content Area - centered with both sections */}
      <div className="mobile-insights-content flex flex-1 flex-col justify-center gap-6 overflow-y-auto px-5 pb-4">
        {/* News & Talks Section */}
        <NewsAndTalksSection items={insightItems} isLoading={isInsightsLoading} isMobile isVisible={isVisible} />

        {/* Podcast Section (compact mode - 2 items) */}
        <PodcastSection isMobile compact isVisible={isVisible} />
      </div>
    </div>
  );
}

export default memo(MobileInsights);
