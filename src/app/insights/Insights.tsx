'use client';

import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { isLayoutRefreshing } from '@/motion/sectionController';
import NewsAndTalksSection from '@/app/insights/_components/NewsAndTalksSection';
import LongevitySection from '@/app/insights/_components/LongevitySection';
import { beats, EASE } from '@/motion/tokens';
import { useGSAP } from '@gsap/react';
import { useSetAtom } from 'jotai';
import { gsap } from 'gsap';
import { useInsightsWithGeoData } from '@/hooks/insights/fetch';
import PodcastSection from './_components/PodcastSection';

const PAGE_ID = 'insights_page';
const insightsNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

export default function Insights() {
  const setCurrentPage = useSetAtom(currentPageAtom);

  // 添加页面锁定效果（与其他页面一致）
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'insights-scroll-trigger',
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(insightsNavItem);
        },
        onEnterBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(insightsNavItem);
        },
      },
    });

    const factor = 10; // 动画因子，与 Engagement 保持一致

    // 设置初始状态（从下方渐入）
    tl.set('.insights-content', { y: 50, opacity: 0 });

    // 入场动画（向下滚动时渐入）
    const entranceDuration = beats(2) * factor;
    tl.to('.insights-content', {
      y: 0,
      opacity: 1,
      ease: EASE.out,
      duration: entranceDuration,
    });
    // Every arrival lands here (MOT-01): the content fully in.
    tl.addLabel('rest');

    // 停留阶段（缩短停留时间，方便快速翻页）
    tl.to({}, { duration: beats(0.5) * factor });

    // 出场动画（向下滚动时淡出）
    const exitDuration = beats(2) * factor;
    tl.to('.insights-content', {
      y: -50,
      opacity: 0,
      ease: EASE.in,
      duration: exitDuration,
    });
  }, []);

  // Use the new API for news & talks
  const { items: insightItems, isLoading: isInsightsLoading, isError: isInsightsError, refetch } = useInsightsWithGeoData();

  return (
    <div id={PAGE_ID} className="page-container insights h-screen">
      <div className="desktop:scale-[0.95] desktop2k:origin-center desktop2k:scale-[0.85]">
        <div className="insights-content mt-30 flex h-[calc(100dvh-14rem)] flex-col justify-center gap-9 px-[20rem]">
          {/* NEWS & TALKS section (top) - takes most of the space for 4x2 grid */}
          <div className="-mt-10">
            <NewsAndTalksSection
              items={insightItems}
              isLoading={isInsightsLoading}
              isError={isInsightsError}
              onRetry={() => void refetch()}
            />
          </div>
          {/* Bottom sections */}
          <div className="grid shrink-0 grid-cols-2 gap-12">
            <PodcastSection />
            <LongevitySection />
          </div>
        </div>
      </div>
    </div>
  );
}
