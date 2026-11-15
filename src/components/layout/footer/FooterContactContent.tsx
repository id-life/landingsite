'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import BilibiliSVG from '@/../public/svgs/bilibili.svg?component';
import ContactEmailSVG from '@/../public/svgs/contact-email.svg?component';
import HomeSVG from '@/../public/svgs/home.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import RedbookSVG from '@/../public/svgs/redbook.svg?component';
import SpotifySVG from '@/../public/svgs/spotify.svg?component';
import WechatSVG from '@/../public/svgs/wechat.svg?component';
import XiaoyuzhouSVG from '@/../public/svgs/xiaoyuzhou.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import CornerBorder from '@/components/common/CornerBorder';
import InfoSVG from '@/../public/svgs/info.svg?component';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { cn } from '@/utils';
import { ORG_ADDRESS_TEXT, ORG_EMAIL, ORG_MAILTO } from '@/constants/contact';
import { NewsletterPlacement, submitNewsletter } from '@/utils/newsletter';
import HoneypotField from '@/components/forms/HoneypotField';
import clsx from 'clsx';
import { FormEvent, useId, useMemo, useRef, useState } from 'react';
import { trackChannelLink } from '@/lib/analytics/social';
import { PrivacyChoicesLink } from '@/components/consent/PrivacyChoicesLink';
import { SUBSCRIBE_PROMISE } from '@/content/subscribe';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/** The field's two rules and their messages (they were react-hook-form's `required` and `pattern`). */
function validateEmail(value: string) {
  if (!value) return 'Please fill in this field';
  if (!EMAIL_PATTERN.test(value)) return 'Please enter email address';
  return null;
}

/** placement: 'connect' in the phone Connect contact panel, 'footer' at the foot of the news pages. */
export default function FooterContactContent({ placement = 'connect' }: { placement?: NewsletterPlacement }) {
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
    const result = await submitNewsletter({ email, website: websiteRef.current?.value ?? '' }, placement);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setIsSubmitted(true);
  };

  const handleLinkClick = (type: MediaLinkTypeKey) => trackChannelLink(type, Links[type], placement);

  const mediaRows = useMemo(
    () => [
      [
        { type: MediaLinkType.Youtube, label: 'YOUTUBE', Icon: YoutubeSVG, iconClassName: 'size-4' },
        {
          type: MediaLinkType.Linkedin,
          label: 'LINKEDIN',
          Icon: LinkedinSVG,
          iconClassName: '-mt-0.5 size-4',
        },
        { type: MediaLinkType.Spotify, label: 'SPOTIFY', Icon: SpotifySVG, iconClassName: 'size-4' },
        { type: MediaLinkType.Media, label: 'MEDIAKIT', Icon: MediaSVG, iconClassName: 'size-4' },
      ],
      [
        { type: MediaLinkType.Xiaoyuzhou, label: '小宇宙', Icon: XiaoyuzhouSVG, iconClassName: 'size-4' },
        { type: MediaLinkType.Bilibili, label: 'BILIBILI', Icon: BilibiliSVG, iconClassName: 'size-4' },
        { type: MediaLinkType.Redbook, label: '小红书', Icon: RedbookSVG, iconClassName: 'size-4' },
        { type: MediaLinkType.Wechat, label: '公众号', Icon: WechatSVG, iconClassName: 'size-4' },
      ],
    ],
    [],
  );

  return (
    // A named region (the phone panel is portalled outside <main>): axe region rule. Not "Connect": the section already has that name.
    <section aria-label="Contact and subscribe" className="text-black">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl/[30px] font-bold uppercase">CONNECT</h3>
        <div className="flex flex-col items-end gap-1">
          <a href="/about" className="font-display text-xs/[15px] font-bold">
            About Immortal Dragons <span aria-hidden="true">→</span>
          </a>
          <PrivacyChoicesLink className="font-display text-xs/[15px] font-bold underline opacity-60" />
        </div>
      </div>
      <div className="mt-3">
        {mediaRows.map((row, rowIndex) => (
          <div key={rowIndex} className={cn('flex justify-between gap-2', rowIndex === 1 && 'mt-4')}>
            {row.map(({ type, label, Icon, iconClassName }) => (
              <a
                key={type}
                onClick={() => handleLinkClick(type)}
                href={Links[type]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-center relative h-[25px] w-[77px] cursor-pointer gap-1"
              >
                <CornerBorder hoverColor="#000" size="4px" color="#666" />
                <Icon className={cn(iconClassName, 'fill-black')} />
                <span className="font-display text-[10px]/3 font-bold">{label}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
      {/* The email is a mailto link (it was the uppercase literal CONTACT@ID.LIFE in a span). */}
      <address className="mt-4 flex flex-col gap-1.5 font-display text-xs/[15px] font-bold not-italic">
        <div className="flex items-center gap-1">
          <HomeSVG aria-hidden="true" className="size-5" />
          <span>{ORG_ADDRESS_TEXT}</span>
        </div>
        <a href={ORG_MAILTO} data-track-placement={placement} className="flex w-fit items-center gap-1 py-1">
          <ContactEmailSVG aria-hidden="true" className="size-5" />
          <span>{ORG_EMAIL}</span>
        </a>
      </address>
      <div className="my-4 h-px w-full bg-black/20" />
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
            className={cn('w-[5.625rem] cursor-pointer py-3 font-text text-base/5 font-semibold', {
              'text-accent': isSubmitting || isSubmitted,
            })}
            type="submit"
            value="Submit"
          />
        </div>
      </form>
      <div className="mt-3 flex gap-1.5 font-text text-xs/5 font-semibold text-ink-muted">
        <InfoSVG className="size-4 shrink-0" />
        {SUBSCRIBE_PROMISE.priorityAccess}
      </div>
    </section>
  );
}
