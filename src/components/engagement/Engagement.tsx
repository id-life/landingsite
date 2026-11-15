import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { mobileMapScrollProgressAtom } from '@/atoms/engagement';
import { WorldMap } from '@/components/engagement/WorldMap';
import type { MapDeck } from '@/components/engagement/WorldMapDotComponents';
import { NAV_LIST } from '@/components/nav/nav';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS, WORLD_MAP_REGION_DOTS } from '@/constants/engagement';
import { useMobileEngagementAnim } from '@/hooks/anim/useMobileEngagementAnim';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { beats, EASE } from '@/motion/tokens';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, useEffect } from 'react';

const PAGE_ID = 'engagement_page';
const engagementNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

// Phone deck: the map strip's scroll position (px).
const SCROLL_PROGRESS_CONFIG = { trackWidth: 152, thumbWidth: 57 } as const;

function MobileScrollProgressBar() {
  const progress = useAtomValue(mobileMapScrollProgressAtom);
  const maxOffset = SCROLL_PROGRESS_CONFIG.trackWidth - SCROLL_PROGRESS_CONFIG.thumbWidth;
  return (
    <div
      className="fixed bottom-[90px] left-1/2 z-10 h-[2px] -translate-x-1/2 rounded-full bg-white/20"
      style={{ width: `${SCROLL_PROGRESS_CONFIG.trackWidth}px` }}
    >
      <div
        className="h-full rounded-full bg-white/40 transition-transform duration-100"
        style={{ width: `${SCROLL_PROGRESS_CONFIG.thumbWidth}px`, transform: `translateX(${progress * maxOffset}px)` }}
      />
    </div>
  );
}

const MAP_DATA = {
  dots: WORLD_MAP_DOTS,
  regionDots: WORLD_MAP_REGION_DOTS,
  bookDots: MAP_BOOK_DOTS,
  sponsorDots: MAP_SPONSOR_DOTS,
};

/** Desktop deck: a pinned page whose scrubbed timeline brings the map and its dots in, rests, then lets them go. */
function DesktopPresence() {
  const setCurrentPage = useSetAtom(currentPageAtom);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'engagement-scroll-trigger',
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(engagementNavItem);
        },
        onEnterBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(engagementNavItem);
        },
      },
    });
    const items = ['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'];
    tl.set('.world-map-img', { y: 50, opacity: 0 });
    tl.set(items, { opacity: 0 });

    const factor = 10;
    const entranceDuration = beats(2) * factor;
    tl.to('.world-map-img', { y: 0, opacity: 1, ease: EASE.linear, duration: entranceDuration });
    tl.to(items, { opacity: 1, scale: 1, ease: EASE.out, stagger: entranceDuration * 0.05, duration: entranceDuration });

    // Every arrival lands here (MOT-01): the map and its dots fully in, no meeting card open.
    tl.addLabel('rest');
    tl.to(() => {}, { duration: beats(2) * factor });
    const exitDuration = beats(2) * factor;
    tl.to(
      ['.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor', '.world-map-region'],
      { opacity: 0, ease: EASE.out, stagger: exitDuration * 0.1, duration: exitDuration },
      `+=${beats(105)}`,
    );
  }, []);

  return (
    <div id={PAGE_ID} className="page-container engagement">
      <div id="map-container" className="relative flex h-[100svh] flex-col items-center justify-center">
        <WorldMap deck="desktop" {...MAP_DATA} />
      </div>
    </div>
  );
}

/** Phone deck: a full-height panel shown while current, with its title, the map strip and the strip's progress. */
function PhonePresence() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const { enterAnimate } = useMobileEngagementAnim();

  useEffect(() => {
    if (currentPage?.id !== PAGE_ID) return;
    return enterAnimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // No CSS animation here (e.g. animate-fade-in): it creates a stacking context that breaks the badges'
  // backdrop-filter. enterAnimate() fades the map in with GSAP.
  return (
    <div
      id={PAGE_ID}
      className={cn('relative h-[calc(100dvh-10.875rem)] w-full text-white transition-all duration-100', {
        hidden: currentPage?.id !== PAGE_ID,
      })}
    >
      {/* A phone in landscape (compact height) gets a compact title, so the map strip keeps its height. */}
      <div className="fixed inset-x-0 top-[5.25rem] z-40 text-center">
        <h2 className="font-title text-title capitalize text-white shortScreen:text-title-sm">Presence</h2>
        {/* Sentence case, not capitals (RWD-01: at most 25 % uppercase Latin per screen); the words are unchanged. */}
        <p className="mt-2 font-display text-label font-bold text-white shortScreen:mt-0.5">Global reach. East &amp; West</p>
      </div>
      <WorldMap deck="phone" {...MAP_DATA} />
      <MobileScrollProgressBar />
    </div>
  );
}

/**
 * Presence, one component for both decks (RWD-02; it was Engagement and MobileEngagement). The map, its dots and
 * cards are shared (WorldMap); what differs by `deck` is how the section enters: a scrubbed, pinned page on the
 * desktop deck, a paged panel with a title, an automatic card tour and a progress bar on the phone deck.
 */
function Engagement({ deck }: { deck: MapDeck }) {
  return deck === 'phone' ? <PhonePresence /> : <DesktopPresence />;
}

export default memo(Engagement);
