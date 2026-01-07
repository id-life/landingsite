'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import ContactEmailSVG from '@/../public/svgs/contact-email.svg?component';
import HomeSVG from '@/../public/svgs/home.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import CornerBorder from '@/components/common/CornerBorder';
import { InfoSVG } from '@/components/svg';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import jsonp from '@/utils/jsonp';
import clsx from 'clsx';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

export default function FooterContactContent() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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
      label: GA_EVENT_LABELS.MEDIUM_CLICK[type.toUpperCase() as Uppercase<keyof typeof MediaLinkType>],
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
    <div className="text-black">
      <h3 className="font-oxanium text-2xl/[30px] font-bold uppercase">CONNECT</h3>
      <div className="mt-3 flex justify-center gap-5">
        <div
          onClick={() => handleLinkClick(MediaLinkType.Youtube)}
          className="flex-center relative h-8 w-[98px] cursor-pointer gap-1"
        >
          <CornerBorder hoverColor="#000" />
          <YoutubeSVG className="size-5 fill-black" />
          <span className="font-oxanium text-xs/3 font-bold">YOUTUBE</span>
        </div>
        <div
          onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
          className="flex-center relative h-8 w-[98px] cursor-pointer gap-1"
        >
          <CornerBorder hoverColor="#000" />
          <LinkedinSVG className="size-5 fill-black" />
          <span className="font-oxanium text-xs/3 font-bold">LINKEDIN</span>
        </div>
        <div
          onClick={() => handleLinkClick(MediaLinkType.Media)}
          className="flex-center relative h-8 w-[98px] cursor-pointer gap-1"
        >
          <CornerBorder hoverColor="#000" />
          <MediaSVG className="size-5 fill-black" />
          <span className="font-oxanium text-xs/3 font-bold">MEDIAKIT</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-1.5 font-oxanium text-xs/[15px] font-bold uppercase">
        <div className="flex items-center gap-1">
          <HomeSVG className="size-5" />
          <span>3 BIOPOLIS DR, #01-15, SINGAPORE 138623</span>
        </div>
        <div className="flex items-center gap-1">
          <ContactEmailSVG className="size-5" />
          <span>CONTACT@ID.LIFE</span>
        </div>
      </div>
      <div className="my-4 h-px w-full bg-black/20" />
      <form id="subscribe-form" className="relative flex justify-between gap-3" onSubmit={handleSubmit(onFormSubmit)}>
        {errors.EMAIL && (
          <span className="absolute -top-6 font-poppins text-xs font-semibold text-red-600">{errors.EMAIL.message}</span>
        )}
        <input type="hidden" {...register('u')} value="e6f88de977cf62de3628d944e" />
        <input type="hidden" {...register('amp;id')} value="af9154d6b5" />
        <input type="hidden" {...register('amp;f_id')} value="00e418e1f0" />
        <div className={clsx('flex-center h-11 w-full border-2 px-3', errors.EMAIL ? 'border-red-600' : 'border-black')}>
          <input
            className="w-full bg-transparent font-poppins text-xs/5 font-semibold placeholder:text-[#747374]"
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
        <div className="footer-submit-clip relative h-11 w-[90px] bg-red-600 text-white">
          {isSubmitting ? (
            <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center">
              <LoadingSVG className="w-6 animate-spin stroke-white stroke-[3]" />
            </div>
          ) : null}
          {isSubmitted ? (
            <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center font-bold">
              <CheckedSVG className="w-6 stroke-white stroke-[3]" />
            </div>
          ) : null}
          <input
            className={cn('w-[5.625rem] cursor-pointer py-3 font-poppins text-base/5 font-semibold', {
              'text-red-600': isSubmitting || isSubmitted,
            })}
            type="submit"
            value="Submit"
          />
        </div>
      </form>
      <div className="mt-3 flex gap-1.5 font-poppins text-xs/5 font-semibold text-black/50">
        <InfoSVG className="size-4 shrink-0" />
        Join our longevity circle for priority access to pioneer research
      </div>
    </div>
  );
}
