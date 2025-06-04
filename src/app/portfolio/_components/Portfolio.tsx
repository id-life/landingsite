import { currentPageAtom } from '@/atoms';
import ParticleGL from '@/components/gl/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useScrollTriggerAction } from '@/hooks/anim/useScrollTriggerAction';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { memo, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { portfolio, portfolioGetSourceImgInfos, PortfolioItemInfo } from './portfolioData';
import PortfolioItem from './PortfolioItem';

// register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

SwiperType.use([FreeMode]);

function Portfolio() {
  const [active, setActive] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [imageIdx, setImageIdx] = useState(0);
  const currentPage = useAtomValue(currentPageAtom);

  const { setEnableJudge: setEnableUpJudge, enableJudge: enableUpJudge } = useScrollTriggerAction({
    // profile auto scroll to engagement
    triggerId: 'portfolio-trigger',
    scrollFn: () => {
      if (!enableUpJudge || currentPage.id !== NAV_LIST[1].id) return;
      gsap.to(window, { duration: 2, scrollTo: { y: `#${NAV_LIST[0].id}` } });
    },
    isUp: true,
  });
  const { setEnableJudge: setEnableDownJudge, enableJudge } = useScrollTriggerAction({
    // profile auto scroll to engagement
    triggerId: 'portfolio-trigger',
    scrollFn: () => {
      if (!enableJudge || currentPage.id !== NAV_LIST[1].id || window.isNavScrolling) return;
      const st = ScrollTrigger.getById('spectrum-trigger');
      if (!st) return;
      gsap.to(window, { duration: 1.5, scrollTo: { y: st.start + (st.end - st.start) * 0.4 } });
    },
    isUp: false,
  });

  const { trackEvent } = useGA();

  const handleFundClick = (item: PortfolioItemInfo) => {
    trackEvent({
      name: GA_EVENT_NAMES.PORTFOLIO_VIEW,
      label: item.title,
    });
    if (!item.link) return;
    window.open(item.link, '_blank');
  };

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
    tl.add(() => {
      setEnableUpJudge(true);
    });
    tl.from('.page2-title', {
      delay: 0.5,
      y: (_, target) => target.offsetHeight,
      rotateX: 45,
      rotateY: 15,
      opacity: 0,
    });
    tl.from('.page2-fund', { y: (_, target) => target.offsetHeight / 3, rotateX: 45, rotateY: 15, opacity: 0 });
    tl.from('.page2-contact', { y: (_, target) => target.offsetHeight / 2, rotateX: 45, rotateY: 15, opacity: 0 });
    // tl.to('.page2-title', {
    //   delay: 0.5,
    //   y: (_, target) => -target.offsetHeight,
    //   rotateX: -45,
    //   rotateY: 15,
    //   opacity: 0,
    // });
    // tl.to('.page2-fund', {
    //   y: (_, target) => -target.offsetHeight / 3, rotateX: -45, rotateY: 15, opacity: 0 });
    // tl.to('.page2-contact',
    //   { y: (_, target) => -target.offsetHeight / 2, rotateX: -45, rotateY: 15, opacity: 0 });
    // tl.to('#particle-gl', { opacity: 0 });
    // tl.to('.fixed-top', { opacity: 0 });
    // tl.to('.fixed-bottom', { opacity: 0 }, '<');
    // set the flag after the entire animation is finished
    tl.add(() => {
      setEnableDownJudge(true);
    });
  }, []);

  useGSAP(
    () => {
      if (!portfolioRefs.current.length) return;

      let isMouseInFundArea = false;
      const wrapper = wrapperRef.current?.querySelector('.page2-fund');

      // create a throttled setImageIdx function
      const throttledSetImageIdx = throttle((index: number) => {
        setImageIdx(index);
      }, 200);

      // add mouse event listeners for the entire fund area
      wrapper?.addEventListener('mouseenter', () => {
        isMouseInFundArea = true;
      });

      wrapper?.addEventListener('mouseleave', () => {
        isMouseInFundArea = false;
        throttledSetImageIdx(0);
      });

      portfolioRefs.current.forEach((div, idx) => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });
        tl.to(div, { scale: 1.1 });
        const title = div.querySelector('.fund-title');
        const selected = title?.querySelectorAll('img');
        const desc = div.querySelector('.fund-desc');
        const subtitle = div.querySelector('.fund-subtitle');
        if (title) {
          tl.to(title, { fontSize: '26px', fontWeight: 600, lineHeight: '30px' });
        }
        if (selected) {
          tl.to(selected, { opacity: 1 });
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
          // reset the image index only when the mouse actually leaves the entire fund area
          if (!isMouseInFundArea) {
            throttledSetImageIdx(0);
          }
        });
      });
    },
    { scope: wrapperRef, dependencies: [] },
  );

  return (
    <div ref={wrapperRef} id={NAV_LIST[1].id} className="page-container text-white">
      <ParticleGL
        activeAnim={active}
        imageIdx={imageIdx}
        id="particle-container"
        getSourceImgInfos={portfolioGetSourceImgInfos}
      />
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <div id="particle-gl">
          <div id="particle-container" className={cn('particle-container', { active })}>
            <div className="particle-mask"></div>
          </div>
        </div>
        <div className="page2-title font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase">Portfolio</div>
        <div className="page2-fund mb-2.5 mt-12 overflow-hidden px-18">
          <div className="grid grid-cols-5">
            {portfolio.map((item, index) => (
              <PortfolioItem
                key={item.title}
                item={item}
                className="w-76"
                onClick={() => handleFundClick(item)}
                ref={(element) => {
                  if (!element) return;
                  portfolioRefs.current[index] = element;
                }}
              />
            ))}
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
