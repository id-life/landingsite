'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import jsonp from '@/utils/jsonp';
import { useGA } from '@/hooks/useGA';
import { InfoSVG } from '@/components/svg';
import { SubmitHandler, useForm } from 'react-hook-form';
import MediaSVG from '@/../public/svgs/media.svg?component';
import BorderSVG from '@/../public/svgs/border.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import CheckedSVG from '@/../public/svgs/checked.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { cn } from '@/utils';
import { motion } from 'motion/react';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

export default function AboutFooter() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { trackEvent } = useGA();

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
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.FOOTER,
    });
  };

  return (
    <>
      <div className="fixed bottom-9 z-10 flex w-full items-center justify-center mobile:hidden">
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
            <form
              id="subscribe-form"
              className="relative mt-8 flex gap-4 px-2 mobile:mt-5 mobile:gap-3 mobile:px-0"
              onSubmit={handleSubmit(onFormSubmit)}
            >
              {errors.EMAIL && (
                <span className="absolute -top-6 font-poppins text-xs text-red-600">{errors.EMAIL.message}</span>
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
      <div className="fixed inset-x-0 bottom-0 z-40 hidden origin-center border-2 border-white bg-white/20 p-4 pt-5 text-black backdrop-blur-xl mobile:block">
        <h3 className="font-oxanium text-2xl/7.5 font-bold uppercase">SUBSCRIBE</h3>
        <form id="subscribe-form" className="relative mt-5 flex gap-3" onSubmit={handleSubmit(onFormSubmit)}>
          {errors.EMAIL && (
            <span className="absolute -top-6 font-poppins text-xs font-semibold text-red-600">{errors.EMAIL.message}</span>
          )}
          <input type="hidden" {...register('u')} value="e6f88de977cf62de3628d944e" />
          <input type="hidden" {...register('amp;id')} value="af9154d6b5" />
          <input type="hidden" {...register('amp;f_id')} value="00e418e1f0" />
          <div className={clsx('flex-center h-11 flex-1 border-2 p-3', errors.EMAIL ? 'border-red-600' : 'border-black')}>
            <input
              className="w-full bg-transparent text-xs/5 font-semibold placeholder:text-black"
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
          <div className="footer-submit-clip relative h-11 w-[5.625rem] bg-red-600 text-white">
            {isSubmitting ? (
              <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center">
                <LoadingSVG className="w-6 animate-spin stroke-white stroke-[3]" />
              </div>
            ) : null}
            {isSubmitted ? (
              <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center font-bold">
                <CheckedSVG className="w-6 stroke-white stroke-[3]" /> Success
              </div>
            ) : null}
            <input
              className={cn('w-full cursor-pointer py-3 text-base/5 font-semibold', {
                'text-red-600': isSubmitting || isSubmitted,
              })}
              type="submit"
              value="Submit"
            />
          </div>
        </form>
        <div className="mt-2 flex gap-1 font-poppins text-xs font-semibold">
          <InfoSVG className="h-4" />
          Join our longevity circle for priority access to pioneer research
        </div>
        <div className="mb-3 mt-4 h-px w-full bg-black/10" />
        <div className="flex-center gap-5">
          <div onClick={() => handleLinkClick(MediaLinkType.Youtube)} className="flex-center relative cursor-pointer gap-1 p-2">
            <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black" />
            <YoutubeSVG className="size-4 fill-black" />
            <span className="font-oxanium text-xs font-bold">YOUTUBE</span>
          </div>
          <div
            onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
            className="flex-center relative cursor-pointer gap-1 p-2"
          >
            <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black" />
            <LinkedinSVG className="size-4 fill-black" />
            <span className="font-oxanium text-xs font-bold">LINKEDIN</span>
          </div>
          <div onClick={() => handleLinkClick(MediaLinkType.Media)} className="flex-center relative cursor-pointer gap-1 p-2">
            <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-black" />
            <MediaSVG className="size-4 fill-black" />
            <span className="font-oxanium text-xs font-bold">MEDIAKIT</span>
          </div>
        </div>
        <p className="mt-6 text-center font-oxanium text-[.625rem]/3 font-semibold uppercase opacity-60">
          e- mail: contact@id.life
          <br />
          t- Biopolis Dr, #01-15, Singapore 138623
        </p>
      </div>
    </>
  );
}
