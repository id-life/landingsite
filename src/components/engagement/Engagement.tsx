import { currentPageAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import { WorldMap } from '@/components/engagement/WorldMap';
import { NAV_LIST } from '@/components/nav/nav';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { useScrollTriggerAction } from '@/hooks/anim/useScrollTriggerAction';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useAtomValue } from 'jotai';
import { memo } from 'react';

function Engagement() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollTriggerAction({
    // engagement auto scroll to profile
    triggerId: 'engagement-scroll-trigger',
    scrollFn: () => {
      if (!enableUpJudge || currentPage.id !== NAV_LIST[3].id) return;
      console.log('Engagement scrollFn Up');
      gsap.to(window, { duration: 1.5, scrollTo: { y: `#${NAV_LIST[2].id}` } });
    },
    isUp: true,
  });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'engagement-scroll-trigger',
        trigger: `#${NAV_LIST[3].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[3]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[3]);
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

    tl.add(() => {
      setEnableUpJudge(true);
    });
    // 入场动画序列
    const entranceDuration = 2 * factor;
    tl.to('.world-map-img', {
      y: 0,
      opacity: 1,
      ease: 'none',
      duration: entranceDuration,
    });
    tl.to(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 1,
      scale: 1,
      ease: 'power2.out',
      stagger: entranceDuration * 0.05,
      duration: entranceDuration,
    });

    // 停留一阵子
    tl.to(() => {}, { duration: 2 * factor });

    // 出场动画序列
    const exitDuration = 2 * factor;
    tl.to(
      ['.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor', '.world-map-region'],
      {
        opacity: 0,
        // y: -10,
        ease: 'power2.out',
        stagger: exitDuration * 0.1,
        duration: exitDuration,
      },
      '+=105',
    );

    // tl.to(
    //   ['.world-map-img'],
    //   {
    //     y: -50,
    //     opacity: 0,
    //     ease: 'power2.out',
    //     duration: exitDuration * 5,
    //   },
    //   '<',
    // );
  }, []);

  return (
    <div id={NAV_LIST[3].id} className="page-container engagement">
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
