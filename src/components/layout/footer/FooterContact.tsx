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
import { InfoSVG } from '@/components/svg';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { useGA } from '@/hooks/useGA';
import jsonp from '@/utils/jsonp';
import { FloatingPortal } from '@floating-ui/react';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

export default function FooterContact() {
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
      label: GA_EVENT_LABELS.MEDIUM_CLICK[type.toUpperCase() as Uppercase<MediaLinkTypeKey>],
    });
  };

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
        <div className="page-footer-contact fixed -bottom-80 z-10 flex w-full items-center justify-center mobile:inset-x-5 mobile:h-auto mobile:w-auto">
          <div className="footer-contact-clip items mx-10 flex w-full justify-between bg-white/40 p-10 backdrop-blur mobile:p-4">
            <div className="mb-7.5 font-oxanium font-bold uppercase">
              <p className="opacity-50">Media</p>
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
                        className="group relative flex h-10 w-[123px] cursor-pointer items-center justify-center gap-1 transition duration-300 hover:text-red-600"
                      >
                        <CornerBorder />
                        <Icon className={clsx(iconClassName, 'fill-black transition duration-300 group-hover:fill-red-600')} />
                        <span className="font-oxanium text-base/5 font-bold uppercase">{label}</span>
                      </a>
                    ))}
                  </div>
                ))}
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
                className="relative mt-8 flex gap-4 mobile:mt-5 mobile:gap-3 mobile:px-0"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                {errors.EMAIL && (
                  <span className="absolute -top-6 font-poppins text-xs font-semibold text-red-600">
                    {errors.EMAIL.message}
                  </span>
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
                <InfoSVG className="size-4" />
                Join our longevity circle for priority access to pioneer research
              </div>
            </div>
          </div>
        </div>
      </FloatingPortal>
    </>
  );
}
