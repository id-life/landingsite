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
import { InfoSVG } from '@/components/svg';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import jsonp from '@/utils/jsonp';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
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

    window.open(Links[type], '__blank');
  };

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
    <div className="text-black">
      <h3 className="font-oxanium text-2xl/[30px] font-bold uppercase">CONNECT</h3>
      <div className="mt-3">
        {mediaRows.map((row, rowIndex) => (
          <div key={rowIndex} className={cn('flex justify-between gap-2', rowIndex === 1 && 'mt-4')}>
            {row.map(({ type, label, Icon, iconClassName }) => (
              <div
                key={type}
                onClick={() => handleLinkClick(type)}
                className="flex-center relative h-[25px] w-[77px] cursor-pointer gap-1"
              >
                <CornerBorder hoverColor="#000" size="4px" color="#666" />
                <Icon className={cn(iconClassName, 'fill-black')} />
                <span className="font-oxanium text-[10px]/3 font-bold">{label}</span>
              </div>
            ))}
          </div>
        ))}
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
