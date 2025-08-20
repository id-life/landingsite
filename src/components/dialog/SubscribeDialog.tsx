import { FormEvent, useState } from 'react';
import jsonp from '@/utils/jsonp';
import { getEmailError } from '@/utils/validation';

type SubscribeDialogProps = {
  handleSubmit?: () => void;
};

export default function SubscribeDialog({ handleSubmit }: SubscribeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
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
      setTimeout(() => handleSubmit?.(), 600);
    });
  };

  return (
    <div className="w-[27.5rem] p-8 mobile:w-full">
      <img src="/svgs/email.svg" className="mx-auto h-10" alt="email" />
      <h3 className="mt-4 text-center text-xl/5.5 font-semibold uppercase">subscribe</h3>
      <form id="subscribe-form" className="mt-8 px-2" onSubmit={onFormSubmit}>
        <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
        <input type="hidden" name="amp;id" value="af9154d6b5" />
        <input type="hidden" name="amp;f_id" value="00e418e1f0" />
        <div className="relative">
          {emailError && <p className="absolute -top-5 left-0 text-xs text-red-600">{emailError}</p>}
          <div className={`border-2 p-3 ${emailError ? 'border-red-600' : 'border-gray-800'}`}>
            <input
              className="w-full text-sm font-semibold"
              placeholder="Please enter email"
              type="text"
              name="EMAIL"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
          </div>
        </div>
        <div className="submit-btn mx-auto mt-7.5 max-w-55 !py-0">
          {isSubmitting ? (
            <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-red-800">
              <img src="/svgs/loading.svg" className="w-6 animate-spin" alt="loading" />
            </div>
          ) : null}
          {isSubmitted ? (
            <div className="absolute left-0 top-0 z-[20] flex h-full w-full items-center justify-center bg-green-600">
              <img src="/svgs/checked.svg" className="w-6" alt="checked" /> Success
            </div>
          ) : null}
          <input className="relative z-10 w-full cursor-pointer py-3" type="submit" value="Subscribe" />
        </div>
      </form>
    </div>
  );
}
