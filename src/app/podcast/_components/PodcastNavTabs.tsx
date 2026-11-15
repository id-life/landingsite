'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import BilingualText from '@/components/common/BilingualText';

export default function PodcastNavTabs() {
  const pathname = usePathname();

  // Each show has its own path; an episode page highlights no tab.
  const search = useMemo(() => PODCAST_NAV_LIST.find((item) => item.link === pathname)?.id ?? null, [pathname]);

  return (
    // The podcast's in-page sub-navigation: the two shows (NAV-04 moved them out of the old podcast header, where the
    // desktop tabs sat beside the logo). Same look as before on both layouts.
    <nav aria-label="Podcast shows">
      <div className="flex gap-8 pb-10 text-sm font-bold mobile:hidden">
        {PODCAST_NAV_LIST.map((item) => (
          <Link
            href={item.link}
            key={item.id}
            aria-current={search === item.id ? 'page' : undefined}
            className={clsx(
              'nav-item bilingual-font relative cursor-pointer whitespace-nowrap text-center uppercase',
              search === item.id && 'nav-active',
            )}
          >
            <BilingualText text={item.title} />
          </Link>
        ))}
      </div>
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
            <Link href={item.link} key={item.id} aria-current={isActive ? 'page' : undefined}>
              <div
                className={clsx(
                  'relative cursor-pointer text-center font-semibold uppercase',
                  isActive ? 'text-accent' : 'text-tone-800',
                )}
              >
                {item.id === 'lt' ? (
                  <p className="whitespace-nowrap text-sm/4">
                    {english} {chinese}
                  </p>
                ) : (
                  <>
                    <p className="text-sm/4">{english}</p>
                    <p className="text-sm/4">{chinese}</p>
                  </>
                )}
                {isActive && <div className="mx-auto mt-1.5 h-0.5 w-5 bg-accent" />}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
