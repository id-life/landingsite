'use client';

import RightSVG from '@/../public/svgs/twin/right.svg?component';
import ClipBorderSVG from '@/../public/svgs/twin/clip-border.svg?component';
import SubscribeSVG from '@/../public/svgs/news/subscribe.svg?component';
import { subscribePopupAtom } from '@/atoms/footer';
import { useSetAtom } from 'jotai';
import { SUBSCRIBE_TRIGGER } from '@/hooks/useSubscribeDialog';

export default function SubTitle() {
  const subscribePopup = useSetAtom(subscribePopupAtom);

  const handleSubscribeClick = () => subscribePopup({ type: 'open', placement: 'content' });

  return (
    <div className="relative isolate border-2 border-white bg-[url(/imgs/news/news-logo-bg.webp)] bg-cover px-6 py-7.5 mobile:overflow-hidden mobile:p-3">
      <img
        className="absolute right-0 top-0 z-0 h-full mobile:-bottom-2.5 mobile:-right-1/3 mobile:top-auto mobile:h-[5rem]"
        src="/imgs/news/news-logo.webp"
        alt=""
      />
      <h2 className="relative z-10 text-4xl font-bold uppercase text-red-600 mobile:text-lg/8">Join our longevity circle</h2>
      <p className="relative z-10 text-lg/7.5 font-semibold mobile:text-xs/4.5">
        For <span className="text-red-600">priority</span> access to pioneer research
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
          <ClipBorderSVG className="absolute left-0 top-0 h-full w-full fill-red-600" />
          <span className="flex-center gap-2 text-base font-semibold text-red-600 mobile:gap-1.5 mobile:text-sm/4">
            <SubscribeSVG className="w-5 fill-red-600 mobile:w-4" />
            SUBSCRIBE
          </span>
          <RightSVG className="fill-red-600 stroke-red-600" />
        </span>
      </button>
    </div>
  );
}
