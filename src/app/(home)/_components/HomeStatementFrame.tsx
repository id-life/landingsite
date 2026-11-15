'use client';

import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { NAV, NavItem } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useNavigation } from '@/hooks/useNavigation';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { MouseEvent, ReactNode } from 'react';

/**
 * Shows the server-rendered home statement over the hero only. Without JavaScript (and before hydration) it is simply
 * visible; once the experience runs it fades out when the visitor leaves the hero section and back in on return.
 * It never moves the canvas: it is fixed above it, below the nav and the loader.
 */
export default function HomeStatementFrame({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const desktopPage = useAtomValue(currentPageAtom);
  const mobilePage = useAtomValue(mobileCurrentPageAtom);
  const page = isMobile ? mobilePage : desktopPage;
  const onHero = page.id === NAV.vision_page.id;

  return (
    <section
      id="home-statement"
      aria-label="Immortal Dragons"
      className={cn(
        'fixed z-[29] text-foreground transition-[opacity,visibility] duration-300 motion-reduce:transition-none',
        // Desktop tree: top left, under the logo, clear of the wordmark and the dragon. Sizes have a px floor so the
        // 0.8333vw root (RWD-01) cannot shrink them below a readable size on tablets.
        // It starts 12 px below the header, whose height (one, two or three rows) the header publishes as
        // --site-header-h, so the block never meets the navigation at any width.
        'left-10 top-[calc(var(--site-header-h,7.5rem)_+_12px)] w-[max(42rem,560px)]',
        // Phone tree: under the header (never above its published height), above the wordmark.
        'mobile:inset-x-5 mobile:top-[max(5.5rem,calc(var(--site-header-h,0px)_+_4px))] mobile:w-auto mobile:text-center',
        '[@media(max-height:740px)]:mobile:top-[max(4.75rem,calc(var(--site-header-h,0px)_+_4px))]',
        // A phone in landscape (compact height): the statement takes the left column, clear of the wordmark in the
        // middle of the screen.
        'shortScreen:right-auto shortScreen:w-[46%] shortScreen:text-left',
        onHero ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      {children}
    </section>
  );
}

const DOORS: { label: string; href: string; section?: NavItem }[] = [
  { label: 'About', href: '/about' },
  { label: 'Insights', href: NAV.insights_page.href, section: NAV.insights_page },
  { label: 'Connect', href: NAV.connect_page.href, section: NAV.connect_page },
];

/** Links out of the hero: the About page, and the Insights and Connect sections within the experience. */
export function StatementDoors({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const { handleNavClick } = useNavigation();
  const { mobileNavChange } = useMobileNavigation();

  const onClick = (event: MouseEvent<HTMLAnchorElement>, section?: NavItem) => {
    // A section link moves the experience there, like the nav; modifier clicks and /about load normally.
    if (!section || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (isMobile) mobileNavChange(section);
    else handleNavClick(section);
  };

  return (
    <ul className={cn('flex gap-6 mobile:justify-center mobile:gap-5 shortScreen:justify-start', className)}>
      {DOORS.map((door) => (
        <li key={door.href}>
          <a
            href={door.href}
            onClick={(event) => onClick(event, door.section)}
            className="group relative inline-flex items-center gap-1.5 py-1 font-display text-label font-bold uppercase transition-colors duration-300 tap hover:text-accent"
          >
            {door.label}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
