'use client';

import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { NAV, NavItem } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useNavigation } from '@/hooks/useNavigation';
import { cn } from '@/utils';
import { HERO_ART_BOTTOM, HERO_DRAGON, heroArtBox, heroInkTop } from '@/components/gl/model/vision/heroFit';
import { PHONE_TREE_QUERY } from '@/styles/device-classes';
import { useAtomValue } from 'jotai';
import { MouseEvent, ReactNode, useEffect, useRef } from 'react';

type HeroLayout = 'wide' | 'split' | 'below';
/** Space kept between the statement and the art, the header or the bottom controls. */
const CLEAR = 8;
/** The slogan carousel, the scroll button and the player take the bottom of the window (desktop deck). */
const BOTTOM_CONTROLS = 110;

/**
 * Places the statement in the room the hero's art leaves (RWD-01): the art keeps its tagged fit, so the text moves.
 * Tries, in order, the whole block at the top left; the statement and its links at the top left and the facts and
 * themes at the top right, beside the dragon (then the same with those two as captions); the facts and themes in the
 * band under the art. A layout is taken when no line of text comes within CLEAR px of the art's outline (heroFit.ts), the header or the bottom controls.
 */
function placeStatement(section: HTMLElement) {
  const secondary = section.querySelector<HTMLElement>('[data-hero-part="secondary"]');
  if (!secondary) return;
  const reset = () => {
    secondary.style.cssText = '';
    section.style.maxWidth = '';
    section.dataset.heroLayout = 'wide';
    section.dataset.heroTight = 'false';
  };
  if (window.matchMedia(PHONE_TREE_QUERY).matches) {
    reset();
    return;
  }
  // Measured without transitions: under reduced motion every property has a 0.01 ms transition (globals.css, and
  // transition-property defaults to all), so a size change would not show until the next frame.
  section.dataset.measuring = 'true';
  const w = window.innerWidth;
  const h = window.innerHeight;
  const art = heroArtBox(w, h);
  const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
  const margin = section.getBoundingClientRect().left;
  const bandTop = art.cy + HERO_ART_BOTTOM * art.W + CLEAR;
  // The statement's measure stops short of the dragon, whatever the layout.
  const measure = `${Math.max(320, art.cx - HERO_DRAGON.left * art.W - CLEAR - margin)}px`;
  const apply: Record<HeroLayout, () => void> = {
    wide: () => {
      reset();
      section.style.maxWidth = measure;
    },
    split: () => {
      section.dataset.heroLayout = 'split';
      section.style.maxWidth = measure;
      const left = art.cx + HERO_DRAGON.right * art.W + CLEAR;
      secondary.style.cssText = `position:fixed;margin:0;top:${headerBottom + CLEAR}px;left:${left}px;width:${w - margin - left}px`;
    },
    below: () => {
      section.dataset.heroLayout = 'below';
      section.style.maxWidth = measure;
      secondary.style.cssText = `position:fixed;margin:0;top:${bandTop}px;left:${margin}px;width:${w - 2 * margin}px`;
    },
  };
  const clashes = () => {
    let n = 0;
    section.querySelectorAll('h1, dt, dd, a').forEach((el) => {
      for (const r of el.getClientRects()) {
        if (r.width < 1) continue;
        if (r.top < headerBottom || r.bottom > h - BOTTOM_CONTROLS) n += 1;
        else if (r.top >= bandTop) continue;
        else {
          let top = Infinity;
          for (let x = r.left; x <= r.right; x += 8) top = Math.min(top, heroInkTop(x, art));
          if (r.bottom + CLEAR > top) n += 1;
        }
      }
    });
    return n;
  };
  // Each layout first with the facts and themes at their size, then set as captions where the room is tight.
  const tries: [HeroLayout, boolean][] = [
    ['wide', false],
    ['split', false],
    ['split', true],
    ['below', false],
    ['below', true],
  ];
  let best: { layout: HeroLayout; tight: boolean; n: number } | null = null;
  for (const [layout, tight] of tries) {
    apply[layout]();
    section.dataset.heroTight = String(tight);
    const n = clashes();
    if (!best || n < best.n) best = { layout, tight, n };
    if (n === 0) break;
  }
  if (best) {
    apply[best.layout]();
    section.dataset.heroTight = String(best.tight);
    section.dataset.heroClashes = String(best.n);
  }
  delete section.dataset.measuring;
}

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

  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let frame = 0;
    const place = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => placeStatement(section));
    };
    place();
    void document.fonts?.ready.then(place);
    const observer = new ResizeObserver(place);
    const header = document.querySelector('header');
    if (header) observer.observe(header);
    window.addEventListener('resize', place);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', place);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="home-statement"
      aria-label="Immortal Dragons"
      className={cn(
        'group fixed z-[29] flex flex-col text-foreground transition-[opacity,visibility] duration-300 motion-reduce:transition-none [&[data-measuring=true]_*]:!transition-none',
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
            className="group relative inline-flex items-center gap-1.5 py-1 font-display text-label font-bold transition-colors duration-300 tap hover:text-accent"
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
