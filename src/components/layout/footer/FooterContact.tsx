'use client';

import { FormEvent, useRef, useState } from 'react';
import gsap from 'gsap';
import jsonp from '@/utils/jsonp';
import { useSetAtom } from 'jotai';
import { useGSAP } from '@gsap/react';
import { isSubscribeShowAtom } from '@/atoms/footer';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import CheckedSVG from '@/../public/svgs/checked.svg?component';
import BorderSVG from '@/../public/svgs/border.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import { FloatingPortal, useFloatingPortalNode } from '@floating-ui/react';
import { isMobile } from 'react-device-detect';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';

export enum MediaLinkType {
  Youtube = 'youtube',
  Linkedin = 'linkedin',
  Media = 'media',
}

export default function FooterContact() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);
  const portalNode = useFloatingPortalNode();

  const { trackEvent } = useGA();

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
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_LETTER,
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.FOOTER_CONTACT,
    });
  };

  const handleLinkClick = (type: MediaLinkType) => {
    trackEvent({
      name: GA_EVENT_NAMES.MEDIUM_CLICK,
      label: GA_EVENT_LABELS.MEDIUM_CLICK[type.toUpperCase() as Uppercase<keyof typeof MediaLinkType>],
    });

    if (type === MediaLinkType.Youtube) {
      window.open('https://www.youtube.com/@Immortal-Dragons', '__blank');
    }
    if (type === MediaLinkType.Linkedin) {
      window.open('https://www.linkedin.com/company/immortaldragons/', '__blank');
    }
    if (type === MediaLinkType.Media) {
      window.open('https://drive.google.com/drive/folders/1MGFLw-cX8gHeuo5XpY2K02XgbtKIXGNW?usp=sharing', '__blank');
    }
  };

  useGSAP(
    () => {
      if (!portalNode) return;
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'footerTimeline',
          trigger: wrapperRef.current,
          start: 'top bottom+=100%',
          end: 'bottom bottom+=80%',
          scrub: true,
          onEnter: () => {
            setIsSubscribeShow(true);
          },
          onLeaveBack: () => {
            setIsSubscribeShow(false);
          },
        },
      });
      timeline.to(subscribeRef.current, { bottom: isMobile ? '5rem' : '2.25rem' });
      timeline.to('.sound-button', { bottom: isMobile ? '25.5rem' : '22.5rem' }, '<');
      timeline.to('.scroll-title', { bottom: isMobile ? '25.5rem' : '22.5rem' }, '<');
    },
    { dependencies: [portalNode, isMobile] },
  );

  return (
    <>
      <div ref={wrapperRef} className="h-48" />
      <FloatingPortal>
        <div
          ref={subscribeRef}
          className="page-footer-contact fixed -bottom-80 z-10 flex w-full items-center justify-center mobile:inset-x-5 mobile:h-auto mobile:w-auto"
        >
          <div className="footer-contact-clip items mx-10 flex w-full justify-between bg-white/40 p-10 backdrop-blur mobile:p-4">
            <div>
              <img className="w-[8.125rem]" src="/svgs/logo.svg" alt="" />
              <div className="mt-18 flex gap-10">
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Youtube)}
                  className="flex-center group relative h-10 w-10 cursor-pointer"
                >
                  <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black group-hover:stroke-red-600" />
                  <YoutubeSVG className="size-6 fill-black group-hover:fill-red-600" />
                </div>
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
                  className="flex-center group relative h-10 w-10 cursor-pointer"
                >
                  <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black group-hover:stroke-red-600" />
                  <LinkedinSVG className="size-6 fill-black group-hover:fill-red-600" />
                </div>
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Media)}
                  className="flex-center group relative h-10 w-10 cursor-pointer"
                >
                  <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black group-hover:stroke-red-600" />
                  <MediaSVG className="size-6 fill-black group-hover:fill-red-600" />
                </div>
              </div>
            </div>
            <div className="font-oxanium text-base/5 font-bold uppercase">
              <p className="opacity-50">Contact</p>
              <div className="mt-7 flex items-center justify-start gap-1.5">
                <img src="/svgs/home.svg" alt="" />3 Biopolis Dr, #01-15, Singapore 138623
              </div>
              <div className="mt-3 flex items-center justify-start gap-1.5">
                <img src="/svgs/contact-email.svg" alt="" />
                contact@id.life
              </div>
            </div>
            <div className="font-oxanium text-base/5 font-bold">
              <p className="uppercase opacity-50">SUBSCRIBE</p>
              <form
                id="subscribe-form"
                className="mt-8 flex gap-4 px-2 mobile:mt-5 mobile:gap-3 mobile:px-0"
                onSubmit={onFormSubmit}
              >
                <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
                <input type="hidden" name="amp;id" value="af9154d6b5" />
                <input type="hidden" name="amp;f_id" value="00e418e1f0" />
                <div className="flex-1 border-2 border-black p-2 mobile:border">
                  <input
                    className="w-[18rem] bg-transparent text-sm font-semibold mobile:text-xs/5"
                    placeholder="Please enter email"
                    type="email"
                    name="EMAIL"
                    required
                    defaultValue=""
                  />
                </div>
                <div className="footer-submit-clip relative w-[10.5rem] bg-red-600 text-white mobile:w-[5.625rem]">
                  {isSubmitting ? (
                    <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-red-600">
                      <LoadingSVG className="w-6 animate-spin stroke-white stroke-[3]" />
                    </div>
                  ) : null}
                  {isSubmitted ? (
                    <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-red-600 font-bold">
                      <CheckedSVG className="w-6 stroke-white stroke-[3]" /> Success
                    </div>
                  ) : null}
                  <input
                    className="w-full cursor-pointer py-3 text-base/5 font-bold mobile:font-semibold"
                    type="submit"
                    value="Subscribe"
                  />
                </div>
              </form>
              <div className="mt-3.5 flex gap-1.5 font-poppins text-xs font-semibold">
                <img className="ml-2 h-4" src="/svgs/info-2.svg" alt="" />
                Join our longevity circle for priority access to pioneer research
              </div>
            </div>
          </div>
        </div>
      </FloatingPortal>
    </>
  );
}
