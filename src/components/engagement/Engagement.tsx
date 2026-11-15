import { currentPageAtom } from '@/atoms';
import { WorldMap } from '@/components/engagement/WorldMap';
import { NAV_LIST } from '@/components/nav/nav';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { beats, EASE } from '@/motion/tokens';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { memo } from 'react';

const PAGE_ID = 'engagement_page';
const engagementNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

function Engagement() {
  const setCurrentPage = useSetAtom(currentPageAtom);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'engagement-scroll-trigger',
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(engagementNavItem);
        },
        onEnterBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(engagementNavItem);
        },
      },
    });
    tl.set('.world-map-img', { y: 50, opacity: 0 });
    tl.set(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 0,
    });
    tl.set('.world-map-dot-content', {
      opacity: 0,
      height: 0,
    });

    // 使用进度位置控制动画时机
    const factor = 10; // 动画因子

    // tl.add(() => {
    //   setEnableUpJudge(true);
    // });
    // 入场动画序列
    const entranceDuration = beats(2) * factor;
    tl.to('.world-map-img', {
      y: 0,
      opacity: 1,
      ease: EASE.linear,
      duration: entranceDuration,
    });
    tl.to(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 1,
      scale: 1,
      ease: EASE.out,
      stagger: entranceDuration * 0.05,
      duration: entranceDuration,
    });

    // Every arrival lands here (MOT-01): the map and its dots fully in, no meeting card open.
    tl.addLabel('rest');
    // 停留一阵子
    tl.to(() => {}, { duration: beats(2) * factor });
    // tl.add(() => {
    //   setEnableDownJudge(true);
    // });
    // 出场动画序列
    const exitDuration = beats(2) * factor;
    tl.to(
      ['.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor', '.world-map-region'],
      {
        opacity: 0,
        // y: -10,
        ease: EASE.out,
        stagger: exitDuration * 0.1,
        duration: exitDuration,
      },
      `+=${beats(105)}`,
    );

    // tl.to(
    //   ['.world-map-img'],
    //   {
    //     y: -50,
    //     opacity: 0,
    //     ease: EASE.out,
    //     duration: exitDuration * 5,
    //   },
    //   '<',
    // );
  }, []);

  return (
    <div id={PAGE_ID} className="page-container engagement">
      <div id="map-container" className="relative flex h-[100svh] flex-col items-center justify-center">
        <WorldMap
          dots={WORLD_MAP_DOTS}
          regionDots={WORLD_MAP_REGION_DOTS}
          bookDots={MAP_BOOK_DOTS}
          sponsorDots={MAP_SPONSOR_DOTS}
        />
      </div>
    </div>
  );
}

export default memo(Engagement);
