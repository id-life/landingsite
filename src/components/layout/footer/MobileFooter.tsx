'use client';

import CheckedSVG from '@/../public/svgs/checked.svg?component';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import { useMobileSubscribeAction } from '@/hooks/useSubscribeAction';
import { FloatingPortal } from '@floating-ui/react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { useEvent } from 'react-use';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

export default function MobileFooter() {
  const { isSubscribeShow, subscribeRef, handleClickOutside, onFormSubmit, isSubmitting, isSubmitted } =
    useMobileSubscribeAction();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEvent('mousedown', handleClickOutside);

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
          <h3 className="flex items-center justify-between font-oxanium text-3xl font-bold mobile:text-2xl/7.5">
            SUBSCRIBE
            {errors.EMAIL && <span className="font-poppins text-xs">{errors.EMAIL.message}</span>}
          </h3>
          <form
            id="subscribe-form"
            className="mt-8 flex gap-4 px-2 mobile:mt-5 mobile:gap-3 mobile:px-0"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <input type="hidden" {...register('u')} value="e6f88de977cf62de3628d944e" />
            <input type="hidden" {...register('amp;id')} value="af9154d6b5" />
            <input type="hidden" {...register('amp;f_id')} value="00e418e1f0" />
            <div className="flex-1 border-2 border-white p-2 mobile:border">
              <input
                className="w-full bg-transparent text-sm font-semibold placeholder:text-white/80 mobile:text-xs/5"
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
            <div className="footer-submit-clip relative w-[10.5rem] bg-white text-red-600 mobile:w-[5.625rem]">
              {isSubmitting ? (
                <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-white">
                  <LoadingSVG className="w-6 animate-spin stroke-red-600 stroke-[3]" />
                </div>
              ) : null}
              {isSubmitted ? (
                <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-white font-bold">
                  <CheckedSVG className="w-6 stroke-red-600 stroke-[3]" />
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
