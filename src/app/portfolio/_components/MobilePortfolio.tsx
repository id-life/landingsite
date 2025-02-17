import {
  currentPageAtom,
  mobileCurrentPageAtom,
  mobilePortfolioPageIndexAtom,
  mobilePortfolioPageNavigateToAtom,
} from '@/atoms';
import ParticleGL from '@/components/gl/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { portfolio, PortfolioItemInfo } from './portfolioData';
import PortfolioItem from './PortfolioItem';
SwiperType.use([FreeMode]);

function MobilePortfolio() {
  const isMounted = useIsMounted();
  const [isEntered, setIsEntered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [mobileImageIdx1, setMobileImageIdx1] = useState(0);
  const [mobileImageIdx2, setMobileImageIdx2] = useState(0);
  const showParticle = useMemo(() => isEntered, [isEntered]);
  const swiperRef = useRef<SwiperType>();
  const setMobilePortfolioPageIndex = useSetAtom(mobilePortfolioPageIndexAtom);
  const [mobilePortfolioPageNavigateTo, setMobilePortfolioPageNavigateTo] = useAtom(mobilePortfolioPageNavigateToAtom);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const enableScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const disableScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const handleFundClick = useCallback((item: PortfolioItemInfo) => {
    if (!item.link) return;
    window.open(item.link, '_blank');
  }, []);

  const throttledSetIsEntered = useMemo(
    () =>
      throttle((value: boolean) => {
        setIsEntered(value);
      }, 50),
    [],
  );

  useGSAP(() => {
    if (!isMounted) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[1].id}`,
        start: 'top top',
        end: '+=200%',
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
        onUpdate: (self) => {
          if (self.progress >= 0.42 && self.progress <= 0.7) {
            throttledSetIsEntered(true);
          } else {
            throttledSetIsEntered(false);
          }
        },
      },
    });
    // 进
    tl.to('#vision-canvas', { zIndex: -1, opacity: 0, duration: 0.2 }, '<');
    tl.from(
      '.page2-title',
      {
        delay: 0.5,
        y: (_, target) => target.offsetHeight,
        rotateX: 45,
        rotateY: 15,
        opacity: 0,
      },
      '<',
    );
    tl.from('.page2-fund', { y: (_, target) => target.offsetHeight / 3, rotateX: 45, rotateY: 15, opacity: 0 }, '<');
    tl.from('.page2-contact', { y: (_, target) => target.offsetHeight / 2, rotateX: 45, rotateY: 15, opacity: 0 }, '<');
    // 出
    tl.to(
      '.page2-title',
      {
        delay: 0.5,
        y: (_, target) => -target.offsetHeight,
        rotateX: -45,
        rotateY: 15,
        opacity: 0,
      },
      '>0.3',
    );
    tl.to('.page2-fund', { y: (_, target) => -target.offsetHeight / 3, rotateX: -45, rotateY: 15, opacity: 0 }, '<');
    tl.to('.page2-contact', { y: (_, target) => -target.offsetHeight / 2, rotateX: -45, rotateY: 15, opacity: 0 }, '<');
    tl.to('#particle-gl', { opacity: 0 }, '<');
    tl.to('.fixed-top', { top: 'calc(50% - 20rem)' }, '<');
    tl.to('.fixed-bottom', { top: 'calc(50% + 20rem)' }, '<');
  }, [isMounted]);

  const handleSlideChange = (swiper: SwiperType) => {
    const index = swiper.activeIndex;
    setActiveIndex(index);
    setMobileImageIdx1(index + 1);
    setMobileImageIdx2(index + 2);
    setMobilePortfolioPageIndex(index);
  };

  useEffect(() => {
    if (mobilePortfolioPageNavigateTo === null) return;
    swiperRef.current?.slideTo(mobilePortfolioPageNavigateTo);
    setMobilePortfolioPageNavigateTo(null);
  }, [mobilePortfolioPageNavigateTo, setMobilePortfolioPageNavigateTo]);

  useEffect(() => {
    if (showParticle) {
      setMobileImageIdx1(activeIndex + 1);
      setMobileImageIdx2(activeIndex + 2);
    }
  }, [showParticle, activeIndex]);

  // 添加 useEffect 来控制滚动
  useEffect(() => {
    if (isEntered) {
      disableScroll();
    }
  }, [disableScroll, isEntered]);

  return (
    <div
      ref={wrapperRef}
      id={NAV_LIST[1].id}
      className={cn('page-container-mobile text-white', {
        hidden: currentPage?.id !== NAV_LIST[1].id,
      })}
    >
      {active && (
        <>
          <ParticleGL activeAnim={showParticle} imageIdx={mobileImageIdx1} id="particle-container-mobile-1" />
          <ParticleGL activeAnim={showParticle} imageIdx={mobileImageIdx2} id="particle-container-mobile-2" />
        </>
      )}
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <div id="particle-gl">
          <div id="particle-container-mobile-1" className={cn({ active: isEntered })}>
            <div className="particle-mask"></div>
          </div>
          <div id="particle-container-mobile-2" className={cn({ active: isEntered })}>
            <div className="particle-mask"></div>
          </div>
        </div>
        <div className="page2-title font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-xl/7.5">Portfolio</div>
        <div className="page2-fund my-12 overflow-hidden px-18 mobile:mt-0 mobile:gap-0 mobile:px-0">
          <Swiper
            direction="vertical"
            slidesPerView={2}
            spaceBetween={0}
            className="h-[60svh]"
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            freeMode={{
              enabled: true,
              sticky: true, // 添加这个让它能对齐到最近的slide
              momentumBounce: true, // 添加反弹效果
              momentumRatio: 0.5, // 降低动量比率使滑动不会太滑
              momentumVelocityRatio: 0.5, // 降低速度比率
              minimumVelocity: 0.1, // 设置最小速度阈值
            }}
            onTouchEnd={(swiper) => {
              // 检查是否在顶部且有向上拖动的动作
              if (swiper.isBeginning && swiper.touches.diff > 50) {
                enableScroll();
                gsap.to(window, {
                  duration: 1.5,
                  scrollTo: { y: `#${NAV_LIST[0].id}` },
                });
              }
              // 检查是否在底部且有向下拖动的动作
              if (swiper.isEnd && swiper.touches.diff < -50) {
                gsap.to(window, {
                  duration: 1.5,
                  scrollTo: { y: `#${NAV_LIST[2].id}`, offsetY: 10 },
                });
              }
            }}
          >
            {portfolio.map((item, index) => (
              <SwiperSlide key={item.title} className="h-[30svh]">
                <PortfolioItem
                  item={item}
                  onClick={() => handleFundClick(item)}
                  ref={(element) => {
                    if (!element) return;
                    portfolioRefs.current[index] = element;
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="page2-contact">
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default memo(MobilePortfolio);
