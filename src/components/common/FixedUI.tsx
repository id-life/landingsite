'use client';

import React from 'react';
import ToggleSoundButton from '@/components/common/ToggleSoundButton';
import VisionDecorationCircleSVG from '@/../public/svgs/vision/vision-decoration-3.svg?component';
import VisionDecorationRightBottomSVG from '@/../public/svgs/vision/vision-decoration-1.svg?component';
import FixedValue from '@/app/value/FixedValue';

export default function FixedUI() {
  return (
    <>
      <div className="fixed-top fixed left-10 top-[calc(50%_-_14rem)] h-2 w-6 bg-foreground transition duration-300" />
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_14rem)] h-2 w-9 bg-foreground transition duration-300" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] h-4 w-4 bg-foreground transition duration-300" />
      <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_14rem)] h-4 w-4 bg-foreground transition duration-300" />
      <div className="fixed bottom-10 left-10 flex select-none items-center gap-1.5">
        <VisionDecorationRightBottomSVG className="h-12 fill-foreground transition duration-300" />
        <p className="whitespace-pre-wrap font-poppins text-base/4.5 font-bold uppercase text-foreground transition duration-300">
          {'Our goal is to increase global\nawareness of longevity'}
        </p>
      </div>
      <VisionDecorationCircleSVG className="fixed-top fixed right-10 top-[calc(50%_-_14rem)] h-4 w-4 fill-foreground stroke-foreground transition duration-300" />
      <ToggleSoundButton className="fixed bottom-10 right-10 z-10 mobile:hidden" />
      <FixedValue />
    </>
  );
}
