import DemoBorderSVG from '@/../public/svgs/twin/demo-border.svg?component';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import RightSVG from '@/../public/svgs/twin/right.svg?component';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useCallback } from 'react';
import { DigitalTwinYoutubeLink } from '@/constants/links';

export default function YTBDemo() {
  const { trackEvent } = useGA();

  const handleYTBLinkClick = useCallback(
    (url: string) => () => {
      window.open(url, '_blank');
      trackEvent({
        name: GA_EVENT_NAMES.DT_DEMO,
      });
    },
    [trackEvent],
  );

  return (
    <div id="ytb-demo" className="absolute bottom-40 left-10 z-20 grid cursor-pointer gap-5">
      <div
        onClick={handleYTBLinkClick(DigitalTwinYoutubeLink)}
        className="group relative flex h-[3.125rem] w-[12.25rem] items-center justify-between px-5"
      >
        <DemoBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-red-600" />
        <div className="flex-center gap-2 text-base font-semibold group-hover:text-red-600">
          <YoutubeSVG className="fill-black group-hover:fill-red-600" />
          DEMO
        </div>
        <RightSVG className="fill-black stroke-black group-hover:fill-red-600 group-hover:stroke-red-600" />
      </div>
    </div>
  );
}
