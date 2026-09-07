'use client';

import { innerPageIndexAtom, innerPageNavigateToAtom, innerPageTotalAtom, mobileCurrentPageAtom } from '@/atoms';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumInitiatives from './SpectrumInitiatives';
import MobileSpectrumSponsorPage from './MobileSpectrumSponsorPage';

const PAGE_ID = 'spectrum_page';
const TOTAL_INNER_PAGES = 2; // Page 0: main items, Page 1: sponsors
const PARTICLE_RESTART_DELAY = 50; // Delay in ms before activating particles on page entry

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
  const [activeInitiativeIndex, setActiveInitiativeIndex] = useState(0);

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
      <ParticleGL
        key={`spectrum-p0-${particleKey}`}
        isStatic
        imageIdx={activeInitiativeIndex + 1}
        activeAnim={particleActive && particleP0Active}
        id="spectrum-particle-container-mobile-initiatives"
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
        {/* Page Content Container */}
        <div className="spectrum-content relative flex h-full w-full flex-1 overflow-hidden">
          {/* Share the expanded initiatives with desktop; keep the existing sponsor page. */}
          <div ref={page0Ref} className="absolute inset-0 flex flex-col px-5">
            <h1 className="spectrum-title mb-5 text-center font-xirod text-[26px]/[30px] font-bold uppercase">Spectrum</h1>
            <div
              id="spectrum-particle-container-mobile-initiatives"
              className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 [&_canvas]:absolute [&_canvas]:left-1/2 [&_canvas]:top-1/2 [&_canvas]:-translate-x-1/2 [&_canvas]:-translate-y-1/2 [&_canvas]:scale-[0.56]"
              aria-hidden="true"
            />
            <div
              className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-6"
              tabIndex={0}
              aria-label="Spectrum initiatives content"
            >
              <SpectrumInitiatives
                items={spectrumMainItems}
                onSelect={setActiveInitiativeIndex}
                executeSpectrumRoute={executeSpectrumRoute}
                updateUrlAndExecute={updateUrlAndExecute}
                routeConfigs={routeConfigs}
              />
            </div>
          </div>

          {/* Page 1: Sponsors logo wall */}
          <div
            ref={page1Ref}
            className="absolute inset-0 hidden flex-col items-center justify-start overflow-y-auto overflow-x-hidden overscroll-contain pb-3 [&>*]:shrink-0"
          >
            {/* Title Section */}
            <div className="spectrum-title mb-1.5 mt-1 text-center font-xirod text-[26px]/[30px] font-bold uppercase">
              SPECTRUM
            </div>

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
