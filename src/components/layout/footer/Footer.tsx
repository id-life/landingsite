'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import CloseSVG from '@/../public/svgs/close.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { InfoSVG } from '@/components/svg';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import jsonp from '@/utils/jsonp';
import { FloatingPortal } from '@floating-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<Inputs>();

  const { trackEvent } = useGA();

  useEffect(() => {
    if (isSubscribeShow) {
      setIsSubmitted(false);
      reset();
      clearErrors();
    }
  }, [isSubscribeShow, reset, clearErrors]);

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
      <div ref={wrapperRef} className="h-52" />
      <FloatingPortal>
        <div className="page-footer fixed -bottom-40 z-[52] flex h-52 w-full items-center justify-center mobile:inset-x-5 mobile:h-auto mobile:w-auto">
          <div className="footer-box-clip relative h-0 w-0 overflow-visible border-2 border-[var(--subscribe-border)] bg-[var(--subscribe-bg)] px-7.5 py-9 text-[var(--foreground)] backdrop-blur-md mobile:px-4 mobile:py-7.5">
            <span className="absolute left-0 top-0 block rotate-90 border-[1.02rem] border-[var(--subscribe-border)] border-r-transparent border-t-transparent" />
            <span className="absolute bottom-0 right-0 block rotate-90 border-[1.02rem] border-[var(--subscribe-border)] border-b-transparent border-l-transparent" />
            <button
              onClick={(e) => {
                e?.stopPropagation();
                eventBus.next({ type: MessageType.CLOSE_SUBSCRIBE });
              }}
              className="absolute right-6 top-6 z-10 transition-opacity hover:opacity-70"
            >
              <CloseSVG className="size-5 stroke-[var(--foreground)] stroke-2" />
            </button>
            <h3 className="flex items-center justify-between pr-8 font-oxanium text-3xl font-bold">SUBSCRIBE</h3>
            <form
              id="subscribe-form"
              className="relative mt-7.5 flex gap-4 mobile:mt-5 mobile:gap-3 mobile:px-0"
              onSubmit={handleSubmit(onFormSubmit)}
            >
              {errors.EMAIL && (
                <span className="absolute -top-6 font-poppins text-xs/5 font-semibold text-red-600">
                  {errors.EMAIL?.message}
                </span>
              )}
              <input type="hidden" {...register('u')} value="e6f88de977cf62de3628d944e" />
              <input type="hidden" {...register('amp;id')} value="af9154d6b5" />
              <input type="hidden" {...register('amp;f_id')} value="00e418e1f0" />
              <div className="relative flex-1 p-2">
                <div
                  className={cn(
                    'absolute inset-0 -z-10 border-[.0938rem] border-foreground opacity-50',
                    errors.EMAIL && 'border-red-600 opacity-100',
                  )}
                />
                <input
                  className="w-full bg-transparent text-sm font-semibold placeholder:text-[#747374] mobile:text-xs/5"
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
            <div className="mt-3.5 flex items-center gap-1.5 text-xs/5 font-semibold text-[var(--foreground)] opacity-50">
              <InfoSVG className="size-4 shrink-0" />
              Join our Longevity Circle and receive the latest insights & research
            </div>
          </div>
        </div>
      </FloatingPortal>
    </>
  );
}
