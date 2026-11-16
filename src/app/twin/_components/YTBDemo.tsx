import type { MouseEvent } from 'react';
import { track, youtubeId } from '@/lib/analytics/track';
import { DigitalTwinYoutubeLink } from '@/constants/links';
import RightSVG from '@/../public/svgs/twin/right.svg?component';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import ClipBorderSVG from '@/../public/svgs/twin/clip-border.svg?component';
import type { TwinDeck } from '@/app/twin/twin-deck';

/**
 * The DEMO link to the Digital Twin video, one component for both decks (RWD-02; it was YTBDemo and its mobile twin).
 * By deck: a framed 196 px button at the bottom left (desktop), or a text link under the headline (phone). The label
 * keeps the original's size and capitals; on coarse pointers it is hit within 44 px (tap-area), its
 * box is the original's (RWD-06).
 */
export default function YTBDemo({ deck }: { deck: TwinDeck }) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    track('video_open', { video_id: youtubeId(DigitalTwinYoutubeLink), placement: 'digital_twin' });
  };

  if (deck === 'phone') {
    return (
      <div id="ytb-demo" className="absolute left-5 top-[22rem] z-20 grid cursor-pointer gap-5">
        <a
          href={DigitalTwinYoutubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-[28px] items-center tap-area"
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

  return (
    // Bottom left, above the fixed slogan; sizes in the text unit (--t) where the original's were in layout units.
    <div
      id="ytb-demo"
      className="absolute bottom-[calc(var(--t)*10)] left-10 z-20 grid cursor-pointer gap-5 expanded:bottom-40 large:bottom-40"
    >
      <a
        href={DigitalTwinYoutubeLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group relative flex h-[calc(var(--t)*3.125)] w-[calc(var(--t)*12.25)] items-center justify-between px-5 tap-area"
      >
        <ClipBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-accent" />
        <div className="flex-center gap-2 text-base font-semibold group-hover:text-accent">
          <YoutubeSVG key="ytb-demo" className="w-[calc(var(--t)*1.25)] fill-black group-hover:fill-accent" />
          DEMO
        </div>
        <RightSVG className="fill-black stroke-black group-hover:fill-accent group-hover:stroke-accent" />
      </a>
    </div>
  );
}
