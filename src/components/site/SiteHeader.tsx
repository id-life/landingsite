import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import BilingualText from '@/components/common/BilingualText';
import Logo from '@/components/nav/Logo';
import { NAV } from '@/components/nav/nav';
import MenuOpenSVG from '@/components/svg/MenuOpenSVG';
import { clsx } from 'clsx';
import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';
import LinkTracker from './LinkTracker';
import MenuToggle from './MenuToggle';
import { isSection, SITE_NAV, type SiteNavItem } from './site-nav';
import SubscribeTrigger from './SubscribeTrigger';

type Variant = 'overlay' | 'solid';

/**
 * The original menu (the owner's call, 2026-11-16): the seven sections, in capitals with their Chinese half, in the top
 * row between the logo and the action; News, Podcast and About are not in the bar. From 1200 px the bar is the
 * original's row at the original's sizes (the owner's rule on font sizes): the logo, the seven items at text-sm (10.5
 * px at 1440), SUBSCRIBE in its 33 x 10 frame. Below 1200 px (the tablet tiers, text at its 1440 size) the seven take a
 * row of their own under the logo, and below 700 px that row breaks after the fourth item (a full-width break whose
 * height is the row gap); the tablet arrangement is a proposal awaiting the owner.
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
  /**
   * The page's own links beside the logo, as its original header had them (the podcast's two show tabs). On the
   * desktop deck they sit in the bar's row; on phones they wrap to a row of their own under it, as on the original.
   */
  pageLinks?: ReactNode;
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
  pageLinks,
}: SiteHeaderProps) {
  const overlay = variant === 'overlay';
  // Without handlers (server-rendered pages) the tracker reads these attributes; with them the caller tracks.
  const trackNav = (navId: string, source?: string) =>
    onItemClick ? {} : { 'data-nav-id': navId, ...(source ? { 'data-nav-source': source } : {}) };
  const live = overlay && shown ? 'pointer-events-auto' : undefined;

  return (
    <>
      <header
        id={id}
        className={clsx(
          'flex w-full items-center text-foreground',
          overlay
            ? // The experience: one row from 1200 px, with the original's padding and gaps; below, the navigation takes
              // its own row under the logo row.
              'fixed left-0 top-0 z-50 flex-wrap gap-x-15 gap-y-2 px-10 pb-2 pt-6 mobile:z-[60] mobile:flex-nowrap mobile:gap-0 mobile:p-5 navRow:flex-nowrap navRow:p-10 [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:gap-y-[14px] [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:px-[30px] [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:pt-[24px]'
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
          <Logo
            onClick={onLogoClick}
            {...trackNav(NAV.vision_page.id, 'logo')}
            {...(currentId === 'podcast'
              ? { className: 'h-auto w-auto', markClassName: 'h-auto w-50 mobile:w-[7.75rem]' }
              : {})}
          />
        </div>
        {pageLinks && (
          <div className="flex items-center mobile:order-last mobile:basis-full mobile:[&>nav]:w-full">{pageLinks}</div>
        )}
        {/* The menu is the experience's only: the original content pages (news, podcast, the tool pages) show the logo
          and their action, and no menu labels (the owner's rule: no label a page did not show). */}
        {overlay && (
          <nav
            aria-label="Main"
            className={clsx(
              'main-nav-links flex gap-x-8 text-sm font-semibold mobile:hidden',
              // Below 1200 px a row of its own (never a sideways scroller: its items would be cut by the window).
              'order-last w-full flex-wrap gap-y-1 navRow:order-none navRow:w-auto navRow:flex-nowrap navGrid:gap-x-6 navGrid:gap-y-0',
              // Where wave 0 put the first item: 16.67 % of the window from its left edge, centred on the logo row.
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
                    'bilingual-font relative flex shrink-0 cursor-pointer items-center whitespace-nowrap text-center font-bold uppercase tap-area',
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
          className="flex h-12 flex-1 items-center justify-end gap-8 mobile:h-auto mobile:gap-5 navRow:items-start"
        >
          {action === 'exit' ? (
            <Link
              prefetch={false}
              href="/"
              className="group pointer-events-auto relative flex h-10 w-33 cursor-pointer items-center justify-center text-sm font-semibold uppercase transition-colors duration-300 tap-area hover:stroke-accent hover:text-accent mobile:h-8 mobile:w-24 mobile:text-xs/5 [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:h-[30px] [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:w-[99px]"
            >
              <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent" />
              ID.LIFE
            </Link>
          ) : (
            <SubscribeTrigger
              className={clsx(
                // The original frame and weight: 33 units by 10 on the experience, 34 on the content pages, wider-spaced on the
                // podcast pages; a 44 px hit area on touch screens (tap-area) instead of a bigger frame.
                'group relative flex h-10 cursor-pointer items-center justify-center whitespace-nowrap text-sm font-semibold uppercase duration-300 tap-area hover:stroke-accent hover:text-accent data-[open=true]:stroke-accent data-[open=true]:text-accent mobile:h-8 mobile:w-24 mobile:text-xs/5',
                overlay ? 'w-33' : 'w-34',
                // The tablet tiers draw the header at its 1440 px size (text there is at its 1440 size too).
                '[@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:h-[30px] [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:w-[99px]',
                currentId === 'podcast' && 'tracking-[0.1em] mobile:tracking-normal',
                live,
              )}
            >
              <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent group-data-[open=true]:stroke-accent" />
              Subscribe
            </SubscribeTrigger>
          )}
          {/* The phone menu; the original tool pages (action 'exit') show only the logo and ID.LIFE, so no menu there. */}
          {action !== 'exit' && (
            <MenuToggle
              currentId={currentId}
              inExperience={inExperience}
              // 40 px icon in a 44 px box on touch screens; the ::before pseudo-element extends the target to 48 px.
              className="pointer-events-auto relative hidden items-center justify-center tap before:absolute before:-inset-1 before:content-[''] mobile:flex"
              openIcon={<MenuOpenSVG className="h-10" />}
              closeIcon={<MenuCloseSVG aria-hidden="true" className="h-10" />}
            />
          )}
        </div>
      </header>
      {/* The skip link's target (Skip to content, in the root layout) on the content pages: where the page's content
          begins, after the bar. A small element of its own, so a skip lands on the content and no large wrapper takes
          focus on a press. The experience places its own after its music player (Home). */}
      {!overlay && <span id="content-start" tabIndex={-1} className="sr-only" />}
    </>
  );
}
