import { innerPageIndexAtom, innerPageNavigateToAtom, innerPageTotalAtom, mobileCurrentPageAtom } from '@/atoms';
import ParticleGL from '@/components/gl/particle/ParticleGL';
import Contact from '@/components/portfolio/Contact';
import Toast from '@/components/common/Toast';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { portfolio, portfolioGetSourceImgInfos, PortfolioItemInfo } from './portfolioData';
import PortfolioItem from './PortfolioItem';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useRetimer } from '@/hooks/useRetimer';
import { useWindowResize } from '@/hooks/useWindowResize';

const PAGE_ID = 'portfolio_page';
const HEIGHT_THRESHOLD = 700;

function MobilePortfolio() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const [innerPageIndex, setInnerPageIndex] = useAtom(innerPageIndexAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [particleActive, setParticleActive] = useState(false);

  const { trackEvent } = useGA();
  const retimer = useRetimer();

  // Calculate items per page based on screen height
  const checkHeight = useCallback(() => {
    setItemsPerPage(window.innerHeight > HEIGHT_THRESHOLD ? 6 : 4);
  }, []);

  useWindowResize(checkHeight);

  const totalPages = Math.ceil(portfolio.length / itemsPerPage);

  // Calculate particle indices for all grid cells on current page
  const getParticleIndices = () => {
    const base = innerPageIndex * itemsPerPage;
    const itemCount = Math.min(itemsPerPage, portfolio.length - base);
    return Array.from({ length: itemCount }, (_, i) => base + i + 1);
  };
  const particleIndices = getParticleIndices();

  // Get opacity for each particle based on config
  const particleConfigs = useMemo(() => portfolioGetSourceImgInfos(true), []);
  const getParticleOpacity = (idx: number) => particleConfigs[particleIndices[idx]]?.opacity ?? 0.5;

  const handleFundClick = useCallback(
    (item: PortfolioItemInfo) => {
      trackEvent({
        name: GA_EVENT_NAMES.PORTFOLIO_VIEW,
        label: item.title,
      });
      if (!item.link) return;
      window.open(item.link, '_blank');
    },
    [trackEvent],
  );

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

    tl.fromTo(wrapperRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });

    tl.fromTo('.page2-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    tl.fromTo('.page2-fund', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    tl.fromTo('.page2-contact', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

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
      duration: 0.8,
      ease: 'power2.inOut',
    });

    return tl;
  }, []);

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
      setInnerPageIndex(0);
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
      <div className="relative flex h-[100svh] flex-col items-center pb-20 pt-21">
        <div className="page2-title font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-[1.625rem]/7.5">
          Portfolio
        </div>
        <div className="page2-fund relative flex-1 overflow-hidden px-4 mobile:mt-2 mobile:w-full">
          {/* Background layer: particle grid - absolute positioned behind portfolio items */}
          <div
            id="particle-gl"
            className={cn(
              'particle-gl-mobile-bg absolute inset-0 grid grid-cols-2 px-4',
              itemsPerPage === 6 ? 'grid-rows-3' : 'grid-rows-2',
            )}
            data-layout={itemsPerPage === 6 ? '2x3' : '2x2'}
          >
            {Array.from({ length: itemsPerPage }).map((_, i) => (
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
                'absolute inset-0 grid grid-cols-2 gap-0 px-4 transition-all duration-500 ease-in-out',
                itemsPerPage === 6 ? 'grid-rows-3' : 'grid-rows-2',
                innerPageIndex === pageIdx
                  ? 'translate-y-0 opacity-100'
                  : innerPageIndex > pageIdx
                    ? '-translate-y-full opacity-0'
                    : 'translate-y-full opacity-0',
              )}
            >
              {portfolio.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).map((item) => (
                <PortfolioItem key={item.title} item={item} onItemClick={handleFundClick} isGridMode />
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

export default memo(MobilePortfolio);
