import { mobileCurrentPageAtom } from '@/atoms';
import MobileWorldMap from '@/components/engagement/MobileWorldMap';
import { NAV_LIST } from '@/components/nav/nav';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { useMobileEngagementAnim } from '@/hooks/anim/useMobileEngagementAnim';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { memo, useEffect } from 'react';

function MobileEngagement() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const { enterAnimate } = useMobileEngagementAnim();

  useEffect(() => {
    if (currentPage?.id !== NAV_LIST[3].id) return;
    const cleanup = enterAnimate();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div
      id={NAV_LIST[3].id}
      className={cn('relative h-[100svh] w-full animate-fade-in overflow-auto text-white transition-all duration-100', {
        hidden: currentPage?.id !== NAV_LIST[3].id,
      })}
    >
      <MobileWorldMap
        dots={WORLD_MAP_DOTS}
        regionDots={WORLD_MAP_REGION_DOTS}
        bookDots={MAP_BOOK_DOTS}
        sponsorDots={MAP_SPONSOR_DOTS}
      />
    </div>
  );
}

export default memo(MobileEngagement);
