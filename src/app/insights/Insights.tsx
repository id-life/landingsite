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
 * Two layouts only (the owner's rule of 2026-11-18): the laptop deck at every width it gets, scaled with the window,
 * and the phone deck. A tablet on its side is a laptop window of that width; a tablet held upright gets the phone deck.
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
      // The column starts at the header's bottom (84 px on a phone, in the deck's unit) and ends above the bottom
      // controls: with the owner's six news cards it is taller than the screen and scrolls inside these bounds.
      <div
        id={PAGE_ID}
        className={cn('page-container-mobile mt-[5.25rem] flex h-[calc(100svh-10.25rem)] flex-col', !isVisible && 'hidden')}
      >
        {/* Content Area: the three rows centred in the panel, each with its heading and VIEW ALL. The news row draws only
            the card rows that fit (NewsAndTalksSection), and "safe" centring keeps the top of a column that is still
            too tall on screen, so the NEWS & TALKS heading can never again sit under the header out of reach (the
            owner's decision of 2026-11-17: the phone must have a way to the news list). */}
        <div className="mobile-insights-content flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-4 [justify-content:safe_center]">
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
    );
  }

  return (
    <div id={PAGE_ID} className="page-container insights h-screen">
      <div className="desktop:scale-[0.95] desktop2k:origin-center desktop2k:scale-[0.85]">
        {/* The column keeps its scaled margins at every width of the laptop deck. */}
        <div
          className={cn(
            'insights-content mt-30 flex h-[calc(100dvh-14rem)] flex-col justify-center gap-9 px-[20rem]',
            // A short laptop window (up to 760 px tall): the box starts below the header (126 px at 1366x641) and
            // content taller than it starts at its top rather than above it.
            '[@media(max-height:760px)]:mt-[132px] [@media(max-height:760px)]:h-[calc(100dvh-212px)] [@media(max-height:760px)]:[justify-content:safe_center]',
          )}
        >
          {/* NEWS & TALKS section (top) - takes most of the space for 4x2 grid */}
          <div className="-mt-10 [@media(max-height:760px)]:mt-0">
            <NewsAndTalksSection
              items={insightItems}
              isLoading={isInsightsLoading}
              isError={isInsightsError}
              onRetry={() => void refetch()}
            />
          </div>
          {/* Bottom sections: side by side. */}
          <div className="grid shrink-0 grid-cols-2 gap-12">
            <PodcastSection />
            <LongevitySection />
          </div>
        </div>
      </div>
    </div>
  );
}
