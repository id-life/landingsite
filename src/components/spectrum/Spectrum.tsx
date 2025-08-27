'use client';

import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom } from 'jotai';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumItem from './SpectrumItem';

function Spectrum() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [active, setActive] = useState<boolean>(false);
  const [imageIdx, setImageIdx] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spectrumRefs = useRef<HTMLDivElement[]>([]);
  const animTimeline = useRef<gsap.core.Timeline | null>(null);
  const mouseAnimations = useRef<Map<number, gsap.core.Timeline>>(new Map());
  const cleanupFunctions = useRef<(() => void)[]>([]);

  const { spectrumData, executeSpectrumRoute, updateUrlAndExecute, routeConfigs } = useSpectrumData();
  const spectrumItems = useMemo(() => {
    return spectrumData.map((item, index) => (
      <SpectrumItem
        key={item.title}
        item={item}
        executeSpectrumRoute={executeSpectrumRoute}
        updateUrlAndExecute={updateUrlAndExecute}
        routeConfigs={routeConfigs}
        onClick={(e) => {
          item.onClick?.(e);
        }}
        ref={(element) => {
          if (element) {
            spectrumRefs.current[index] = element;
          }
        }}
      />
    ));
  }, [spectrumData, executeSpectrumRoute, updateUrlAndExecute, routeConfigs]);

  const windowDimensions = useMemo(() => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  const circleCenter = useMemo(() => {
    const centerX = windowDimensions.width / 2;
    const centerY = windowDimensions.height / 2;
    const maxRadius = Math.hypot(
      Math.max(centerX, windowDimensions.width - centerX),
      Math.max(centerY, windowDimensions.height - centerY),
    );
    return { centerX, centerY, maxRadius };
  }, [windowDimensions]);

  // const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollTriggerAction({
  //   // engagement auto scroll to profile
  //   triggerId: 'spectrum-trigger',
  //   scrollFn: () => {
  //     if (!enableUpJudge || currentPage.id !== NAV_LIST[2].id) return;
  //     const st = ScrollTrigger.getById('portfolio-trigger');
  //     if (!st) return;
  //     gsap.to(window, { duration: 1.5, scrollTo: { y: st.start + (st.end - st.start) * 0.96 } });
  //   },
  //   isUp: true,
  // });

  // const { setEnableJudge: setEnableDownJudge, enableJudge } = useScrollTriggerAction({
  //   // profile auto scroll to engagement
  //   triggerId: 'spectrum-trigger',
  //   scrollFn: () => {
  //     if (!enableJudge || currentPage.id !== NAV_LIST[2].id) return;
  //     // console.log('Spectrum scrollFn down');
  //     const st = ScrollTrigger.getById('engagement-scroll-trigger');
  //     if (!st) return;
  //     gsap.to(window, { duration: 1.5, scrollTo: { y: st.start + (st.end - st.start) * 0.4 } });
  //   },
  //   isUp: false,
  // });

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    // engagement auto scroll to profile
    scrollFn: () => {
      // console.log(
      //   '[DEBUG] [Spectrum] UP scrollFn called - enableUpJudge:',
      //   enableUpJudge,
      //   'currentPage:',
      //   currentPage.id,
      //   'isNavScrolling:',
      //   window.isNavScrolling,
      // );
      if (!enableUpJudge || currentPage.id !== NAV_LIST[2].id || window.isNavScrolling) return;
      const st = ScrollTrigger.getById('portfolio-trigger');
      if (!st) {
        // console.log('[DEBUG] [Spectrum] portfolio-trigger not found');
        return;
      }
      // console.log('[DEBUG] [Spectrum] Starting UP auto-scroll to Portfolio');
      window.isNavScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.96 },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        onComplete: () => {
          window.isNavScrolling = false;
          // console.log('[DEBUG] [Spectrum] UP Auto-scroll completed');
        },
      });
    },
    isUp: true,
  });

  const { setEnableJudge: setEnableDownJudge, enableJudge } = useScrollSmootherAction({
    // profile auto scroll to engagement
    scrollFn: () => {
      // console.log('[DEBUG] [Spectrum] DOWN scrollFn called - enableJudge:', enableJudge, 'currentPage:', currentPage.id, 'isNavScrolling:', window.isNavScrolling);
      if (!enableJudge || currentPage.id !== NAV_LIST[2].id || window.isNavScrolling) return;
      const st = ScrollTrigger.getById('engagement-scroll-trigger');
      if (!st) {
        // console.log('[DEBUG] [Spectrum] engagement-scroll-trigger not found');
        return;
      }
      // console.log('[DEBUG] [Spectrum] Starting DOWN auto-scroll to Engagement');
      window.isNavScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.4 },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        onComplete: () => {
          window.isNavScrolling = false;
          // console.log('[DEBUG] [Spectrum] DOWN Auto-scroll completed');
        },
      });
    },
    isUp: false,
  });

  useEffect(() => {
    if (currentPage.id === NAV_LIST[2].id) {
      console.log('spectrum setEnableUpJudge & setEnableDownJudge true');
      setEnableUpJudge(true);
      setEnableDownJudge(true);
    } else {
      setEnableUpJudge(false);
      setEnableDownJudge(false);
    }
  }, [currentPage, setEnableUpJudge, setEnableDownJudge]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        // markers: true,
        id: 'spectrum-trigger', // add an ID for later reference
        onEnter: () => {
          setCurrentPage(NAV_LIST[2]);
          setActive(true);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[2]);
          setActive(true);
        },
        onLeaveBack: () => {
          setActive(false);
        },
      },
    });
    // tl.add(() => {
    //   setEnableUpJudge(true);
    // });
    tl.from('.spectrum-title', {
      delay: 1,
      y: (_, target) => target.offsetHeight,
      rotateX: 45,
      rotateY: 15,
      opacity: 0,
    });
    tl.from('.spectrum-fund', { y: (_, target) => target.offsetHeight / 3, rotateX: 45, rotateY: 15, opacity: 0 });

    // tl.to(() => {}, { duration: 5 });
    tl.to('.fixed-top', { opacity: 0 });
    tl.to('.fixed-bottom', { opacity: 0 }, '<');
    // tl.add(() => {
    //   setEnableDownJudge(true);
    // });
  }, []);

  const throttledSetImageIdx = useThrottle((index: number) => {
    setImageIdx(index);
  }, 200);

  useGSAP(
    () => {
      if (!spectrumRefs.current.length) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const cleanup: (() => void)[] = [];

      spectrumRefs.current.forEach((div, idx) => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });
        const title = div.querySelector('.spectrum-title');
        const titleCn = div.querySelector('.spectrum-title-cn');
        // const selected = div?.querySelectorAll('.spectrum-selected-icon');
        const icon = div?.querySelectorAll('.spectrum-icon');

        if (title) tl.to(title, { fontSize: '1.875rem', lineHeight: '2.25rem' });
        if (titleCn) tl.to(titleCn, { fontSize: '1.5rem', lineHeight: '1.75rem' }, '<');
        if (icon) tl.to(icon, { width: '2.25rem', height: '2.25rem' }, '<');
        // if (selected) tl.to(selected, { opacity: 1 });

        mouseAnimations.current.set(idx, tl);

        const handleMouseEnter = () => {
          throttledSetImageIdx(idx + 1);
          tl.play();
        };

        const handleMouseLeave = () => {
          tl.reverse();
        };

        div.addEventListener('mouseenter', handleMouseEnter);
        div.addEventListener('mouseleave', handleMouseLeave);

        cleanup.push(() => {
          div.removeEventListener('mouseenter', handleMouseEnter);
          div.removeEventListener('mouseleave', handleMouseLeave);
          tl.kill();
        });
      });

      cleanupFunctions.current = cleanup;

      return () => {
        cleanup.forEach((fn) => fn());
        mouseAnimations.current.clear();
      };
    },
    { scope: wrapperRef, dependencies: [] },
  );

  return (
    <div id={NAV_LIST[2].id} className="page-container spectrum">
      <ParticleGL
        isStatic
        activeAnim={active}
        imageIdx={imageIdx}
        id="spectrum-particle-container"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <h1 className="spectrum-title font-xirod text-[2.5rem]/[4.5rem] uppercase text-white">spectrum</h1>
        <div id="spectrum-particle-gl">
          <div id="spectrum-particle-container" className={cn('particle-container', { active })}></div>
        </div>
        <div className="spectrum-fund mt-12 overflow-hidden px-18">
          <div className="ml-24 grid grid-cols-4 gap-3" ref={wrapperRef}>
            {spectrumItems}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Spectrum);
