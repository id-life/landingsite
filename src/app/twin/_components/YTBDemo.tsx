import { track, youtubeId } from '@/lib/analytics/track';
import { DigitalTwinYoutubeLink } from '@/constants/links';
import RightSVG from '@/../public/svgs/twin/right.svg?component';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import ClipBorderSVG from '../../../../public/svgs/twin/clip-border.svg?component';

export default function YTBDemo() {
  const handleClick = () => track('video_open', { video_id: youtubeId(DigitalTwinYoutubeLink), placement: 'digital_twin' });

  return (
    <div id="ytb-demo" className="absolute bottom-40 left-10 z-20 grid cursor-pointer gap-5">
      <a
        href={DigitalTwinYoutubeLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group relative flex h-[3.125rem] w-[12.25rem] items-center justify-between px-5"
      >
        <ClipBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-accent" />
        <div className="flex-center gap-2 text-base font-semibold group-hover:text-accent">
          <YoutubeSVG key="ytb-demo" className="w-5 fill-black group-hover:fill-accent" />
          DEMO
        </div>
        <RightSVG className="fill-black stroke-black group-hover:fill-accent group-hover:stroke-accent" />
      </a>
    </div>
  );
}
