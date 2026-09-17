'use client';

import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom } from 'jotai';
import { memo, useEffect, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumInitiatives from './SpectrumInitiatives';
import SpectrumItem from './SpectrumItem';

const PAGE_ID = 'spectrum_page';
const spectrumNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

function Spectrum() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [active, setActive] = useState<boolean>(false);
  const [imageIdx, setImageIdx] = useState(1);

  const { spectrumData, executeSpectrumRoute, updateUrlAndExecute, routeConfigs } = useSpectrumData();
  const initiativeItems = spectrumData.slice(0, 3);
  const publicationItem = spectrumData[3];
  const sponsorItem = spectrumData[spectrumData.length - 1];

  const selectInitiative = (index: number) => {
    setImageIdx(index + 1);
  };

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

  return (
    <div id={PAGE_ID} className="page-container spectrum">
      <ParticleGL
        isStatic
        activeAnim={active}
        imageIdx={imageIdx}
        id="spectrum-particle-container"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />
      <div className="relative flex h-[100svh] flex-col overflow-y-auto px-10 pb-20 pt-28 xl:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_51%_52%,rgba(138,168,181,0.07),transparent_30%),linear-gradient(125deg,rgba(117,11,19,0.12),transparent_22%)]" />
        <header className="spectrum-title relative z-10 pb-5 text-center">
          <h1 className="font-xirod text-[2.75rem]/none uppercase text-white">Spectrum</h1>
        </header>
        <div id="spectrum-particle-gl" className="pointer-events-none opacity-30">
          <div id="spectrum-particle-container" className={cn('particle-container', { active })}></div>
        </div>
        <div className="spectrum-fund relative z-10 mx-auto mt-2 flex w-full max-w-[1400px] flex-1 flex-col py-3">
          <div className="flex flex-1 flex-col justify-evenly gap-6">
            <SpectrumInitiatives
              items={initiativeItems}
              onSelect={selectInitiative}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
            <SpectrumInitiatives
              items={[publicationItem]}
              layout="publications"
              onSelect={() => selectInitiative(3)}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
            <div className="w-full pb-4 pt-2">
              <SpectrumItem
                key={sponsorItem.title}
                item={sponsorItem}
                isSponsor
                className="!p-0"
                executeSpectrumRoute={executeSpectrumRoute}
                updateUrlAndExecute={updateUrlAndExecute}
                routeConfigs={routeConfigs}
                onClick={(e) => {
                  sponsorItem.onClick?.(e);
                }}
                onHover={() => setImageIdx(5)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Spectrum);
