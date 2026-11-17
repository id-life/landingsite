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
import { beats, DISTANCE, DURATION, EASE, MAX_TILT } from '@/motion/tokens';
import { MOTION } from '@/motion/presets';
import { useReducedMotionPref } from '@/motion/preference';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import ParticleGL from '../gl/particle/ParticleGL';
import SpectrumInitiatives from './SpectrumInitiatives';
import SpectrumItem from './SpectrumItem';
import MobileSpectrumSponsorPage from './MobileSpectrumSponsorPage';
import { PAPERS_GROUP, spectrumPhonePages } from './phonePages';
import { fitScale, type FitScale } from './fitScale';

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
 * content from useSpectrumData: the section title, the three initiatives, the supporting institutions and the papers,
 * with the same initiative lists (SpectrumInitiatives) and the same particle image behind them.
 *
 * The owner's arrangement of 2026-11-17 for the desktop deck: the initiatives on top, the institutions' logos in the
 * middle, the papers at the bottom, where only the three most cited show until "more" opens the rest in place (with six
 * papers above them the logos were pushed under the bottom controls).
 *
 * Real differences, kept as the deck (two render paths in this one module):
 * - Desktop deck: one pinned page of the scrolled deck with a scrubbed entrance ending on 'rest'; everything on one
 *   screen; hovering an initiative swaps the particle image; the institutions are one logo grid (SpectrumItem).
 * - Phone deck: a panel shown while current, paged through the inner-page contract shared with Portfolio (the section
 *   arrows step the pages, in the desktop's order: Translation & Publishing, Evangelism with Digital Twin, ten logos
 *   per page, then Papers & Reviews; see phonePages), with a page counter; no hover, so the particle image follows
 *   the page.
 */
function Spectrum() {
  const phone = useDeviceProfile()?.tree === 'phone';
  return phone ? <PhoneSpectrum /> : <DeckSpectrum />;
}

/** The boxes of the fixed bottom controls (slogan, section arrows, player); the composition may not reach under them. */
function bottomControls(section: Element): DOMRect[] {
  const boxes: DOMRect[] = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (section.contains(el)) continue;
    // A dialog over the page (SUBSCRIBE, the newsletter prompt) is not a bottom control: it comes and goes, and the
    // composition fitted above it stayed so after it closed.
    if (el.closest('[role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-floating-ui-portal]')) continue;
    const style = getComputedStyle(el);
    if (style.position !== 'fixed' || style.visibility === 'hidden' || style.display === 'none') continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2 || box.top < window.innerHeight / 2 || box.height > window.innerHeight / 3) continue;
    boxes.push(box);
  }
  return boxes;
}

/** An element's layout position inside a positioned ancestor (offsets: untouched by transforms such as the entrance). */
function layoutOffset(el: HTMLElement, root: HTMLElement): { x: number; y: number } | null {
  let x = 0;
  let y = 0;
  let node: Element | null = el;
  while (node instanceof HTMLElement && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return node === root ? { x, y } : null;
}

/**
 * The fit scale of the desktop composition (fitScale.ts): measured from the page, never from fixed numbers. The room is
 * the band between the site header's bottom (--site-header-h, published by ExperienceHeader) and the top of the bottom
 * controls, inside the column's own padding; the height needed is the composition's with every group open (the hidden
 * open copies of the collapsible lists, SpectrumInitiatives). Remeasured on resize and whenever the content's size
 * changes (fonts, logos); the result changes only by more than a rounding step, so applying it cannot loop.
 */
function useFitScale(
  column: React.RefObject<HTMLDivElement | null>,
  content: React.RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  const [fit, setFit] = useState<
    FitScale & { offset: number; room: number; constrained: boolean; fieldShift: number; fieldShiftHeld: number }
  >({
    scale: 1,
    scrolls: false,
    offset: 0,
    fieldShift: 0,
    fieldShiftHeld: 0,
    gapCut: 0,
    room: 0,
    constrained: false,
  });

  useEffect(() => {
    const col = column.current;
    const box = content.current;
    if (!col || !box) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const colBox = col.getBoundingClientRect();
        const cs = getComputedStyle(col);
        const headerBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-h')) || 0;
        const top = Math.max(headerBottom, colBox.top + parseFloat(cs.paddingTop));
        const controls = bottomControls(col);
        const controlsTop = Math.min(window.innerHeight, ...controls.map((c) => c.top));
        const bottom = Math.min(controlsTop, colBox.bottom - parseFloat(cs.paddingBottom));
        const room = bottom - top;
        // A column held to the band (constrained: an opened paper was predicted under a control) cannot predict again
        // while held, so a hold decided against a room that has since changed outlived it: after the window was made
        // 40 px lower and set back, the first measure ran before the fixed bottom controls had moved, predicted with
        // the old room, and 1440x900 stayed held 13 px higher than a fresh load. When the room no longer equals the
        // held height, the hold is let go; the box's own resize brings the next measure, which predicts afresh.
        const heldAt = parseFloat(box.style.height);
        if (heldAt && (parseFloat(box.style.zoom) || 1) === 1 && Math.abs(heldAt - room) >= 1) {
          setFit((prev) => (prev.constrained && prev.scale === 1 ? { ...prev, constrained: false } : prev));
          return;
        }
        // Height needed at scale 1: the content's own children (title, bands), plus what the closed groups add open.
        // Layout sizes (offsetHeight), not boxes: they are unscaled under the zoom and ignore the entrance's tilt.
        const fund = box.querySelector<HTMLElement>('.spectrum-fund');
        const title = box.querySelector<HTMLElement>('.spectrum-title');
        const bands = fund?.firstElementChild as HTMLElement | null;
        if (!fund || !title || !bands) return;
        const fundStyle = getComputedStyle(fund);
        const children = [...bands.children] as HTMLElement[];
        let needed =
          title.offsetHeight +
          parseFloat(fundStyle.marginTop) +
          parseFloat(fundStyle.paddingTop) +
          parseFloat(fundStyle.paddingBottom) +
          children.reduce((sum, child) => sum + child.offsetHeight, 0) +
          (parseFloat(getComputedStyle(bands).rowGap) || 0) * Math.max(0, children.length - 1);
        let openExtra = 0;
        const copies: { copy: HTMLElement; list: HTMLElement }[] = [];
        for (const copy of box.querySelectorAll<HTMLElement>('[data-open-measure]')) {
          const list = copy.parentElement?.previousElementSibling as HTMLElement | null;
          if (!list) continue;
          openExtra += Math.max(0, copy.offsetHeight - list.offsetHeight);
          copies.push({ copy, list });
        }
        needed += openExtra;
        // At scale 1 the bands are spread over the column's whole height (justify-content: space-evenly), which can
        // put an opened link under a bottom control even when the composition fits. Predict where every link of an
        // opened group would be drawn at the column's natural height (the hidden open copy gives each link's place in
        // its list; opening moves every band up by n/(n+1) of the height it adds, since the even spaces shrink), and
        // where one would lie under a control or below the window, hold the column to the room instead (the bands
        // spread over the room). Predicted for the natural height, so holding it does not undo the decision.
        // Positions come from layout offsets inside the column, so the entrance's rise and tilt cannot skew them. While
        // the column is held (or scaled) nothing is predicted and the previous decision stands (see setFit below).
        let predicted: boolean | null = null;
        if (!box.style.height) {
          predicted = false;
          const lift = (children.length * openExtra) / (children.length + 1);
          const clear = 4; // a link's line box reaches a pixel or two past its rounded edge
          for (const { copy, list } of copies) {
            const listAt = layoutOffset(list, col);
            const copyAt = layoutOffset(copy, col);
            if (!listAt || !copyAt) continue;
            for (const item of copy.children as HTMLCollectionOf<HTMLElement>) {
              const at = layoutOffset(item, col);
              if (!at) continue;
              const left = colBox.left + at.x;
              const right = left + item.offsetWidth;
              const linkTop = colBox.top + at.y + (listAt.y - copyAt.y) - lift;
              const linkBottom = linkTop + item.offsetHeight + clear;
              if (linkBottom > window.innerHeight) predicted = true;
              for (const c of controls)
                if (left < c.right && right > c.left && linkTop < c.bottom && linkBottom > c.top) predicted = true;
            }
          }
        }
        // The gaps between the rows of opened papers, whole: the cut in force (--paper-row-cut) is added back, so the
        // decision does not feed on itself.
        const appliedCut = parseFloat(box.style.getPropertyValue('--paper-row-cut')) || 0;
        const paperCopy = box.querySelector<HTMLElement>('section[aria-label="Spectrum publications"] [data-open-measure]');
        const paperRows = paperCopy
          ? new Set([...paperCopy.children].map((li) => Math.round((li as HTMLElement).offsetTop))).size
          : 0;
        const gaps = {
          count: Math.max(0, paperRows - 1),
          gap: paperCopy ? (parseFloat(getComputedStyle(paperCopy).rowGap) || 0) + appliedCut : 0,
        };
        needed += appliedCut * gaps.count;
        box.dataset.fitRoom = String(Math.round(room));
        box.dataset.fitNeeded = String(Math.round(needed));
        const next = fitScale(room, needed, gaps);
        const offset = Math.max(0, top - (colBox.top + parseFloat(cs.paddingTop)));
        // The particle field is placed at the middle of the composition's box; the owner's picture has it at the middle
        // of the whole column, whose padding is larger above than below. This shift puts it back there at scale 1.
        const fieldShift = (parseFloat(cs.paddingBottom) - parseFloat(cs.paddingTop)) / 2;
        // Held to the band at scale 1 (constrained): the box starts `offset` lower and is `room` tall.
        const fieldShiftHeld = colBox.height / 2 - parseFloat(cs.paddingTop) - offset - room / 2;
        setFit((prev) => {
          // Held at scale 1 because of a prediction: it stands. Scaled: no hold needed once back at 1, predict again.
          // With the gaps cut the opened composition fills the room exactly, so nothing lies under a control: no hold.
          const constrained = next.gapCut > 0 ? false : (predicted ?? (prev.scale < 1 ? false : prev.constrained));
          return Math.abs(next.scale - prev.scale) < 0.01 &&
            Math.abs(next.gapCut - prev.gapCut) < 0.1 &&
            next.scrolls === prev.scrolls &&
            constrained === prev.constrained &&
            Math.abs(room - prev.room) < 1 &&
            Math.abs(offset - prev.offset) < 1 &&
            Math.abs(fieldShift - prev.fieldShift) < 0.5 &&
            Math.abs(fieldShiftHeld - prev.fieldShiftHeld) < 0.5
            ? prev
            : { ...next, offset, room, constrained, fieldShift, fieldShiftHeld };
        });
      });
    };
    measure();
    // The fixed bottom controls fade in after the loader and on arrival: measure again once they are in place.
    const late = [setTimeout(measure, 1000), setTimeout(measure, 3000)];
    const observer = new ResizeObserver(measure);
    observer.observe(col);
    observer.observe(box);
    for (const el of box.querySelectorAll('.spectrum-fund > div > *, [data-open-measure], .spectrum-title'))
      observer.observe(el);
    // After a resize the fixed bottom controls settle a moment later than the window: measure again then too.
    let afterResize: ReturnType<typeof setTimeout>[] = [];
    const onResize = () => {
      measure();
      afterResize.forEach(clearTimeout);
      afterResize = [setTimeout(measure, 400), setTimeout(measure, 1200)];
    };
    window.addEventListener('resize', onResize);
    void document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      late.forEach(clearTimeout);
      observer.disconnect();
      afterResize.forEach(clearTimeout);
      window.removeEventListener('resize', onResize);
    };
  }, [column, content, active]);

  return fit;
}

function DeckSpectrum() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [active, setActive] = useState<boolean>(false);
  const [imageIdx, setImageIdx] = useState(1);

  const { spectrumData, executeSpectrumRoute, updateUrlAndExecute, routeConfigs } = useSpectrumData();
  const logosWanted = useLogosWanted();
  const columnRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fit = useFitScale(columnRef, contentRef, active);
  // Scale 1: nothing changes (the owner's picture). Otherwise the composition is zoomed to fit the band between the
  // header and the bottom controls, or at the floor scrolls inside that band; the column itself never scrolls then.
  const scaled = fit.scale < 1 || fit.constrained;
  const contentStyle: CSSProperties | undefined = scaled
    ? {
        zoom: fit.scale,
        flex: 'none',
        height: fit.room / fit.scale,
        marginTop: fit.offset / fit.scale,
        overflowY: fit.scrolls ? 'auto' : 'hidden',
      }
    : fit.gapCut > 0
      ? ({ '--paper-row-cut': `${fit.gapCut}px` } as CSSProperties)
      : undefined;
  const initiativeItems = spectrumData.slice(0, 3);
  const publicationItem = spectrumData[3];
  const sponsorItem = spectrumData[spectrumData.length - 1];

  const selectInitiative = (index: number) => {
    setImageIdx(index + 1);
  };
  const reduceMotion = useReducedMotionPref();
  const bandTransition = reduceMotion ? MOTION.instant : { duration: DURATION.base, ease: EASE.out };

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
      {/* The laptop deck, one layout at every width it gets (the owner's rule of 2026-11-18: two versions, phone and
          laptop; a tablet on its side is a laptop window of that width): the original's padding, title gap and block
          spacing, scaled with the window through the layout unit. The composition is fitted between the site header and
          the fixed bottom controls (useFitScale). */}
      <div
        ref={columnRef}
        className={cn(
          // The column never scrolls (one wheel notch is one section): the composition is fitted to its band below, and
          // at the scale floor it scrolls inside that band. (The particle canvas reached past the column's end and made
          // it scroll by 10 to 20 px on short windows.)
          'relative flex h-[100svh] flex-col overflow-clip px-10 pb-20 pt-28 xl:px-20',
          // The title stays clear of the site header where the header is taller than the original's top space (a
          // header in two rows on a narrow laptop window); elsewhere 7 units, the original's, is the larger and wins.
          'pt-[max(7rem,calc(var(--site-header-h,0px)+1rem))]',
          // A wide, short window: the bands close up (below) and end clear of the bottom controls.
          'wideShort:!pb-24',
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_51%_52%,rgba(138,168,181,0.07),transparent_30%),linear-gradient(125deg,rgba(117,11,19,0.12),transparent_22%)]" />
        {/* The composition (title and the three bands), scaled to fit when the window is too short for it OPEN. */}
        <div ref={contentRef} className="relative flex min-h-0 flex-1 flex-col" style={contentStyle}>
          <div className="spectrum-title relative z-10 pb-5 text-center wideShort:!pb-2">
            <h2 className="font-title text-[2.75rem]/none uppercase text-white">Spectrum</h2>
          </div>
          <div id="spectrum-particle-gl" className="pointer-events-none opacity-30">
            {/* At scale 1 the field keeps the owner's place, the middle of the whole column (fieldShift, or
                fieldShiftHeld where the box is held to the band);
                scaled, it is placed in and scaled with the composition, so it keeps its place relative to the lists. */}
            <div
              id="spectrum-particle-container"
              className={cn('particle-container', { active })}
              style={
                fit.scale < 1 ? undefined : { top: `calc(50% + ${fit.constrained ? fit.fieldShiftHeld : fit.fieldShift}px)` }
              }
            ></div>
          </div>
          <div className="spectrum-fund relative z-10 mx-auto mt-2 flex w-full max-w-[1400px] flex-1 flex-col py-3 wideShort:!py-1">
            <div className="flex flex-1 flex-col justify-evenly gap-6 wideShort:!gap-3">
              <motion.div layout="position" transition={bandTransition} className="w-full">
                <SpectrumInitiatives
                  items={initiativeItems}
                  onSelect={selectInitiative}
                  executeSpectrumRoute={executeSpectrumRoute}
                  updateUrlAndExecute={updateUrlAndExecute}
                  routeConfigs={routeConfigs}
                />
              </motion.div>
              {/* The three bands glide to their new places when the papers open or close, instead of jumping. */}
              <motion.div
                layout="position"
                transition={bandTransition}
                className="w-full border-t border-white/15 pt-5 wideShort:pt-3"
              >
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
              </motion.div>
              <motion.div layout="position" transition={bandTransition} className="w-full pb-4 wideShort:pb-0">
                <SpectrumInitiatives
                  items={[publicationItem]}
                  layout="publications"
                  onSelect={() => selectInitiative(3)}
                  executeSpectrumRoute={executeSpectrumRoute}
                  updateUrlAndExecute={updateUrlAndExecute}
                  routeConfigs={routeConfigs}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneSpectrum() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotionPref();
  const { spectrumMainItems, spectrumSponsorItem, executeSpectrumRoute, updateUrlAndExecute, routeConfigs } = useSpectrumData();
  const pages = useMemo(() => spectrumPhonePages(spectrumSponsorItem.links.length), [spectrumSponsorItem.links.length]);
  const totalPages = pages.length;
  const active = currentPage.id === PAGE_ID;
  const page = pages[pageIndex] ?? pages[0];

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
          imageIdx={page.kind === 'sponsors' ? 5 : page.items[0] + 1}
          activeAnim={!reduceMotion}
          id="spectrum-particle-container-mobile-pages"
          getSourceImgInfos={spectrumGetSourceImgInfos}
        />
      )}
      {/* The title starts below the phone header's box (84 px). A phone in landscape (compact height): a tighter bottom
          and title margin, so an initiative and its links fit between the
          title and the section arrows. */}
      {/* overflow: clip, not hidden: a clipped frame cannot be scrolled, so focusing the papers' "more" (which
          reaches into the padding) never shifts the page sideways. */}
      <div className="relative flex h-[100svh] flex-col overflow-clip px-5 pb-24 pt-[5.5rem] shortScreen:pb-[4.5rem]">
        <h2 className="mb-6 shrink-0 text-center font-title text-[1.625rem]/[1.875rem] font-bold uppercase shortScreen:mb-1">
          Spectrum
        </h2>
        <div
          id="spectrum-particle-container-mobile-pages"
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 [&_canvas]:absolute [&_canvas]:left-1/2 [&_canvas]:top-1/2 [&_canvas]:-translate-x-1/2 [&_canvas]:-translate-y-1/2 [&_canvas]:scale-[0.56]"
          aria-hidden="true"
        />
        <div className="relative min-h-0 flex-1 overflow-clip">
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
              {page.kind === 'sponsors' ? (
                <MobileSpectrumSponsorPage
                  sponsorItem={{ ...spectrumSponsorItem, links: spectrumSponsorItem.links.slice(page.from, page.to) }}
                  executeSpectrumRoute={executeSpectrumRoute}
                  updateUrlAndExecute={updateUrlAndExecute}
                  routeConfigs={routeConfigs}
                  className="!mt-0 !px-0"
                />
              ) : (
                <SpectrumInitiatives
                  items={page.items.map((index) => spectrumMainItems[index])}
                  label={page.items.includes(PAPERS_GROUP) ? 'Spectrum publications' : undefined}
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
          className="mt-3 shrink-0 text-center font-display text-xs tabular-nums text-white/60"
        >
          <span className="sr-only">Spectrum page </span>
          {pageIndex + 1} / {totalPages}
        </p>
      </div>
    </div>
  );
}

export default memo(Spectrum);
