import React from 'react';
import VisionDecorationRightBottomSVG from '@/../public/svgs/vision/vision-decoration-1.svg?component';
import VisionDecorationBottomScrollSVG from '@/../public/svgs/vision/vision-decoration-2.svg?component';
import VisionDecorationCircleSVG from '@/../public/svgs/vision/vision-decoration-3.svg?component';
import VisionGL from '@/components/gl/VisionGL';

export default function Vision() {
  return (
    <div className="page-container">
      <div className="absolute left-0 top-0 size-full">
        <VisionGL />
      </div>
      <div className="absolute bottom-10 left-10 flex select-none items-center gap-1.5">
        <VisionDecorationRightBottomSVG className="h-12" />
        <p className="whitespace-pre-wrap font-poppins text-base/4.5 font-bold uppercase text-black">
          {'Our goal is to increase global\nawareness of longevity'}
        </p>
      </div>
      {/* pieces of decoration */}
      <div className="group absolute inset-0 -z-10 select-none">
        <img
          src="/imgs/vision-decoration-text.png"
          draggable={false}
          className="absolute bottom-24 left-1/2 w-[35.625rem] -translate-x-1/2"
          alt="Til Unlimited Human Healthy Lifespan"
        />
        <div className="absolute left-10 top-[calc(50%_-_14rem)] h-2 w-6 bg-black" />
        <div className="absolute left-10 top-[calc(50%_+_14rem)] h-2 w-9 bg-black" />
        <div className="absolute right-10 top-[calc(50%_+_14rem)] h-4 w-4 bg-black" />
        <div className="absolute right-[13.5rem] top-[calc(50%_-_14rem)] h-4 w-4 bg-black" />
        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <VisionDecorationBottomScrollSVG className="h-12" />
          <p className="font-migrena text-xl/6 font-bold uppercase">SCROLL</p>
        </div>
        <VisionDecorationCircleSVG className="absolute right-10 top-[calc(50%_-_14rem)] h-4 w-4" />
      </div>
    </div>
  );
}
