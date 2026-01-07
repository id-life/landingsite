'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import CornerBorder from '@/components/common/CornerBorder';
import FooterContactContent from '@/components/layout/footer/FooterContactContent';
import { InfoSVG } from '@/components/svg';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { useGA } from '@/hooks/useGA';
import jsonp from '@/utils/jsonp';
import { FormEvent, useState } from 'react';

export default function NewsFooter() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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

  return (
    <div className="relative z-10 -mx-5 flex flex-col border-2 border-white bg-white/20 pb-15 pt-30 backdrop-blur-lg mobile:mt-5 mobile:p-5">
      {/* Desktop Layout */}
      <div className="flex items-start justify-between mobile:hidden">
        <div className="flex flex-col items-start gap-5 self-stretch">
          <img className="h-12 w-auto" src="/svgs/logo-en.svg" alt="" />
          <div className="mt-auto flex items-center gap-5">
            <div
              onClick={() => handleLinkClick(MediaLinkType.Youtube)}
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <YoutubeSVG className="size-6 fill-black" />
              <span className="font-oxanium text-base font-bold uppercase">Youtube</span>
            </div>
            <div
              onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <LinkedinSVG className="size-6 fill-black" />
              <span className="font-oxanium text-base font-bold uppercase">LinkedIn</span>
            </div>
            <div
              onClick={() => handleLinkClick(MediaLinkType.Media)}
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <MediaSVG className="size-6 fill-black" />
              <span className="font-oxanium text-base font-bold uppercase">MediaKit</span>
            </div>
          </div>
        </div>
        <div className="font-oxanium text-base/5 font-bold uppercase">
          <p className="opacity-50">Contact</p>
          <div className="mt-7 flex items-center justify-start gap-1.5 font-poppins font-semibold">
            <img className="size-5" src="/svgs/home.svg" alt="" />3 Biopolis Dr, #01-15, Singapore 138623
          </div>
          <div className="mt-3 flex items-center justify-start gap-1.5 font-poppins font-semibold">
            <img className="size-5" src="/svgs/contact-email.svg" alt="" />
            contact@id.life
          </div>
        </div>
        <div className="font-oxanium text-base/5">
          <p className="font-bold uppercase opacity-50">SUBSCRIBE</p>
          <form id="subscribe-form" className="mt-7 flex flex-col" onSubmit={onFormSubmit}>
            <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
            <input type="hidden" name="amp;id" value="af9154d6b5" />
            <input type="hidden" name="amp;f_id" value="00e418e1f0" />
            <div className="border-2 border-black p-3">
              <input
                id="news-subscribe-email"
                className="w-[25rem] bg-transparent font-poppins text-xs font-semibold"
                placeholder="Please enter email"
                type="email"
                name="EMAIL"
                required
                defaultValue=""
              />
            </div>
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
        <FooterContactContent />
      </div>
    </div>
  );
}
