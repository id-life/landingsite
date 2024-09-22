import ArrowSVG from '@/../public/svgs/arrow.svg?component';
import { currentPageAtom } from '@/atoms';
import DynamicParticleGL from '@/components/gl/DynamicParticleGL';
import ParticleGL from '@/components/gl/ParticleGL';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

type FundItem = {
  title: string;
  description: string;
  image: JSX.Element;
  link?: string;
};

export default function Fund() {
  const isMobile = useIsMobile();
  const currentPage = useAtomValue(currentPageAtom);
  const active = useMemo(() => currentPage.id === NAV_LIST[1].id, [currentPage]);

  const funds = useMemo<FundItem[]>(
    () => [
      {
        title: 'VitaDAO',
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
        title: 'R3 Bio',
        description: 'Wholebody replacement',
        image: <img className="w-[8.9375rem] mobile:w-[4.6875rem]" src="/imgs/investments/r3.webp" alt="r3" />,
      },
      {
        title: 'Mito Health',
        description: 'AI Powered Concierge Doctor',
        image: <img className="w-22.5 mobile:w-12" src="/imgs/investments/mito.jpg" alt="mito" />,
        link: 'https://mitohealth.com/',
      },
    ],
    [],
  );
  const handleFundClick = (item: FundItem) => {
    if (!item.link) return;
    window.open(item.link, '_blank');
  };
  return (
    <div id={NAV_LIST[1].id} className="page-container page-height bg-fund p-8 text-white mobile:px-5">
      <ParticleGL activeAnim={active} />
      <div className="relative flex h-full w-full flex-col items-center justify-center mobile:h-auto">
        <div id="particle-container" className={cn({ active })}>
          <div className="particle-mask"></div>
        </div>
        <div className="font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-xl/7.5">Portfolio</div>
        {isMobile && (
          <p className="text-sm/5 font-bold capitalize mobile:mt-1.5">
            Access To cutting-edge products, exclusive events, and a network of innovators
          </p>
        )}
        <div className="mt-12 grid w-full grid-cols-6 gap-7.5 px-18 mobile:mt-6 mobile:grid-cols-2 mobile:gap-0 mobile:px-0 mobile:pb-10">
          {funds.map((item) => (
            <div
              onClick={() => handleFundClick(item)}
              key={item.title}
              className="group h-100 text-foreground transition-colors duration-300 hover:bg-black/10 hover:backdrop-blur-2xl mobile:h-37"
            >
              <div className="flex h-[8.875rem] items-center justify-center mobile:h-[3.8125rem]">{item.image}</div>
              <div className="text-center font-semibold">
                <h4 className="text-base/6 mobile:text-sm/5">{item.title}</h4>
                <p className="mt-3 px-4 text-xs/5 mobile:mt-1.5 mobile:px-0 mobile:text-[.625rem]/3.5">{item.description}</p>
              </div>
              {item.link ? (
                <ArrowSVG className="absolute bottom-5 left-1/2 w-5 -translate-x-1/2 fill-none duration-300 group-hover:rotate-180 group-hover:fill-white mobile:bottom-2 mobile:w-2.5" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
