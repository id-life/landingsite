import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { useGSAP } from '@gsap/react';
import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import Contact from '@/components/fund/Contact';
import { useIsMobile } from '@/hooks/useIsMobile';
import ParticleGL from '@/components/gl/ParticleGL';
import ArrowSVG from '@/../public/svgs/arrow.svg?component';

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
    image: <img className="w-20 mobile:w-10" src="/imgs/investments/healthspan.webp" alt="healthspan" />,
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
    image: <img className="w-[4.875rem] mobile:w-10" src="/imgs/investments/vitalia.webp" alt="vita" />,
    link: 'https://vitalia.city/',
  },
  {
    title: 'Unlimited Bio',
    description: 'Accelerate clinical trials',
    image: <img className="w-[4.875rem] mobile:w-10" src="/imgs/investments/unlimited.webp" alt="unlimited" />,
    link: 'https://unlimit.bio/',
  },
  {
    title: 'BiohackerDAO',
    description: 'Decentralized self-enhancement experiments and monetizes data',
    image: <img className="w-[18.25rem] mobile:w-[9.5625rem]" src="/imgs/investments/biohacker.webp" alt="biohacker" />,
    link: 'https://biohackerdao.com/',
  },
  {
    title: 'Mito Health',
    description: 'AI Powered Concierge Doctor',
    image: <img className="w-22.5 mobile:w-[4.6875rem]" src="/imgs/investments/mito.webp" alt="mito" />,
    link: 'https://mitohealth.com/',
  },
];

export default function Fund() {
  const isMobile = useIsMobile();
  const currentPage = useAtomValue(currentPageAtom);
  const active = useMemo(() => currentPage.id === NAV_LIST[1].id, [currentPage]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fundRefs = useRef<HTMLDivElement[]>([]);

  const handleFundClick = (item: FundItem) => {
    if (!item.link) return;
    window.open(item.link, '_blank');
  };

  useGSAP(
    () => {
      if (isMobile) return;
      if (!fundRefs.current.length) return;
      fundRefs.current.forEach((div) => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });
        tl.to(div, { scale: 1.1 });
        tl.from(div.querySelector('.fund-desc'), { opacity: 0, translateY: '50%' });
        tl.from(div.querySelector('.fund-arrow'), { opacity: 0, translateY: '50%' }, '<50%');
        div.addEventListener('mouseenter', () => tl.play());
        div.addEventListener('mouseleave', () => tl.reverse());
      });
    },
    { scope: wrapperRef, dependencies: [isMobile] },
  );

  return (
    <div
      ref={wrapperRef}
      id={NAV_LIST[1].id}
      className="page-container page-height bg-fund p-8 text-white mobile:px-5 mobile:pt-0"
    >
      {active && <ParticleGL activeAnim={true} />}
      <div className="relative flex h-full w-full flex-col items-center justify-center mobile:h-auto">
        <div id="particle-container" className={cn({ active })}>
          <div className="particle-mask"></div>
        </div>
        <div className="font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-xl/7.5">Portfolio</div>
        {/* <p className="text-center font-migrena text-xl/7.5 font-bold capitalize mobile:mt-1.5 mobile:text-sm/5">
          Access To cutting-edge products, exclusive events, and a network of innovators
        </p> */}
        <div className="mt-12 grid w-full grid-cols-6 gap-7.5 px-18 mobile:mt-7.5 mobile:grid-cols-2 mobile:gap-0 mobile:px-0 mobile:pb-10">
          {funds.map((item, index) => (
            <div
              onClick={() => handleFundClick(item)}
              key={item.title}
              ref={(element) => {
                if (!element) return;
                fundRefs.current[index] = element;
              }}
              className="relative h-72 cursor-pointer text-foreground mobile:h-37"
            >
              <div className="flex h-[8.875rem] items-center justify-center mobile:h-[3.875rem]">{item.image}</div>
              <div className="text-center font-semibold">
                <h4 className="text-base/6 mobile:text-sm/5">{item.title}</h4>
                {item?.subTitle ? <p className="text-xs/5 font-semibold text-gray-350">{item.subTitle}</p> : null}
                {!isMobile && <p className="fund-desc mt-3 px-4 text-xs/5">{item.description}</p>}
              </div>
              {item.link ? (
                <ArrowSVG className="fund-arrow mx-auto mt-4 w-5 rotate-180 fill-foreground mobile:mt-2 mobile:w-3" />
              ) : null}
            </div>
          ))}
        </div>
        <Contact />
      </div>
    </div>
  );
}
