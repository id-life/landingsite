import { currentPageAtom } from '@/atoms';
import { activeAnimAtom, imageIdxAtom } from '@/atoms/portfolio';
import ParticleGL from '@/components/gl/particle/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { usePortfolioItemAnimation } from '@/hooks/anim/usePortfolioItemAnimation';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { cn } from '@/utils';
import { beats, DISTANCE, MAX_TILT } from '@/motion/tokens';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, useMemo, useRef } from 'react';
import { portfolio, portfolioGetSourceImgInfos } from './portfolioData';
import PortfolioItem from './PortfolioItem';

const PAGE_ID = 'portfolio_page';
const FIRST_ROW_COUNT = 8;
const portfolioNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

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

function Portfolio() {
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
            {/* Eight columns from 840 px; four on a medium (portrait tablet) window, so names and one-liners at their
                role sizes are not squeezed into 90 px columns (RWD-01, RWD-02). */}
            <div className="grid grid-cols-8 justify-items-center gap-y-8 medium:grid-cols-4">{portfolioItems.firstRow}</div>
            <div className="grid grid-cols-8 justify-items-center gap-y-8 medium:grid-cols-4">{portfolioItems.secondRow}</div>
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

export default memo(Portfolio);
