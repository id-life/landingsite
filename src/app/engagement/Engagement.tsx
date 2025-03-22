import { currentPageAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import { WorldMap } from '@/components/engagement/WorldMap';
import { NAV_LIST } from '@/components/nav/nav';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { useScrollTriggerAction } from '@/hooks/anim/useScrollTriggerAction';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo } from 'react';

function Engagement() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);

  const { setEnableJudge: setEnableUpJudge } = useScrollTriggerAction({
    triggerId: 'engagement-scroll-trigger',
    scrollFn: () => {
      // console.log('Engagement scrollFn Up');
      gsap.to(window, { duration: 1.5, scrollTo: { y: `#${NAV_LIST[1].id}` } });
    },
    isUp: true,
  });

  const { setEnableJudge: setEnableDownJudge } = useScrollTriggerAction({
    triggerId: 'engagement-scroll-trigger',
    scrollFn: () => {
      // console.log('Engagement scrollFn down');
      gsap.to(window, { duration: 1.5, scrollTo: { y: `#${NAV_LIST[3].id}` } });
    },
    isUp: false,
  });

  useGSAP(() => {
    if (!globalLoaded) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'engagement-scroll-trigger',
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[2]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[2]);
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
    const buttons = document.querySelectorAll('.engagement-bottom-button');
    tl.set(buttons, { y: 30, opacity: 0 });

    // 使用进度位置控制动画时机
    // 入场动画：0 - 0.2
    // 停留时间：0.2 - 0.8
    // 出场动画：0.8 - 1.0
    const factor = 10; // 动画因子

    // 计算入场动画总时长（占总进度的0.2
    const entranceDuration = 0.2 * factor;
    // 计算入场每个动画的单位时长
    const entranceUnit = entranceDuration / 4; // 分为 4 个步骤
    tl.add(() => {
      setEnableUpJudge(true);
    });
    // 入场动画序列
    tl.to('.world-map-img', {
      y: 0,
      opacity: 1,
      ease: 'none',
      duration: entranceUnit,
    });

    tl.to('.world-map-region', {
      scale: 1,
      opacity: 1,
      ease: 'power2.out',
      stagger: entranceUnit * 0.05,
      duration: entranceUnit,
    });

    tl.to(['.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 1,
      scale: 1,
      ease: 'power2.out',
      stagger: entranceUnit * 0.05,
      duration: entranceUnit,
    });

    tl.to(buttons, {
      y: 0,
      opacity: 1,
      stagger: entranceUnit * 0.2,
      ease: 'back.out(1.7)',
      duration: entranceUnit,
    });
    // 停留一阵子
    tl.to(() => {}, { duration: 5 });
    // 出场动画（在进度0.8后开始）
    // 计算出场动画总时长（占总进度的0.2）
    const exitDuration = 0.2 * factor;
    // 计算出场每个动画的单位时长
    const exitUnit = exitDuration / 3; // 分为2个步骤

    // 出场动画序列
    tl.to(`.world-map-dot-content-3`, { opacity: 0, height: 0, ease: 'power2.out', duration: exitUnit });
    tl.to(buttons, {
      y: 30,
      opacity: 0,
      stagger: exitUnit * 0.2,
      ease: 'back.out(1.7)',
      duration: exitUnit,
    });
    tl.to(['.world-map-img', '#world-map-svg'], {
      y: -50,
      opacity: 0,
      ease: 'power2.out',
      duration: exitUnit,
    });

    tl.add(() => {
      setEnableDownJudge(true);
    });
  }, [globalLoaded]);

  return (
    <div id={NAV_LIST[2].id} className="page-container engagement">
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
