import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import React from 'react';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { DigitalTwinYoutubeLink } from '@/constants/links';

export default function YTBDemo() {
  const { trackEvent } = useGA();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent({
      name: GA_EVENT_NAMES.DT_DEMO,
    });
  };
  return (
    <div id="ytb-demo" className="absolute left-5 top-[22rem] z-20 grid cursor-pointer gap-5">
      <a
        href={DigitalTwinYoutubeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-[28px] items-center"
        onClick={handleClick}
      >
        <div className="flex-center gap-2 text-sm font-medium group-hover:text-red-600">
          <YoutubeSVG className="w-4 fill-black group-hover:fill-red-600" />
          DEMO
        </div>
        {/* <RightSVG className="fill-black stroke-black group-hover:fill-red-600 group-hover:stroke-red-600 ml-2" /> */}
        <img src="/imgs/twin/arrow.webp" alt="" className="ml-1 h-2 w-3" />
      </a>
    </div>
  );
}
