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
import { isSection, SITE_NAV, type SiteNavItem } from './site-nav';
import SubscribeTrigger from './SubscribeTrigger';

type Variant = 'overlay' | 'solid';

/**
 * The original menu (the owner's call, 2026-11-16): the seven sections, in capitals with their Chinese half, in the top
 * row between the logo and the action, as the wave-0 site had them; News, Podcast and About are not in the bar (they
 * are reached from the Insights section, the footer and the phone menu). From 1240 px the bar is that one row, the
 * items placed where wave 0 placed them (from 16.67 % of the window, gaps of 1.67 %) but at 14 px instead of 10. Below
 * 1240 px the seven do not fit beside the logo at 14 px: they take a row of their own under it, and below 900 px that
 * row breaks after the fourth item (a full-width break whose height is the row gap). The tablet arrangement is a
 * proposal awaiting the owner.
 */
const SECTION_NAV = SITE_NAV.filter(isSection);
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
          ? // The experience: one row from 1240 px, with wave 0's padding (2.08 % of the window: 30 px at 1440, 40 at
            // 1920); below, the navigation takes its own row under the logo row.
            'fixed left-0 top-0 z-50 flex-wrap gap-x-15 gap-y-2 px-10 pb-2 pt-6 mobile:z-[60] mobile:flex-nowrap mobile:gap-0 mobile:p-5 navRow:flex-nowrap navRow:p-[2.0833vw]'
          : // Content pages: the logo and the page's action, as their original headers had them.
            'flex-wrap gap-x-6 gap-y-4 navRow:flex-nowrap',
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
      {/* The menu is the experience's only: the original content pages (news, podcast, the tool pages) show the logo
          and their action, and no menu labels (the owner's rule: no label a page did not show). */}
      {overlay && (
        <nav
          aria-label="Main"
          className={clsx(
            'main-nav-links flex gap-x-8 text-label font-semibold mobile:hidden',
            // Below 1240 px a row of its own (never a sideways scroller: its items would be cut by the window).
            'order-last w-full flex-wrap gap-y-1 navRow:order-none navRow:w-auto navRow:flex-nowrap navGrid:gap-x-6 navGrid:gap-y-0',
            // Where wave 0 put the first item: 16.67 % of the window from its left edge, centred on the logo row.
            'navRow:absolute navRow:left-[16.667vw] navRow:top-1/2 navRow:-translate-y-1/2',
            live,
          )}
        >
          {SECTION_NAV.map((item, index) => {
            const current = currentId === item.id;
            return [
              index === 4 && (
                <span
                  key="row-break"
                  aria-hidden="true"
                  // A flex line of its own that is the row gap (the nav has none here: a zero-height line would add
                  // the gap twice, and a negative margin cannot shrink a flex line below zero).
                  className="hidden h-1 basis-full navGrid:block"
                />
              ),
              <Link
                key={item.id}
                prefetch={false}
                href={item.href}
                aria-current={current ? (inExperience ? 'page' : currentKind) : undefined}
                onClick={onItemClick ? (event) => onItemClick(event, item) : undefined}
                {...trackNav(item.id)}
                className={clsx(
                  // The e2e guards count the seven section items by this class.
                  'nav-item',
                  'bilingual-font relative flex shrink-0 cursor-pointer items-center whitespace-nowrap text-center font-bold uppercase tap',
                  current && 'nav-active',
                )}
              >
                {/* In a span: the link is a flex box, which would drop the space between the two languages. */}
                <span>
                  <BilingualText text={item.title} />
                </span>
              </Link>,
            ];
          })}
        </nav>
      )}
      <div
        id={overlay ? 'subscribe-btn' : undefined}
        className="flex h-[max(3rem,44px)] flex-1 items-center justify-end gap-8 mobile:h-auto mobile:gap-5"
      >
        {action === 'exit' ? (
          <Link
            prefetch={false}
            href="/"
            className="group pointer-events-auto relative flex h-[max(2.5rem,40px)] min-w-[max(8.25rem,120px)] cursor-pointer items-center justify-center px-5 text-label font-semibold uppercase transition-colors duration-300 tap hover:stroke-accent hover:text-accent mobile:h-8 mobile:min-w-24 mobile:px-0 mobile:text-caption"
          >
            <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent" />
            ID.LIFE
          </Link>
        ) : (
          <SubscribeTrigger
            className={clsx(
              'group relative flex h-[max(2.5rem,40px)] min-w-[max(8.25rem,120px)] cursor-pointer items-center justify-center whitespace-nowrap px-5 text-label font-semibold uppercase duration-300 tap hover:stroke-accent hover:text-accent data-[open=true]:stroke-accent data-[open=true]:text-accent mobile:h-8 mobile:min-w-24 mobile:px-0 mobile:text-caption',
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
