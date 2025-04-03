import { currentPageAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import ParticleGL from '@/components/gl/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { portfolio, PortfolioItemInfo } from './portfolioData';
import PortfolioItem from './PortfolioItem';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTriggerAction } from '@/hooks/anim/useScrollTriggerAction';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

SwiperType.use([FreeMode]);

function Portfolio() {
  const [active, setActive] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [imageIdx, setImageIdx] = useState(0);
  const showParticle = useMemo(() => active, [active]);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const currentPage = useAtomValue(currentPageAtom);
  const { setEnableJudge: setEnableDownJudge, enableJudge } = useScrollTriggerAction({
    triggerId: 'portfolio-trigger',
    scrollFn: () => {
      if (!enableJudge || currentPage.id !== NAV_LIST[1].id) return;
      console.log('Portfolio scrollFn down');
      const smoother = ScrollSmoother.get();
      smoother?.scrollTo(`#${NAV_LIST[2].id}`, false);
    },
    isUp: false,
  });

  const handleFundClick = useCallback((item: PortfolioItemInfo) => {
    if (!item.link) return;
    window.open(item.link, '_blank');
  }, []);

  useGSAP(() => {
    if (!globalLoaded) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[1].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        id: 'portfolio-trigger', // 添加ID以便后续引用
        onEnter: () => {
          setCurrentPage(NAV_LIST[1]);
          setActive(true);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[1]);
          setActive(true);
        },
        onLeaveBack: () => {
          setActive(false);
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
    tl.to('.page2-title', {
      delay: 0.5,
      y: (_, target) => -target.offsetHeight,
      rotateX: -45,
      rotateY: 15,
      opacity: 0,
    });
    tl.to('.page2-fund', { y: (_, target) => -target.offsetHeight / 3, rotateX: -45, rotateY: 15, opacity: 0 });
    tl.to('.page2-contact', { y: (_, target) => -target.offsetHeight / 2, rotateX: -45, rotateY: 15, opacity: 0 });
    tl.to('#particle-gl', { opacity: 0 });
    tl.to('.fixed-top', { opacity: 0 });
    tl.to('.fixed-bottom', { opacity: 0 }, '<');

    // 在整个动画完成后设置标志
    tl.add(() => {
      setEnableDownJudge(true);
    });
  }, [globalLoaded]);

  useGSAP(
    () => {
      if (!portfolioRefs.current.length) return;

      let isMouseInFundArea = false;
      const wrapper = wrapperRef.current?.querySelector(`.${PORTFOLIO.FUND_CLASS}`);

      // 添加整个基金区域的鼠标事件监听
      wrapper?.addEventListener('mouseenter', () => {
        isMouseInFundArea = true;
      });

      wrapper?.addEventListener('mouseleave', () => {
        isMouseInFundArea = false;
        throttledSetImageIdx(0);
      });

      portfolioRefs.current.forEach((div: HTMLDivElement, idx: number) => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });
        tl.to(div, { scale: 1.1 });
        const title = div.querySelector('.fund-title');
        const desc = div.querySelector('.fund-desc');
        const subtitle = div.querySelector('.fund-subtitle');
        if (title) {
          tl.to(title, { fontSize: '26px', fontWeight: 600, lineHeight: '30px', textDecoration: 'underline' });
        }
        if (desc) {
          tl.from(desc, { opacity: 0, translateY: '50%' }, '<50%');
        }
        if (subtitle) {
          tl.from(subtitle, { opacity: 0, translateY: '50%' }, '<50%');
        }
        div.addEventListener('mouseenter', () => {
          throttledSetImageIdx(idx + 1);
          tl.play();
        });
        div.addEventListener('mouseleave', () => {
          tl.reverse();
          // 只有当鼠标真正离开整个基金区域时才重置图片索引
          if (!isMouseInFundArea) {
            throttledSetImageIdx(0);
          }
        });
      });
    },
    { scope: wrapperRef, dependencies: [] },
  );

  return { wrapperRef, imageIdx };
};

// 提取GSAP动画逻辑
const usePortfolioAnimations = (
  isMounted: boolean,
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentPage: (page: (typeof NAV_LIST)[0]) => void,
) => {
  useGSAP(() => {
    if (!isMounted) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${PORTFOLIO.PORTFOLIO_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[1]);
          setActive(true);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[1]);
          setActive(true);
        },
        onLeaveBack: () => {
          setActive(false);
        },
      },
    });
    tl.to(`#${PORTFOLIO.VISION_CANVAS_ID}`, { zIndex: -1, opacity: 0, duration: 2 });
    tl.from(`.${PORTFOLIO.TITLE_CLASS}`, {
      delay: 0.5,
      y: (_, target) => target.offsetHeight,
      rotateX: 45,
      rotateY: 15,
      opacity: 0,
    });
    tl.from(`.${PORTFOLIO.FUND_CLASS}`, {
      y: (_, target) => target.offsetHeight / 3,
      rotateX: 45,
      rotateY: 15,
      opacity: 0,
    });
    tl.from(`.${PORTFOLIO.CONTACT_CLASS}`, {
      y: (_, target) => target.offsetHeight / 2,
      rotateX: 45,
      rotateY: 15,
      opacity: 0,
    });
    tl.to(`.${PORTFOLIO.TITLE_CLASS}`, {
      delay: 0.5,
      y: (_, target) => -target.offsetHeight,
      rotateX: -45,
      rotateY: 15,
      opacity: 0,
    });
    tl.to(`.${PORTFOLIO.FUND_CLASS}`, {
      y: (_, target) => -target.offsetHeight / 3,
      rotateX: -45,
      rotateY: 15,
      opacity: 0,
    });
    tl.to(`.${PORTFOLIO.CONTACT_CLASS}`, {
      y: (_, target) => -target.offsetHeight / 2,
      rotateX: -45,
      rotateY: 15,
      opacity: 0,
    });
    tl.to(`#${PORTFOLIO.PARTICLE_ID}`, { opacity: 0 });
    tl.to('.fixed-top', { top: 'calc(50% - 20rem)' });
    tl.to('.fixed-bottom', { top: 'calc(50% + 20rem)' }, '<');
  }, [isMounted]);
};

// 提取UI组件
interface PortfolioGridProps {
  portfolioRefs: React.MutableRefObject<HTMLDivElement[]>;
  handleFundClick: (item: PortfolioItemInfo) => void;
}

const PortfolioGrid = ({ portfolioRefs, handleFundClick }: PortfolioGridProps) => (
  <>
    <div className="grid grid-cols-4">
      {portfolio.slice(0, 4).map((item, index) => (
        <PortfolioItem
          key={item.title}
          item={item}
          onClick={() => handleFundClick(item)}
          ref={(element) => {
            if (!element) return;
            portfolioRefs.current[index] = element;
          }}
        />
      ))}
    </div>
    <div className="grid grid-cols-5">
      {portfolio.slice(4).map((item, index) => (
        <PortfolioItem
          key={item.title}
          item={item}
          onClick={() => handleFundClick(item)}
          ref={(element) => {
            if (!element) return;
            portfolioRefs.current[4 + index] = element;
          }}
        />
      ))}
    </div>
  </>
);

function Portfolio() {
  const isMounted = useIsMounted();
  const [active, setActive] = useState<boolean>(false);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const showParticle = useMemo(() => active, [active]);

  // 使用提取的hooks
  const { wrapperRef, imageIdx } = usePortfolioItemsInteraction(portfolioRefs);
  usePortfolioAnimations(isMounted, setActive, setCurrentPage);

  const handleFundClick = useCallback((item: PortfolioItemInfo) => {
    if (!item.link) return;
    window.open(item.link, '_blank');
  }, []);

  return (
    <div ref={wrapperRef} id={PORTFOLIO.PORTFOLIO_ID} className="page-container text-white">
      {active && <ParticleGL activeAnim={showParticle} imageIdx={imageIdx} id="particle-container" />}
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <div id={PORTFOLIO.PARTICLE_ID}>
          <div id="particle-container" className={cn({ active })}>
            <div className="particle-mask"></div>
          </div>
        </div>
        <div className={cn(PORTFOLIO.TITLE_CLASS, 'font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-xl/7.5')}>
          Portfolio
        </div>
        <div className={cn(PORTFOLIO.FUND_CLASS, 'my-12 overflow-hidden px-18 mobile:mt-0 mobile:gap-0 mobile:px-0')}>
          <PortfolioGrid portfolioRefs={portfolioRefs} handleFundClick={handleFundClick} />
        </div>
        <div className={PORTFOLIO.CONTACT_CLASS}>
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default memo(Portfolio);
