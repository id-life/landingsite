'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import { isSubscribeShowAtom } from '@/atoms/footer';
import jsonp from '@/utils/jsonp';
import { FloatingPortal } from '@floating-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { MediaLinkType } from './FooterContact';

export default function MobileFooter() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);

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

  const onFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [isSubmitting, setIsSubmitting, setIsSubmitted],
  );

  const handleLinkClick = useCallback((type: MediaLinkType) => {
    if (type === MediaLinkType.Youtube) {
      window.open('https://www.youtube.com/@Immortal-Dragons', '__blank');
    }
    if (type === MediaLinkType.Linkedin) {
      window.open('https://www.linkedin.com/company/immortaldragons/', '__blank');
    }
    if (type === MediaLinkType.Media) {
      window.open('https://drive.google.com/drive/folders/1MGFLw-cX8gHeuo5XpY2K02XgbtKIXGNW?usp=sharing', '__blank');
    }
  }, []);

  return (
    <FloatingPortal>
      <AnimatePresence>
        <motion.div
          animate={isSubscribeShow ? 'open' : 'close'}
          variants={{
            open: { scale: 1, bottom: 0 },
            close: { scale: 0, bottom: '-10rem' },
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          ref={subscribeRef}
          className="page-footer fixed inset-x-5 bottom-0 z-40 origin-center border-2 border-white bg-white/20 p-4 pt-5 text-black backdrop-blur-lg"
        >
          <h3 className="font-oxanium text-2xl/7.5 font-bold uppercase">SUBSCRIBE</h3>
          <form id="subscribe-form" className="mt-5 flex gap-3" onSubmit={onFormSubmit}>
            <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
            <input type="hidden" name="amp;id" value="af9154d6b5" />
            <input type="hidden" name="amp;f_id" value="00e418e1f0" />
            <div className="flex-center h-11 flex-1 border-2 border-black p-3">
              <input
                className="w-full bg-transparent text-xs/5 font-semibold placeholder:text-black"
                placeholder="Please enter email"
                type="email"
                name="EMAIL"
                required
                defaultValue=""
              />
            </div>
            <div className="footer-submit-clip relative h-11 w-[5.625rem] bg-red-600 text-white">
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
              <input className="w-full cursor-pointer py-3 text-base/5 font-semibold" type="submit" value="Submit" />
            </div>
          </form>
          <div className="mb-1.5 mt-4 h-px w-full bg-black/10" />
          <div className="flex-center">
            <div
              onClick={() => handleLinkClick(MediaLinkType.Youtube)}
              className="flex-center group relative size-9 cursor-pointer"
            >
              <YoutubeSVG className="size-4 fill-black group-hover:fill-red-600" />
            </div>
            <div
              onClick={() => handleLinkClick(MediaLinkType.Linkedin)}
              className="flex-center group relative size-9 cursor-pointer"
            >
              <LinkedinSVG className="size-4 fill-black group-hover:fill-red-600" />
            </div>
            <div
              onClick={() => handleLinkClick(MediaLinkType.Media)}
              className="flex-center group relative size-9 cursor-pointer"
            >
              <MediaSVG className="size-4 fill-black group-hover:fill-red-600" />
            </div>
          </div>
          <p className="mt-1.5 text-center font-oxanium text-[.625rem]/3 font-semibold uppercase opacity-60">
            e- mail: contact@id.life
            <br />
            t- Biopolis Dr, #01-15, Singapore 138623
          </p>
        </motion.div>
      </AnimatePresence>
    </FloatingPortal>
  );
}
