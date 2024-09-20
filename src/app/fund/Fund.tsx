import ArrowSVG from '@/../public/svgs/arrow.svg?component';
import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';

type FundItem = {
  title: string;
  description: string;
  image: JSX.Element;
  link?: string;
};

export default function Fund() {
  const [p5Loaded, setP5Loaded] = useState(false);
  console.log('p5Loaded', p5Loaded);
  const currentPage = useAtomValue(currentPageAtom);
  const active = useMemo(() => currentPage.id === NAV_LIST[1].id, [currentPage]);
  const funds = useMemo<FundItem[]>(
    () => [
      {
        title: 'VitaDAO',
        description: 'New funding paradigm for unlikely bio projects',
        image: <img className="w-48 mobile:w-24" src="/imgs/investments/vita.webp" alt="vita" />,
        link: 'https://www.vitadao.com/',
      },
      {
        title: 'Vitalia',
        description: 'Accelerated longevity startups Special economic zone',
        image: <img className="w-22.5 mobile:w-12" src="/imgs/investments/vitalia.webp" alt="vita" />,
        link: 'https://vitalia.city/',
      },
      {
        title: 'Unlimited Bio',
        description: 'Accelerate clinical trials',
        image: <img className="w-22.5 mobile:w-12" src="/imgs/investments/unlimited.webp" alt="unlimited" />,
        link: 'https://unlimit.bio/',
      },
      {
        title: 'BiohackerDAO',
        description: 'Decentralized self-enhancement experiments and monetizes data',
        image: <img className="w-66.5 mobile:w-32" src="/imgs/investments/biohacker.webp" alt="biohacker" />,
        link: 'https://biohackerdao.com/',
      },
      {
        title: 'R3 Bio',
        description: 'Wholebody replacement',
        image: <img className="w-32.5 mobile:w-16" src="/imgs/investments/r3.webp" alt="r3" />,
      },
    ],
    [],
  );

  const handleFundClick = (item: FundItem) => {
    if (!item.link) return;
    window.open(item.link, '_blank');
  };

  return (
    <div id={NAV_LIST[1].id} className="page-container bg-fund page-height p-8 text-white mobile:p-5">
      <Script async src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js" onLoad={() => setP5Loaded(true)} />
      {p5Loaded && <Script src="/js/particle-gl.js" />}
      <div className="relative flex h-full w-full select-none flex-col items-center justify-center">
        <div id="particle-container" className={cn({ active })}>
          <div className="particle-mask"></div>
        </div>
        <div className="font-xirod text-[2.5rem]/[4.5rem] font-bold uppercase mobile:text-base/5">Portfolio</div>
        <div className="mt-12 grid w-full grid-cols-5 gap-7.5 px-18 mobile:mt-6 mobile:grid-cols-2 mobile:gap-4 mobile:px-0 mobile:pb-10">
          {funds.map((item) => (
            <div
              onClick={() => handleFundClick(item)}
              key={item.title}
              className="fund-box-border group h-105 text-background mobile:h-36"
            >
              <div className="fund-box-content">
                <div className="flex h-3/5 items-center justify-center px-5 mobile:h-1/2 mobile:px-3">{item.image}</div>
                <div className="text-center font-semibold">
                  <h4 className="text-xl/7.5 mobile:text-xs/4">{item.title}</h4>
                  <p className="px-8 text-xs mobile:px-2 mobile:text-[.5rem]/3">{item.description}</p>
                </div>
                {item.link ? (
                  <ArrowSVG className="absolute bottom-5 left-1/2 w-5 -translate-x-1/2 duration-300 group-hover:rotate-180 group-hover:fill-red-600 mobile:bottom-2 mobile:w-2.5" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
