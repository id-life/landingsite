'use client';

import {
  currentPageAtom,
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  mobileCurrentPageAtom,
} from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useSectionNear } from '@/hooks/useDeferredAssets';
import { isLayoutRefreshing, sectionStateAtom } from '@/motion/sectionController';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { cn } from '@/utils';
import { beats, DISTANCE, MAX_TILT } from '@/motion/tokens';
import { MOTION } from '@/motion/presets';
import { useReducedMotionPref } from '@/motion/preference';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useEffect, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumInitiatives from './SpectrumInitiatives';
import SpectrumItem from './SpectrumItem';
import MobileSpectrumSponsorPage from './MobileSpectrumSponsorPage';

const PAGE_ID = 'spectrum_page';
const spectrumNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;
const SPECTRUM_INDEX = NAV_LIST.findIndex((item) => item.id === PAGE_ID);

/**
 * The institutions' logos (about 250 kB of PNG on the desktop deck) load on approach, not with the hero: once the
 * visitor is within one section of Spectrum (useSectionNear: Insights reached, or a deep link to Spectrum or beyond),
 * or as soon as a section change towards it starts (a nav jump from the hero), so they arrive while the previous
 * section settles. Until then each logo keeps its box (fixed height, no request), so nothing shifts when they come.
 */
function useLogosWanted() {
  const near = useSectionNear(SPECTRUM_INDEX);
  const { target } = useAtomValue(sectionStateAtom);
  return near || target >= SPECTRUM_INDEX - 1;
}

/**
 * Spectrum, one component for both decks (RWD-02; it was Spectrum and MobileSpectrum). Both decks show the same
 * content from useSpectrumData: the section title, the three initiatives, the peer reviews and the supporting
 * institutions, with the same initiative lists (SpectrumInitiatives) and the same particle image behind them.
 *
 * Real differences, kept as the deck (two render paths in this one module):
 * - Desktop deck: one pinned page of the scrolled deck with a scrubbed entrance ending on 'rest'; everything on one
 *   screen; hovering an initiative swaps the particle image; the institutions are one logo grid (SpectrumItem).
 * - Phone deck: a panel shown while current, paged through the inner-page contract shared with Portfolio (the section
 *   arrows step the pages: Translation & Publishing, Evangelism with Digital Twin, Peer Reviews, then ten logos per
 *   page), with a page counter; no hover, so the particle image follows the page.
 */
function Spectrum() {
  const phone = useDeviceProfile()?.tree === 'phone';
  return phone ? <PhoneSpectrum /> : <DeckSpectrum />;
}

function DeckSpectrum() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [active, setActive] = useState<boolean>(false);
  const [imageIdx, setImageIdx] = useState(1);

  const { spectrumData, executeSpectrumRoute, updateUrlAndExecute, routeConfigs } = useSpectrumData();
  const logosWanted = useLogosWanted();
  const initiativeItems = spectrumData.slice(0, 3);
  const publicationItem = spectrumData[3];
  const sponsorItem = spectrumData[spectrumData.length - 1];

  const selectInitiative = (index: number) => {
    setImageIdx(index + 1);
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      // Scrubbed: lengths are beats (shares of the section's scroll), not seconds.
      defaults: { duration: beats(0.5) },
      scrollTrigger: {
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        // markers: true,
        id: 'spectrum-trigger', // add an ID for later reference
        onEnter: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(spectrumNavItem);
          setActive(true);
        },
        onEnterBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(spectrumNavItem);
          setActive(true);
        },
        onLeaveBack: () => {
          if (isLayoutRefreshing()) return;
          setActive(false);
        },
      },
    });
    // Entrances rise 16-24 px with a tilt of at most 8 degrees (MOT-08; they tilted 45 and 15 degrees).
    tl.fromTo(
      '.spectrum-title',
      { y: DISTANCE.md, rotateX: MAX_TILT, rotateY: MAX_TILT / 2, opacity: 0 },
      { delay: beats(1), y: 0, rotateX: 0, rotateY: 0, opacity: 1 },
    );
    tl.fromTo(
      '.spectrum-fund',
      { y: DISTANCE.sm, rotateX: MAX_TILT, rotateY: MAX_TILT / 2, opacity: 0 },
      { y: 0, rotateX: 0, rotateY: 0, opacity: 1 },
    );

    // Every arrival lands here (MOT-01), then a short hold inside the pin.
    tl.addLabel('rest');
    tl.to({}, { duration: beats(0.25) });
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
      {/* The title starts below the site header's box (measured bottoms: 129 px at 1440, 156 at 1920, 122 at 1280,
          126 at 1366x641, 142 at 1180, 151 at a coarse 1366x1024, 171 at 820, 168 at 744, 181 at 1024x1366) and the
          last logo row ends above the fixed bottom controls; the side margins on tablets are the page grid's. */}
      <div
        className={cn(
          'relative flex h-[100svh] flex-col overflow-y-auto px-10 pb-[max(5rem,88px)] pt-[max(10rem,136px)] xl:px-20',
          // A large touch screen (1366x1024): the header's 44 px nav boxes make it taller (labels end at 122 px).
          '[@media(min-width:1200px)_and_(pointer:coarse)]:pt-[max(10rem,156px)]',
          'medium:px-[var(--grid-margin)] medium:pt-[176px] expanded:px-[var(--grid-margin)] expanded:pt-[148px] expanded:portrait:pt-[188px]',
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_51%_52%,rgba(138,168,181,0.07),transparent_30%),linear-gradient(125deg,rgba(117,11,19,0.12),transparent_22%)]" />
        <div className="spectrum-title relative z-10 pb-3 text-center [@media(max-height:860px)]:pb-2">
          <h2 className="font-title text-title uppercase leading-none text-white">Spectrum</h2>
        </div>
        <div id="spectrum-particle-gl" className="pointer-events-none opacity-30">
          <div id="spectrum-particle-container" className={cn('particle-container', { active })}></div>
        </div>
        {/* Up to 1100 px tall the gaps between the three blocks tighten (and the padding under 860), so the logo wall
            clears the bottom controls. */}
        <div className="spectrum-fund relative z-10 mx-auto mt-2 flex w-full max-w-[1400px] flex-1 flex-col py-3 [@media(max-height:860px)]:py-1">
          <div className="flex flex-1 flex-col justify-evenly gap-6 [@media(max-height:1100px)]:gap-4">
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
            <div className="w-full pt-2">
              <SpectrumItem
                key={sponsorItem.title}
                item={sponsorItem}
                isSponsor
                loadImages={logosWanted}
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

// Keep each initiative together, pairing the two shorter sections.
const INITIATIVE_PAGES = [[0], [1, 2], [3]];
const SPONSORS_PER_PAGE = 10;

function PhoneSpectrum() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotionPref();
  const { spectrumMainItems, spectrumSponsorItem, executeSpectrumRoute, updateUrlAndExecute, routeConfigs } = useSpectrumData();
  const totalPages = INITIATIVE_PAGES.length + Math.ceil(spectrumSponsorItem.links.length / SPONSORS_PER_PAGE);
  const active = currentPage.id === PAGE_ID;
  const isSponsor = pageIndex >= INITIATIVE_PAGES.length;
  const itemIndices = INITIATIVE_PAGES[pageIndex] ?? [];
  const sponsorStart = (pageIndex - INITIATIVE_PAGES.length) * SPONSORS_PER_PAGE;

  // Use the same inner-page navigation contract as MobilePortfolio.
  useEffect(() => {
    if (!active) return;
    setPageIndex(0);
    setInnerPageIndex(0);
    setInnerPageTotal(totalPages);
  }, [active, totalPages, setInnerPageIndex, setInnerPageTotal]);

  useEffect(() => {
    if (!active || innerPageNavigateTo === null) return;
    if (innerPageNavigateTo >= 0 && innerPageNavigateTo < totalPages) {
      setDirection(innerPageNavigateTo > pageIndex ? 1 : -1);
      setPageIndex(innerPageNavigateTo);
      setInnerPageIndex(innerPageNavigateTo);
    }
    setInnerPageNavigateTo(null);
  }, [active, innerPageNavigateTo, pageIndex, totalPages, setInnerPageIndex, setInnerPageNavigateTo]);

  return (
    <div id={PAGE_ID} className={cn('page-container-mobile relative text-white', { hidden: !active })}>
      {active && (
        <ParticleGL
          isStatic
          imageIdx={isSponsor ? 5 : (itemIndices[0] ?? 0) + 1}
          activeAnim={!reduceMotion}
          id="spectrum-particle-container-mobile-pages"
          getSourceImgInfos={spectrumGetSourceImgInfos}
        />
      )}
      {/* The title starts below the phone header's box (84 px). A phone in landscape (compact height): a tighter bottom
          and title margin, so an initiative and its links fit between the
          title and the section arrows. */}
      <div className="relative flex h-[100svh] flex-col overflow-hidden px-5 pb-24 pt-[88px] shortScreen:pb-[72px]">
        <h2 className="mb-6 shrink-0 text-center font-title text-title font-bold uppercase leading-tight shortScreen:mb-1">
          Spectrum
        </h2>
        <div
          id="spectrum-particle-container-mobile-pages"
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 [&_canvas]:absolute [&_canvas]:left-1/2 [&_canvas]:top-1/2 [&_canvas]:-translate-x-1/2 [&_canvas]:-translate-y-1/2 [&_canvas]:scale-[0.56]"
          aria-hidden="true"
        />
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={pageIndex}
              custom={direction}
              variants={{
                enter: (travel: number) => ({ opacity: 0, y: reduceMotion ? 0 : travel * 24 }),
                visible: { opacity: 1, y: 0 },
                exit: (travel: number) => ({ opacity: 0, y: reduceMotion ? 0 : travel * -24 }),
              }}
              initial="enter"
              animate="visible"
              exit="exit"
              transition={reduceMotion ? MOTION.instant : MOTION.pageStep}
              className="absolute inset-0 flex flex-col [justify-content:safe_center]"
            >
              {isSponsor ? (
                <MobileSpectrumSponsorPage
                  sponsorItem={{
                    ...spectrumSponsorItem,
                    links: spectrumSponsorItem.links.slice(sponsorStart, sponsorStart + SPONSORS_PER_PAGE),
                  }}
                  executeSpectrumRoute={executeSpectrumRoute}
                  updateUrlAndExecute={updateUrlAndExecute}
                  routeConfigs={routeConfigs}
                  className="!mt-0 !px-0"
                />
              ) : (
                <SpectrumInitiatives
                  items={itemIndices.map((index) => spectrumMainItems[index])}
                  onSelect={() => {}}
                  executeSpectrumRoute={executeSpectrumRoute}
                  updateUrlAndExecute={updateUrlAndExecute}
                  routeConfigs={routeConfigs}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="mt-3 shrink-0 text-center font-display text-caption tabular-nums text-white/60"
        >
          <span className="sr-only">Spectrum page </span>
          {pageIndex + 1} / {totalPages}
        </p>
      </div>
    </div>
  );
}

export default memo(Spectrum);
