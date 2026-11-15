import React from 'react';
import { track, youtubeId } from '@/lib/analytics/track';
import { DigitalTwinYoutubeLink } from '@/constants/links';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';

export default function YTBDemo() {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    track('video_open', { video_id: youtubeId(DigitalTwinYoutubeLink), placement: 'digital_twin' });
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
        <div className="flex-center gap-2 text-sm font-medium">
          <YoutubeSVG className="w-4 fill-black" />
          DEMO
        </div>
        <img src="/imgs/twin/arrow.webp" alt="" className="ml-1 h-2 w-3" />
      </a>
    </div>
  );
}
