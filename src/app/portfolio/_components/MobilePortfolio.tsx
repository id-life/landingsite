import { innerPageIndexAtom, innerPageNavigateToAtom, innerPageTotalAtom, mobileCurrentPageAtom } from '@/atoms';
import ParticleGL from '@/components/gl/particle/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { portfolio, portfolioGetSourceImgInfos, PortfolioItemInfo } from './portfolioData';
import PortfolioItem from './PortfolioItem';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';

SwiperType.use([FreeMode]);

function MobilePortfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const [mobileImageIdx1, setMobileImageIdx1] = useState(0);
  const [mobileImageIdx2, setMobileImageIdx2] = useState(0);
  const swiperRef = useRef<SwiperType>();
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [particleActive, setParticleActive] = useState(false);

  const { trackEvent } = useGA();

  const handleFundClick = (item: PortfolioItemInfo) => {
    trackEvent({
      name: GA_EVENT_NAMES.PORTFOLIO_VIEW,
      label: item.title,
    });
    if (!item.link) return;
    window.open(item.link, '_blank');
  };
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // 创建入场动画
  const createEnterAnimation = useCallback(() => {
    if (!wrapperRef.current) return;

    // 如果存在之前的动画，先清理
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.fromTo(wrapperRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });

    // 标题动画
    tl.fromTo('.page2-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    // Portfolio items 动画
    tl.fromTo('.page2-fund', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    // Contact 部分动画
    tl.fromTo('.page2-contact', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    return tl;
  }, []);

  // 创建退场动画
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

  const handleSlideChange = (swiper: SwiperType) => {
    const index = swiper.activeIndex;
    setActiveIndex(index);
    setMobileImageIdx1(index + 1);
    setMobileImageIdx2(index + 2);
    setInnerPageIndex(index);
  };

  useEffect(() => {
    if (innerPageNavigateTo === null || currentPage.id !== NAV_LIST[1].id) return;
    swiperRef.current?.slideTo(innerPageNavigateTo);
    setInnerPageNavigateTo(null);
  }, [innerPageNavigateTo, currentPage.id, setInnerPageNavigateTo]);

  useEffect(() => {
    if (currentPage.id === NAV_LIST[1].id) {
      setParticleActive(true);
      setMobileImageIdx1(1);
      setMobileImageIdx2(2);
      setInnerPageIndex(0);
      setInnerPageTotal(portfolio.length - 1); // slidesPerView=2, 所以 total = length - 1
      swiperRef.current?.slideTo(0);
      createEnterAnimation();
    } else {
      setParticleActive(false);
      createExitAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div
      ref={wrapperRef}
      id={NAV_LIST[1].id}
      className={cn('page-container-mobile text-white', {
        hidden: currentPage?.id !== NAV_LIST[1].id,
      })}
    >
      <ParticleGL
        imageIdx={mobileImageIdx1}
        activeAnim={particleActive}
        id="particle-container-mobile-1"
        getSourceImgInfos={portfolioGetSourceImgInfos}
      />
      <ParticleGL
        imageIdx={mobileImageIdx2}
        activeAnim={particleActive}
        id="particle-container-mobile-2"
        getSourceImgInfos={portfolioGetSourceImgInfos}
      />
      <div className="relative flex h-[100svh] flex-col items-center pb-16 pt-24">
        <div id="particle-gl">
          <div
            id="particle-container-mobile-1"
            className={cn('particle-container particle-container-mobile-1', { active: particleActive })}
          >
            <div className="particle-mask"></div>
          </div>
          <div
            id="particle-container-mobile-2"
            className={cn('particle-container particle-container-mobile-2', { active: particleActive })}
          >
            <div className="particle-mask"></div>
          </div>
        </div>
        <div className="page2-title font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-xl/7.5">Portfolio</div>
        <div className="page2-fund overflow-hidden px-18 mobile:mt-0 mobile:gap-0 mobile:px-0">
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
        <div className="page2-contact flex-center relative h-12 w-full">
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default memo(MobilePortfolio);
