import { mobileCurrentPageAtom } from '@/atoms';
import { mobileMapScrollProgressAtom } from '@/atoms/engagement';
import MobileWorldMap from '@/components/engagement/MobileWorldMap';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { useMobileEngagementAnim } from '@/hooks/anim/useMobileEngagementAnim';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { memo, useEffect } from 'react';

// Scroll progress bar configuration
const SCROLL_PROGRESS_CONFIG = {
  trackWidth: 152, // Total width of progress track in pixels
  thumbWidth: 57, // Width of progress indicator thumb in pixels
} as const;

// 滚动进度条组件
function MobileScrollProgressBar() {
  const progress = useAtomValue(mobileMapScrollProgressAtom);
  const maxOffset = SCROLL_PROGRESS_CONFIG.trackWidth - SCROLL_PROGRESS_CONFIG.thumbWidth;

  return (
    <div
      className="fixed bottom-[90px] left-1/2 z-10 h-[2px] -translate-x-1/2 rounded-full bg-white/20"
      style={{ width: `${SCROLL_PROGRESS_CONFIG.trackWidth}px` }}
    >
      <div
        className="h-full rounded-full bg-white/40 transition-transform duration-100"
        style={{
          width: `${SCROLL_PROGRESS_CONFIG.thumbWidth}px`,
          transform: `translateX(${progress * maxOffset}px)`,
        }}
      />
    </div>
  );
}

const PAGE_ID = 'engagement_page';

function MobileEngagement() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const { enterAnimate } = useMobileEngagementAnim();

  useEffect(() => {
    if (currentPage?.id !== PAGE_ID) return;
    const cleanup = enterAnimate();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div
      id={PAGE_ID}
      className={cn('relative h-[calc(100dvh-10.875rem)] w-full animate-fade-in text-white transition-all duration-100', {
        hidden: currentPage?.id !== PAGE_ID,
      })}
    >
      {/* Title Section */}
      <div className="fixed inset-x-0 top-[5.25rem] z-40 text-center">
        <h1 className="font-xirod text-[26px] capitalize leading-[30px] text-white">Presence</h1>
        <p className="mt-2 font-oxanium text-[14px] font-bold uppercase leading-[20px] text-white">
          GLOBAL REACH. EAST &amp; WEST
        </p>
      </div>

      <MobileWorldMap
        dots={WORLD_MAP_DOTS}
        regionDots={WORLD_MAP_REGION_DOTS}
        bookDots={MAP_BOOK_DOTS}
        sponsorDots={MAP_SPONSOR_DOTS}
      />

      {/* Progress Bar */}
      <MobileScrollProgressBar />
    </div>
  );
}

export default memo(MobileEngagement);
