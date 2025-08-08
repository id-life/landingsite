'use client';

import { FormEvent, useState } from 'react';
import jsonp from '@/utils/jsonp';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { GA_EVENT_LABELS } from '@/constants/ga';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import CheckedSVG from '@/../public/svgs/checked.svg?component';
import { MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import PodcastSVG from '@/../public/svgs/podcast.svg?component';
import XyzSVG from '@/../public/svgs/xyz.svg?component';
import { Links } from '@/constants/links';

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

    if (type === MediaLinkType.Podcast) {
      window.open(Links.podcast, '__blank');
    }
    if (type === MediaLinkType.Xyz) {
      window.open(Links.xyz, '__blank');
    }
  };

  return (
    <div className="relative z-10 flex items-stretch justify-between pb-15 pt-30 mobile:flex-col mobile:gap-10 mobile:px-5 mobile:pb-7.5 mobile:pt-15">
      <div className="flex flex-col items-start justify-between">
        <img className="w-[14.2rem]" src="/svgs/logo-en.svg" alt="" />
        <div className="flex items-center gap-7 mobile:mt-6">
          <YoutubeSVG
            onClick={() => handleLinkClick(MediaLinkType.Youtube)}
            className="size-6 cursor-pointer fill-black hover:fill-red-600"
          />
          <LinkedinSVG
            onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
            className="size-6 cursor-pointer fill-black hover:fill-red-600"
          />

          <MediaSVG
            onClick={() => handleLinkClick(MediaLinkType.Media)}
            className="size-6 cursor-pointer fill-black hover:fill-red-600"
          />
          <PodcastSVG
            onClick={() => handleLinkClick(MediaLinkType.Podcast)}
            className="size-6 cursor-pointer fill-black hover:fill-red-600"
          />
          <XyzSVG
            onClick={() => handleLinkClick(MediaLinkType.Xyz)}
            className="h-4.5 cursor-pointer fill-black hover:fill-red-600"
          />
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
      <div className="font-oxanium text-base/5">
        <p className="font-bold uppercase opacity-50">SUBSCRIBE</p>
        <form id="subscribe-form" className="mt-7 flex flex-col" onSubmit={onFormSubmit}>
          <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
          <input type="hidden" name="amp;id" value="af9154d6b5" />
          <input type="hidden" name="amp;f_id" value="00e418e1f0" />
          <div className="flex-1 border-2 border-black p-2">
            <input
              id="news-subscribe-email"
              className="w-[18rem] bg-transparent text-sm font-semibold"
              placeholder="Please enter email"
              type="email"
              name="EMAIL"
              required
              defaultValue=""
            />
          </div>
          <div className="mt-4 flex gap-1.5 font-poppins text-xs font-semibold opacity-50">
            <img className="ml-2 h-4" src="/svgs/info-2.svg" alt="" />
            Join our longevity circle for priority access to pioneer research
          </div>
          <div className="footer-submit-clip mt-3 w-[10.5rem] self-end bg-red-600 text-white">
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
            <input className="w-full cursor-pointer py-3 text-base/5 font-bold" type="submit" value="Subscribe" />
          </div>
        </form>
      </div>
    </div>
  );
}
