import {
  currentPageAtom,
  currentPageIndexAtom,
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
} from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
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
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const lastIndexRef = useRef<number>(0);
  const { jumpTo } = useEngagementJumpTo();
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const debouncedSetInnerPageIndex = useMemo(
    () =>
      debounce((index: number) => {
        if (lastIndexRef.current !== index) {
          lastIndexRef.current = index;
          setInnerPageIndex(index);
        }
      }, 200),
    [setInnerPageIndex],
  );

  // useGSAP(() => {
  //   if (!globalLoaded) return;
  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       id: 'engagement-scroll-trigger',
  //       trigger: `#${NAV_LIST[2].id}`,
  //       start: 'top top',
  //       end: 'bottom bottom',
  //       scrub: true,
  //       immediateRender: true,
  //       // onUpdate: (p) => {
  //       //   console.log('progress:', p);
  //       // },
  //     },
  //   });
  //   tl.set('#world-map-img', { y: 50, opacity: 0 });
  //   tl.set(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
  //     opacity: 0,
  //   });
  //   const buttons = document.querySelectorAll('.engagement-bottom-button');
  //   tl.set(buttons, { y: 30, opacity: 0 });

  //   // 使用进度位置控制动画时机
  //   // 入场动画：0 - 0.4
  //   // 停留时间：0.4 - 0.65
  //   // 出场动画：0.65 - 1.0
  //   const factor = 100; // 动画因子

  //   // 计算入场动画总时长（占总进度的0.4
  //   const entranceDuration = 0.4 * factor;
  //   // 计算入场每个动画的单位时长
  //   const entranceUnit = entranceDuration / 4; // 分为 4 个步骤

  //   // 入场动画序列
  //   tl.to(
  //     '#world-map-img',
  //     {
  //       y: 0,
  //       opacity: 1,
  //       ease: 'none',
  //       duration: entranceUnit,
  //     },
  //     0,
  //   );

  //   tl.to(
  //     '.world-map-region',
  //     {
  //       scale: 1,
  //       opacity: 1,
  //       ease: 'power2.out',
  //       stagger: entranceUnit * 0.05,
  //       duration: entranceUnit,
  //     },
  //     entranceUnit,
  //   );

  //   tl.to(
  //     ['.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'],
  //     {
  //       opacity: 1,
  //       scale: 1,
  //       ease: 'power2.out',
  //       stagger: entranceUnit * 0.05,
  //       duration: entranceUnit,
  //     },
  //     entranceUnit * 2,
  //   );

  //   tl.to(
  //     buttons,
  //     {
  //       y: 0,
  //       opacity: 1,
  //       stagger: entranceUnit * 0.2,
  //       ease: 'back.out(1.7)',
  //       duration: entranceUnit,
  //     },
  //     entranceUnit * 3,
  //   );

  //   // 停留 0.4 - 0.8
  //   const stayDuration = 0.4 * factor;
  //   // 计算停留每个动画的单位时长
  //   const stayUnit = stayDuration / 4; // 分为 4 个步骤
  //   tl.to(`.world-map-dot-content-0`, { opacity: 1, height: '70vh', ease: 'power2.out', duration: stayUnit / 2 }, 0.4 * factor);
  //   tl.to(
  //     `.world-map-dot-content-0`,
  //     { opacity: 0, height: 0, ease: 'power2.out', duration: stayUnit / 2 },
  //     0.4 * factor + stayUnit,
  //   );
  //   tl.to(
  //     `.world-map-dot-content-1`,
  //     {
  //       opacity: 1,
  //       height: '70vh',
  //       ease: 'power2.out',
  //       duration: stayUnit / 2,
  //       onComplete: () => {
  //         debouncedSetInnerPageIndex(1);
  //       },
  //       onReverseComplete: () => {
  //         debouncedSetInnerPageIndex(0);
  //       },
  //     },
  //     '<',
  //   );
  //   tl.to(
  //     `.world-map-dot-content-1`,
  //     { opacity: 0, height: 0, ease: 'power2.out', duration: stayUnit / 2 },
  //     0.4 * factor + stayUnit * 2,
  //   );
  //   tl.to(
  //     `.world-map-dot-content-2`,
  //     {
  //       opacity: 1,
  //       height: '70vh',
  //       ease: 'power2.out',
  //       duration: stayUnit / 2,
  //       onComplete: () => {
  //         debouncedSetInnerPageIndex(2);
  //       },
  //       onReverseComplete: () => {
  //         debouncedSetInnerPageIndex(1);
  //       },
  //     },
  //     '<',
  //   );
  //   tl.to(
  //     `.world-map-dot-content-2`,
  //     { opacity: 0, height: 0, ease: 'power2.out', duration: stayUnit / 2 },
  //     0.4 * factor + stayUnit * 3,
  //   );
  //   tl.to(
  //     `.world-map-dot-content-3`,
  //     {
  //       opacity: 1,
  //       height: '70vh',
  //       ease: 'power2.out',
  //       duration: stayUnit / 2,
  //       onComplete: () => {
  //         debouncedSetInnerPageIndex(3);
  //       },
  //       onReverseComplete: () => {
  //         debouncedSetInnerPageIndex(2);
  //       },
  //     },
  //     '<',
  //   );
  //   // 出场动画（在进度0.8后开始）
  //   // 计算出场动画总时长（占总进度的0.2）
  //   const exitDuration = 0.2 * factor;
  //   // 计算出场每个动画的单位时长
  //   const exitUnit = exitDuration / 3; // 分为2个步骤

  //   // 出场动画序列
  //   tl.to(`.world-map-dot-content-3`, { opacity: 0, height: 0, ease: 'power2.out', duration: exitUnit }, 0.8 * factor);
  //   tl.to(
  //     buttons,
  //     {
  //       y: 30,
  //       opacity: 0,
  //       stagger: exitUnit * 0.2,
  //       ease: 'back.out(1.7)',
  //       duration: exitUnit,
  //     },
  //     0.8 * factor + exitUnit,
  //   );
  //   tl.to(
  //     ['#world-map-img', '#world-map-svg'],
  //     {
  //       y: -50,
  //       opacity: 0,
  //       ease: 'power2.out',
  //       duration: exitUnit,
  //     },
  //     0.8 * factor + exitUnit * 2,
  //   );
  // }, [globalLoaded, debouncedSetInnerPageIndex]);

  useEffect(() => {
    if (currentPageIndex !== 2 || innerPageNavigateTo === null) return;
    jumpTo(innerPageNavigateTo, () => {
      setInnerPageIndex(innerPageNavigateTo);
      setInnerPageNavigateTo(null);
    });
  }, [currentPageIndex, innerPageNavigateTo, jumpTo, setInnerPageIndex, setInnerPageNavigateTo]);

  return (
    <div
      id={NAV_LIST[2].id}
      className={cn('relative h-[100svh] overflow-auto text-white', {
        hidden: currentPage?.id !== NAV_LIST[2].id,
      })}
    >
      <WorldMap
        dots={WORLD_MAP_DOTS}
        regionDots={WORLD_MAP_REGION_DOTS}
        bookDots={MAP_BOOK_DOTS}
        sponsorDots={MAP_SPONSOR_DOTS}
      />
    </div>
  );
}

export default memo(MobileEngagement);
