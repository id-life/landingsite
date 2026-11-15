'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import CornerBorder from '@/components/common/CornerBorder';
import FooterContactContent from '@/components/layout/footer/FooterContactContent';
import { InfoSVG } from '@/components/svg';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { trackChannelLink } from '@/lib/analytics/social';
import { submitNewsletter } from '@/utils/newsletter';
import { ORG_EMAIL, ORG_MAILTO } from '@/constants/contact';
import HoneypotField from '@/components/forms/HoneypotField';
import { FormEvent, useState } from 'react';

export default function NewsFooter() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const data = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitNewsletter(
      { email: String(data.get('EMAIL') ?? ''), website: String(data.get('website') ?? '') },
      'footer',
    );
    setIsSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    setIsSubmitted(true);
  };

  const handleLinkClick = (type: MediaLinkTypeKey) => trackChannelLink(type, Links[type], 'footer');

  return (
    <div className="relative z-10 -mx-5 flex flex-col pb-15 pt-30 mobile:mt-5 mobile:border-2 mobile:border-white mobile:bg-white/20 mobile:p-5 mobile:backdrop-blur-lg">
      {/* Desktop Layout */}
      <div className="flex items-start justify-between mobile:hidden">
        <div className="flex flex-col items-start gap-5 self-stretch">
          <img className="h-12 w-auto" src="/svgs/logo-en.svg" alt="" />
          <div className="mt-auto flex items-center gap-5">
            <a
              href={Links[MediaLinkType.Youtube]}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(MediaLinkType.Youtube)}
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <YoutubeSVG className="size-6 fill-black" />
              <span className="font-oxanium text-base font-bold uppercase">Youtube</span>
            </a>
            <a
              href={Links[MediaLinkType.Linkedin]}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <LinkedinSVG className="size-6 fill-black" />
              <span className="font-oxanium text-base font-bold uppercase">LinkedIn</span>
            </a>
            <a
              href={Links[MediaLinkType.Media]}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(MediaLinkType.Media)}
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <MediaSVG className="size-6 fill-black" />
              <span className="font-oxanium text-base font-bold uppercase">MediaKit</span>
            </a>
          </div>
        </div>
        <div className="font-oxanium text-base/5 font-bold uppercase">
          <p className="opacity-50">Contact</p>
          <div className="mt-7 flex items-center justify-start gap-1.5 font-poppins font-semibold">
            <img className="size-5" src="/svgs/home.svg" alt="" />3 Biopolis Dr, #01-15, Singapore 138623
          </div>
          <a
            href={ORG_MAILTO}
            data-track-placement="footer"
            className="mt-3 flex w-fit items-center justify-start gap-1.5 font-poppins font-semibold"
          >
            <img className="size-5" src="/svgs/contact-email.svg" alt="" />
            {ORG_EMAIL}
          </a>
        </div>
        <div className="font-oxanium text-base/5">
          <p className="font-bold uppercase opacity-50">SUBSCRIBE</p>
          <form id="subscribe-form" className="relative mt-7 flex flex-col" onSubmit={onFormSubmit}>
            <HoneypotField />
            <label htmlFor="news-subscribe-email" className="sr-only">
              Email
            </label>
            <div className="border-2 border-black p-3">
              <input
                id="news-subscribe-email"
                className="w-[25rem] bg-transparent font-poppins text-xs font-semibold"
                placeholder="Please enter email"
                type="email"
                inputMode="email"
                autoComplete="email"
                name="EMAIL"
                required
                aria-invalid={submitError ? true : undefined}
                aria-describedby={submitError ? 'news-subscribe-error' : undefined}
                defaultValue=""
              />
            </div>
            {submitError && (
              <p id="news-subscribe-error" role="alert" className="mt-2 font-poppins text-xs font-semibold text-red-600">
                {submitError}
              </p>
            )}
            <div className="mt-3 flex items-start gap-1.5 font-poppins text-xs font-semibold">
              <InfoSVG className="size-4 shrink-0" />
              Join our longevity circle for priority access to pioneer research
            </div>
            <div className="footer-submit-clip relative mt-3 h-11 w-[10.5rem] self-end bg-red-600 text-white">
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
              <input className="h-full w-full cursor-pointer font-poppins text-base/5 font-bold" type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Layout - reuse FooterContactContent */}
      <div className="hidden mobile:block">
        <FooterContactContent placement="footer" />
      </div>
    </div>
  );
}
