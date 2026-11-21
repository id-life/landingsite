import {
  currentPageAtom,
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  mobileCurrentPageAtom,
} from '@/atoms';
import { activeAnimAtom, imageIdxAtom } from '@/atoms/portfolio';
import Toast from '@/components/common/Toast';
import ParticleGL from '@/components/gl/particle/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { usePortfolioItemAnimation } from '@/hooks/anim/usePortfolioItemAnimation';
import { useRetimer } from '@/hooks/useRetimer';
import { keptStartPage, useKeptInnerPage } from '@/hooks/useKeptInnerPage';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { beats, DISTANCE, DURATION, EASE, MAX_TILT } from '@/motion/tokens';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PORTFOLIO_PHONE_FIRST_PAGE, portfolio, portfolioGetSourceImgInfos } from './portfolioData';
import PortfolioItem from './PortfolioItem';

const PAGE_ID = 'portfolio_page';
// The desktop deck: the first row's company count.
const FIRST_ROW_COUNT = 8;
// The paged deck: the companies on its first and second inner pages.
const FIRST_PAGE_COUNT = PORTFOLIO_PHONE_FIRST_PAGE;
const SECOND_PAGE_COUNT = 6;
const portfolioNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

/**
 * The Portfolio section, one component for both decks (RWD-02; it was Portfolio and MobilePortfolio). Both show the
 * same companies (portfolioData) as PortfolioItem tiles with the Contact pill under them. What differs is real and is
 * the `deck` property, so each deck keeps its own body below (their hooks differ, and hooks cannot be chosen by a
 * property inside one body):
 * - motion: the desktop deck is a continuous deck, so the section is pinned and its entrance is scrubbed by the scroll
 *   (ScrollTrigger); the paged deck plays the entrance and exit when the section becomes or stops being the current
 *   page, and steps between inner pages (PAGE_STEP) through the inner-page atoms the SectionPager drives;
 * - layout: two rows of eight on the desktop deck (at every laptop width, scaled); inner pages of six, six and the rest in
 *   two columns on the paged deck (one row of tiles on a short window);
 * - particles: one field behind the whole grid on the desktop deck, showing the company under the mouse; one field per
 *   tile on the paged deck;
 * - the copy confirmation: the paged deck shows a Toast when the address is copied.
 */
function Portfolio({ deck }: { deck: 'desktop' | 'phone' }) {
  return deck === 'phone' ? <PhonePortfolio /> : <DesktopPortfolio />;
}

export default memo(Portfolio);

const ParticleGLWrapper = () => {
  const imageIdx = useAtomValue(imageIdxAtom);
  const activeAnim = useAtomValue(activeAnimAtom);
  return (
    <ParticleGL
      activeAnim={activeAnim}
      imageIdx={imageIdx}
      id="particle-container"
      getSourceImgInfos={portfolioGetSourceImgInfos}
    />
  );
};

const ParticleGLContainer = () => {
  const activeAnim = useAtomValue(activeAnimAtom);
  return (
    <div id="particle-gl">
      <div id="particle-container" className={cn('particle-container', { active: activeAnim })}>
        <div className="particle-mask"></div>
      </div>
    </div>
  );
};

function DesktopPortfolio() {
  const setActiveAnim = useSetAtom(activeAnimAtom);
  const setImageIdx = useSetAtom(imageIdxAtom);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);

  // 使用新的 Portfolio 动画 Hook
  usePortfolioItemAnimation(wrapperRef, portfolioRefs, setImageIdx);

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
        id: 'portfolio-trigger', // add an ID for later reference
        onEnter: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(portfolioNavItem);
          setActiveAnim(true);
        },
        onEnterBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(portfolioNavItem);
          setActiveAnim(true);
        },
        onLeaveBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(NAV_LIST[0]);
          setActiveAnim(false);
        },
      },
    });
    tl.to('#vision-canvas', { zIndex: -1, opacity: 0, duration: beats(2) });
    // Entrances rise 16-24 px with a tilt of at most 8 degrees (MOT-08; they tilted 45 and 15 degrees).
    tl.fromTo(
      '.page2-title',
      { y: DISTANCE.md, rotateX: MAX_TILT, rotateY: MAX_TILT / 2, opacity: 0 },
      { delay: beats(0.5), y: 0, rotateX: 0, rotateY: 0, opacity: 1 },
    );
    tl.fromTo(
      '.page2-fund',
      { y: DISTANCE.sm, rotateX: MAX_TILT, rotateY: MAX_TILT / 2, opacity: 0 },
      { y: 0, rotateX: 0, rotateY: 0, opacity: 1 },
    );
    tl.fromTo(
      '.page2-contact',
      { y: DISTANCE.sm, rotateX: MAX_TILT, rotateY: MAX_TILT / 2, opacity: 0 },
      { y: 0, rotateX: 0, rotateY: 0, opacity: 1 },
    );
    // Every arrival lands here (MOT-01): the entrance complete, contact fully shown. A short hold follows, so the
    // rest pose sits inside the pin rather than on its last pixel.
    tl.addLabel('rest');
    tl.to({}, { duration: beats(0.25) });
  }, []);

  const portfolioItems = useMemo(() => {
    const items = portfolio.map((item, index) => (
      <PortfolioItem
        key={item.title}
        item={item}
        className="w-full min-w-0"
        ref={(element) => {
          if (!element) return;
          portfolioRefs.current[index] = element;
        }}
      />
    ));

    const firstRow = items.slice(0, FIRST_ROW_COUNT);
    const secondRow = items.slice(FIRST_ROW_COUNT);

    return { firstRow, secondRow };
  }, []);

  return (
    <div ref={wrapperRef} id={PAGE_ID} className="page-container text-white">
      <ParticleGLWrapper />
      {/* On short windows the column is centred in the space under the header, which publishes its height (a
          1366x641 or 1280x720 laptop put the heading under the two-row header). */}
      <div className="relative flex h-[100svh] flex-col items-center justify-center [@media(max-height:760px)]:pt-[var(--site-header-h,0px)]">
        <ParticleGLContainer />
        <h2 className="page2-title font-title text-[2.5rem]/[4.5rem] font-bold uppercase">Portfolio</h2>
        <div className="page2-fund mb-2.5 mt-12 w-full max-w-[152rem] px-12 [@media(max-height:760px)]:mt-6">
          <div className="flex flex-col gap-8 [@media(max-height:760px)]:gap-4">
            {/* Eight columns, as on the original at every laptop width (two versions only, RWD-02). */}
            <div className="grid grid-cols-8 justify-items-center gap-y-8">{portfolioItems.firstRow}</div>
            <div className="grid grid-cols-8 justify-items-center gap-y-8">{portfolioItems.secondRow}</div>
          </div>
        </div>
        {/* On short windows the column reaches the bottom of the window, where the section arrows sit at its centre:
            there the contact pill moves to the right of them instead of under them. */}
        <div className="page2-contact [@media(max-height:760px)]:relative [@media(max-height:760px)]:left-[140px]">
          <Contact />
        </div>
      </div>
    </div>
  );
}

function PhonePortfolio() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const [innerPageIndex, setInnerPageIndex] = useAtom(innerPageIndexAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [particleActive, setParticleActive] = useState(false);
  const retimer = useRetimer();

  const pageItemIndices = useMemo(() => {
    const allIndices = portfolio.map((_, index) => index);
    const firstPage = allIndices.slice(0, FIRST_PAGE_COUNT);
    const secondPage = allIndices.slice(FIRST_PAGE_COUNT, FIRST_PAGE_COUNT + SECOND_PAGE_COUNT);
    const thirdPage = allIndices.slice(FIRST_PAGE_COUNT + SECOND_PAGE_COUNT);
    return [firstPage, secondPage, thirdPage].filter((indices) => indices.length > 0);
  }, []);

  const pageItems = useMemo(() => {
    return pageItemIndices.map((indices) => indices.map((index) => portfolio[index]));
  }, [pageItemIndices]);

  const totalPages = pageItems.length;
  const currentItems = pageItems[innerPageIndex] ?? [];
  const currentGridRows = currentItems.length > 4 ? 'grid-rows-3' : 'grid-rows-2';

  // Calculate particle indices for all grid cells on current page
  const getParticleIndices = () => {
    const currentPageIndices = pageItemIndices[innerPageIndex] ?? [];
    return currentPageIndices.map((index) => index + 1);
  };
  const particleIndices = getParticleIndices();

  // Get opacity for each particle based on config
  const particleConfigs = useMemo(() => portfolioGetSourceImgInfos(true), []);
  const getParticleOpacity = (idx: number) => particleConfigs[particleIndices[idx]]?.opacity ?? 0.5;

  const handleCopy = useCallback(() => {
    setShowToast(true);
    retimer(setTimeout(() => setShowToast(false), 3000));
  }, [retimer]);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const createEnterAnimation = useCallback(() => {
    if (!wrapperRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.fromTo(wrapperRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: DURATION.camera, ease: EASE.out });

    tl.fromTo(
      '.page2-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.section, ease: EASE.out },
      `<${DURATION.moderate}`,
    );

    tl.fromTo(
      '.page2-fund',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.section, ease: EASE.out },
      `<${DURATION.fast}`,
    );

    tl.fromTo(
      '.page2-contact',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.section, ease: EASE.out },
      `<${DURATION.fast}`,
    );

    return tl;
  }, []);

  const createExitAnimation = useCallback(() => {
    if (!wrapperRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.to(wrapperRef.current, {
      opacity: 0,
      y: -50,
      duration: DURATION.section,
      ease: EASE.inOut,
    });

    return tl;
  }, []);

  useKeptInnerPage(PAGE_ID, currentPage.id === PAGE_ID, totalPages);

  // Handle inner page navigation
  useEffect(() => {
    if (innerPageNavigateTo === null || currentPage.id !== PAGE_ID) return;
    setInnerPageIndex(innerPageNavigateTo);
    setInnerPageNavigateTo(null);
  }, [innerPageNavigateTo, currentPage.id, setInnerPageNavigateTo, setInnerPageIndex]);

  // Page enter/exit animations and reset state
  useEffect(() => {
    if (currentPage.id === PAGE_ID) {
      setParticleActive(true);
      // The first page, or the page this history entry kept when Back, Forward or a reload brought it back (NAV-02).
      setInnerPageIndex(keptStartPage(PAGE_ID, totalPages));
      setInnerPageTotal(totalPages);
      createEnterAnimation();
    } else {
      setParticleActive(false);
      createExitAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  return (
    <div
      ref={wrapperRef}
      id={PAGE_ID}
      className={cn('page-container-mobile text-white', {
        hidden: currentPage?.id !== PAGE_ID,
      })}
    >
      {/* Render ParticleGL instances for each grid cell */}
      {particleIndices.map((imageIdx, i) => (
        <ParticleGL
          key={`particle-gl-${i}`}
          imageIdx={imageIdx}
          activeAnim={particleActive}
          id={`particle-container-mobile-${i + 1}`}
          getSourceImgInfos={portfolioGetSourceImgInfos}
        />
      ))}
      {/* A short window (a phone in landscape, under 480 px of height) has room for one row of tiles: each page's
          companies sit side by side there, instead of three rows printed over each other. The columns take the whole
          width there (8 px edges, no padding of their own; only the logos keep a gap), so the longest word of a name,
          "Biotechnologies", stays inside its column at 667 px. */}
      <div className="relative flex h-[100svh] flex-col items-center pb-20 pt-21 shortScreen:pb-16 shortScreen:pt-[68px]">
        <h2 className="page2-title relative top-10 font-title text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-[1.625rem]/7.5 shortScreen:top-0">
          Portfolio
        </h2>
        <div className="page2-fund relative top-10 flex-1 overflow-hidden px-4 mobile:w-full shortScreen:top-0">
          {/* Background layer: particle grid - absolute positioned behind portfolio items */}
          <div
            id="particle-gl"
            className={cn(
              'particle-gl-mobile-bg absolute inset-x-0 bottom-12 top-2 grid grid-cols-2 px-4 shortScreen:px-2',
              currentGridRows,
              // Inner pages of four tiles sit in a narrower band, where the window has the height for it: under 700 px tall the
              // band would be shorter than two rows of tiles and the second row was drawn over the first (375x667).
              innerPageIndex >= 1 && currentGridRows === 'grid-rows-2' && 'py-24 [@media(max-height:699.98px)]:py-0',
              'shortScreen:auto-cols-fr shortScreen:grid-flow-col shortScreen:grid-cols-none shortScreen:grid-rows-1 shortScreen:py-0',
            )}
            data-layout={currentGridRows === 'grid-rows-3' ? '2x3' : '2x2'}
          >
            {Array.from({ length: currentItems.length }).map((_, i) => (
              <div
                key={`container-${i}`}
                id={`particle-container-mobile-${i + 1}`}
                className={cn('particle-container-grid-cell', {
                  active: particleActive && i < particleIndices.length,
                })}
                style={particleActive && i < particleIndices.length ? { opacity: getParticleOpacity(i) } : undefined}
              >
                <div className="particle-mask"></div>
              </div>
            ))}
          </div>
          {/* Foreground layer: paginated portfolio items grid */}
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <div
              key={pageIdx}
              className={cn(
                // The phone inner-page step (MOT-08): the same 0.25 s ease-out as Spectrum's pages.
                'absolute inset-x-0 bottom-12 top-2 grid grid-cols-2 gap-0 px-4 transition-all duration-page ease-token-out shortScreen:px-2',
                pageItems[pageIdx].length > 4 ? 'grid-rows-3' : 'grid-rows-2',
                pageIdx >= 1 && pageItems[pageIdx].length <= 4 && 'py-32 [@media(max-height:699.98px)]:py-0',
                'shortScreen:auto-cols-fr shortScreen:grid-flow-col shortScreen:grid-cols-none shortScreen:grid-rows-1 shortScreen:py-0',
                innerPageIndex === pageIdx
                  ? 'translate-y-0 opacity-100'
                  : innerPageIndex > pageIdx
                    ? '-translate-y-full opacity-0'
                    : 'translate-y-full opacity-0',
              )}
            >
              {pageItems[pageIdx].map((item) => (
                <PortfolioItem key={item.title} item={item} isGridMode />
              ))}
            </div>
          ))}
        </div>
        <div className="page2-contact fixed bottom-6 left-5 z-10">
          <Contact onCopy={handleCopy} />
        </div>
      </div>
      <Toast visible={showToast} message="Copied successfully" />
    </div>
  );
}
