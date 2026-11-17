import { isSubscribeShowAtom, subscribePopupAtom, subscribeTypeAtom } from '@/atoms/footer';
import { submitNewsletter } from '@/utils/newsletter';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useThrottle } from './useThrottle';

type Inputs = {
  EMAIL: string;
  website: string;
};

/** Form state of the phone SUBSCRIBE popup (SubscribeSheet). Opening and closing go through subscribePopupAtom. */
export function useMobileSubscribeAction() {
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);
  const placement = useAtomValue(subscribeTypeAtom);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitNewsletter({ email: formData.EMAIL, website: formData.website }, placement ?? 'nav');
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
