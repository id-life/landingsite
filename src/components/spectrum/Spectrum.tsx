'use client';
import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom } from 'jotai';
import { memo, useState } from 'react';
import ParticleGL from '../gl/ParticleGL';

function Spectrum() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [active, setActive] = useState<boolean>(false);
  const [imageIdx, setImageIdx] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        // markers: true,
        id: 'spectrum-trigger', // add an ID for later reference
        onEnter: () => {
          if (currentPage.id !== NAV_LIST[2].id) setCurrentPage(NAV_LIST[2]);
          setActive(true);
        },
        onEnterBack: () => {
          if (currentPage.id !== NAV_LIST[2].id) setCurrentPage(NAV_LIST[2]);
          !active && setActive(true);
        },
        onLeaveBack: () => {
          !active && setActive(false);
        },
      },
    });
    tl.to(() => {}, { duration: 5 });
    tl.to('.fixed-top', { opacity: 0 });
    tl.to('.fixed-bottom', { opacity: 0 }, '<');
  }, []);

  return (
    <div id={NAV_LIST[2].id} className="page-container spectrum">
      {active && <ParticleGL activeAnim={active} imageIdx={imageIdx} id="spectrum-particle-container" />}
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <h1 className="spectrum-title font-xirod text-[2.5rem]/[4.5rem] uppercase text-white">spectrum</h1>
        <div id="spectrum-particle-gl">
          <div id="spectrum-particle-container" className={cn('particle-container', { active })}>
            {/* <div className="particle-mask"></div> */}
          </div>
        </div>
        <div className="spectrum-fund mb-2.5 mt-12 overflow-hidden px-18">
          <div className="grid grid-cols-4">
            <div className="size-96 bg-red-300"></div>
            <div className="size-96 bg-red-300"></div>
            <div className="size-96 bg-red-300"></div>
            <div className="size-96 bg-red-300"></div>
          </div>
          <div className="grid grid-cols-4">
            <div className="size-96 bg-red-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Spectrum);
