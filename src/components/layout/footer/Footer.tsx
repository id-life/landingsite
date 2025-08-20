'use client';

import { FormEvent, useRef, useState } from 'react';
import jsonp from '@/utils/jsonp';
import LoadingSVG from '@/../public/svgs/loading.svg?component';
import CheckedSVG from '@/../public/svgs/checked.svg?component';
import { FloatingPortal } from '@floating-ui/react';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { getEmailError } from '@/utils/validation';

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const subscribeRef = useRef<HTMLDivElement>(null);

  const { trackEvent } = useGA();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // 清除之前的错误
    if (emailError) {
      const error = getEmailError(value);
      setEmailError(error);
    }
  };

  const handleEmailBlur = () => {
    const error = getEmailError(email);
    setEmailError(error);
  };

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    // 验证邮箱
    const error = getEmailError(email);
    if (error) {
      setEmailError(error);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value: any, key) => params.append(key, value));
    const querystring = params.toString();
    setIsSubmitting(true);
    jsonp(`https://life.us11.list-manage.com/subscribe/post-json?${querystring}`).then(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail(''); // 清空输入
      setEmailError(''); // 清空错误
    });

    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_LETTER,
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.FOOTER,
    });
  };

  return (
    <>
      <div ref={wrapperRef} className="h-52" />
      <FloatingPortal>
        <div
          ref={subscribeRef}
          className="page-footer fixed -bottom-40 z-[52] flex h-52 w-full items-center justify-center mobile:inset-x-5 mobile:h-auto mobile:w-auto"
        >
          <div className="footer-box-clip h-0 w-0 bg-red-600 px-7.5 py-9 text-white mobile:px-4 mobile:py-7.5">
            <h3 className="font-oxanium text-3xl font-bold uppercase mobile:text-2xl/7.5">SUBSCRIBE</h3>
            <form id="subscribe-form" className="mt-8 px-2 mobile:mt-5 mobile:px-0" onSubmit={onFormSubmit}>
              <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
              <input type="hidden" name="amp;id" value="af9154d6b5" />
              <input type="hidden" name="amp;f_id" value="00e418e1f0" />
              <div className="relative flex gap-4 mobile:gap-3">
                {email && emailError && <p className="absolute -top-5 left-0 text-xs text-white">{emailError}</p>}
                <div className={`flex-1 border-2 p-2 mobile:border ${emailError ? 'border-red-300' : 'border-white'}`}>
                  <input
                    className="w-full bg-transparent text-sm font-semibold placeholder:text-white/80 mobile:text-xs/5"
                    placeholder="Please enter email"
                    type="text"
                    name="EMAIL"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
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
              </div>
            </form>
            <div className="ml-2 mt-3.5 flex items-center gap-1.5 text-xs font-semibold">
              <img className="h-4" src="/svgs/info.svg" alt="" />
              Join our Longevity Circle and receive the latest insights & research
            </div>
          </div>
        </div>
      </FloatingPortal>
    </>
  );
}
