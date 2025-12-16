'use client';

import IdSVG from '@/../public/svgs/news/id.svg?component';
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

  const handleIdLifeClick = () => {
    window.open('/', '_blank');
  };

  const handleSubscribeClick = () => {
    setIsSubscribeShow(true);
    setSubscribeType('footer');
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_SHOW,
      label: GA_EVENT_LABELS.SUBSCRIBE_SHOW.FOOTER,
    });
  };

  return (
    <div className="flex-center gap-7.5">
      <div id="id.life" className="cursor-pointer gap-5">
        <div
          onClick={handleIdLifeClick}
          className="group relative flex h-[3.125rem] w-[12.25rem] items-center justify-between px-5"
        >
          <ClipBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-red-600" />
          <div className="flex-center gap-2 text-base font-semibold group-hover:text-red-600">
            <IdSVG className="w-5 fill-black group-hover:fill-red-600" />
            ID.LIFE
          </div>
          <RightSVG className="fill-black stroke-black group-hover:fill-red-600 group-hover:stroke-red-600" />
        </div>
      </div>
      <div id="subscribe" className="cursor-pointer gap-5" onClick={handleSubscribeClick}>
        <div className="group relative flex h-[3.125rem] w-[12.25rem] items-center justify-between px-5">
          <ClipBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-red-600" />
          <div className="flex-center gap-2 text-base font-semibold group-hover:text-red-600">
            <SubscribeSVG className="w-5 fill-black group-hover:fill-red-600" />
            SUBSCRIBE
          </div>
          <RightSVG className="fill-black stroke-black group-hover:fill-red-600 group-hover:stroke-red-600" />
        </div>
      </div>
    </div>
  );
}
