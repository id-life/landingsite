'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import BilibiliSVG from '@/../public/svgs/bilibili.svg?component';
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
import { ORG_ADDRESS_TEXT, ORG_EMAIL, ORG_MAILTO } from '@/constants/contact';
import { submitNewsletter } from '@/utils/newsletter';
import HoneypotField from '@/components/forms/HoneypotField';
import { FloatingPortal } from '@floating-ui/react';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { trackChannelLink } from '@/lib/analytics/social';
import { PrivacyChoicesLink } from '@/components/consent/PrivacyChoicesLink';
import { SUBSCRIBE_PROMISE } from '@/content/subscribe';

type Inputs = {
  EMAIL: string;
  website: string;
};

export default function FooterContact() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();
  const onFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    setIsSubmitting(true);
    const result = await submitNewsletter({ email: formData.EMAIL, website: formData.website }, 'connect');
    setIsSubmitting(false);
    if (!result.ok) {
      setError('EMAIL', { type: 'server', message: result.message });
      return;
    }
    setIsSubmitted(true);
  };

  const handleLinkClick = (type: MediaLinkTypeKey) => trackChannelLink(type, Links[type], 'connect');

  const mediaRows = useMemo(
    () => [
      [
        { type: MediaLinkType.Youtube, label: 'YOUTUBE', Icon: YoutubeSVG, iconClassName: 'size-6' },
        {
          type: MediaLinkType.Linkedin,
          label: 'LINKEDIN',
          Icon: LinkedinSVG,
          iconClassName: '-mt-0.5 size-6',
        },
        { type: MediaLinkType.Spotify, label: 'SPOTIFY', Icon: SpotifySVG, iconClassName: 'size-6' },
        { type: MediaLinkType.Media, label: 'MEDIAKIT', Icon: MediaSVG, iconClassName: 'size-6' },
      ],
      [
        { type: MediaLinkType.Xiaoyuzhou, label: '小宇宙', Icon: XiaoyuzhouSVG, iconClassName: 'size-6' },
        { type: MediaLinkType.Bilibili, label: 'BILIBILI', Icon: BilibiliSVG, iconClassName: 'size-6' },
        { type: MediaLinkType.Redbook, label: '小红书', Icon: RedbookSVG, iconClassName: 'size-6' },
        { type: MediaLinkType.Wechat, label: '公众号', Icon: WechatSVG, iconClassName: 'size-6' },
      ],
    ],
    [],
  );

  return (
    <>
      <FloatingPortal>
        <div className="page-footer-contact fixed bottom-[-100vh] z-10 flex w-full items-center justify-center mobile:inset-x-5 mobile:h-auto mobile:w-auto">
          {/* A named region: the panel sits outside <main>, so without a landmark axe counts each of its parts (region). */}
          <section
            aria-label="Contact and subscribe"
            className="footer-contact-clip items mx-10 flex w-full justify-between bg-white/40 p-10 backdrop-blur mobile:p-4"
          >
            <div className="mb-7.5 font-display font-bold uppercase">
              <p className="text-tone-650">Media</p>
              <div className="mt-7">
                {mediaRows.map((row, rowIndex) => (
                  <div key={rowIndex} className={clsx('flex gap-5', rowIndex === 1 && 'mt-4')}>
                    {row.map(({ type, label, Icon, iconClassName }) => (
                      <a
                        key={type}
                        onClick={() => handleLinkClick(type)}
                        href={Links[type]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex h-10 w-[123px] cursor-pointer items-center justify-center gap-1 transition duration-300 hover:text-accent"
                      >
                        <CornerBorder />
                        <Icon className={clsx(iconClassName, 'fill-black transition duration-300 group-hover:fill-accent')} />
                        <span className="font-display text-base/5 font-bold uppercase">{label}</span>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="font-display text-base/5 font-bold">
              {/* The About link shares the label's row: a line of its own made the panel taller and put it under
                  the section arrows at the bottom of the screen. */}
              <div className="flex items-baseline justify-between gap-6">
                <p className="uppercase text-tone-650">Contact</p>
                <div className="flex items-baseline gap-4">
                  <a href="/about" className="transition duration-300 hover:text-accent">
                    About Immortal Dragons <span aria-hidden="true">→</span>
                  </a>
                  {/* Beside About (DATA-01), not on a line of its own, for the same reason. */}
                  <PrivacyChoicesLink className="text-sm underline opacity-60 hover:opacity-100" />
                </div>
              </div>
              {/* The email is a mailto link (it was plain text in capitals) and both lines come from the entity
                  constants instead of repeated literals. */}
              <address className="not-italic">
                <div className="mt-7 flex items-center justify-start gap-1.5">
                  <img src="/svgs/home.svg" alt="" />
                  {ORG_ADDRESS_TEXT}
                </div>
                <a
                  href={ORG_MAILTO}
                  data-track-placement="connect"
                  className="mt-3 flex w-fit items-center justify-start gap-1.5 transition duration-300 hover:text-accent"
                >
                  <img src="/svgs/contact-email.svg" alt="" />
                  {ORG_EMAIL}
                </a>
              </address>
            </div>
            <div className="font-display text-base/5 font-bold">
              <p className="uppercase text-tone-650">SUBSCRIBE</p>
              <form
                id="subscribe-form"
                noValidate
                className="relative mt-8 flex gap-4 mobile:mt-5 mobile:gap-3 mobile:px-0"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                {errors.EMAIL && (
                  <span
                    id="connect-subscribe-error"
                    role="alert"
                    className="absolute -top-6 font-text text-xs font-semibold text-accent"
                  >
                    {errors.EMAIL.message}
                  </span>
                )}
                <HoneypotField {...register('website')} />
                <label htmlFor="connect-subscribe-email" className="sr-only">
                  Email
                </label>
                <div className={clsx('flex-1 border-2 p-2', errors.EMAIL ? 'border-accent' : 'border-black')}>
                  <input
                    id="connect-subscribe-email"
                    className="w-[18rem] bg-transparent text-sm font-semibold mobile:text-xs/5"
                    placeholder="Please enter email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-invalid={errors.EMAIL ? true : undefined}
                    aria-describedby={errors.EMAIL ? 'connect-subscribe-error' : undefined}
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
              <div className="mt-3.5 flex gap-1.5 font-text text-xs font-semibold">
                <InfoSVG className="size-4" />
                {SUBSCRIBE_PROMISE.priorityAccess}
              </div>
            </div>
          </section>
        </div>
      </FloatingPortal>
    </>
  );
}
