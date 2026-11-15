import { isSubscribeShowAtom, subscribePopupAtom, subscribeTypeAtom } from '@/atoms/footer';
import { submitNewsletter } from '@/utils/newsletter';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useThrottle } from './useThrottle';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

/**
 * The desktop header's SUBSCRIBE button. The popup opens only on request: it used to open by itself
 * (first on arrival, then on reaching the 4th section), covering the hero, the phone controls and the
 * Connect contact block. The button toggles it; a page scroll closes it without counting as a dismissal.
 */
export function useSubscribeAction() {
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);
  const isSubscribeShowRef = useRef(isSubscribeShow);
  isSubscribeShowRef.current = isSubscribeShow;
  const dispatch = useSetAtom(subscribePopupAtom);

  const onSubscribeClick = () => dispatch({ type: 'toggle', placement: 'nav' });

  const handleScroll = useThrottle(() => {
    if (isSubscribeShowRef.current) dispatch({ type: 'close', method: 'scroll' });
  }, 300);

  return { isSubscribeShow, onSubscribeClick, handleScroll };
}

/** Form state of the phone SUBSCRIBE popup (MobileFooter). Opening and closing go through subscribePopupAtom. */
export function useMobileSubscribeAction() {
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);
  const placement = useAtomValue(subscribeTypeAtom);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitNewsletter(formData, placement ?? 'nav');
    setIsSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (isSubscribeShow) {
      setIsSubmitted(false);
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isSubscribeShow]);

  return { isSubscribeShow, onFormSubmit, isSubmitting, isSubmitted, submitError };
}
