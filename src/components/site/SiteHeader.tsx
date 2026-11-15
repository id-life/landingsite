import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import BilingualText from '@/components/common/BilingualText';
import Logo from '@/components/nav/Logo';
import { NAV } from '@/components/nav/nav';
import MenuOpenSVG from '@/components/svg/MenuOpenSVG';
import { clsx } from 'clsx';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import LinkTracker from './LinkTracker';
import MenuToggle from './MenuToggle';
import { ABOUT_LINK, isSection, SITE_NAV, type SiteNavItem } from './site-nav';
import SubscribeTrigger from './SubscribeTrigger';

type Variant = 'overlay' | 'solid';

export type SiteHeaderProps = {
  variant: Variant;
  /** The navigation item of the page in view (a section id, 'news', 'podcast' or 'about'), or null. */
  currentId: string | null;
  /** 'page' when the item is this page; 'true' when the page sits under it (the Spectrum tool pages). */
  currentKind?: 'page' | 'true';
  /** `exit`: the Spectrum tool pages' ID.LIFE link back into the site, in place of SUBSCRIBE. */
  action?: 'subscribe' | 'exit';
  /** Position and padding of the bar (the content layouts differ). */
  className?: string;
  // Set by ExperienceHeader only (the experience's fixed bar).
  id?: string;
  /** False while the experience's intro hides its fixed UI. */
  shown?: boolean;
  inExperience?: boolean;
  onLogoClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onItemClick?: (event: MouseEvent<HTMLAnchorElement>, item: SiteNavItem) => void;
};

/**
 * The one site header (NAV-04), on every route: the logo (a same-tab link to /), the primary navigation (the seven
 * sections plus News and Podcast, the current one marked aria-current) and the actions. `solid` sits in the flow of
 * the content pages; `overlay` is the experience's fixed transparent bar (rendered by ExperienceHeader, which adds the
 * section controller). On phones the navigation moves into the menu sheet.
 *
 * No hooks and no client state (PERF-10): on content pages it renders on the server. Its only client code is the
 * SUBSCRIBE button, the menu button and one delegated click tracker; labels, icons and the wordmark are HTML.
 */
export default function SiteHeader({
  variant,
  currentId,
  currentKind = 'page',
  action = 'subscribe',
  className,
  id,
  shown = true,
  inExperience = false,
  onLogoClick,
  onItemClick,
}: SiteHeaderProps) {
  const overlay = variant === 'overlay';
  // Without handlers (server-rendered pages) the tracker reads these attributes; with them the caller tracks.
  const trackNav = (navId: string, source?: string) =>
    onItemClick ? {} : { 'data-nav-id': navId, ...(source ? { 'data-nav-source': source } : {}) };
  const live = overlay && shown ? 'pointer-events-auto' : undefined;

  return (
    <header
      id={id}
      className={clsx(
        'flex w-full items-center text-foreground',
        overlay
          ? // The experience: one row from 1700 px; below, the navigation takes its own row (wrapping on tablets),
            // because labels are 14 px or more at every width (RWD-01).
            'fixed left-0 top-0 z-50 flex-wrap gap-x-15 gap-y-2 p-10 mobile:z-[60] mobile:flex-nowrap mobile:gap-0 mobile:p-5 navRow:flex-nowrap'
          : // Content pages: the logo and the actions on the first row, the navigation on its own row below.
            'flex-wrap gap-x-6 gap-y-4',
        // Never dimmed or disabled during a section transition (MOT-01); before the UI is revealed it takes no input.
        // On phones the bar lets taps through to the page (its controls take them).
        // It fades in; it hides at once (a fade-out from the server-painted bar would read as "visible" for 300 ms).
        overlay &&
          (shown
            ? 'pointer-events-auto opacity-100 transition-opacity duration-300 mobile:pointer-events-none'
            : 'pointer-events-none opacity-0'),
        className,
      )}
    >
      {!onItemClick && <LinkTracker />}
      <div className={live}>
        <Logo onClick={onLogoClick} {...trackNav(NAV.vision_page.id, 'logo')} />
      </div>
      <nav
        aria-label="Main"
        className={clsx(
          'main-nav-links flex gap-x-8 text-label font-semibold mobile:hidden',
          overlay
            ? clsx(
                // Below 1700 px a row of its own that wraps (never a sideways scroller: its items would be cut by the window).
                'order-last w-full flex-wrap gap-y-1 navRow:order-none navRow:w-auto navRow:flex-nowrap',
                live,
              )
            : 'order-last w-full flex-wrap gap-y-3',
        )}
      >
        {SITE_NAV.map((item) => {
          const current = currentId === item.id;
          return (
            <Link
              key={item.id}
              prefetch={false}
              href={item.href}
              aria-current={current ? (inExperience ? 'page' : currentKind) : undefined}
              onClick={onItemClick ? (event) => onItemClick(event, item) : undefined}
              {...trackNav(item.id)}
              className={clsx(
                // Sections are .nav-item and the pages .nav-page-item (same look, globals.css): the e2e guards count
                // the seven section items by that class.
                isSection(item) ? 'nav-item' : 'nav-page-item',
                'bilingual-font relative flex shrink-0 cursor-pointer items-center whitespace-nowrap text-center font-bold uppercase tap',
                current && 'nav-active',
              )}
            >
              {/* In a span: the link is a flex box, which would drop the space between the two languages. */}
              <span>
                <BilingualText text={item.title} />
              </span>
            </Link>
          );
        })}
      </nav>
      <div
        id={overlay ? 'subscribe-btn' : undefined}
        className="flex h-[max(3rem,44px)] flex-1 items-center justify-end gap-8 mobile:h-auto mobile:gap-5"
      >
        {/* The About page (CON-01): a separate page, so a plain link, not an item of the section navigation. */}
        <Link
          prefetch={false}
          href={ABOUT_LINK.href}
          aria-current={currentId === ABOUT_LINK.id ? 'page' : undefined}
          className={clsx(
            'flex h-10 items-center whitespace-nowrap text-label font-bold uppercase transition-colors duration-300 tap hover:text-accent mobile:hidden',
            live,
          )}
        >
          About
        </Link>
        {/* MOT-02: the Motion switch (<button aria-pressed>) goes here, before SUBSCRIBE, so it is an early Tab stop. */}
        {action === 'exit' ? (
          <Link
            prefetch={false}
            href="/"
            className="group pointer-events-auto relative flex h-[max(2.5rem,40px)] min-w-[max(8.25rem,120px)] cursor-pointer items-center justify-center px-5 text-label font-semibold uppercase transition-colors duration-300 tap hover:stroke-accent hover:text-accent mobile:h-8 mobile:min-w-24 mobile:px-0 mobile:text-xs/5"
          >
            <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent" />
            ID.LIFE
          </Link>
        ) : (
          <SubscribeTrigger
            className={clsx(
              'group relative flex h-[max(2.5rem,40px)] min-w-[max(8.25rem,120px)] cursor-pointer items-center justify-center whitespace-nowrap px-5 text-label font-semibold uppercase duration-300 tap-area hover:stroke-accent hover:text-accent data-[open=true]:stroke-accent data-[open=true]:text-accent mobile:h-8 mobile:min-w-24 mobile:px-0 mobile:text-xs/5',
              live,
            )}
          >
            <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent group-data-[open=true]:stroke-accent" />
            Subscribe
          </SubscribeTrigger>
        )}
        <MenuToggle
          currentId={currentId}
          inExperience={inExperience}
          // 40 px icon in a 44 px box on touch screens; the ::before pseudo-element extends the target to 48 px.
          className="pointer-events-auto relative hidden items-center justify-center tap before:absolute before:-inset-1 before:content-[''] mobile:flex"
          openIcon={<MenuOpenSVG className="h-10" />}
          closeIcon={<MenuCloseSVG aria-hidden="true" className="h-10" />}
        />
      </div>
    </header>
  );
}
