'use client';

import { innerPageIndexAtom, innerPageNavigateToAtom, innerPageTotalAtom, mobileCurrentPageAtom } from '@/atoms';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import MobileSpectrumItem, { ParticleConfig } from './MobileSpectrumItem';
import MobileSpectrumSponsorPage from './MobileSpectrumSponsorPage';

const PAGE_ID = 'spectrum_page';
const TOTAL_INNER_PAGES = 2; // Page 0: main items, Page 1: sponsors
const PARTICLE_RESTART_DELAY = 50; // Delay in ms before activating particles on page entry

// Particle container IDs for each grid item (2x2 layout: tl, tr, bl, br)
const PARTICLE_CONTAINER_IDS = [
  'spectrum-particle-container-mobile-p0-tl',
  'spectrum-particle-container-mobile-p0-tr',
  'spectrum-particle-container-mobile-p0-bl',
  'spectrum-particle-container-mobile-p0-br',
];

// Default particle configuration applied to all items
const DEFAULT_PARTICLE_CONFIG: ParticleConfig = {
  offset: { x: '0px', y: '0px' },
  scale: 1,
};

// Per-item particle config overrides (index matches PARTICLE_CONTAINER_IDS)
// Order: Translation & Publishing, Evanglism, Digital Twin, Global Internship
const PARTICLE_CONFIG_OVERRIDES: (Partial<ParticleConfig> | undefined)[] = [
  undefined, // Translation & Publishing (top-left)
  undefined, // Evanglism (top-right)
  { offset: { x: '10px', y: '-20px' } }, // Digital Twin (bottom-left)
  { offset: { x: '10px', y: '-20px' } }, // Global Internship (bottom-right)
];

// Merge default config with per-item overrides
const getParticleConfig = (index: number): ParticleConfig => {
  const override = PARTICLE_CONFIG_OVERRIDES[index];
  if (!override) return DEFAULT_PARTICLE_CONFIG;
  return {
    offset: {
      x: override.offset?.x ?? DEFAULT_PARTICLE_CONFIG.offset?.x,
      y: override.offset?.y ?? DEFAULT_PARTICLE_CONFIG.offset?.y,
    },
    scale: override.scale ?? DEFAULT_PARTICLE_CONFIG.scale,
  };
};

function MobileSpectrum() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pageTransitionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const page0Ref = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const [currentInnerPage, setCurrentInnerPage] = useState(0);
  const currentInnerPageRef = useRef(currentInnerPage);
  const [particleActive, setParticleActive] = useState(false);
  // Separate active states for each page's particles to allow crossfade
  const [particleP0Active, setParticleP0Active] = useState(true);
  const [particleP1Active, setParticleP1Active] = useState(false);
  // Key to force ParticleGL remount on page entry (restarts animation from random positions)
  const [particleKey, setParticleKey] = useState(0);

  const { spectrumMainItems, spectrumSponsorItem, executeSpectrumRoute, updateUrlAndExecute, routeConfigs } = useSpectrumData();

  // Keep ref in sync with state
  useEffect(() => {
    currentInnerPageRef.current = currentInnerPage;
  }, [currentInnerPage]);

  // Create enter animation
  const createEnterAnimation = useCallback(() => {
    if (!wrapperRef.current) return;

    if (pageTransitionTimelineRef.current) pageTransitionTimelineRef.current.kill();

    const tl = gsap.timeline();
    pageTransitionTimelineRef.current = tl;

    tl.fromTo(wrapperRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });

    // Title animation
    tl.fromTo(
      '.spectrum-title',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6',
    );

    // Subtitle animation
    tl.fromTo(
      '.spectrum-subtitle',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.5',
    );

    // Content animation
    tl.fromTo(
      '.spectrum-content',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4',
    );

    return tl;
  }, []);

  // Create exit animation
  const createExitAnimation = useCallback(() => {
    if (!wrapperRef.current) return;

    if (pageTransitionTimelineRef.current) {
      pageTransitionTimelineRef.current.kill();
    }

    const tl = gsap.timeline();
    pageTransitionTimelineRef.current = tl;

    tl.to(wrapperRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power2.inOut',
    });

    return tl;
  }, []);

  // Slide transition between inner pages
  const slideToPage = useCallback(
    (targetPage: number) => {
      if (targetPage === currentInnerPageRef.current) return;
      if (targetPage < 0 || targetPage >= TOTAL_INNER_PAGES) return;

      const isForward = targetPage > currentInnerPageRef.current;
      const currentRef = currentInnerPageRef.current === 0 ? page0Ref : page1Ref;
      const targetRef = targetPage === 0 ? page0Ref : page1Ref;

      if (!currentRef.current || !targetRef.current) return;

      // Kill any ongoing transition
      if (pageTransitionTimelineRef.current) {
        pageTransitionTimelineRef.current.kill();
      }

      // Activate target particle animation before transition starts
      if (targetPage === 0) {
        setParticleP0Active(true);
      } else {
        setParticleP1Active(true);
      }

      const tl = gsap.timeline({
        onComplete: () => {
          const previousPage = currentInnerPageRef.current;
          currentInnerPageRef.current = targetPage;
          setCurrentInnerPage(targetPage);
          setInnerPageIndex(targetPage);
          // Deactivate previous particle after transition
          if (previousPage === 0) {
            setParticleP0Active(false);
          } else {
            setParticleP1Active(false);
          }
        },
      });
      pageTransitionTimelineRef.current = tl;

      // Set initial position for target page
      gsap.set(targetRef.current, {
        y: isForward ? '100%' : '-100%',
        opacity: 1,
        display: 'flex',
      });

      // Animate current page out and target page in
      tl.to(
        currentRef.current,
        {
          y: isForward ? '-100%' : '100%',
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0,
      );

      tl.to(
        targetRef.current,
        {
          y: '0%',
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0,
      );

      tl.set(currentRef.current, { display: 'none' });
    },
    [setInnerPageIndex],
  );

  // Handle navigation from MobilePageArrows
  useEffect(() => {
    if (innerPageNavigateTo === null || currentPage.id !== PAGE_ID) return;
    slideToPage(innerPageNavigateTo);
    setInnerPageNavigateTo(null);
  }, [innerPageNavigateTo, currentPage.id, setInnerPageNavigateTo, slideToPage]);

  // Handle page activation/deactivation
  useEffect(() => {
    if (currentPage.id === PAGE_ID) {
      // Reset to initial state first
      setCurrentInnerPage(0);
      setInnerPageIndex(0);
      setInnerPageTotal(TOTAL_INNER_PAGES);

      // Increment particleKey to force ParticleGL remount (restarts animation)
      setParticleKey((prev) => prev + 1);

      // First deactivate particles to ensure a clean restart
      setParticleActive(false);
      setParticleP0Active(false);
      setParticleP1Active(false);

      // Reset page positions immediately
      if (page0Ref.current) {
        gsap.set(page0Ref.current, { y: '0%', opacity: 1, display: 'flex' });
      }
      if (page1Ref.current) {
        gsap.set(page1Ref.current, { y: '100%', opacity: 1, display: 'none' });
      }

      // Activate particles after a brief delay to ensure clean restart cycle
      const timer = setTimeout(() => {
        setParticleP0Active(true);
        setParticleP1Active(false);
        setParticleActive(true);
      }, PARTICLE_RESTART_DELAY);

      createEnterAnimation();

      return () => clearTimeout(timer);
    } else {
      setParticleActive(false);
      setParticleP0Active(false);
      setParticleP1Active(false);
      createExitAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div
      ref={wrapperRef}
      id={PAGE_ID}
      className={cn('page-container-mobile relative text-white', {
        hidden: currentPage?.id !== PAGE_ID,
      })}
    >
      {/* Page 0 Particles - 2x2 grid */}
      <ParticleGL
        key={`spectrum-p0-tl-${particleKey}`}
        isStatic
        imageIdx={1}
        activeAnim={particleActive && particleP0Active}
        id="spectrum-particle-container-mobile-p0-tl"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />
      <ParticleGL
        key={`spectrum-p0-tr-${particleKey}`}
        isStatic
        imageIdx={2}
        activeAnim={particleActive && particleP0Active}
        id="spectrum-particle-container-mobile-p0-tr"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />
      <ParticleGL
        key={`spectrum-p0-bl-${particleKey}`}
        isStatic
        imageIdx={3}
        activeAnim={particleActive && particleP0Active}
        id="spectrum-particle-container-mobile-p0-bl"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />
      <ParticleGL
        key={`spectrum-p0-br-${particleKey}`}
        isStatic
        imageIdx={4}
        activeAnim={particleActive && particleP0Active}
        id="spectrum-particle-container-mobile-p0-br"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />

      {/* Page 1 Particle - centered for sponsors */}
      <ParticleGL
        key={`spectrum-p1-${particleKey}`}
        isStatic
        imageIdx={5}
        activeAnim={particleActive && particleP1Active}
        id="spectrum-particle-container-mobile-p1"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />

      <div className="relative flex h-[100svh] flex-col items-center justify-start overflow-hidden pb-20 pt-20">
        {/* Title Section */}
        <div className="spectrum-title mb-1.5 mt-1 font-xirod text-[26px]/[30px] font-bold uppercase">SPECTRUM</div>
        <div className="spectrum-subtitle mb-6 font-oxanium text-sm font-bold uppercase">WE DRIVE CHANGE BY..</div>

        {/* Page Content Container */}
        <div className="spectrum-content relative h-full w-full flex-1 overflow-hidden">
          {/* Page 0: Main 4 items in 2x2 grid */}
          <div ref={page0Ref} className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="grid w-full grid-cols-2 grid-rows-2 gap-y-10 px-4">
              {spectrumMainItems.map((item, index) => (
                <MobileSpectrumItem
                  key={item.title}
                  item={item}
                  executeSpectrumRoute={executeSpectrumRoute}
                  updateUrlAndExecute={updateUrlAndExecute}
                  routeConfigs={routeConfigs}
                  className="spectrum-grid-item"
                  particleContainerId={PARTICLE_CONTAINER_IDS[index]}
                  particleActive={particleActive && particleP0Active}
                  particleConfig={getParticleConfig(index)}
                  linksInRow={index === 3} // Global Internship: Apply links in one row
                  onClick={(e) => {
                    item.onClick?.(e);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Page 1: Sponsors logo wall */}
          <div ref={page1Ref} className="absolute inset-0 hidden flex-col items-center justify-center">
            {/* Particle container for sponsor page - centered background */}
            <div
              id="spectrum-particle-container-mobile-p1"
              className={cn(
                'spectrum-particle-item-bg spectrum-particle-p1-bg pointer-events-none absolute left-1/2 top-1/2 z-[-1] -translate-x-1/2 -translate-y-1/2',
                {
                  active: particleActive && particleP1Active,
                },
              )}
            />
            <MobileSpectrumSponsorPage
              sponsorItem={spectrumSponsorItem}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MobileSpectrum);
