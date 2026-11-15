'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useAtom, useSetAtom } from 'jotai';
import LogoSVGen from '@/components/svg/LogoSVGen';
import MenuOpenSVG from '@/components/svg/MenuOpenSVG';
import { isPodcastNavOpenAtom } from '@/atoms/podcast';
import { usePathname } from 'next/navigation';
import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { track } from '@/lib/analytics/track';
import { subscribePopupAtom } from '@/atoms/footer';
import { SUBSCRIBE_TRIGGER } from '@/hooks/subscribe-trigger';

import BilingualText from '@/components/common/BilingualText';
// The phone menu (GSAP stagger) loads on its first open, not with the page.
const PodcastNavDialog = dynamic(() => import('@/app/podcast/_components/PodcastNavDialog'), { ssr: false });

export default function PodcastHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useAtom(isPodcastNavOpenAtom);
  const subscribePopup = useSetAtom(subscribePopupAtom);
  const [navWanted, setNavWanted] = useState(false);

  // The menu's code loads on its first open; set while rendering, not in an effect.
  if (menuOpen && !navWanted) setNavWanted(true);

  // Each show has its own path; an episode page highlights no tab.
  const search = useMemo(() => PODCAST_NAV_LIST.find((item) => item.link === pathname)?.id ?? null, [pathname]);

  const handleLogoClick = () => {
    track('nav_click', { target_section: 'vision_page', source: 'logo' });
    window.location.href = '/';
  };

  const handleSubscribeClick = () => subscribePopup({ type: 'toggle', placement: 'nav' });

  return (
    <div className="relative flex items-center justify-between py-10 mobile:py-5">
      <div className="flex items-center gap-6">
        {/* Logo - Left */}
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <LogoSVGen className="w-50 mobile:w-[7.75rem]" />
        </div>

        {/* Tabs - Center (Desktop only) */}
        <div className="flex gap-8 text-sm font-bold mobile:hidden">
          {PODCAST_NAV_LIST.map((item) => (
            <Link href={item.link} key={item.id}>
              <div
                className={clsx(
                  'nav-item bilingual-font relative cursor-pointer whitespace-nowrap text-center uppercase',
                  search === item.id && 'nav-active',
                )}
              >
                <BilingualText text={item.title} />
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Subscribe + Menu - Right */}
      <div className="flex-center gap-5">
        <button
          type="button"
          {...SUBSCRIBE_TRIGGER}
          aria-haspopup="dialog"
          onClick={handleSubscribeClick}
          className="group relative flex h-10 w-34 cursor-pointer items-center justify-center text-sm font-semibold uppercase tracking-[0.1em] duration-300 hover:stroke-accent hover:text-accent mobile:h-8 mobile:w-24 mobile:text-xs/5 mobile:tracking-normal"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent" />
          Subscribe
        </button>
        <div className="hidden mobile:block" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MenuCloseSVG className="h-10" /> : <MenuOpenSVG className="h-10" />}
        </div>
      </div>
      {navWanted && <PodcastNavDialog />}
    </div>
  );
}
