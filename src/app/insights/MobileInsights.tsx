'use client';

import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useMobileInsightsAnim } from '@/hooks/anim/useMobileInsightsAnim';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import NewsSection from './_components/NewsSection';
import TalksSection from './_components/TalksSection';
import PodcastSection from './_components/PodcastSection';

export default function MobileInsights() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const { enterAnimate, leaveAnimate } = useMobileInsightsAnim();

  useEffect(() => {
    if (currentPage?.id !== NAV_LIST[5].id) {
      leaveAnimate();
      return;
    }
    enterAnimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div
      id={NAV_LIST[5].id}
      className={cn('page-container-mobile min-h-screen bg-[#F0F0F0] px-5 pb-24 pt-20', {
        hidden: currentPage?.id !== NAV_LIST[5].id,
      })}
    >
      <div className="flex flex-col gap-12">
        <div className="insights-section insights-section-news flex flex-col">
          <NewsSection />
        </div>

        <div className="insights-section insights-section-talks flex flex-col">
          <TalksSection />
        </div>

        <div className="insights-section insights-section-podcast flex flex-col">
          <PodcastSection />
        </div>
      </div>
    </div>
  );
}
