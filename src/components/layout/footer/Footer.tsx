'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import CloseSVG from '@/../public/svgs/close.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import { subscribeTypeAtom } from '@/atoms/footer';
import InfoSVG from '@/../public/svgs/info.svg?component';
import { useSubscribeDialog } from '@/hooks/useSubscribeDialog';
import { cn } from '@/utils';
import { submitNewsletter } from '@/utils/newsletter';
import HoneypotField from '@/components/forms/HoneypotField';
import { FloatingFocusManager, FloatingPortal, useMergeRefs } from '@floating-ui/react';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SUBSCRIBE_PROMISE } from '@/content/subscribe';

type Inputs = {
  EMAIL: string;
  website: string;
};

/**
 * The desktop SUBSCRIBE popup. It opens only when the visitor asks (subscribePopupAtom) and is a modal
 * dialog: role="dialog" labelled by its heading, focus moves to the email field and stays inside, Escape,
 * the X or a click outside close it, and focus returns to the button that opened it.
 */
export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const placement = useAtomValue(subscribeTypeAtom);
  const { open: isSubscribeShow, refs, context, getFloatingProps, titleId, closeWithX, closedProps } = useSubscribeDialog();
  // ENG-09: the email field has a visible label (it had only a placeholder, then an aria-label).
  const emailId = useId();
  const footerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  // True once the portal content exists. Content pages mount this popup on its first open (SubscribePopup), so
  // the open state arrives before the portal has rendered the box; the open effect waits for it.
  const [portalReady, setPortalReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setError,
  } = useForm<Inputs>();
  const { ref: emailFieldRef, ...emailField } = register('EMAIL', {
    required: 'Please fill in this field',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter email address',
    },
  });

  const trackPortal = useCallback((node: HTMLDivElement | null) => setPortalReady(!!node), []);
  const boxMergedRef = useMergeRefs([refs.setFloating, boxRef, trackPortal]);
  const emailMergedRef = useMergeRefs([emailFieldRef, emailRef]);

  // Built on first open: the popup lives in a portal that mounts after this component, so its elements
  // do not exist yet when this component's effects first run.
  const getTimeline = () => {
    if (!timelineRef.current && footerRef.current && boxRef.current) {
      const tl = gsap.timeline({ paused: true });
      tl.to(footerRef.current, { bottom: '2.25rem', duration: 0.3 });
      tl.to(boxRef.current, { width: '40rem', height: '13rem', duration: 0.3 }, '<');
      timelineRef.current = tl;
    }
    return timelineRef.current;
  };
  useEffect(() => () => void timelineRef.current?.kill(), []);

  useEffect(() => {
    if (!isSubscribeShow) {
      timelineRef.current?.reverse();
      return;
    }
    getTimeline()?.play();
    // Focus the email field once the popup is on screen, without scrolling: a plain focus() on the
    // still-offscreen field scrolled the page, and on the experience a scroll changes the section. (The
    // focus manager's own initial focus is off, initialFocus -1; it still traps Tab and returns focus.)
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => emailRef.current?.focus({ preventScroll: true }));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [isSubscribeShow, portalReady]);

  useEffect(() => {
    if (isSubscribeShow) {
      setIsSubmitted(false);
      reset();
      clearErrors();
    }
  }, [isSubscribeShow, reset, clearErrors]);

  const onFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    setIsSubmitting(true);
    const result = await submitNewsletter({ email: formData.EMAIL, website: formData.website }, placement ?? 'nav');
    setIsSubmitting(false);
    if (!result.ok) {
      setError('EMAIL', { type: 'server', message: result.message });
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <>
      <FloatingPortal>
        <div
          ref={footerRef}
          className="page-footer pointer-events-none fixed -bottom-40 z-[52] flex h-52 w-full items-center justify-center mobile:inset-x-5 mobile:h-auto mobile:w-auto"
        >
          <FloatingFocusManager context={context} disabled={!isSubscribeShow} initialFocus={-1}>
            <div
              {...getFloatingProps({ ref: boxMergedRef })}
              aria-labelledby={titleId}
              aria-modal={isSubscribeShow ? 'true' : undefined}
              {...closedProps}
              className="footer-box-clip pointer-events-auto relative h-0 w-0 overflow-visible border-2 border-[var(--subscribe-border)] bg-[var(--subscribe-bg)] px-7.5 py-9 text-[var(--foreground)] backdrop-blur-md mobile:px-4 mobile:py-7.5"
            >
              <span className="absolute left-0 top-0 block rotate-90 border-[1.02rem] border-[var(--subscribe-border)] border-r-transparent border-t-transparent" />
              <span className="absolute bottom-0 right-0 block rotate-90 border-[1.02rem] border-[var(--subscribe-border)] border-b-transparent border-l-transparent" />
              <button
                type="button"
                aria-label="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeWithX();
                }}
                className="absolute right-2 top-2 z-10 flex size-[44px] items-center justify-center transition-opacity hover:opacity-70"
              >
                <CloseSVG aria-hidden="true" className="size-5 stroke-[var(--foreground)] stroke-2" />
              </button>
              <h3 id={titleId} className="flex items-center justify-between pr-8 font-display text-3xl font-bold">
                SUBSCRIBE
              </h3>
              <form
                id="subscribe-form"
                noValidate
                className="relative mt-7.5 flex items-center gap-4 mobile:mt-5 mobile:gap-3 mobile:px-0"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                {errors.EMAIL && (
                  <span
                    id="popup-subscribe-error"
                    role="alert"
                    className="absolute -top-6 font-text text-xs/5 font-semibold text-accent"
                  >
                    {errors.EMAIL?.message}
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
                    className="w-full bg-transparent text-xs/5 font-semibold placeholder:text-tone-600"
                    id={emailId}
                    placeholder="Please enter email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-invalid={errors.EMAIL ? true : undefined}
                    aria-describedby={errors.EMAIL ? 'popup-subscribe-error' : undefined}
                    defaultValue=""
                    {...emailField}
                    ref={emailMergedRef}
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
                {SUBSCRIBE_PROMISE.latestInsights}
              </div>
            </div>
          </FloatingFocusManager>
        </div>
      </FloatingPortal>
    </>
  );
}
