import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import BilingualText from '@/components/common/BilingualText';
import AlternatingLogo from '@/components/nav/AlternatingLogo';
import { alternatingMarks } from '@/components/nav/AlternatingMarks';
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
  /** The navigation item of the page in view (a section id, 'news' or 'podcast'), or null. */
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
        data-experience-header={overlay ? '' : undefined}
        className={clsx(
          'flex w-full items-center text-foreground',
          overlay
            ? // The experience: one row with the original's padding and gaps on every laptop-deck window, scaled with
              // the window (two versions only, RWD-02); the phone deck's bar.
              'fixed left-0 top-0 z-50 flex-nowrap gap-x-15 p-10 mobile:z-[60] mobile:gap-0 mobile:p-5'
            : // Content pages: the logo and the page's action, as their original headers had them.
              'flex-wrap gap-x-6 gap-y-4 notMobile:flex-nowrap',
          // Never dimmed or disabled during a section transition (MOT-01); before the UI is revealed it takes no input.
          // On phones the bar lets taps through to the page (its controls take them).
          // It fades in. On the laptop deck its opacity also eases over 300 ms while hidden, as the original's bar did
          // (its CSS transition smoothed the intro's fade-in tween); the phone's bar had none.
          overlay &&
            (shown
              ? 'pointer-events-auto opacity-100 transition-opacity duration-300 mobile:pointer-events-none'
              : 'pointer-events-none opacity-0 notMobile:transition-opacity notMobile:duration-300'),
          className,
        )}
      >
        {!onItemClick && <LinkTracker />}
        <div className={live}>
          {/* As on the original (the owner's answer 1A), per page kind and deck: the experience and /news alternate the
              Chinese lockup and the English wordmark on both decks (on the experience a press only swaps them); the
              Spectrum tool pages show the still lockup on the laptop deck and alternate on the phone deck; the
              podcast pages show the still wordmark on both. */}
          {overlay || currentId === 'news' ? (
            <AlternatingLogo
              {...alternatingMarks()}
              toggle={overlay}
              {...(overlay ? {} : trackNav(NAV.vision_page.id, 'logo'))}
            />
          ) : action === 'exit' ? (
            <>
              <Logo mark="cn" className="mobile:hidden" {...trackNav(NAV.vision_page.id, 'logo')} />
              <AlternatingLogo {...alternatingMarks()} className="notMobile:hidden" {...trackNav(NAV.vision_page.id, 'logo')} />
            </>
          ) : (
            <Logo
              mark="en"
              {...trackNav(NAV.vision_page.id, 'logo')}
              {...(currentId === 'podcast'
                ? { className: 'h-auto w-auto', markClassName: 'h-auto w-50 mobile:w-[7.75rem]' }
                : {})}
            />
          )}
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
              // In the logo's row, as on the original at every laptop width (it scales with the window).
              'flex-nowrap',
              // Where wave 0 put the first item: 16.67 % of the window from its left edge, centred on the logo row.
              live,
            )}
          >
            {SECTION_NAV.map((item) => {
              const current = currentId === item.id;
              return [
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
          className={clsx(
            'flex h-12 flex-1 items-center justify-end gap-8 mobile:h-auto mobile:gap-5',
            'notMobile:items-start',
          )}
        >
          {action === 'exit' ? (
            <Link
              prefetch={false}
              href="/"
              className="group pointer-events-auto relative flex h-10 w-33 cursor-pointer items-center justify-center text-sm font-semibold uppercase transition-colors duration-300 tap-area hover:stroke-accent hover:text-accent mobile:h-8 mobile:w-24 mobile:text-xs/5"
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
              experiencePage={overlay}
              // A 40 px icon in a 44 px box on touch screens; the ::before pseudo-element extends the target to 48 px. Both
              // in the deck's unit (2.5 and 2.75), so on an upright tablet the round button grows with the bar and SUBSCRIBE
              // beside it keeps its place; 40 and 44 px wherever the unit is 16.
              className="pointer-events-auto relative hidden items-center justify-center tap before:absolute before:-inset-1 before:content-[''] mobile:flex mobile:min-h-[2.75rem] mobile:min-w-[2.75rem]"
              openIcon={<MenuOpenSVG className="size-10" />}
              closeIcon={<MenuCloseSVG aria-hidden="true" className="size-10" />}
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
