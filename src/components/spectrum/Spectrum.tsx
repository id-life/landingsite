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
import { cloneElement, memo, useEffect, useMemo, useRef, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumItem from './SpectrumItem';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowSVG } from '@/components/svg';

const PAGE_ID = 'spectrum_page';
const spectrumNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

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
    return spectrumData.slice(0, 4).map((item, index) => (
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

  const sponsorItem = spectrumData[spectrumData.length - 1];

  const windowDimensions = useMemo(() => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    // spectrum auto scroll to insights
    scrollFn: () => {
      if (
        !enableUpJudge ||
        currentPage.id !== PAGE_ID ||
        window.isNavScrolling ||
        window.isSmootherScrolling ||
        window.isResizing
      )
        return;
      const st = ScrollTrigger.getById('insights-scroll-trigger');
      if (!st) return;
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.5 },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
        },
      });
    },
    isUp: true,
  });

  const { setEnableJudge: setEnableDownJudge, enableJudge } = useScrollSmootherAction({
    // profile auto scroll to engagement
    scrollFn: () => {
      // console.log('[DEBUG] [Spectrum] DOWN scrollFn called - enableJudge:', enableJudge, 'currentPage:', currentPage.id, 'isNavScrolling:', window.isNavScrolling);
      if (
        !enableJudge ||
        currentPage.id !== PAGE_ID ||
        window.isNavScrolling ||
        window.isSmootherScrolling ||
        window.isResizing
      )
        return;
      const st = ScrollTrigger.getById('engagement-scroll-trigger');
      if (!st) {
        // console.log('[DEBUG] [Spectrum] engagement-scroll-trigger not found');
        return;
      }
      // console.log('[DEBUG] [Spectrum] Starting DOWN auto-scroll to Engagement');
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.4 },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false; // TODO: Trick to prevent the scroll animation from being triggered again, Please fix while you have time.
          // console.log('[DEBUG] [Spectrum] DOWN Auto-scroll completed');
        },
      });
    },
    isUp: false,
  });

  useEffect(() => {
    if (currentPage.id === PAGE_ID) {
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
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        // markers: true,
        id: 'spectrum-trigger', // add an ID for later reference
        onEnter: () => {
          if (window.isResizing) return;
          setCurrentPage(spectrumNavItem);
          setActive(true);
        },
        onEnterBack: () => {
          if (window.isResizing) return;
          setCurrentPage(spectrumNavItem);
          setActive(true);
        },
        onLeaveBack: () => {
          if (window.isResizing) return;
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

      // Only apply hover animation to first 4 items (not sponsor)
      spectrumRefs.current.slice(0, 4).forEach((div, idx) => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });
        const content = div.querySelector('.spectrum-item-content');

        // Use transform scale instead of changing fontSize to avoid layout shifts
        if (content) {
          tl.to(content, { scale: 1.1, transformOrigin: 'top left' });
        }

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
    <div id={PAGE_ID} className="page-container spectrum">
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
          <div className="flex flex-col">
            <div className="flex justify-center gap-[9.375rem]" ref={wrapperRef}>
              {spectrumItems}
            </div>
            <div className="w-full">
              <SpectrumItem
                key={sponsorItem.title}
                item={sponsorItem}
                isSponsor={true}
                executeSpectrumRoute={executeSpectrumRoute}
                updateUrlAndExecute={updateUrlAndExecute}
                routeConfigs={routeConfigs}
                onClick={(e) => {
                  sponsorItem.onClick?.(e);
                }}
                ref={(element) => {
                  if (element) {
                    spectrumRefs.current[spectrumData.length - 1] = element;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Spectrum);
