import { currentPageAtom } from '@/atoms';
import ParticleGL from '@/components/gl/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperType.use([FreeMode]);

type PortfolioItem = {
  title: string;
  subTitle?: string;
  description: string;
  image: JSX.Element;
  link?: string;
};

const portfolio: PortfolioItem[] = [
  {
    title: 'Healthspan Capital',
    description: 'The most active longevity fund in space.',
    image: <img className="w-19.5 mobile:w-15" src="/imgs/investments/healthspan.webp" alt="healthspan" />,
    link: 'https://www.healthspancapital.vc/',
  },
  {
    title: 'VitaDAO',
    subTitle: 'via secondary market',
    description: 'New funding paradigm for unlikely bio projects',
    image: <img className="w-50 mobile:w-[9.375rem]" src="/imgs/investments/vita.webp" alt="vita" />,
    link: 'https://www.vitadao.com/',
  },
  {
    title: 'Vitalia',
    description: 'Accelerated longevity startups Special economic zone',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/vitalia.webp" alt="vitalia" />,
    link: 'https://vitalia.city/',
  },
  {
    title: 'Unlimited Bio',
    description: 'Accelerate clinical trials',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/unlimited.webp" alt="unlimited" />,
    link: 'https://unlimit.bio/',
  },
  {
    title: 'BiohackerDAO',
    description: 'Decentralized self-enhancement experiments and monetizes data',
    image: (
      <>
        <img className="w-19.5 mobile:hidden" src="/imgs/investments/biohacker.webp" alt="biohacker" />
        <img
          className="hidden mobile:block mobile:w-[3.625rem]"
          src="/imgs/investments/mobile-biohacker.webp"
          alt="biohacker"
        />
      </>
    ),
    link: 'https://biohackerdao.com/',
  },
  {
    title: 'Mito Health',
    description: 'AI Powered Concierge Doctor',
    image: <img className="w-36 mobile:w-[6.75rem]" src="/imgs/investments/mito.webp" alt="mito" />,
    link: 'https://mitohealth.com/',
  },
  {
    title: 'R3 Bio',
    description: 'Wholebody replacement',
    image: <img className="w-[8.75rem] mobile:w-[6.5625rem]" src="/imgs/investments/r3.webp" alt="r3" />,
  },
  {
    title: 'BIO Protocol',
    subTitle: 'via VITA allocation convert',
    description: 'A new home for Decentralized Biotech',
    image: <img className="w-[9.6875rem] mobile:w-[7.25rem]" src="/imgs/investments/bio.webp" alt="bio" />,
    link: 'http://bio.xyz/',
  },
  {
    title: 'Longevity.Technology',
    description: 'The #1 destination for daily news and insights on the fast-growing longevity market',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/longevity.webp" alt="longevity" />,
    link: 'https://longevity.technology/',
  },
];

function Portfolio() {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const [isEntered, setIsEntered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [mobileImageIdx1, setMobileImageIdx1] = useState(1);
  const [mobileImageIdx2, setMobileImageIdx2] = useState(2);
  const [imageIdx, setImageIdx] = useState(0);
  const showParticle = useMemo(() => (isMobile ? isEntered : active), [isMobile, isEntered, active]);
  const swiperRef = useRef<SwiperType>();

  const handleFundClick = useCallback((item: PortfolioItem) => {
    if (!item.link) return;
    window.open(item.link, '_blank');
  }, []);

  useGSAP(() => {
    if (!isMounted) return;
    if (isMobile) {
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
      tl.from(
        '.page2-fund',
        {
          y: (_, target) => target.offsetHeight / 3,
          rotateX: 45,
          rotateY: 15,
          opacity: 0,
        },
        '<',
      );
      tl.add(() => setIsEntered(false));
      tl.add(() => setIsEntered(true));
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
      tl.to(
        '.page2-fund',
        {
          y: (_, target) => -target.offsetHeight / 3,
          rotateX: -45,
          rotateY: 15,
          opacity: 0,
        },
        '<',
      );
      tl.add(() => setIsEntered(true));
      tl.add(() => setIsEntered(false));
      tl.to('.page2-contact', { y: (_, target) => -target.offsetHeight / 2, rotateX: -45, rotateY: 15, opacity: 0 }, '<');
      tl.to('#particle-gl', { opacity: 0 }, '<');
      tl.to('.fixed-top', { top: 'calc(50% - 20rem)' }, '<');
      tl.to('.fixed-bottom', { top: 'calc(50% + 20rem)' }, '<');
      return;
    }

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
    tl.to('.fixed-top', { top: 'calc(50% - 20rem)' });
    tl.to('.fixed-bottom', { top: 'calc(50% + 20rem)' }, '<');
  }, [isMounted, isMobile]);

  useGSAP(
    () => {
      if (isMobile || !portfolioRefs.current.length) return;

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
        const desc = div.querySelector('.fund-desc');
        const subtitle = div.querySelector('.fund-subtitle');
        if (desc) {
          tl.from(desc, { opacity: 0, translateY: '50%' });
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
    { scope: wrapperRef, dependencies: [isMobile] },
  );

  const handleSlideChange = (swiper: SwiperType) => {
    const index = swiper.activeIndex;
    setActiveIndex(index);
    setMobileImageIdx1(index + 1);
    setMobileImageIdx2(index + 2);
  };
  // console.log({ mobileImageIdx1, mobileImageIdx2, isEntered, activeIndex });

  useEffect(() => {
    if (!isMobile) return;
    if (isEntered) {
      setMobileImageIdx1(activeIndex + 1);
      setMobileImageIdx2(activeIndex + 2);
    }
  }, [isMobile, activeIndex, isEntered]);

  // 添加 useEffect 来控制滚动
  useEffect(() => {
    if (isEntered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isEntered]);

  return (
    <div ref={wrapperRef} id={NAV_LIST[1].id} className="page-container fund text-white">
      {!isMobile && active && <ParticleGL activeAnim={active} imageIdx={imageIdx} id="particle-container" />}
      {isMobile && <ParticleGL activeAnim={showParticle} imageIdx={mobileImageIdx1} id="particle-container-mobile-1" />}
      {isMobile && <ParticleGL activeAnim={showParticle} imageIdx={mobileImageIdx2} id="particle-container-mobile-2" />}
      <div className="relative flex h-[100svh] flex-col items-center justify-center mobile:translate-y-6">
        <div id="particle-gl">
          {isMobile ? (
            <>
              <div id="particle-container-mobile-1" className={cn({ active: isEntered })}>
                <div className="particle-mask"></div>
              </div>
              <div id="particle-container-mobile-2" className={cn({ active: isEntered })}>
                <div className="particle-mask"></div>
              </div>
            </>
          ) : (
            <div id="particle-container" className={cn({ active })}>
              <div className="particle-mask"></div>
            </div>
          )}
        </div>
        <div className="page2-title font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-xl/7.5">Portfolio</div>
        <div className="page2-fund my-12 overflow-hidden px-18 mobile:mt-0 mobile:gap-0 mobile:px-0">
          {isMobile ? (
            <Swiper
              direction="vertical"
              slidesPerView={2}
              spaceBetween={0}
              className="h-[70svh]"
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
                  gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: `#${NAV_LIST[0].id}` },
                  });
                }
                // 检查是否在底部且有向下拖动的动作
                if (swiper.isEnd && swiper.touches.diff < -50) {
                  gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: `#${NAV_LIST[2].id}` },
                  });
                }
              }}
            >
              {portfolio.map((item, index) => (
                <SwiperSlide key={item.title} className="h-[35svh]">
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
          ) : (
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
          )}
        </div>
        <div className="page2-contact">
          <Contact />
        </div>
      </div>
    </div>
  );
}

interface PortfolioItemProps {
  item: PortfolioItem;
  link?: string;
  onClick: () => void;
  className?: string;
}

export const PortfolioItem = memo(
  forwardRef<HTMLDivElement, PortfolioItemProps>(({ item, onClick, className }, ref) => {
    const { title, subTitle, description, image } = item;
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'mobile:flex-center relative h-60 w-[23.75rem] cursor-pointer pt-3 text-foreground mobile:h-[35svh] mobile:w-[100dvw] mobile:flex-col mobile:pt-0',
          className,
        )}
      >
        <div className="flex h-20 items-center justify-center mobile:h-[3.875rem]">{image}</div>
        <div className="mt-4 text-center font-semibold">
          <h4 className="font-oxanium text-base/6 mobile:text-xl/6">{title}</h4>
          <p className="fund-desc mx-auto mt-3 w-72 text-xs/5">{description}</p>
          {subTitle && (
            <div className="fund-subtitle mx-auto mt-3 w-44 py-1.5 text-xs/3 font-semibold text-gray-350">{subTitle}</div>
          )}
        </div>
      </div>
    );
  }),
);

PortfolioItem.displayName = 'PortfolioItem';

export default memo(Portfolio);
