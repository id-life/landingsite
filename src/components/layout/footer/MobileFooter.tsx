'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import { mobileCurrentPageAtom } from '@/atoms';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { NAV_LIST } from '@/components/nav/nav';
import jsonp from '@/utils/jsonp';
import { FloatingPortal, useFloatingPortalNode } from '@floating-ui/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { FormEvent, useEffect, useRef, useState } from 'react';

export default function MobileFooter() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);
  const portalNode = useFloatingPortalNode();
  const currentPage = useAtomValue(mobileCurrentPageAtom);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value: any, key) => params.append(key, value));
    const querystring = params.toString();
    setIsSubmitting(true);
    jsonp(`https://life.us11.list-manage.com/subscribe/post-json?${querystring}`).then(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    });
  };

  const open = () => {
    gsap.to('.page-footer', { bottom: '5rem' });
    gsap.to('.footer-box-clip', { width: '100%', height: 'auto' });
  };
  const close = () => {
    gsap.to('.page-footer', { bottom: '-40rem' });
    gsap.to('.footer-box-clip', { width: '0', height: '0' });
  };

  useEffect(() => {
    if (currentPage.id !== NAV_LIST[2].id) return;
    if (isSubscribeShow) {
      open();
    } else {
      close();
    }
  }, [isSubscribeShow, currentPage]);

  useGSAP(
    () => {
      if (!portalNode) return;
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'footerTimeline',
          trigger: wrapperRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onEnter: () => {
            open();
          },
          onLeaveBack: () => {
            close();
          },
        },
      });
      timeline.to(subscribeRef.current, { bottom: '5rem' });
      timeline.to('.footer-box-clip', { width: '100%', height: 'auto' }, '<');
    },
    { dependencies: [portalNode] },
  );

  return (
    <>
      <div ref={wrapperRef} className="h-48" />
      <FloatingPortal>
        <div
          ref={subscribeRef}
          className="page-footer fixed -bottom-40 z-20 flex h-48 w-full items-center justify-center mobile:inset-x-5 mobile:h-auto mobile:w-auto"
        >
          <div className="footer-box-clip h-0 w-0 bg-red-600 px-7.5 py-9 text-white mobile:px-4 mobile:py-7.5">
            <h3 className="font-oxanium text-3xl font-bold uppercase mobile:text-2xl/7.5">SUBSCRIBE</h3>
            <form
              id="subscribe-form"
              className="mt-8 flex gap-4 px-2 mobile:mt-5 mobile:gap-3 mobile:px-0"
              onSubmit={onFormSubmit}
            >
              <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
              <input type="hidden" name="amp;id" value="af9154d6b5" />
              <input type="hidden" name="amp;f_id" value="00e418e1f0" />
              <div className="flex-1 border-2 border-white p-2 mobile:border">
                <input
                  className="w-full bg-transparent text-sm font-semibold placeholder:text-white/80 mobile:text-xs/5"
                  placeholder="Please enter email"
                  type="email"
                  name="EMAIL"
                  required
                  defaultValue=""
                />
              </div>
              <div className="footer-submit-clip relative w-[10.5rem] bg-white text-red-600 mobile:w-[5.625rem]">
                {isSubmitting ? (
                  <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-white">
                    <LoadingSVG className="w-6 animate-spin stroke-red-600 stroke-[3]" />
                  </div>
                ) : null}
                {isSubmitted ? (
                  <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-white font-bold">
                    <CheckedSVG className="w-6 stroke-red-600 stroke-[3]" /> Success
                  </div>
                ) : null}
                <input
                  className="w-full cursor-pointer py-3 text-base/5 font-bold mobile:font-semibold"
                  type="submit"
                  value="Subscribe"
                />
              </div>
            </form>
          </div>
        </div>
      </FloatingPortal>
    </>
  );
}
