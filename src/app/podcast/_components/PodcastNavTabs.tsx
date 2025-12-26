'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useSearchParams, usePathname } from 'next/navigation';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';

export default function PodcastNavTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = useMemo(
    () => (pathname === '/podcast' ? (searchParams.get('c') ?? PODCAST_NAV_LIST[0].id) : null),
    [pathname, searchParams],
  );

  return (
    <div className="hidden mobile:grid mobile:grid-cols-2 mobile:justify-center mobile:pb-5">
      {PODCAST_NAV_LIST.map((item) => {
        const isActive = search === item.id;
        const [english, chinese] = item.title.split(' ').reduce(
          (acc, word) => {
            if (/[\u4e00-\u9fa5]/.test(word)) {
              acc[1] = acc[1] ? `${acc[1]} ${word}` : word;
            } else {
              acc[0] = acc[0] ? `${acc[0]} ${word}` : word;
            }
            return acc;
          },
          ['', ''],
        );

        return (
          <Link href={item.link} key={item.id}>
            <div
              className={clsx(
                'relative cursor-pointer text-center font-semibold uppercase',
                isActive ? 'text-[#c11111]' : 'text-[#222]',
              )}
            >
              <p className="text-sm/4">{english}</p>
              <p className="text-sm/4">{chinese}</p>
              {isActive && <div className="mx-auto mt-1.5 h-0.5 w-5 bg-[#c11111]" />}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
