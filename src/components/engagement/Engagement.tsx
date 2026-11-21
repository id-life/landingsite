import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, mobileMapScrollProgressAtom } from '@/atoms/engagement';
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
      className="fixed bottom-[5.625rem] left-1/2 z-10 h-[0.125rem] -translate-x-1/2 rounded-full bg-white/20"
      style={{ width: `calc(var(--u) * ${SCROLL_PROGRESS_CONFIG.trackWidth / 16})` }}
    >
      <div
        className="h-full rounded-full bg-white/40 transition-transform duration-100"
        style={{
          width: `calc(var(--u) * ${SCROLL_PROGRESS_CONFIG.thumbWidth / 16})`,
          transform: `translateX(calc(var(--u) * ${(progress * maxOffset) / 16}))`,
        }}
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
  const meeting = useAtomValue(activeMeetingDotAtom);
  const book = useAtomValue(activeBookDotAtom);
  const sponsor = useAtomValue(activeSponsorDotAtom);
  const cardOpen = meeting !== null || book !== null || sponsor !== null;

  useEffect(() => {
    if (currentPage?.id !== PAGE_ID) return;
    return enterAnimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // No CSS animation here (e.g. animate-fade-in): it creates a stacking context that breaks the badges'
  // backdrop-filter. enterAnimate() fades the map in with GSAP.
  //
  // A phone on its side at most 768 px wide (shortNarrow, where the original's phone version is the reference): the
  // compact strip's map is narrower than the window and would sit at its left edge, so the cards that hang left of
  // their points (London, Shanghai) were cut more than on the original. The whole strip (map, points, cards and their
  // tap areas together, so their shared origin holds) starts a quarter of the free room in: F / 4, where F is the
  // window less the map (--map-h × 63 / 30), never below 0. A quarter, not the middle: from 0.20 F to 0.34 F every
  // card's pictures and letters are cut no more than on the original at 640x360, 667x375 and 720x450, no place name is
  // cut, and no more letters lie under the section arrows than at 0 (centred puts book-1's title under the arrows at
  // 720x450). The strip's x clip is lifted there, else it would cut those cards at the strip's new left edge: with the
  // map narrower than the strip there is nothing to pan, so no card reaches past the window's right edge. Wider
  // windows keep the map at 0 (no reference of the original there, and moving it puts more letters under the arrows).
  return (
    <div
      id={PAGE_ID}
      className={cn(
        'relative h-[calc(100dvh-10.875rem)] w-full text-white transition-all duration-100',
        'shortNarrow:[&_:has(>.world-map-container)]:left-[max(0px,calc((100%_-_var(--map-h)*63/30)/4))] shortNarrow:[&_:has(>.world-map-container)]:w-auto shortNarrow:[&_:has(>.world-map-container)]:overflow-x-visible',
        { hidden: currentPage?.id !== PAGE_ID },
      )}
    >
      {/* A phone in landscape (compact height) gets a compact title, so the map strip keeps its height. */}
      <div className="fixed inset-x-0 top-[5.25rem] z-40 text-center">
        <h2 className="font-title text-[26px] capitalize leading-[30px] text-white phoneScaled:text-[1.625rem] phoneScaled:leading-[1.875rem] shortScreen:text-[20px] shortScreen:leading-[24px]">
          Presence
        </h2>
        {/* Compact heights: an open card's title rises to this line (the strip is under 260 px tall), so the line fades
            while a card is open; the heading stays (RWD-02 A3). */}
        <p
          className={cn(
            'mt-2 font-display text-[14px] font-bold uppercase leading-[20px] text-white transition-opacity duration-fast phoneScaled:text-[0.875rem] phoneScaled:leading-[1.25rem] shortScreen:mt-0.5',
            cardOpen && 'shortScreen:opacity-0',
          )}
        >
          GLOBAL REACH. EAST &amp; WEST
        </p>
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
