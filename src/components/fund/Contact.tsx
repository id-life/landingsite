'use client';

import { FormEvent, useState } from 'react';
import Dialog from '@/components/dialog';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import jsonp from '@/utils/jsonp';
import CopySVG from '@/../public/svgs/copy-btn.svg?component';
import CheckmarkSVG from '@/../public/svgs/checkmark.svg?component';
import { useCopyToClipboard } from 'react-use';

export default function Contact() {
  const [clicked, setClicked] = useState<boolean>(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  // const [open, setOpen] = useState<boolean>(false);
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  // const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (isSubmitting) return;
  //   const formData = new FormData(event.currentTarget);
  //   const params = new URLSearchParams();
  //   formData.forEach((value: any, key) => params.append(key, value));
  //   const querystring = params.toString();
  //   setIsSubmitting(true);
  //   jsonp(`https://life.us11.list-manage.com/subscribe/post-json?${querystring}`).then(() => {
  //     setIsSubmitting(false);
  //     setIsSubmitted(true);
  //     setTimeout(() => {
  //       setOpen(false);
  //       setIsSubmitted(false);
  //     }, 600);
  //   });
  // };

  return (
    <>
      <div
        onClick={() => {
          if (!clicked) {
            setClicked(true);
            return;
          }
          copyToClipboard('contact@id.life');
        }}
        className="group relative w-52 cursor-pointer bg-white/10 py-3.5 text-center text-base/5 font-semibold backdrop-blur duration-300 hover:text-red-600 mobile:w-32 mobile:text-xs/5"
      >
        <SubscribeBorderSVG className="absolute inset-0 left-0 top-0 stroke-foreground duration-300 group-hover:stroke-red-600" />
        {clicked ? (
          <div className="flex-center gap-4">
            <span className="w-36">contact@id.life</span>
            {state.value ? (
              <CheckmarkSVG className="aspect-square h-3.5 stroke-white duration-300 group-hover:stroke-red-600" />
            ) : (
              <CopySVG className="aspect-square h-3.5 stroke-white duration-300 group-hover:stroke-red-600" />
            )}
          </div>
        ) : (
          <>CONTACT US</>
        )}
      </div>
      {/* <Dialog
        open={open}
        onOpenChange={setOpen}
        render={() => (
          <div className="w-[27.5rem] p-7.5 mobile:w-full mobile:p-4">
            <img src="/svgs/email.svg" className="mx-auto h-10" alt="email" />
            <h3 className="mt-4 text-center text-xl/5.5 font-semibold uppercase">CONTACT US</h3>
            <form id="contact-form" className="mt-8 grid gap-5" onSubmit={onFormSubmit}>
              <input type="hidden" name="u" value="e6f88de977cf62de3628d944e" />
              <input type="hidden" name="amp;id" value="af9154d6b5" />
              <input type="hidden" name="amp;f_id" value="00e918e1f0" />
              <div className="border-2 border-gray-800 p-3">
                <input
                  className="w-full text-xs/5 font-semibold"
                  placeholder="Name"
                  type="text"
                  name="NAME"
                  required
                  defaultValue=""
                />
              </div>
              <div className="border-2 border-gray-800 p-3">
                <input
                  className="w-full text-xs/5 font-semibold"
                  placeholder="Email"
                  type="email"
                  name="EMAIL"
                  required
                  defaultValue=""
                />
              </div>
              <div>
                <p className="text-xs/5 font-semibold">Which best describes you?</p>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  <div className="relative cursor-pointer py-3 text-center">
                    <input
                      type="radio"
                      name="PROFESSION"
                      value="Founder"
                      id="contact-founder"
                      defaultChecked
                      className="cursor-pointer appearance-none after:absolute after:inset-0 after:border-2 after:border-gray-800 checked:after:border-red-600 checked:after:text-red-600"
                    />
                    <label htmlFor="contact-founder" className="text-xs/5 font-semibold">
                      Founder
                    </label>
                  </div>
                  <div className="relative cursor-pointer py-3 text-center">
                    <input
                      type="radio"
                      name="PROFESSION"
                      value="Investor"
                      id="contact-investor"
                      className="cursor-pointer appearance-none after:absolute after:inset-0 after:border-2 after:border-gray-800 checked:after:border-red-600 checked:after:text-red-600"
                    />
                    <label htmlFor="contact-investor" className="text-xs/5 font-semibold">
                      Investor
                    </label>
                  </div>
                  <div className="relative cursor-pointer py-3 text-center">
                    <input
                      type="radio"
                      name="PROFESSION"
                      value="Media"
                      id="contact-media"
                      className="cursor-pointer appearance-none after:absolute after:inset-0 after:border-2 after:border-gray-800 checked:after:border-red-600 checked:after:text-red-600"
                    />
                    <label htmlFor="contact-media" className="text-xs/5 font-semibold">
                      Media
                    </label>
                  </div>
                  <div className="relative cursor-pointer py-3 text-center">
                    <input
                      type="radio"
                      name="PROFESSION"
                      value="Advocates"
                      id="contact-advocates"
                      className="cursor-pointer appearance-none after:absolute after:inset-0 after:border-2 after:border-gray-800 checked:after:border-red-600 checked:after:text-red-600"
                    />
                    <label htmlFor="contact-advocates" className="text-xs/5 px-1 font-semibold">
                      Advocates
                    </label>
                  </div>
                </div>
              </div>
              <div className="border-2 border-gray-800 p-3">
                <textarea
                  id="story"
                  name="MSG"
                  placeholder="Note"
                  rows={5}
                  cols={33}
                  className="w-full resize-none text-xs/5 font-semibold"
                />
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
        )}
      /> */}
    </>
  );
}
