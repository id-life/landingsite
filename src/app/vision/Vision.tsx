import React from 'react';
import { NAV_LIST } from '@/components/nav/nav';
import VisionDecorationBottomScrollSVG from '@/../public/svgs/vision/vision-decoration-2.svg?component';

export default function Vision() {
  return (
    <div id={NAV_LIST[0].id} className="page-container">
      {/* pieces of decoration */}
      <div className="group absolute inset-0 -z-10 select-none">
        <img
          src="/imgs/vision-decoration-text.png"
          draggable={false}
          className="absolute bottom-24 left-1/2 w-[35.625rem] -translate-x-1/2"
          alt="Til Unlimited Human Healthy Lifespan"
        />
        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <VisionDecorationBottomScrollSVG className="h-12" />
          <p className="font-migrena text-xl/6 font-bold uppercase">SCROLL</p>
        </div>
      </div>
    </div>
  );
}
