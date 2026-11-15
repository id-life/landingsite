'use client';

import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { experienceMountedAtom, initialRouteHandledAtom, mobileNavOpenAtom } from '@/atoms';
import { isSubscribeShowAtom, subscribePopupAtom } from '@/atoms/footer';
import { fadeInAnimCompletedAtom } from '@/atoms/geo';
import BilingualText from '@/components/common/BilingualText';
import Logo from '@/components/nav/Logo';
import { NAV, NAV_LIST } from '@/components/nav/nav';
import MenuOpenSVG from '@/components/svg/MenuOpenSVG';
import { SUBSCRIBE_TRIGGER } from '@/hooks/subscribe-trigger';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { track } from '@/lib/analytics/track';
import { goToSection, sectionStateAtom } from '@/motion/sectionController';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { ABOUT_LINK, isPlainClick, isSection, pageOfPath, SITE_NAV } from './site-nav';

// The phone menu sheet (GSAP stagger) loads on its first open, on every route.
const SiteMenu = dynamic(() => import('./SiteMenu'), { ssr: false });

type Variant = 'overlay' | 'solid';

/**
 * The id of the navigation item for the page in view: the section the controller is at or moving to while the
 * experience is mounted (so a transition never shows two, NAV-04), otherwise the route.
 */
function useCurrentNavId(): string | null {
  const pathname = usePathname();
  const experienceMounted = useAtomValue(experienceMountedAtom);
  const routeApplied = useAtomValue(initialRouteHandledAtom);
  const { target } = useAtomValue(sectionStateAtom);
  if (experienceMounted && routeApplied) return NAV_LIST[target]?.id ?? null;
  const page = pageOfPath(pathname);
  if (page) return page;
  // The Spectrum tool pages belong to Spectrum.
  return NAV_LIST.find((s) => (s.href === '/' ? pathname === '/' : pathname?.startsWith(s.href)))?.id ?? null;
}

/**
 * The one site header (NAV-04), on every route: the logo (a link to /), the primary navigation (the seven sections
 * plus News and Podcast, exactly one item marked aria-current) and the actions. `overlay` is the experience's fixed
 * transparent bar; `solid` sits in the flow of the content pages. On phones the navigation moves into the menu sheet.
 *
 * Inside the experience a section link moves through the section controller and keeps its real href, so a
 * modifier-click still opens a new tab; everywhere else it is a plain next/link navigation.
 */
export default function SiteHeader({
  variant,
  action = 'subscribe',
  className,
}: {
  variant: Variant;
  /** `exit`: the Spectrum tool pages' ID.LIFE link back into the site, in place of SUBSCRIBE. */
  action?: 'subscribe' | 'exit';
  className?: string;
}) {
  const isMobile = useIsMobile();
  const mounted = useIsMounted();
  const pathname = usePathname();
  const currentId = useCurrentNavId();
  const experienceMounted = useAtomValue(experienceMountedAtom);
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);
  const subscribePopup = useSetAtom(subscribePopupAtom);
  const [menuOpen, setMenuOpen] = useAtom(mobileNavOpenAtom);
  const [menuWanted, setMenuWanted] = useState(false);
  // The experience reveals its fixed UI when the intro ends (fadeInAnimCompletedAtom). The server HTML and the
  // first paint show the header, so it paints from HTML on every route.
  const uiVisible = useAtomValue(fadeInAnimCompletedAtom);
  const overlay = variant === 'overlay';
  const shown = !overlay || !mounted || uiVisible;
  const inExperience = overlay && experienceMounted;

  // The menu's code loads on its first open; set while rendering, not in an effect.
  if (menuOpen && !menuWanted) setMenuWanted(true);

  // A page scroll closes the SUBSCRIBE popup (it used to be the desktop nav's job), without counting as a dismissal.
  useEffect(() => {
    if (!isSubscribeShow) return;
    const close = () => subscribePopup({ type: 'close', method: 'scroll' });
    window.addEventListener('scroll', close, { passive: true, once: true });
    return () => window.removeEventListener('scroll', close);
  }, [isSubscribeShow, subscribePopup]);

  // The menu closes when the route changes (set while rendering, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  const onLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    track('nav_click', { target_section: NAV.vision_page.id, source: 'logo' });
    if (!inExperience || !isPlainClick(event)) return;
    event.preventDefault();
    goToSection(NAV.vision_page.id, 'nav');
  };

  const onItemClick = (event: MouseEvent<HTMLAnchorElement>, item: (typeof SITE_NAV)[number]) => {
    track('nav_click', { target_section: item.id, source: 'nav' });
    if (!inExperience || !isSection(item) || !isPlainClick(event)) return;
    event.preventDefault();
    goToSection(item.id, 'nav');
  };

  // The experience's bar keeps the ids the experience and its tests know: #nav on the desktop deck, #mobile-nav
  // on the phone deck. Only once mounted: the intro tweens and the suite read that id's opacity as "the experience
  // is ready", which the server-painted header is not.
  const id = overlay && mounted && isMobile !== null ? (isMobile ? 'mobile-nav' : 'nav') : undefined;

  return (
    <header
      id={id}
      className={cn(
        'flex w-full items-center text-foreground',
        overlay
          ? 'fixed left-0 top-0 z-50 gap-15 p-10 transition-opacity duration-300 mobile:z-[60] mobile:gap-0 mobile:p-5'
          : // Content pages: the logo and the actions on the first row, the navigation on its own row below.
            'relative flex-wrap gap-x-6 gap-y-4 py-5',
        // Never dimmed or disabled during a section transition (MOT-01); before the UI is revealed it takes no input.
        // On phones the bar lets taps through to the page (its controls take them).
        overlay && (shown ? 'pointer-events-auto opacity-100 mobile:pointer-events-none' : 'pointer-events-none opacity-0'),
        className,
      )}
    >
      <div className={cn(overlay && shown && 'pointer-events-auto')}>
        <Logo onClick={onLogoClick} />
      </div>
      <nav
        aria-label="Main"
        className={cn(
          'main-nav-links flex gap-8 text-sm font-semibold mobile:hidden',
          overlay ? (shown ? 'pointer-events-auto' : '') : 'order-last w-full flex-wrap gap-y-3',
        )}
      >
        {SITE_NAV.map((item) => {
          const current = currentId === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={current ? (pathname === item.href || inExperience ? 'page' : 'true') : undefined}
              onClick={(event) => onItemClick(event, item)}
              className={cn(
                'nav-item bilingual-font relative cursor-pointer whitespace-nowrap text-center font-bold uppercase',
                current && 'nav-active',
              )}
            >
              <BilingualText text={item.title} />
            </Link>
          );
        })}
      </nav>
      <div
        id={overlay ? 'subscribe-btn' : undefined}
        className="flex h-12 flex-1 items-center justify-end gap-8 mobile:h-auto mobile:gap-5"
      >
        {/* The About page (CON-01): a separate page, so a plain link, not an item of the section navigation. */}
        <Link
          href={ABOUT_LINK.href}
          aria-current={currentId === ABOUT_LINK.id ? 'page' : undefined}
          className={cn(
            'flex h-10 items-center whitespace-nowrap text-sm font-bold uppercase transition-colors duration-300 hover:text-accent mobile:hidden',
            overlay && shown && 'pointer-events-auto',
          )}
        >
          About
        </Link>
        {/* MOT-02: the Motion switch (<button aria-pressed>) goes here, before SUBSCRIBE, so it is an early Tab stop. */}
        {action === 'exit' ? (
          <Link
            href="/"
            className="group pointer-events-auto relative flex h-10 w-33 cursor-pointer items-center justify-center text-sm font-semibold uppercase transition-colors duration-300 hover:stroke-accent hover:text-accent mobile:h-8 mobile:w-24 mobile:text-xs/5"
          >
            <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent" />
            ID.LIFE
          </Link>
        ) : (
          <button
            type="button"
            {...SUBSCRIBE_TRIGGER}
            aria-haspopup="dialog"
            aria-expanded={isSubscribeShow}
            onClick={() => subscribePopup({ type: 'toggle', placement: 'nav' })}
            className={cn(
              'group relative flex h-10 w-33 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-accent hover:text-accent mobile:h-8 mobile:w-24 mobile:text-xs/5',
              overlay && shown && 'pointer-events-auto',
              isSubscribeShow && 'stroke-accent text-accent',
            )}
          >
            <SubscribeBorderSVG
              className={cn(
                'absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent',
                isSubscribeShow && 'stroke-accent',
              )}
            />
            Subscribe
          </button>
        )}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
          // 40 px icon; the ::before pseudo-element extends the touch target to 48 px.
          className="pointer-events-auto relative hidden before:absolute before:-inset-1 before:content-[''] mobile:flex"
        >
          {menuOpen ? <MenuCloseSVG aria-hidden="true" className="h-10" /> : <MenuOpenSVG className="h-10" />}
        </button>
      </div>
      {menuWanted && <SiteMenu currentId={currentId} inExperience={inExperience} />}
    </header>
  );
}
