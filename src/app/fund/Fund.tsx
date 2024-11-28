import ArrowSVG from '@/../public/svgs/arrow.svg?component';
import { currentPageAtom } from '@/atoms';
import { fundLogoParticleIndexAtom } from '@/atoms/app';
import Contact from '@/components/fund/Contact';
import ParticleGL from '@/components/gl/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { useRef, useState } from 'react';

type FundItem = {
  title: string;
  subTitle?: string;
  description: string;
  image: JSX.Element;
  link?: string;
};

const funds: FundItem[] = [
  {
    title: 'Healthspan Capital',
    description: 'The most active longevity fund in space.',
    image: <img className="w-19.5 mobile:w-10" src="/imgs/investments/healthspan.webp" alt="healthspan" />,
    link: 'https://www.healthspancapital.vc/',
  },
  {
    title: 'VitaDAO',
    subTitle: 'via secondary market',
    description: 'New funding paradigm for unlikely bio projects',
    image: <img className="w-50 mobile:w-[6.5625rem]" src="/imgs/investments/vita.webp" alt="vita" />,
    link: 'https://www.vitadao.com/',
  },
  {
    title: 'Vitalia',
    description: 'Accelerated longevity startups Special economic zone',
    image: <img className="w-19.5 mobile:w-10" src="/imgs/investments/vitalia.webp" alt="vitalia" />,
    link: 'https://vitalia.city/',
  },
  {
    title: 'Unlimited Bio',
    description: 'Accelerate clinical trials',
    image: <img className="w-19.5 mobile:w-10" src="/imgs/investments/unlimited.webp" alt="unlimited" />,
    link: 'https://unlimit.bio/',
  },
  {
    title: 'BiohackerDAO',
    description: 'Decentralized self-enhancement experiments and monetizes data',
    image: <img className="w-19.5 mobile:w-10" src="/imgs/investments/biohacker.webp" alt="biohacker" />,
    link: 'https://biohackerdao.com/',
  },
  {
    title: 'Mito Health',
    description: 'AI Powered Concierge Doctor',
    image: <img className="w-36 mobile:w-[4.6875rem]" src="/imgs/investments/mito.webp" alt="mito" />,
    link: 'https://mitohealth.com/',
  },
  {
    title: 'R3 Bio',
    description: 'Wholebody replacement',
    image: <img className="w-[8.75rem] mobile:w-[4.6875rem]" src="/imgs/investments/r3.webp" alt="r3" />,
  },
  {
    title: 'BIO Protocol',
    subTitle: 'via VITA allocation convert',
    description: 'A new home for Decentralized Biotech',
    image: <img className="w-[9.6875rem] mobile:w-[4.84rem]" src="/imgs/investments/bio.webp" alt="bio" />,
    link: 'http://bio.xyz/',
  },
  {
    title: 'Longevity.Technology',
    description: 'The #1 destination for daily news and insights on the fast-growing longevity market',
    image: <img className="w-19.5 mobile:w-10" src="/imgs/investments/longevity.webp" alt="longevity" />,
    link: 'https://longevity.technology/',
  },
];

export default function Fund() {
  const isMobile = useIsMobile();
  const [active, setActive] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fundRefs = useRef<HTMLDivElement[]>([]);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [imageIdx, setImageIdx] = useAtom(fundLogoParticleIndexAtom);

  const handleFundClick = (item: FundItem) => {
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
  });

  useGSAP(
    () => {
      if (isMobile) return;
      if (!fundRefs.current.length) return;
      // 创建节流后的setImageIdx函数
      const throttledSetImageIdx = throttle((index: number) => {
        setImageIdx(index);
      }, 200); // 500ms的节流时间

      fundRefs.current.forEach((div, idx) => {
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
          throttledSetImageIdx(0);
          tl.reverse();
        });
      });
    },
    { scope: wrapperRef, dependencies: [isMobile] },
  );

  return (
    <div ref={wrapperRef} id={NAV_LIST[1].id} className="page-container text-white">
      {active && <ParticleGL activeAnim={active} imageIdx={imageIdx} />}
      <div className="relative flex h-screen flex-col items-center justify-center mobile:translate-y-6">
        <div id="particle-gl">
          <div id="particle-container" className={cn({ active })}>
            <div className="particle-mask"></div>
          </div>
        </div>
        <div className="page2-title font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-xl/7.5">Portfolio</div>
        <div className="page2-fund my-12 overflow-hidden px-18 mobile:mt-7.5 mobile:gap-0 mobile:px-0 mobile:pb-10">
          <div className="grid grid-cols-4 mobile:grid-cols-2">
            {funds.slice(0, 4).map((item, index) => (
              <div
                onClick={() => handleFundClick(item)}
                key={item.title}
                ref={(element) => {
                  if (!element) return;
                  fundRefs.current[index] = element;
                }}
                className="relative h-60 w-[23.75rem] cursor-pointer pt-3 text-foreground mobile:h-37 mobile:w-auto"
              >
                <div className="flex h-20 items-center justify-center mobile:h-[3.875rem]">{item.image}</div>
                <div className="mt-4 text-center font-semibold">
                  <h4 className="font-oxanium text-base/6 mobile:text-sm/5">{item.title}</h4>
                  {!isMobile && <p className="fund-desc mx-auto mt-3 w-72 text-xs/5">{item.description}</p>}
                  {item.subTitle && (
                    <div className="fund-subtitle mx-auto mt-3 w-44 py-1.5 text-xs/3 font-semibold text-gray-350">
                      {item.subTitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 mobile:grid-cols-2">
            {funds.slice(4).map((item, index) => (
              <div
                onClick={() => handleFundClick(item)}
                key={item.title}
                ref={(element) => {
                  if (!element) return;
                  fundRefs.current[4 + index] = element;
                }}
                className="relative h-60 w-[19rem] cursor-pointer pt-3 text-foreground mobile:h-37 mobile:w-auto"
              >
                <div className="flex h-20 items-center justify-center mobile:h-[3.875rem]">{item.image}</div>
                <div className="mt-4 text-center font-semibold">
                  <h4 className="font-oxanium text-base/6 mobile:text-sm/5">{item.title}</h4>
                  {!isMobile && <p className="fund-desc mx-auto mt-3 w-72 text-xs/5">{item.description}</p>}
                  {item.subTitle && (
                    <div className="fund-subtitle mx-auto mt-3 w-44 rounded-full bg-yellow-800/30 py-1.5 text-xs/3 font-semibold text-yellow-800">
                      {item.subTitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="page2-contact">
          <Contact />
        </div>
        {/* <div
          className="cursor-pointer bg-red-400 p-2"
          onClick={() => setImageIdx(imageIdx - 1 >= 0 ? imageIdx - 1 : fundLogoLength - 1)}
        >
          上一张
        </div>
        <div
          className="cursor-pointer bg-red-400 p-2"
          onClick={() => setImageIdx(imageIdx + 1 < fundLogoLength ? imageIdx + 1 : 0)}
        >
          下一张
        </div> */}
      </div>
    </div>
  );
}
