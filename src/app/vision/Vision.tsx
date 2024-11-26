import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NAV_LIST } from '@/components/nav/nav';
import VisionDecorationBottomScrollSVG from '@/../public/svgs/vision/vision-decoration-2.svg?component';

export default function Vision() {
  const wrapperRef = useRef(null);
  const visionBottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(visionBottomRef.current, {
        opacity: 0,
        scrollTrigger: { toggleActions: 'play none none reverse' },
      });
    },
    { scope: wrapperRef },
  );
  return (
    <div ref={wrapperRef} id={NAV_LIST[0].id} className="page-container">
      {/* pieces of decoration */}
      <div ref={visionBottomRef} className="group pointer-events-none absolute inset-0 -z-10 select-none">
        <img
          src="/imgs/vision-decoration-text.png"
          draggable={false}
          className="absolute left-1/2 top-[calc(100dvh_-_8rem)] w-[35.625rem] -translate-x-1/2 text-gray-800 mobile:top-[calc(100dvh_-_5.625rem)] mobile:w-[18.75rem] mobile:-translate-y-1/2"
          alt="TIL UNLIMITED HUMAN HEALTHY LIFESPAN"
        />
        <div className="absolute left-1/2 top-[calc(100dvh_-_5rem)] flex -translate-x-1/2 items-center gap-2 mobile:top-[calc(100dvh_-_3.375rem)] mobile:rounded-lg mobile:bg-white/50 mobile:px-1.5 mobile:py-2 mobile:backdrop-blur-2xl">
          <VisionDecorationBottomScrollSVG className="h-12 w-10 mobile:h-6 mobile:w-5" />
          <p className="font-migrena text-xl/6 font-bold uppercase mobile:text-xs/5">SCROLL</p>
        </div>
      </div>
    </div>
  );
}
