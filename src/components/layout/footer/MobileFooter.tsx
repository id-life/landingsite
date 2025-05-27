'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import { isSubscribeShowAtom } from '@/atoms/footer';
import jsonp from '@/utils/jsonp';
import { FloatingPortal } from '@floating-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { MediaLinkType } from './FooterContact';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';

export default function MobileFooter() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);

  const { trackEvent } = useGA();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (subscribeRef.current && !subscribeRef.current.contains(event.target as Node)) {
        setIsSubscribeShow(false);
      }
    },
    [setIsSubscribeShow],
  );

  useEffect(() => {
    if (isSubscribeShow) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, isSubscribeShow]);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value: any, key) => params.append(key, value));
    const querystring = params.toString();
    setIsSubmitting(true);
    jsonp(`https://life.us11.list-manage.com/subscribe/post-json?${querystring}`).then(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    });
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_LETTER,
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.FOOTER,
    });
  };

  const handleLinkClick = useCallback((type: MediaLinkType) => {
    if (type === MediaLinkType.Youtube) {
      window.open('https://www.youtube.com/@Immortal-Dragons', '__blank');
    }
    if (type === MediaLinkType.Linkedin) {
      window.open('https://www.linkedin.com/company/immortaldragons/', '__blank');
    }
    if (type === MediaLinkType.Media) {
      window.open('https://drive.google.com/drive/folders/1vajrjCq-nAX1LVSzJ_fETL2GKI0-ckrG', '__blank');
    }
  }, []);

  return (
    <FloatingPortal>
      <AnimatePresence>
        <motion.div
          animate={isSubscribeShow ? 'open' : 'close'}
          variants={{
            open: { scale: 1, bottom: '.75rem' },
            close: { scale: 0, bottom: '-10rem' },
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          ref={subscribeRef}
          // 比导航遮罩层级高
          className="page-footer footer-box-clip fixed inset-x-4 bottom-3 z-[101] origin-center bg-red-600 px-4 py-7.5 text-white"
        >
          <h3 className="font-oxanium text-3xl font-bold uppercase mobile:text-2xl/7.5">SUBSCRIBE</h3>
          <form
            id="subscribe-form"
            className="mt-8 flex gap-4 px-2 mobile:mt-5 mobile:gap-3 mobile:px-0"
            onSubmit={onFormSubmit}
          >
            <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
            <input type="hidden" name="amp;id" value="af9154d6b5" />
            <input type="hidden" name="amp;f_id" value="00e418e1f0" />
            <div className="flex-1 border-2 border-white p-2 mobile:border">
              <input
                className="w-full bg-transparent text-sm font-semibold placeholder:text-white/80 mobile:text-xs/5"
                placeholder="Please enter email"
                type="email"
                name="EMAIL"
                required
                defaultValue=""
              />
            </div>
            <div className="footer-submit-clip relative w-[10.5rem] bg-white text-red-600 mobile:w-[5.625rem]">
              {isSubmitting ? (
                <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-white">
                  <LoadingSVG className="w-6 animate-spin stroke-red-600 stroke-[3]" />
                </div>
              ) : null}
              {isSubmitted ? (
                <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-white font-bold">
                  <CheckedSVG className="w-6 stroke-red-600 stroke-[3]" /> Success
                </div>
              ) : null}
              <input
                className="w-full cursor-pointer py-3 text-base/5 font-bold mobile:font-semibold"
                type="submit"
                value="Subscribe"
              />
            </div>
          </form>
          <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
            <img className="h-4" src="/svgs/info.svg" alt="" />
            Join our Longevity Circle and receive the latest insights & research
          </div>
        </motion.div>
      </AnimatePresence>
    </FloatingPortal>
  );
}
