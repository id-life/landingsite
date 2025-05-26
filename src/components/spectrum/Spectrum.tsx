'use client';
import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom } from 'jotai';
import { memo, useRef, useState } from 'react';
import ParticleGL from '../gl/ParticleGL';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import SpectrumItem from './SpectrumItem';
import { useThrottle } from '@/hooks/useThrottle';

function Spectrum() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [active, setActive] = useState<boolean>(false);
  const [imageIdx, setImageIdx] = useState(0);
  const spectrumData = useSpectrumData();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spectrumRefs = useRef<HTMLDivElement[]>([]);

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

  const throttledSetImageIdx = useThrottle((index: number) => {
    setImageIdx(index);
  }, 200);

  useGSAP(
    () => {
      if (!spectrumRefs.current.length) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      let isMouseInFundArea = false;
      // add mouse event listeners for the entire fund area
      wrapper?.addEventListener('mouseenter', () => {
        isMouseInFundArea = true;
      });

      wrapper?.addEventListener('mouseleave', () => {
        isMouseInFundArea = false;
        throttledSetImageIdx(0);
      });

      spectrumRefs.current.forEach((div, idx) => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });
        const title = div.querySelector('.spectrum-title');
        const titleCn = div.querySelector('.spectrum-title-cn');
        const selected = div?.querySelectorAll('.spectrum-selected-icon');
        const icon = div?.querySelectorAll('.spectrum-icon');
        if (title) tl.to(title, { fontSize: '1.875rem', lineHeight: '2.25rem' });
        if (titleCn) tl.to(titleCn, { fontSize: '1.5rem', lineHeight: '1.75rem' }, '<');
        if (icon) tl.to(icon, { width: '2.25rem', height: '2.25rem' }, '<');
        if (selected) tl.to(selected, { opacity: 1 });

        div.addEventListener('mouseenter', () => {
          throttledSetImageIdx(idx + 1);
          tl.play();
        });
        div.addEventListener('mouseleave', () => {
          tl.reverse();
          // reset the image index only when the mouse actually leaves the entire fund area
          if (!isMouseInFundArea) {
            throttledSetImageIdx(0);
          }
        });
      });
    },
    { scope: wrapperRef, dependencies: [] },
  );

  return (
    <div id={NAV_LIST[2].id} className="page-container spectrum">
      {active && (
        <ParticleGL
          activeAnim={active}
          imageIdx={imageIdx}
          id="spectrum-particle-container"
          getSourceImgInfos={spectrumGetSourceImgInfos}
        />
      )}
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <h1 className="spectrum-title font-xirod text-[2.5rem]/[4.5rem] uppercase text-white">spectrum</h1>
        <div id="spectrum-particle-gl">
          <div id="spectrum-particle-container" className={cn('particle-container', { active })}>
            {/* <div className="particle-mask"></div> */}
          </div>
        </div>
        <div className="spectrum-fund mb-2.5 mt-12 overflow-hidden px-18">
          <div className="grid grid-cols-4 gap-6" ref={wrapperRef}>
            {spectrumData.map((item, index) => (
              <SpectrumItem
                key={item.title}
                item={item}
                onClick={() => {
                  console.log(item.title);
                }}
                ref={(element) => {
                  if (!element) return;
                  spectrumRefs.current[index] = element;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Spectrum);
