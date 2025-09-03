import { currentPageAtom } from '@/atoms';
import { activeAnimAtom, imageIdxAtom } from '@/atoms/portfolio';
import ParticleGL from '@/components/gl/particle/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { usePortfolioItemAnimation } from '@/hooks/anim/usePortfolioItemAnimation';
import { useScrollSmootherAction } from '@/hooks/anim/useScrollSmootherAction';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { portfolio, portfolioGetSourceImgInfos, PortfolioItemInfo } from './portfolioData';
import PortfolioItem from './PortfolioItem';

SwiperType.use([FreeMode]);

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

  const currentPage = useAtomValue(currentPageAtom);

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollSmootherAction({
    // profile auto scroll to vision
    scrollFn: () => {
      // console.log(
      //   '[DEBUG] [Portfolio] UP scrollFn called - enableUpJudge:',
      //   enableUpJudge,
      //   'isNavScrolling:',
      //   window.isNavScrolling,
      // );
      if (!enableUpJudge || window.isNavScrolling || window.isSmootherScrolling) return;
      // console.log('[DEBUG] [Portfolio] Starting auto-scroll to Vision');
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: 0 },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
        },
      });
    },
    isUp: true,
  });
  const { setEnableJudge: setEnableDownJudge, enableJudge: enableDownJudge } = useScrollSmootherAction({
    // profile auto scroll to engagement
    scrollFn: () => {
      // console.log(
      //   '[DEBUG] [Portfolio] DOWN scrollFn called - enableDownJudge:',
      //   enableDownJudge,
      //   'isNavScrolling:',
      //   window.isNavScrolling,
      // );
      if (!enableDownJudge || window.isNavScrolling || window.isSmootherScrolling) return;
      const st = ScrollTrigger.getById('spectrum-trigger');
      if (!st) {
        // console.log('[DEBUG] [Portfolio] spectrum-trigger not found');
        return;
      }
      // console.log('[DEBUG] [Portfolio] Starting auto-scroll to Spectrum');
      window.isNavScrolling = true;
      window.isSmootherScrolling = true;
      gsap.to(window, {
        duration: SCROLL_ANIMATION_CONFIG.DURATION.FAST / 1000,
        scrollTo: { y: st.start + (st.end - st.start) * 0.965 },
        onComplete: () => {
          window.isNavScrolling = false;
          window.isSmootherScrolling = false;
        },
        ease: SCROLL_ANIMATION_CONFIG.EASING.DEFAULT,
      });
    },
    isUp: false,
  });

  const { trackEvent } = useGA();

  // 使用新的 Portfolio 动画 Hook
  usePortfolioItemAnimation(wrapperRef, portfolioRefs, setImageIdx);

  const handleFundClick = useCallback(
    (item: PortfolioItemInfo) => () => {
      trackEvent({
        name: GA_EVENT_NAMES.PORTFOLIO_VIEW,
        label: item.title,
        landingsite_action: 'click',
      });
      if (!item.link) return;
      window.open(item.link, '_blank');
    },
    [trackEvent],
  );

  const handleMouseEnter = useCallback(
    (item: PortfolioItemInfo) => () =>
      trackEvent({
        name: GA_EVENT_NAMES.PORTFOLIO_VIEW,
        label: item.title,
        landingsite_action: 'hover',
      }),
    [trackEvent],
  );

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[1].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        id: 'portfolio-trigger', // add an ID for later reference
        onEnter: () => {
          setCurrentPage(NAV_LIST[1]);
          setActiveAnim(true);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[1]);
          setActiveAnim(true);
        },
        onLeaveBack: () => {
          setActiveAnim(false);
        },
      },
    });
    tl.to('#vision-canvas', { zIndex: -1, opacity: 0, duration: 2 });
    tl.from('.page2-title', {
      delay: 0.5,
      y: (_, target) => target.offsetHeight,
      rotateX: 45,
      rotateY: 15,
      opacity: 0,
    });
    tl.from('.page2-fund', { y: (_, target) => target.offsetHeight / 3, rotateX: 45, rotateY: 15, opacity: 0 });
    tl.from('.page2-contact', { y: (_, target) => target.offsetHeight / 2, rotateX: 45, rotateY: 15, opacity: 0 });
  }, []);

  useEffect(() => {
    if (currentPage.id === NAV_LIST[1].id) {
      console.log('portfolio setEnableUpJudge true');
      setEnableUpJudge(true);
      setEnableDownJudge(true);
    } else {
      setEnableUpJudge(false);
      setEnableDownJudge(false);
    }
  }, [currentPage, setEnableUpJudge, setEnableDownJudge]);

  const portfolioItems = useMemo(() => {
    const items = portfolio.map((item, index) => (
      <PortfolioItem
        key={item.title}
        item={item}
        className="w-76"
        onClick={handleFundClick(item)}
        onMouseEnter={handleMouseEnter(item)}
        ref={(element) => {
          if (!element) return;
          portfolioRefs.current[index] = element;
        }}
      />
    ));

    // Split items into two rows: first 6, then remaining
    const firstRow = items.slice(0, 6);
    const secondRow = items.slice(6);

    return { firstRow, secondRow };
  }, [handleFundClick, handleMouseEnter]);

  return (
    <div ref={wrapperRef} id={NAV_LIST[1].id} className="page-container text-white">
      <ParticleGLWrapper />
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <ParticleGLContainer />
        <div className="page2-title font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase">Portfolio</div>
        <div className="page2-fund mb-2.5 mt-12 overflow-hidden px-12">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-6 justify-items-center">{portfolioItems.firstRow}</div>
            <div className="grid grid-cols-5 justify-items-center">{portfolioItems.secondRow}</div>
          </div>
        </div>
        <div className="page2-contact">
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default memo(Portfolio);
