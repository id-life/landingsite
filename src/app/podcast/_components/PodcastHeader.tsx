'use client';

import { useMemo } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import LogoSVGen from '@/components/svg/LogoSVGen';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border-2.svg?component';

export default function PodcastHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(
    () => (pathname === '/podcast' ? (searchParams.get('c') ?? PODCAST_NAV_LIST[0].id) : null),
    [pathname, searchParams],
  );

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleTabClick = (tab: string) => {
    router.push('/podcast?c=' + tab);
  };

  return (
    <div className="flex items-center justify-between py-10">
      <div className="flex items-center justify-start gap-6">
        <LogoSVGen className="h-10 w-50" />
        <div className="flex gap-8 text-sm font-semibold">
          {PODCAST_NAV_LIST.map((item) => (
            <Link href={`/podcast?c=` + item.id} key={item.id}>
              <div
                className={clsx(
                  'nav-item bilingual-font relative cursor-pointer whitespace-nowrap text-center font-bold uppercase',
                  search === item.id && 'nav-active',
                )}
              >
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div
        onClick={handleHomeClick}
        className="group relative flex h-8 w-26.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5"
      >
        <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
        ID.LIFE
      </div>
    </div>
  );
}
