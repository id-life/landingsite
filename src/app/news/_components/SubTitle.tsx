'use client';

import RightSVG from '@/../public/svgs/twin/right.svg?component';
import ClipBorderSVG from '@/../public/svgs/twin/clip-border.svg?component';
import SubscribeSVG from '@/../public/svgs/news/subscribe.svg?component';
import { isSubscribeShowAtom, subscribeTypeAtom } from '@/atoms/footer';
import { useSetAtom } from 'jotai';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { trackEvent } from '@/hooks/useGA';

export default function SubTitle() {
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);
  const setSubscribeType = useSetAtom(subscribeTypeAtom);

  const handleSubscribeClick = () => {
    setIsSubscribeShow(true);
    setSubscribeType('footer');
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_SHOW,
      label: GA_EVENT_LABELS.SUBSCRIBE_SHOW.FOOTER,
    });
  };

  return (
    <div className="relative border-2 border-white bg-[url(/imgs/news/news-logo-bg.webp)] bg-cover px-6 py-7.5 mobile:overflow-hidden mobile:p-3">
      <img
        className="absolute right-0 top-0 h-full mobile:-bottom-2.5 mobile:-right-1/3 mobile:top-auto mobile:h-[5rem]"
        src="/imgs/news/news-logo.webp"
        alt=""
      />
      <h2 className="text-4xl font-bold uppercase text-red-600 mobile:text-lg/8">Join our longevity circle</h2>
      <p className="text-lg/7.5 font-semibold mobile:text-xs/4.5">
        For <span className="text-red-600">priority</span> access to pioneer research
      </p>
      <div id="subscribe" className="mt-4.5 cursor-pointer gap-5 mobile:mt-3.5" onClick={handleSubscribeClick}>
        <div className="group relative flex h-[3.125rem] w-[12.25rem] items-center justify-between px-5 mobile:h-10 mobile:w-[9.25rem] mobile:px-3">
          <ClipBorderSVG className="absolute left-0 top-0 h-full w-full fill-red-600" />
          <div className="flex-center gap-2 text-base font-semibold text-red-600 mobile:gap-1.5 mobile:text-sm/4">
            <SubscribeSVG className="w-5 fill-red-600 mobile:w-4" />
            SUBSCRIBE
          </div>
          <RightSVG className="fill-red-600 stroke-red-600" />
        </div>
      </div>
    </div>
  );
}
