'use client';

import { FormEvent, useRef, useState } from 'react';
import gsap from 'gsap';
import jsonp from '@/utils/jsonp';
import { useSetAtom } from 'jotai';
import { useGSAP } from '@gsap/react';
import { useGA } from '@/hooks/useGA';
import { isMobile } from 'react-device-detect';
import { isSubscribeShowAtom } from '@/atoms/footer';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import CheckedSVG from '@/../public/svgs/checked.svg?component';
import BorderSVG from '@/../public/svgs/border.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import { FloatingPortal, useFloatingPortalNode } from '@floating-ui/react';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { ValueOf } from '@/constants/config';
import { getEmailError } from '@/utils/validation';

export const MediaLinkType = {
  Youtube: 'youtube',
  Linkedin: 'linkedin',
  Media: 'media',
  Podcast: 'podcast',
  Xyz: 'xyz',
} as const;

export type MediaLinkTypeKey = ValueOf<typeof MediaLinkType>;

export default function FooterContact() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);
  const portalNode = useFloatingPortalNode();

  const { trackEvent } = useGA();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // 清除之前的错误
    if (emailError) {
      const error = getEmailError(value);
      setEmailError(error);
    }
  };

  const handleEmailBlur = () => {
    const error = getEmailError(email);
    setEmailError(error);
  };

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    // 验证邮箱
    const error = getEmailError(email);
    if (error) {
      setEmailError(error);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value: any, key) => params.append(key, value));
    const querystring = params.toString();
    setIsSubmitting(true);
    jsonp(`https://life.us11.list-manage.com/subscribe/post-json?${querystring}`).then(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail(''); // 清空输入
      setEmailError(''); // 清空错误
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
      window.open('https://www.youtube.com/@Immortal-Dragons', '__blank');
    }
    if (type === MediaLinkType.Linkedin) {
      window.open('https://www.linkedin.com/company/immortaldragons/', '__blank');
    }
    if (type === MediaLinkType.Media) {
      window.open('https://drive.google.com/drive/folders/1vajrjCq-nAX1LVSzJ_fETL2GKI0-ckrG', '__blank');
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
                  className="flex-center group relative h-10 cursor-pointer gap-1.5 p-2"
                >
                  <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black group-hover:stroke-red-600" />
                  <YoutubeSVG className="size-6 fill-black group-hover:fill-red-600" />
                  <span className="font-oxanium text-base/5 font-bold group-hover:text-red-600">YOUTUBE</span>
                </div>
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
                  className="group relative flex h-10 cursor-pointer items-center justify-center gap-1.5 p-2 font-oxanium text-base/4 font-bold hover:text-red-600"
                >
                  <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black group-hover:stroke-red-600" />
                  <LinkedinSVG className="size-6 fill-black group-hover:fill-red-600" /> LINKEDIN
                </div>
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Media)}
                  className="group relative flex h-10 cursor-pointer items-center justify-center gap-1.5 p-2 font-oxanium text-base/4 font-bold hover:text-red-600"
                >
                  <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black group-hover:stroke-red-600" />
                  <MediaSVG className="size-6 fill-black group-hover:fill-red-600" /> MEDIAKIT
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

              <form id="subscribe-form" className="mt-8 px-2 mobile:mt-5 mobile:gap-3 mobile:px-0" onSubmit={onFormSubmit}>
                <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
                <input type="hidden" name="amp;id" value="af9154d6b5" />
                <input type="hidden" name="amp;f_id" value="00e418e1f0" />

                <div className="flex-1">
                  <div className="relative flex gap-4">
                    {emailError && <p className="absolute -top-5 left-0 text-xs text-red-600">{emailError}</p>}
                    <div className={`border-2 p-2 mobile:border ${emailError ? 'border-red-600' : 'border-black'}`}>
                      <input
                        className="w-[18rem] bg-transparent text-sm font-semibold mobile:text-xs/5"
                        placeholder="Please enter email"
                        type="text"
                        name="EMAIL"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
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
                  </div>
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
