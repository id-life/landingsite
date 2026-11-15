'use client';

import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { isLayoutRefreshing } from '@/motion/sectionController';
import NewsAndTalksSection from '@/app/insights/_components/NewsAndTalksSection';
import LongevitySection from '@/app/insights/_components/LongevitySection';
import { beats, EASE } from '@/motion/tokens';
import { useGSAP } from '@gsap/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { gsap } from 'gsap';
import { useEffect } from 'react';
import { useInsightsWithGeoData } from '@/hooks/insights/fetch';
import { useMobileInsightsAnim } from '@/hooks/anim/useMobileInsightsAnim';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { cn } from '@/utils';
import { ensureMobileUIVisible } from '@/utils/ui';
import PodcastSection from './_components/PodcastSection';

const PAGE_ID = 'insights_page';
const insightsNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

/**
 * Insights, one component for both decks (RWD-02; it was Insights and MobileInsights). The three rows (news and
 * talks, the podcast, the longevity weekly) are the same components on both decks. Real differences, kept as the
 * deck: on the desktop deck the section is a pinned page of the scrolled deck with a scrubbed entrance; on the phone
 * deck it is a panel shown while current, entering with a short tween (useMobileInsightsAnim, which under reduced
 * motion sets the end state at once), with the rows stacked in a scroll box and two-up podcast and weekly rows.
 *
 * Medium and expanded windows (600-1199 px, the tablet tier, RWD-01): the desktop deck's text is set in the type
 * roles, so the column the rows sit in is sized in px there (it scaled with the window and squeezed role-sized text
 * into a 550 px column at 820 px). Medium shows the news cards three across and the two bottom rows stacked.
 */
export default function Insights() {
  const phone = useDeviceProfile()?.tree === 'phone';
  const setCurrentPage = useSetAtom(currentPageAtom);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const isVisible = currentPage?.id === PAGE_ID;
  const { enterAnimate, leaveAnimate } = useMobileInsightsAnim();

  // Desktop deck: the page is pinned for its share of the scroll (as every section).
  useGSAP(
    () => {
      if (phone) return;
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

      // Entrance from below, with explicit end values (MOT-02: scrubbed entrances are fromTo).
      tl.fromTo('.insights-content', { y: 50, opacity: 0 }, { y: 0, opacity: 1, ease: EASE.out, duration: beats(2) * factor });
      // Every arrival lands here (MOT-01): the content fully in.
      tl.addLabel('rest');

      // 停留阶段（缩短停留时间，方便快速翻页）
      tl.to({}, { duration: beats(0.5) * factor });

      // 出场动画（向下滚动时淡出）
      tl.to('.insights-content', { y: -50, opacity: 0, ease: EASE.in, duration: beats(2) * factor });
    },
    { dependencies: [phone] },
  );

  // Phone deck: the fixed UI is visible whenever the panel is (important after browser back navigation).
  useEffect(() => {
    if (!phone || !isVisible) return;
    requestAnimationFrame(() => ensureMobileUIVisible());
  }, [phone, isVisible]);

  // Phone deck: enter and leave with the panel.
  useEffect(() => {
    if (!phone) return;
    if (isVisible) enterAnimate();
    else leaveAnimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone, isVisible]);

  // Use the new API for news & talks
  const { items: insightItems, isLoading: isInsightsLoading, isError: isInsightsError, refetch } = useInsightsWithGeoData();

  if (phone) {
    return (
      <div
        id={PAGE_ID}
        className={cn('page-container-mobile mt-20 flex h-[calc(100svh-10rem)] flex-col', !isVisible && 'hidden')}
      >
        {/* Content Area. Centred with auto margins, not justify-content: center: centring content that is
            taller than the scroll box pushed the NEWS & TALKS row (and the only VIEW ALL to /news) above the
            box's scroll origin, where neither scrolling nor tapping reached it. Auto margins centre when there
            is room and start at the top when there is not, on every browser. */}
        <div className="mobile-insights-content flex flex-1 flex-col overflow-y-auto px-5 pb-4">
          <div className="my-auto flex flex-col gap-6">
            <NewsAndTalksSection
              items={insightItems}
              isLoading={isInsightsLoading}
              isError={isInsightsError}
              onRetry={() => void refetch()}
              isMobile
              isVisible={isVisible}
            />
            {/* Podcast and weekly rows in compact mode: two cards per page. */}
            <PodcastSection isMobile compact isVisible={isVisible} />
            <LongevitySection isMobile isVisible={isVisible} compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={PAGE_ID} className="page-container insights h-screen">
      <div className="desktop:scale-[0.95] desktop2k:origin-center desktop2k:scale-[0.85]">
        {/* From 1200 px the column keeps its scaled margins (unchanged). Medium and expanded windows: px margins
            wide enough for the 44 px carousel arrows beside the cards, and a box that starts below the site header
            (three rows of navigation at 820 px, two at 1180) and ends above the fixed bottom controls. */}
        <div
          className={cn(
            'insights-content mt-30 flex h-[calc(100dvh-14rem)] flex-col justify-center gap-9 px-[20rem]',
            'medium:mt-[160px] medium:h-[calc(100dvh-250px)] medium:gap-[28px] medium:px-[64px]',
            'expanded:mt-[132px] expanded:h-[calc(100dvh-212px)] expanded:gap-[20px] expanded:px-[80px]',
          )}
        >
          {/* NEWS & TALKS section (top) - takes most of the space for 4x2 grid */}
          <div className="-mt-10 medium:mt-0 expanded:mt-0">
            <NewsAndTalksSection
              items={insightItems}
              isLoading={isInsightsLoading}
              isError={isInsightsError}
              onRetry={() => void refetch()}
            />
          </div>
          {/* Bottom sections: side by side; stacked on a medium (portrait tablet) window, where each row then gets
              the full width for its two cards. Expanded windows keep them side by side with room between the
              columns for both rows' carousel arrows; a portrait expanded window (1024x1366) stacks them as medium. */}
          <div className="grid shrink-0 grid-cols-2 gap-12 medium:grid-cols-1 medium:gap-[24px] expanded:gap-[120px] expanded:portrait:grid-cols-1 expanded:portrait:gap-[24px]">
            <PodcastSection />
            <LongevitySection />
          </div>
        </div>
      </div>
    </div>
  );
}
