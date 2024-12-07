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
      <div ref={visionBottomRef} className="group pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="absolute left-1/2 top-[calc(100svh_-_6rem)] -translate-x-1/2 items-center gap-2 mobile:top-[calc(100svh_-_4.625rem)] mobile:rounded-lg mobile:px-1.5 mobile:py-2">
          <VisionDecorationBottomScrollSVG className="mx-auto h-12 w-10 mobile:h-6 mobile:w-5" />
          <p className="font-migrena text-xl/6 font-bold uppercase mobile:text-xs/5">SCROLL</p>
        </div>
      </div>
    </div>
  );
}
