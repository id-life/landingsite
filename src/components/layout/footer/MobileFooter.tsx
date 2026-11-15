'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import CloseSVG from '@/../public/svgs/close.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import InfoSVG from '@/../public/svgs/info.svg?component';
import { useMobileSubscribeAction } from '@/hooks/useSubscribeAction';
import { useSubscribeDialog } from '@/hooks/useSubscribeDialog';
import { cn } from '@/utils';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId } from 'react';
import HoneypotField from '@/components/forms/HoneypotField';
import { useForm } from 'react-hook-form';
import { SUBSCRIBE_PROMISE } from '@/content/subscribe';

type Inputs = {
  EMAIL: string;
  website: string;
};

/**
 * The phone SUBSCRIBE popup. It opens only from a SUBSCRIBE button and is a modal dialog: role="dialog"
 * labelled by its heading, focus moves to its close button (no keyboard pops up) and stays inside, and the
 * X, Escape or a tap outside close it. A tap with the popup closed does nothing: the old window-level
 * mousedown handler ran on every tap anywhere, logged a close and marked the popup as dismissed.
 */
export default function MobileFooter() {
  const { onFormSubmit, isSubmitting, isSubmitted, submitError } = useMobileSubscribeAction();
  const { open: isSubscribeShow, refs, context, getFloatingProps, titleId, closeWithX, closedProps } = useSubscribeDialog();
  // ENG-09: the email field has a visible label (it had only a placeholder, then an aria-label).
  const emailId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  useEffect(() => {
    if (isSubscribeShow) reset();
  }, [isSubscribeShow, reset]);

  return (
    <FloatingPortal>
      <AnimatePresence>
        {/* Focus starts on the close button (the first control), so no on-screen keyboard pops up. */}
        <FloatingFocusManager context={context} disabled={!isSubscribeShow} initialFocus={0}>
          <motion.div
            {...getFloatingProps({ ref: refs.setFloating })}
            aria-labelledby={titleId}
            aria-modal={isSubscribeShow ? 'true' : undefined}
            {...closedProps}
            animate={isSubscribeShow ? 'open' : 'close'}
            variants={{
              open: { scale: 1, bottom: '.75rem', width: 'auto' },
              close: { scale: 0, bottom: '-10rem' },
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
            // 比导航遮罩层级高
            className="page-footer footer-box-clip fixed inset-x-4 bottom-3 z-[101] origin-center border-2 border-[var(--subscribe-border)] bg-[var(--subscribe-bg)] px-4 py-7.5 text-[var(--foreground)] backdrop-blur-md"
          >
            <span className="absolute left-0 top-0 block rotate-90 border-[17px] border-[var(--subscribe-border)] border-r-transparent border-t-transparent" />
            <span className="absolute bottom-0 right-0 block rotate-90 border-[17px] border-[var(--subscribe-border)] border-b-transparent border-l-transparent" />
            <button
              type="button"
              aria-label="Close"
              onClick={closeWithX}
              className="absolute right-2 top-2 z-10 flex size-[44px] items-center justify-center transition-opacity hover:opacity-70"
            >
              <CloseSVG aria-hidden="true" className="size-5 fill-[var(--foreground)] stroke-2" />
            </button>
            <h3 id={titleId} className="flex items-center justify-between font-display text-2xl/7.5 font-bold">
              SUBSCRIBE
            </h3>
            <form
              id="subscribe-form"
              noValidate
              className="relative mt-7.5 flex gap-4 px-2 mobile:gap-3 mobile:px-0"
              onSubmit={handleSubmit(onFormSubmit)}
            >
              {(errors.EMAIL || submitError) && (
                <span
                  id="mobile-subscribe-error"
                  role="alert"
                  className="absolute -top-5 font-text text-xs font-semibold text-accent"
                >
                  {errors.EMAIL?.message ?? submitError}
                </span>
              )}
              <HoneypotField {...register('website')} />
              <div className="relative flex h-11 flex-1 items-center justify-center p-2">
                <div
                  className={cn(
                    'absolute inset-0 -z-10 border-[.0938rem] border-foreground opacity-50',
                    errors.EMAIL && 'border-accent opacity-100',
                  )}
                />
                <label htmlFor={emailId} className="mr-2 shrink-0 text-xs/5 font-semibold opacity-70">
                  Email
                </label>
                <input
                  className="w-full bg-transparent text-xs/5 font-semibold placeholder:text-tone-600 mobile:text-[16px]/5"
                  id={emailId}
                  placeholder="Please enter email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  aria-invalid={errors.EMAIL || submitError ? true : undefined}
                  aria-describedby={errors.EMAIL || submitError ? 'mobile-subscribe-error' : undefined}
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
              <div className="footer-submit-clip relative w-[10.5rem] bg-accent text-white mobile:w-[5.625rem]">
                {isSubmitting ? (
                  <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-accent">
                    <LoadingSVG className="w-6 animate-spin stroke-white stroke-[3]" />
                  </div>
                ) : null}
                {isSubmitted ? (
                  <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-accent font-bold">
                    <CheckedSVG className="w-6 stroke-white stroke-[3]" />
                  </div>
                ) : null}
                <input
                  className="w-full cursor-pointer py-3 text-base/5 font-bold mobile:font-semibold"
                  type="submit"
                  value="Submit"
                />
              </div>
            </form>
            <div className="mt-5 flex gap-1.5 text-left text-xs/5 font-semibold text-foreground opacity-50">
              <InfoSVG className="size-4 shrink-0 mobile:mt-0.5" />
              {SUBSCRIBE_PROMISE.latestInsights}
            </div>
          </motion.div>
        </FloatingFocusManager>
      </AnimatePresence>
    </FloatingPortal>
  );
}
