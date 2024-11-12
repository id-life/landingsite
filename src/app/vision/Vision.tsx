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
      <div ref={visionBottomRef} className="group absolute inset-0 -z-10 select-none">
        <img
          src="/imgs/vision-decoration-text.png"
          draggable={false}
          className="absolute left-1/2 top-[calc(100vh_-_8rem)] w-[35.625rem] -translate-x-1/2"
          alt="TIL UNLIMITED HUMAN HEALTHY LIFESPAN"
        />
        <div className="absolute left-1/2 top-[calc(100vh_-_5rem)] flex -translate-x-1/2 items-center gap-2">
          <VisionDecorationBottomScrollSVG className="h-12" />
          <p className="font-migrena text-xl/6 font-bold uppercase">SCROLL</p>
        </div>
      </div>
    </div>
  );
}
