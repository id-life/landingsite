'use client';

import Logo from '@/components/nav/Logo';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';

export default function AboutHeader() {
  const handleHomeClick = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="flex items-center justify-between p-10 mobile:p-5">
      <Logo />
      <div
        onClick={handleHomeClick}
        className="group relative z-[100] flex h-10 w-34 cursor-pointer items-center justify-center text-sm font-semibold uppercase text-foreground duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5"
      >
        <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
        ID.LIFE
      </div>
    </div>
  );
}
