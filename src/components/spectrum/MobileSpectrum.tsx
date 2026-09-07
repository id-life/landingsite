'use client';

import { innerPageIndexAtom, innerPageNavigateToAtom, innerPageTotalAtom, mobileCurrentPageAtom } from '@/atoms';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { memo, useEffect, useState } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumInitiatives from './SpectrumInitiatives';
import MobileSpectrumSponsorPage from './MobileSpectrumSponsorPage';

const PAGE_ID = 'spectrum_page';
// Keep each initiative together, pairing the two shorter sections.
const INITIATIVE_PAGES = [[0], [1, 2], [3]];
const SPONSORS_PER_PAGE = 10;

function MobileSpectrum() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
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
      <div className="relative flex h-[100svh] flex-col overflow-hidden px-5 pb-24 pt-20">
        <h1 className="mb-6 shrink-0 text-center font-xirod text-[26px]/[30px] font-bold uppercase">Spectrum</h1>
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
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="absolute inset-0 flex flex-col justify-center"
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
          className="mt-3 shrink-0 text-center font-oxanium text-xs tabular-nums text-white/60"
        >
          <span className="sr-only">Spectrum page </span>
          {pageIndex + 1} / {totalPages}
        </p>
      </div>
    </div>
  );
}

export default memo(MobileSpectrum);
