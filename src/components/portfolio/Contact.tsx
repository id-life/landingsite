'use client';

import { useCopyToClipboard } from 'react-use';
import CopySVG from '@/../public/svgs/copy-btn.svg?component';
import CheckmarkSVG from '@/../public/svgs/checkmark.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';

export default function Contact() {
  const [state, copyToClipboard] = useCopyToClipboard();

  return (
    <div
      onClick={() => copyToClipboard('contact@id.life')}
      className="group relative w-52 cursor-pointer bg-white/10 py-3.5 text-center text-base/5 font-semibold backdrop-blur duration-300 hover:text-red-600 mobile:absolute mobile:-bottom-3 mobile:w-44 mobile:-translate-x-1/2 mobile:text-xs/5"
    >
      <SubscribeBorderSVG
        preserveAspectRatio="none"
        className="absolute inset-0 left-0 top-0 h-full w-full stroke-foreground duration-300 group-hover:stroke-red-600"
      />
      <div className="flex-center h-full w-full gap-4 mobile:gap-2">
        <span className="w-36 mobile:w-[7.9375rem] mobile:uppercase">contact@id.life</span>
        {state.value ? (
          <CheckmarkSVG className="aspect-square h-3.5 stroke-white duration-300 group-hover:stroke-red-600" />
        ) : (
          <CopySVG className="aspect-square h-3.5 stroke-white duration-300 group-hover:stroke-red-600" />
        )}
      </div>
    </div>
  );
}
