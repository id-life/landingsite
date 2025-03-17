import { memo, useRef } from 'react';
import { gsap } from 'gsap';
import { NAV_LIST } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import { useSetAtom } from 'jotai';
import { currentPageAtom } from '@/atoms';

function Twin() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[3].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[3]);
          gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[3]);
          gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
        },
        onLeaveBack: () => {
          gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
        },
        onLeave: () => {
          gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
        },
      },
    });
    tl.to(imageContainerRef.current, { height: '100svh' });
    tl.to('#twin-three-wrapper', { opacity: 1, duration: 6 });
    tl.to('#switch-model', { opacity: 1, duration: 6 }, '<');
    tl.to('#switch-skin', { opacity: 1, duration: 6 }, '<');
    tl.to('#switch-anatomy-camera', { opacity: 1, duration: 6 }, '<');
    // tl.to('.twin-title-wrapper', { left: '4rem', ease: 'power2.inOut' });
    // tl.to('.twin-title-wrapper', { left: '-30rem', ease: 'power2.inOut', duration: 2, delay: 2 });
    tl.to('#twin-three-wrapper', { opacity: 0, duration: 2 });
  }, []);

  return (
    <div id={NAV_LIST[3].id} className="page-container twin">
      <div ref={imageContainerRef} className="absolute left-0 top-0 h-0 overflow-hidden">
        <img className="relative right-0 top-0 h-screen w-screen" src="/svgs/twin-bg.svg" alt="" />
      </div>
      <div className="twin-title-wrapper relative">
        <div className="twin-title absolute left-10 top-40 w-screen">
          <p className="font-oxanium text-[11.875rem]/[11.25rem] font-bold uppercase text-red-600">DIGITAL TWIN</p>
          <p className="font-oxanium text-[10.5rem]/[10.25rem] font-bold uppercase">Biomarker</p>
          <p className="font-oxanium text-[10.5rem]/[10.25rem] font-bold uppercase">Visualization</p>
        </div>
        <div className="twin-title-item twin-title-M0 absolute left-[-80rem] top-64">
          <p className="font-oxanium text-[1.75rem]/[1.75rem] font-bold uppercase text-red-600">organization</p>
          <div className="font-oxanium text-[7.5rem]/[7.5rem] font-bold uppercase">
            <p>DIGITAL</p>
            <p>TWIN</p>
          </div>
        </div>
        <div className="twin-title-item twin-title-M1 absolute left-[-80rem] top-64">
          <p className="font-oxanium text-[1.75rem]/[1.75rem] font-bold uppercase text-red-600">CLONE_01</p>
          <div className="font-oxanium text-[7.5rem]/[7.5rem] font-bold uppercase">
            <p>Unhealthy</p>
            <p>habits me</p>
          </div>
        </div>
        <div className="twin-title-item twin-title-M2 absolute left-[-80rem] top-64">
          <p className="font-oxanium text-[1.75rem]/[1.75rem] font-bold uppercase text-red-600">CLONE_02</p>
          <div className="font-oxanium text-[7.5rem]/[7.5rem] font-bold uppercase">
            <p>A Healthier</p>
            <p>Life</p>
          </div>
        </div>
        <div className="twin-title-item twin-title-M3 absolute left-[-80rem] top-64">
          <p className="font-oxanium text-[1.75rem]/[1.75rem] font-bold uppercase text-red-600">CLONE_03</p>
          <div className="font-oxanium text-[7.5rem]/[7.5rem] font-bold uppercase">
            <p>FITNESS</p>
            <p>FITNESS FITNESS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Twin);
