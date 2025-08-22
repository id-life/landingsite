'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import { isSubscribeShowAtom } from '@/atoms/footer';
import CornerBorder from '@/components/common/CornerBorder';
import { InfoSVG } from '@/components/svg';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { useGA } from '@/hooks/useGA';
import jsonp from '@/utils/jsonp';
import { FloatingPortal, useFloatingPortalNode } from '@floating-ui/react';
import { useGSAP } from '@gsap/react';
import { clsx } from 'clsx';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

export default function FooterContact() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);
  const portalNode = useFloatingPortalNode();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { trackEvent } = useGA();

  const onFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => params.append(key, value));
    const querystring = params.toString();
    setIsSubmitting(true);
    jsonp(`https://life.us11.list-manage.com/subscribe/post-json?${querystring}`).finally(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    });

    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_LETTER,
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.FOOTER_CONTACT,
    });
  };

  const handleLinkClick = (type: MediaLinkTypeKey) => {
    trackEvent({
      name: GA_EVENT_NAMES.MEDIUM_CLICK,
      label: GA_EVENT_LABELS.MEDIUM_CLICK[type.toUpperCase() as Uppercase<MediaLinkTypeKey>],
    });

    if (type === MediaLinkType.Youtube) {
      window.open(Links.youtube, '__blank');
    }
    if (type === MediaLinkType.Linkedin) {
      window.open(Links.linkedin, '__blank');
    }
    if (type === MediaLinkType.Media) {
      window.open(Links.media, '__blank');
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
              <div className="mt-18 flex gap-5">
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Youtube)}
                  className="group relative flex h-10 cursor-pointer items-center justify-center gap-1 px-2.5 py-2 transition duration-300 hover:text-red-600"
                >
                  <CornerBorder />
                  <YoutubeSVG className="size-6 fill-black transition duration-300 group-hover:fill-red-600" />
                  <span className="font-oxanium text-base/5 font-bold uppercase">YOUTUBE</span>
                </div>
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
                  className="group relative flex h-10 cursor-pointer items-center justify-center gap-1 px-2.5 py-2 transition duration-300 hover:text-red-600"
                >
                  <CornerBorder />
                  <LinkedinSVG className="-mt-0.5 size-6 fill-black transition duration-300 group-hover:fill-red-600" />
                  <span className="font-oxanium text-base/5 font-bold uppercase transition duration-300">LINKEDIN</span>
                </div>
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Media)}
                  className="group relative flex h-10 cursor-pointer items-center justify-center gap-1 px-2.5 py-2 font-oxanium text-base/4 font-bold transition duration-300 hover:text-red-600"
                >
                  <CornerBorder />
                  <MediaSVG className="size-6 fill-black transition duration-300 group-hover:fill-red-600" />
                  <span className="font-oxanium text-base/5 font-bold uppercase">MEDIAKIT</span>
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
                className="relative mt-8 flex gap-4 mobile:mt-5 mobile:gap-3 mobile:px-0"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                {errors.EMAIL && (
                  <span className="absolute -top-6 font-poppins text-xs font-semibold text-red-600">
                    {errors.EMAIL.message}
                  </span>
                )}
                <input type="hidden" {...register('u')} value="e6f88de977cf62de3628d944e" />
                <input type="hidden" {...register('amp;id')} value="af9154d6b5" />
                <input type="hidden" {...register('amp;f_id')} value="00e418e1f0" />
                <div className={clsx('flex-1 border-2 p-2', errors.EMAIL ? 'border-red-600' : 'border-black')}>
                  <input
                    className="w-[18rem] bg-transparent text-sm font-semibold mobile:text-xs/5"
                    placeholder="Please enter email"
                    defaultValue=""
                    {...register('EMAIL', {
                      required: 'Please fill in this field',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter email address',
                      },
                    })}
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
                    value="Submit"
                  />
                </div>
              </form>
              <div className="mt-3.5 flex gap-1.5 font-poppins text-xs font-semibold">
                <InfoSVG className="ml-2 size-4" />
                Join our longevity circle for priority access to pioneer research
              </div>
            </div>
          </div>
        </div>
      </FloatingPortal>
    </>
  );
}
