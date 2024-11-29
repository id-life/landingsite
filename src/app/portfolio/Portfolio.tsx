import { currentPageAtom } from '@/atoms';
import ParticleGL from '@/components/gl/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/portfolio/Contact';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { forwardRef, useEffect, useRef, useState } from 'react';

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

export default function Fund() {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const [isEntered, setIsEntered] = useState(false);
  const [active, setActive] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [mobileImageIdx1, setMobileImageIdx1] = useState(0);
  const [mobileImageIdx2, setMobileImageIdx2] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const handleFundClick = (item: PortfolioItem) => {
    if (!item.link) return;
    window.open(item.link, '_blank');
  };

  useGSAP(() => {
    if (!isMounted) return;
    if (isMobile) {
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
          onUpdate: (self) => {
            // 当滚动进度超过200%时设置isEntered为true
            if (!isMobile) return;
            if (self.progress >= 0.5 && self.progress <= 0.8) {
              setIsEntered(true);
            } else {
              setIsEntered(false);
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
        '<0.3',
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
        onUpdate: (self) => {
          console.log('progress:', self.progress);
          // 当滚动进度超过200%时设置isEntered为true
          if (self.progress >= 0.5) {
            setIsEntered(true);
          } else {
            setIsEntered(false);
          }
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current || !isMounted || !isEntered) return;

    const throttledSetMobileImage1Idx = throttle((index: number) => {
      setMobileImageIdx1(index);
    }, 200);

    const throttledSetMobileImage2Idx = throttle((index: number) => {
      setMobileImageIdx2(index);
    }, 200);

    const container = scrollContainerRef.current;
    const itemPairHeight = window.innerHeight * 0.7; // 70vh

    throttledSetMobileImage1Idx(1);
    throttledSetMobileImage2Idx(2);
    const observer = ScrollTrigger.observe({
      target: container,
      type: 'scroll',
      onStop: (self) => {
        const currentScroll = self.scrollY();
        const itemHeight = itemPairHeight / 2; // 单个item的高度
        const targetIndex = Math.round(currentScroll / itemHeight);
        const maxIndex = portfolio.length - 2; // 最大索引改为总长度-2
        const finalIndex = Math.min(Math.max(0, targetIndex), maxIndex);

        gsap.to(container, {
          scrollTop: finalIndex * itemHeight,
          duration: 0.3,
          ease: 'power2.out',
          onUpdate: () => {
            // 更新为连续的两个索引
            throttledSetMobileImage1Idx(finalIndex + 1);
            throttledSetMobileImage2Idx(finalIndex + 2);
          },
        });
      },
    });

    return () => {
      observer.kill();
    };
  }, [isMobile, isMounted, isEntered]);

  return (
    <div ref={wrapperRef} id={NAV_LIST[1].id} className="page-container fund text-white">
      {active && (
        <ParticleGL
          activeAnim={isMobile ? isEntered : active}
          imageIdx={isMobile ? mobileImageIdx1 : imageIdx}
          id={isMobile ? 'particle-container-mobile-1' : 'particle-container'}
        />
      )}
      {isMobile && active && <ParticleGL activeAnim={isEntered} imageIdx={mobileImageIdx2} id="particle-container-mobile-2" />}
      <div className="relative flex h-[100dvh] flex-col items-center justify-center mobile:translate-y-6">
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
            <div
              ref={scrollContainerRef}
              className={cn(
                'grid h-[70dvh] snap-y snap-mandatory grid-cols-1',
                isEntered ? 'overflow-auto' : 'overflow-hidden',
              )}
              style={{ scrollSnapType: 'y mandatory' }}
            >
              {portfolio.map((item, index) => (
                <div key={item.title} className="h-[35dvh] snap-start" style={{ scrollSnapAlign: 'start' }}>
                  <PortfolioItem
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    onClick={() => handleFundClick(item)}
                    ref={(element) => {
                      if (!element) return;
                      portfolioRefs.current[index] = element;
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4">
                {portfolio.slice(0, 4).map((item, index) => (
                  <PortfolioItem
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    image={item.image}
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
                    title={item.title}
                    description={item.description}
                    image={item.image}
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
  title: string;
  subTitle?: string;
  description: string;
  image: JSX.Element;
  link?: string;
  onClick: () => void;
  className?: string;
}

export const PortfolioItem = forwardRef<HTMLDivElement, PortfolioItemProps>(
  ({ title, subTitle, description, image, onClick, className }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'mobile:flex-center relative h-60 w-[23.75rem] cursor-pointer pt-3 text-foreground mobile:h-[35dvh] mobile:w-[100dvw] mobile:flex-col mobile:pt-0',
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
  },
);

PortfolioItem.displayName = 'PortfolioItem';
