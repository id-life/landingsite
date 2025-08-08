'use client';

import { useMemo } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useAtom } from 'jotai';
import LogoSVGen from '@/components/svg/LogoSVGen';
import MenuOpenSVG from '@/components/svg/MenuOpenSVG';
import { isPodcastNavOpenAtom } from '@/atoms/podcast';
import { useSearchParams, usePathname } from 'next/navigation';
import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import PodcastNavDialog from '@/app/podcast/_components/PodcastNavDialog';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border-2.svg?component';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';

export default function PodcastHeader() {
  const pathname = usePathname();
  const { trackEvent } = useGA();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useAtom(isPodcastNavOpenAtom);

  const search = useMemo(
    () => (pathname === '/podcast' ? (searchParams.get('c') ?? PODCAST_NAV_LIST[0].id) : null),
    [pathname, searchParams],
  );

  const handleHomeClick = () => {
    trackEvent({ name: GA_EVENT_NAMES.ID_HOME_REDIRECT });
    window.open('/', '_blank');
  };

  return (
    <div className="flex items-center justify-between py-10 mobile:py-6.5">
      <div className="flex items-center justify-start gap-6">
        <LogoSVGen className="w-50 mobile:w-30" />
        <div className="flex gap-8 text-sm font-semibold mobile:hidden">
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
      <div className="flex-center gap-5">
        <div
          onClick={handleHomeClick}
          className="group relative flex h-8 w-26.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-21 mobile:text-xs/5"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
          ID.LIFE
        </div>
        <div className="hidden mobile:block" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MenuCloseSVG className="h-10" /> : <MenuOpenSVG className="h-10" />}
        </div>
      </div>
      <PodcastNavDialog />
    </div>
  );
}
