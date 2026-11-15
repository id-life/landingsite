'use client';

import Link from 'next/link';
import { cn } from '@/utils';
import Logo from '@/components/nav/Logo';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';

export interface SpectrumHeaderProps {
  className?: string;
}

export default function SpectrumHeader(props: SpectrumHeaderProps) {
  const { className } = props;

  return (
    <div className={cn('flex items-center justify-between p-10 mobile:p-5', className)}>
      <Logo />
      {/* The tool pages' way back into the site: a real same-tab link (it used to open / in a new tab). */}
      <Link
        href="/"
        className="group relative z-[100] flex h-10 w-33 cursor-pointer items-center justify-center text-sm font-semibold uppercase text-foreground transition-colors duration-300 hover:stroke-accent hover:text-accent mobile:h-8 mobile:w-24 mobile:text-xs/5"
      >
        <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent" />
        ID.LIFE
      </Link>
    </div>
  );
}
