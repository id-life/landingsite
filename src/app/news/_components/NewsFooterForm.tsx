'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import InfoSVG from '@/../public/svgs/info.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import HoneypotField from '@/components/forms/HoneypotField';
import { SUBSCRIBE_PROMISE } from '@/content/subscribe';
import { FormEvent, useState } from 'react';

/** The subscribe form of the news footer: the footer's one client island (PERF-10; the rest renders on the server). */
export default function NewsFooterForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const data = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);
    // Loaded on submit (PERF-10): the newsletter module brings the analytics client with it.
    const { submitNewsletter } = await import('@/utils/newsletter');
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

  return (
    <form id="subscribe-form" className="relative mt-7 flex flex-col" onSubmit={onFormSubmit}>
      <HoneypotField />
      <label htmlFor="news-subscribe-email" className="sr-only">
        Email
      </label>
      <div className="border-2 border-black p-3">
        <input
          id="news-subscribe-email"
          className="w-[min(25rem,30vw)] bg-transparent font-text text-xs font-semibold"
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
        <p id="news-subscribe-error" role="alert" className="mt-2 font-text text-xs font-semibold text-accent">
          {submitError}
        </p>
      )}
      <div className="mt-3 flex items-start gap-1.5 font-text text-xs font-semibold">
        <InfoSVG className="size-4 shrink-0" />
        {SUBSCRIBE_PROMISE.priorityAccess}
      </div>
      <div className="footer-submit-clip relative mt-3 h-11 w-[10.5rem] self-end bg-accent text-white">
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
        <input className="h-full w-full cursor-pointer font-text text-base/5 font-bold" type="submit" value="Submit" />
      </div>
    </form>
  );
}
