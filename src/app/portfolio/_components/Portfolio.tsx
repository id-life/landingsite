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
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { portfolio, PortfolioItemInfo } from './portfolioData';
import PortfolioItem from './PortfolioItem';

SwiperType.use([FreeMode]);

function Portfolio() {
  const isMounted = useIsMounted();
  const [active, setActive] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [imageIdx, setImageIdx] = useState(0);
  const showParticle = useMemo(() => active, [active]);
  const globalLoaded = useAtomValue(globalLoadedAtom);

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
  }, [globalLoaded]);

  useGSAP(
    () => {
      if (!portfolioRefs.current.length) return;

      let isMouseInFundArea = false;
      const wrapper = wrapperRef.current?.querySelector('.page2-fund');

      // 创建节流后的setImageIdx函数
      const throttledSetImageIdx = throttle((index: number) => {
        setImageIdx(index);
      }, 200);

      // 添加整个基金区域的鼠标事件监听
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

  return (
    <div ref={wrapperRef} id={NAV_LIST[1].id} className="page-container text-white">
      {active && <ParticleGL activeAnim={showParticle} imageIdx={imageIdx} id="particle-container" />}
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <div id="particle-gl">
          <div id="particle-container" className={cn({ active })}>
            <div className="particle-mask"></div>
          </div>
        </div>
        <div className="page2-title font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-xl/7.5">Portfolio</div>
        <div className="page2-fund my-12 overflow-hidden px-18 mobile:mt-0 mobile:gap-0 mobile:px-0">
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
        </div>
        <div className="page2-contact">
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default memo(Portfolio);
