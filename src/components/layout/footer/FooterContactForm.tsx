'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import HoneypotField from '@/components/forms/HoneypotField';
import type { NewsletterPlacement } from '@/utils/newsletter';
import { clsx } from 'clsx';
import { FormEvent, useId, useRef, useState } from 'react';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/** The field's two rules and their messages (they were react-hook-form's `required` and `pattern`). */
function validateEmail(value: string) {
  if (!value) return 'Please fill in this field';
  if (!EMAIL_PATTERN.test(value)) return 'Please enter email address';
  return null;
}

/** The subscribe form of the phone contact panel and the phone news footer: their one client island (PERF-10). */
export default function FooterContactForm({ placement }: { placement: NewsletterPlacement }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const fieldId = useId();

  // Plain form state, not react-hook-form (PERF-10: about 9 kB gzip on every news page for one email field). The same
  // behaviour: validated on submit (the first invalid field takes focus), then re-validated on every change, and a
  // server error shows under the field until the next change or submit.
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmittedOnce] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const errors = { EMAIL: error ? { message: error } : undefined };

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedOnce(true);
    const email = emailRef.current?.value ?? '';
    const invalid = validateEmail(email);
    setError(invalid);
    if (invalid) {
      emailRef.current?.focus();
      return;
    }
    setIsSubmitting(true);
    // Loaded on submit (PERF-10): the newsletter module brings the analytics client with it.
    const { submitNewsletter } = await import('@/utils/newsletter');
    const result = await submitNewsletter({ email, website: websiteRef.current?.value ?? '' }, placement);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <form
      id="subscribe-form"
      noValidate
      className="relative flex justify-between gap-3"
      onSubmit={(event) => void onFormSubmit(event)}
    >
      {errors.EMAIL && (
        <span id={`${fieldId}-error`} role="alert" className="absolute -top-6 font-text text-xs font-semibold text-accent">
          {errors.EMAIL.message}
        </span>
      )}
      <HoneypotField ref={websiteRef} />
      <label htmlFor={`${fieldId}-email`} className="sr-only">
        Email
      </label>
      <div className={clsx('flex-center h-11 w-full border-2 px-3', errors.EMAIL ? 'border-accent' : 'border-black')}>
        <input
          id={`${fieldId}-email`}
          className="w-full bg-transparent font-text text-xs/5 font-semibold placeholder:text-tone-600 mobile:text-[16px]/5"
          placeholder="Please enter email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={errors.EMAIL ? true : undefined}
          aria-describedby={errors.EMAIL ? `${fieldId}-error` : undefined}
          defaultValue=""
          ref={emailRef}
          name="EMAIL"
          onChange={(event) => {
            if (submitted) setError(validateEmail(event.target.value));
          }}
        />
      </div>
      <div className="footer-submit-clip relative h-11 w-[90px] bg-accent text-white">
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
          className={clsx('w-[5.625rem] cursor-pointer py-3 font-text text-base/5 font-semibold', {
            'text-accent': isSubmitting || isSubmitted,
          })}
          type="submit"
          value="Submit"
        />
      </div>
    </form>
  );
}
