import {
  currentPageAtom,
  currentPageIndexAtom,
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
} from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import MobileWorldMap from '@/components/engagement/MobileWorldMap';
import { WorldMap } from '@/components/engagement/WorldMap';
import { NAV_LIST } from '@/components/nav/nav';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { useEngagementJumpTo } from '@/hooks/engagement/useEngagementJumpTo';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { debounce } from 'lodash-es';
import { memo, useEffect, useMemo, useRef } from 'react';

function MobileEngagement() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  // const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  // const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  // const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  // const lastIndexRef = useRef<number>(0);
  // useEffect(() => {
  //   if (currentPageIndex !== 2 || innerPageNavigateTo === null) return;
  //   jumpTo(innerPageNavigateTo, () => {
  //     setInnerPageIndex(innerPageNavigateTo);
  //     setInnerPageNavigateTo(null);
  //   });
  // }, [currentPageIndex, innerPageNavigateTo, jumpTo, setInnerPageIndex, setInnerPageNavigateTo]);

  return (
    <div
      id={NAV_LIST[2].id}
      className={cn('relative h-[100svh] w-full overflow-auto text-white', {
        hidden: currentPage?.id !== NAV_LIST[2].id,
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
