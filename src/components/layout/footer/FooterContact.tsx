'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import { isSubscribeShowAtom } from '@/atoms/footer';
import CornerBorder from '@/components/common/CornerBorder';
import { InfoSVG } from '@/components/svg';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { Links, MediaLinkType, MediaLinkTypeKey } from '@/constants/links';
import { useGA } from '@/hooks/useGA';
import jsonp from '@/utils/jsonp';
import { FloatingPortal, useFloatingPortalNode } from '@floating-ui/react';
import { useGSAP } from '@gsap/react';
import { clsx } from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue, useSetAtom } from 'jotai';
import { currentPageAtom } from '@/atoms';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
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
  const subscribeRef = useRef<HTMLDivElement>(null);
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);
  const currentPage = useAtomValue(currentPageAtom);
  const currentPageRef = useRef(currentPage);
  const portalNode = useFloatingPortalNode();

  // 保持 currentPage 的最新值
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
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

    if (type === MediaLinkType.Youtube) {
      window.open(Links.youtube, '__blank');
    }
    if (type === MediaLinkType.Linkedin) {
      window.open(Links.linkedin, '__blank');
    }
    if (type === MediaLinkType.Media) {
      window.open(Links.media, '__blank');
    }
  };

  useGSAP(
    () => {
      if (!portalNode) return;
      // 创建一个新的 ScrollTrigger 绑定到 connect-page1，在其动画结束时触发
      ScrollTrigger.create({
        id: 'footerTimeline',
        trigger: '#connect-page1',
        start: 'bottom bottom',
        end: 'bottom bottom',
        onEnter: () => {
          // 只在 connect 页面时显示
          if (currentPageRef.current.id !== 'connect_page') return;
          setIsSubscribeShow(true);
          gsap.to(subscribeRef.current, { bottom: isMobile ? '5rem' : '0rem', duration: 0.5, ease: 'power2.out' });
          gsap.to('.sound-button', { bottom: isMobile ? '25.5rem' : '22.5rem', duration: 0.5, ease: 'power2.out' });
          gsap.to('.scroll-title', { opacity: 0, duration: 0.5 });
          // 英文标题一个一个消失，然后中文标题一个一个出现
          const title1 = gsap.utils.toArray('.connect-title1 *');
          const title1cn = gsap.utils.toArray('.connect-title1cn path');
          const title2 = gsap.utils.toArray('.connect-title2 *');
          const title2cn = gsap.utils.toArray('.connect-title2cn path');
          const title3 = gsap.utils.toArray('.connect-title3 *');
          const title3cn = gsap.utils.toArray('.connect-title3cn path');
          const allEnTitles = [...title1, ...title2, ...title3];
          const allCnTitles = [...title1cn, ...title2cn, ...title3cn];
          // 英文消失的总时长
          const enDuration = allEnTitles.length * 0.02;
          allEnTitles.forEach((item, index) => {
            if (!item) return;
            gsap.to(item, { opacity: 0, duration: 0.05, delay: index * 0.02 });
          });
          // 等英文消失后再出现中文
          allCnTitles.forEach((item, index) => {
            if (!item) return;
            gsap.to(item, { opacity: 1, duration: 0.05, delay: enDuration + index * 0.02 });
          });
        },
        onLeaveBack: () => {
          setIsSubscribeShow(false);
          gsap.to(subscribeRef.current, { bottom: '-20rem', duration: 0.5, ease: 'power2.out' });
          gsap.to('.sound-button', { bottom: '2.5rem', duration: 0.5, ease: 'power2.out' });
          gsap.to('.scroll-title', { opacity: 1, duration: 0.5 });
          // 中文标题一个一个消失，然后英文标题一个一个出现
          const title1 = gsap.utils.toArray('.connect-title1 *');
          const title1cn = gsap.utils.toArray('.connect-title1cn path');
          const title2 = gsap.utils.toArray('.connect-title2 *');
          const title2cn = gsap.utils.toArray('.connect-title2cn path');
          const title3 = gsap.utils.toArray('.connect-title3 *');
          const title3cn = gsap.utils.toArray('.connect-title3cn path');
          const allEnTitles = [...title1, ...title2, ...title3];
          const allCnTitles = [...title1cn, ...title2cn, ...title3cn];
          // 中文消失的总时长
          const cnDuration = allCnTitles.length * 0.02;
          allCnTitles.forEach((item, index) => {
            if (!item) return;
            gsap.to(item, { opacity: 0, duration: 0.05, delay: index * 0.02 });
          });
          // 等中文消失后再出现英文
          allEnTitles.forEach((item, index) => {
            if (!item) return;
            gsap.to(item, { opacity: 1, duration: 0.05, delay: cnDuration + index * 0.02 });
          });
        },
      });
    },
    { dependencies: [portalNode, isMobile] },
  );

  return (
    <>
      <FloatingPortal>
        <div
          ref={subscribeRef}
          className="page-footer-contact fixed -bottom-80 z-10 flex w-full items-center justify-center mobile:inset-x-5 mobile:h-auto mobile:w-auto"
        >
          <div className="footer-contact-clip items mx-10 flex w-full justify-between bg-white/40 p-10 backdrop-blur mobile:p-4">
            <div>
              <img className="w-[8.125rem]" src="/svgs/logo_without_gradient.svg" alt="" />
              <div className="mt-18 flex gap-5">
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Youtube)}
                  className="group relative flex h-10 cursor-pointer items-center justify-center gap-1 px-2.5 py-2 transition duration-300 hover:text-red-600"
                >
                  <CornerBorder />
                  <YoutubeSVG className="size-6 fill-black transition duration-300 group-hover:fill-red-600" />
                  <span className="font-oxanium text-base/5 font-bold uppercase">YOUTUBE</span>
                </div>
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
                  className="group relative flex h-10 cursor-pointer items-center justify-center gap-1 px-2.5 py-2 transition duration-300 hover:text-red-600"
                >
                  <CornerBorder />
                  <LinkedinSVG className="-mt-0.5 size-6 fill-black transition duration-300 group-hover:fill-red-600" />
                  <span className="font-oxanium text-base/5 font-bold uppercase transition duration-300">LINKEDIN</span>
                </div>
                <div
                  onClick={() => handleLinkClick(MediaLinkType.Media)}
                  className="group relative flex h-10 cursor-pointer items-center justify-center gap-1 px-2.5 py-2 font-oxanium text-base/4 font-bold transition duration-300 hover:text-red-600"
                >
                  <CornerBorder />
                  <MediaSVG className="size-6 fill-black transition duration-300 group-hover:fill-red-600" />
                  <span className="font-oxanium text-base/5 font-bold uppercase">MEDIAKIT</span>
                </div>
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
