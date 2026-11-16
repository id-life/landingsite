'use client';

import RightSVG from '@/../public/svgs/twin/right.svg?component';
import ClipBorderSVG from '@/../public/svgs/twin/clip-border.svg?component';
import SubscribeSVG from '@/../public/svgs/news/subscribe.svg?component';
import { requestSubscribe } from '@/components/site/subscribe-events';
import { SUBSCRIBE_TRIGGER } from '@/hooks/subscribe-trigger';

export default function SubTitle() {
  // A DOM event, not jotai (PERF-10): the page's SubscribePopup loads the popup on the first request.
  const handleSubscribeClick = () => requestSubscribe({ type: 'open', placement: 'content' });

  return (
    <div className="relative isolate border-2 border-white bg-[url(/imgs/news/news-logo-bg.webp)] bg-cover px-6 py-7.5 mobile:overflow-hidden mobile:p-3">
      <img
        // Tablets: the dragon keeps the right half and its height, as in the original, so the text and the art each keep
        // their own half (the taller banner made it larger and pushed it under the text).
        className="absolute right-0 top-0 z-0 h-full mobile:-bottom-2.5 mobile:-right-1/3 mobile:top-auto mobile:h-[5rem] medium:h-auto medium:max-h-full medium:w-1/2 medium:object-contain medium:object-right expanded:h-auto expanded:max-h-full expanded:w-1/2 expanded:object-contain expanded:object-right"
        src="/imgs/news/news-logo.webp"
        alt=""
      />
      {/* Title and line kept at their original 36 and 18 px: the title role (44 at 1920) ran the title into the dragon
          art, which wave 0 keeps clear. */}
      <h2 className="relative z-10 text-4xl font-bold uppercase text-accent mobile:text-lg/8 medium:text-title-sm expanded:text-title">
        Join our longevity circle
      </h2>
      <p className="relative z-10 text-lg/7.5 font-semibold mobile:text-xs/4.5 medium:text-body-sm expanded:text-body">
        For <span className="text-accent">priority</span> access to pioneer research
      </p>
      <button
        type="button"
        id="subscribe"
        {...SUBSCRIBE_TRIGGER}
        aria-haspopup="dialog"
        className="relative z-10 mt-4.5 block cursor-pointer gap-5 mobile:mt-3.5"
        onClick={handleSubscribeClick}
      >
        <span className="group relative flex h-[3.125rem] w-[12.25rem] items-center justify-between px-5 mobile:h-10 mobile:w-[9.25rem] mobile:px-3">
          <ClipBorderSVG className="absolute left-0 top-0 h-full w-full fill-accent" />
          <span className="flex-center gap-2 text-body font-semibold text-accent mobile:gap-1.5 mobile:text-label mobile:leading-4">
            <SubscribeSVG className="w-5 fill-accent mobile:w-4" />
            SUBSCRIBE
          </span>
          <RightSVG className="fill-accent stroke-accent" />
        </span>
      </button>
    </div>
  );
}
