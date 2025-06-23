'use client';
import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useScrollTriggerAction } from '@/hooks/anim/useScrollTriggerAction';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumItem from './SpectrumItem';
import DiseaseManagementStatus from '../disease-management/DiseaseManagementStatus';
import { showDiseaseManagementContentAtom } from '@/atoms/spectrum';

// register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function Spectrum() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [active, setActive] = useState<boolean>(false);
  const isShowingDiseaseManagement = useAtomValue(showDiseaseManagementContentAtom);
  const setIsShowingDiseaseManagement = useSetAtom(showDiseaseManagementContentAtom);
  const [imageIdx, setImageIdx] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spectrumRefs = useRef<HTMLDivElement[]>([]);
  const animTimeline = useRef<gsap.core.Timeline | null>(null);

  const handleBackToSpectrum = useCallback(() => {
    setIsShowingDiseaseManagement(false);
  }, [setIsShowingDiseaseManagement]);

  const createClipPath = useCallback((isOpening: boolean) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const maxRadius = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY),
    );

    return isOpening ? `circle(${maxRadius}px at ${centerX}px ${centerY}px)` : `circle(0px at ${centerX}px ${centerY}px)`;
  }, []);

  const spectrumData = useSpectrumData();

  useGSAP(() => {
    if (isShowingDiseaseManagement) {
      if (animTimeline.current) animTimeline.current.kill();
      animTimeline.current = gsap.timeline();
      animTimeline.current
        .to(['.spectrum-content-wrapper', '#spectrum-particle-gl'], {
          opacity: 0,
          duration: 0.4,
          pointerEvents: 'none',
        })
        .fromTo(
          '.disease-management-wrapper',
          {
            clipPath: 'circle(0% at 50% 50%)',
            pointerEvents: 'none',
          },
          {
            clipPath: 'circle(100% at 50% 50%)',
            duration: 0.8,
            ease: 'easeInOut',
            pointerEvents: 'auto',
          },
          '-=0.2',
        );
    } else {
      if (animTimeline?.current && animTimeline.current?.progress() > 0) {
        animTimeline.current.reverse();
      }
    }
  }, [isShowingDiseaseManagement]);

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollTriggerAction({
    // engagement auto scroll to profile
    triggerId: 'spectrum-trigger',
    scrollFn: () => {
      if (!enableUpJudge || currentPage.id !== NAV_LIST[2].id) return;
      const st = ScrollTrigger.getById('portfolio-trigger');
      if (!st) return;
      gsap.to(window, { duration: 1.5, scrollTo: { y: st.start + (st.end - st.start) * 0.96 } });
    },
    isUp: true,
  });

  const { setEnableJudge: setEnableDownJudge, enableJudge } = useScrollTriggerAction({
    // profile auto scroll to engagement
    triggerId: 'spectrum-trigger',
    scrollFn: () => {
      if (!enableJudge || currentPage.id !== NAV_LIST[2].id) return;
      // console.log('Spectrum scrollFn down');
      const st = ScrollTrigger.getById('engagement-scroll-trigger');
      if (!st) return;
      gsap.to(window, { duration: 1.5, scrollTo: { y: st.start + (st.end - st.start) } });
    },
    isUp: false,
  });

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
    tl.add(() => {
      setEnableUpJudge(true);
    });
    tl.from('.spectrum-title', {
      delay: 1,
      y: (_, target) => target.offsetHeight,
      rotateX: 45,
      rotateY: 15,
      opacity: 0,
    });
    tl.from('.spectrum-fund', { y: (_, target) => target.offsetHeight / 3, rotateX: 45, rotateY: 15, opacity: 0 });

    tl.to(() => {}, { duration: 5 });
    tl.to('.fixed-top', { opacity: 0 });
    tl.to('.fixed-bottom', { opacity: 0 }, '<');
    tl.add(() => {
      setEnableDownJudge(true);
    });
  }, []);

  const throttledSetImageIdx = useThrottle((index: number) => {
    setImageIdx(index);
  }, 200);

  useGSAP(
    () => {
      if (!spectrumRefs.current.length) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

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

        div.addEventListener('mouseenter', () => {
          throttledSetImageIdx(idx + 1);
          tl.play();
        });
        div.addEventListener('mouseleave', () => {
          tl.reverse();
        });
      });
    },
    { scope: wrapperRef, dependencies: [] },
  );

  return (
    <>
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
            <div id="spectrum-particle-container" className={cn('particle-container', { active })}>
              {/* <div className="particle-mask"></div> */}
            </div>
          </div>
          <div className="spectrum-fund mt-12 overflow-hidden px-18">
            <div className="ml-24 grid grid-cols-4 gap-3" ref={wrapperRef}>
              {spectrumData.map((item, index) => (
                <SpectrumItem
                  key={item.title}
                  item={item}
                  onClick={(e) => {
                    console.log(item.title);
                    item.onClick?.(e);
                  }}
                  ref={(element) => {
                    if (!element) return;
                    spectrumRefs.current[index] = element;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div
          className="disease-management-wrapper pointer-events-none absolute inset-0 z-[65] bg-black"
          style={{ clipPath: 'circle(0% at 50% 50%)' }}
        >
          <DiseaseManagementStatus onBack={handleBackToSpectrum} />
        </div>
      </div>
    </>
  );
}

export default memo(Spectrum);
