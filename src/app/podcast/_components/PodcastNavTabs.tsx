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
    // The podcast's sub-navigation: the two shows, in the site header beside the logo as the original podcast header
    // had them (SiteHeader pageLinks); under the bar on phones. Same look as before on both layouts.
    <nav aria-label="Podcast shows">
      {/* RWD-09: the reading size (text-read-sm, 14.3 px at 1440, 18.6 px at 2560) instead of a fixed 14 px, so the show
          tabs grow with the reading column on large screens; the line height stays 20 px. */}
      <div className="flex gap-8 text-read-sm font-bold leading-5 mobile:hidden">
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
      <div className="hidden mobile:grid mobile:grid-cols-2 mobile:justify-center mobile:pt-5">
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
                  <p className="whitespace-nowrap text-label leading-4">
                    {english} {chinese}
                  </p>
                ) : (
                  <>
                    <p className="text-label leading-4">{english}</p>
                    <p className="text-label leading-4">{chinese}</p>
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
