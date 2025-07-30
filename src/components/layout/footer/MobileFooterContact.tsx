'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import BorderSVG from '@/../public/svgs/border.svg?component';
import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import jsonp from '@/utils/jsonp';
import { FloatingPortal } from '@floating-ui/react';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { MediaLinkType, MediaLinkTypeKey } from './FooterContact';
import { cn } from '@/utils';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

export default function MobileFooterContact() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isMobileFooterContactShowAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { trackEvent } = useGA();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (subscribeRef.current && !subscribeRef.current.contains(event.target as Node)) {
        setIsSubscribeShow(false);
      }
    },
    [setIsSubscribeShow],
  );

  useEffect(() => {
    if (isSubscribeShow) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, isSubscribeShow]);

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
      window.open('https://www.youtube.com/@Immortal-Dragons', '__blank');
    }
    if (type === MediaLinkType.Linkedin) {
      window.open('https://www.linkedin.com/company/immortaldragons/', '__blank');
    }
    if (type === MediaLinkType.Media) {
      window.open('https://drive.google.com/drive/folders/1vajrjCq-nAX1LVSzJ_fETL2GKI0-ckrG', '__blank');
    }
  };

  return (
    <FloatingPortal>
      <AnimatePresence>
        <motion.div
          animate={isSubscribeShow ? 'open' : 'close'}
          variants={{
            open: { scale: 1, bottom: 0 },
            close: { scale: 0, bottom: '-10rem' },
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          ref={subscribeRef}
          className="page-footer fixed inset-x-0 bottom-0 z-40 origin-center border-2 border-white bg-white/20 p-4 pt-5 text-black backdrop-blur-xl"
        >
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
            <img className="h-4" src="/svgs/info-2.svg" alt="" />
            Join our longevity circle for priority access to pioneer research
          </div>
          <div className="mb-3 mt-4 h-px w-full bg-black/10" />
          <div className="flex-center gap-5">
            <div
              onClick={() => handleLinkClick(MediaLinkType.Youtube)}
              className="flex-center relative cursor-pointer gap-1 p-2"
            >
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
        </motion.div>
      </AnimatePresence>
    </FloatingPortal>
  );
}
