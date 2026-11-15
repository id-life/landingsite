'use client';

import { MapBookDotData, MapDotData, MapRegionDotData, MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { DURATION, EASE } from '@/motion/tokens';
import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, mobileMapScrollProgressAtom } from '@/atoms/engagement';
import { globalLoadedAtom } from '@/atoms/geo';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { memo, useCallback, useEffect, useMemo, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';
import { useMeasure } from 'react-use';
import { NAV } from '../nav/nav';
import WorldMapSVG from '@/../public/svgs/engagement/world-map.svg?component';
import { WorldMapAnimBackground } from './WorldMapAnimBackground';
import { WorldMapBookDotContent, WorldMapBookDotPoint } from './WorldMapBookDot';
import { WorldMapDotContent, WorldMapDotPoint } from './WorldMapDot';
import { WorldMapSponsorDotContent, WorldMapSponsorDotPoint } from './WorldMapSponsorDot';
import type { MapDeck } from './WorldMapDotComponents';
import { color } from '@/styles/tokens';
import { isReducedMotion } from '@/motion/preference';

const svgViewBox = { w: 756, h: 360 };
const parallaxFactor = 20; // largest parallax shift in px (mouse deck)

/**
 * Portrait and square windows on the scrolled deck (iPad portrait, 1024x1366): drawn at the laptop composition the map
 * is two to three window widths wide and only Europe shows. There the map becomes a strip that pans sideways, like the
 * phone map, tall enough that neighbouring labels (London and Oxford) stay a line apart. (RWD-02 medium tier.)
 */
const MAP_PAN_QUERY = '(max-aspect-ratio: 1/1)';

interface MapProps {
  /** The deck the map is drawn for: 'desktop' (scrolled deck: hover, parallax; pans on portrait windows) or 'phone'. */
  deck: MapDeck;
  dots?: Array<MapDotData>;
  regionDots?: Array<MapRegionDotData>;
  bookDots?: Array<MapBookDotData>;
  sponsorDots?: Array<MapSponsorDotData>;
  lineColor?: string;
}

/**
 * The Presence world map, one component for both decks (RWD-02; it was WorldMap and MobileWorldMap). Shared: the dots,
 * their cards, the coordinates, closing every card on a background tap or when the visitor leaves the section. By deck:
 * - desktop: the map fills 88 % of the window height with pointer parallax; on portrait windows (MAP_PAN_QUERY) it
 *   is a sideways-panning strip and an opened dot is scrolled into view;
 * - phone: a 55 % tall strip panned by touch, with a progress bar (Engagement) and an automatic tour.
 */
export const WorldMap = memo(function WorldMapComponent({
  deck,
  dots,
  regionDots,
  bookDots,
  sponsorDots,
  lineColor = color.accent,
}: MapProps) {
  const phone = deck === 'phone';
  const svgRef = useRef<SVGSVGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const setActiveBookDot = useSetAtom(activeBookDotAtom);
  const setActiveSponsorDot = useSetAtom(activeSponsorDotAtom);
  const setActiveMeetingDot = useSetAtom(activeMeetingDotAtom);
  const setScrollProgress = useSetAtom(mobileMapScrollProgressAtom);
  const desktopPage = useAtomValue(currentPageAtom);
  const phonePage = useAtomValue(mobileCurrentPageAtom);
  const currentPage = phone ? phonePage : desktopPage;
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const [ref, { width: mapWidth, height: mapHeight }] = useMeasure<SVGSVGElement>();
  const [scrollLeft, setScrollLeft] = useState(0);

  const calcPoint = useCallback(
    (lat: number, lng: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0, left: 0, top: 0 };
      const { w, h } = svgViewBox;
      const { width, height } = svg.getBoundingClientRect();
      const x = (lng + 180) * (w / 360);
      const y = (90 - lat) * (h / 180);
      return { x, y, left: (x / w) * width, top: (y / h) * height };
    },
    // Recomputed when the measured map changes size (a resize, or the portrait strip switching on or off).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapWidth, mapHeight],
  );
  const { activeBookDot, activeMeetingDot, activeSponsorDot } = useEngagementClickPoint();
  const isAnyActive = activeBookDot !== null || activeMeetingDot !== null || activeSponsorDot !== null;

  const regionDotsPoints = useMemo(() => {
    if (!regionDots?.length) return null;
    return regionDots.map((dot, i) => {
      const { left, top } = calcPoint(dot.lat, dot.lng);
      return (
        <div
          key={`points-group-${i}`}
          className="world-map-region flex-center pointer-events-auto absolute size-7 cursor-pointer text-3xl opacity-0"
          style={{ left, top, filter: 'url(#black-overlay)' }}
        >
          <div className={cn({ 'opacity-80': isAnyActive })}>{dot.icon}</div>
        </div>
      );
    });
  }, [regionDots, calcPoint, isAnyActive]);

  const points = useMemo(
    () => (
      <>
        {dots?.map((dot, i) => (
          <WorldMapDotPoint key={`world-map-dot-point-${i}`} deck={deck} dot={dot} calcPoint={calcPoint} index={i} />
        ))}
        {bookDots?.map((dot, i) => (
          <WorldMapBookDotPoint key={`world-map-dot-book-point-${i}`} deck={deck} dot={dot} calcPoint={calcPoint} index={i} />
        ))}
        {sponsorDots?.map((dot, i) => (
          <WorldMapSponsorDotPoint
            key={`world-map-dot-sponsor-point-${i}`}
            deck={deck}
            dot={dot}
            calcPoint={calcPoint}
            index={i}
          />
        ))}
      </>
    ),
    [deck, dots, bookDots, sponsorDots, calcPoint],
  );

  const contents = useMemo(
    () => (
      <>
        {dots?.map((dot, i) => (
          <WorldMapDotContent key={`world-map-dot-content-${i}`} deck={deck} dot={dot} calcPoint={calcPoint} index={i} />
        ))}
        {bookDots?.map((dot, i) => (
          <WorldMapBookDotContent
            key={`world-map-dot-book-content-${i}`}
            deck={deck}
            dot={dot}
            calcPoint={calcPoint}
            index={i}
          />
        ))}
        {sponsorDots?.map((dot, i) => (
          <WorldMapSponsorDotContent
            key={`world-map-dot-sponsor-content-${i}`}
            deck={deck}
            dot={dot}
            calcPoint={calcPoint}
            index={i}
          />
        ))}
      </>
    ),
    [deck, dots, bookDots, sponsorDots, calcPoint],
  );

  // A tap or click on the map background closes the open card.
  const handleBackgroundClick = useCallback(() => {
    setActiveBookDot(null);
    setActiveSponsorDot(null);
    setActiveMeetingDot(null);
  }, [setActiveBookDot, setActiveSponsorDot, setActiveMeetingDot]);

  // Leaving the section closes the open card.
  useEffect(() => {
    if (!globalLoaded) return;
    if (currentPage?.id !== NAV.engagement_page.id) handleBackgroundClick();
  }, [currentPage, handleBackgroundClick, globalLoaded]);

  const filterDefs = (
    <svg
      ref={svgRef}
      viewBox="0 0 756 360"
      className={cn('pointer-events-none absolute left-0 top-0 select-none overflow-visible', phone ? 'h-full' : 'size-full')}
    >
      <defs>
        {!phone && (
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        )}
        <filter id="black-overlay" x="0" y="0" width="100%" height="100%">
          <feFlood floodColor="black" floodOpacity="0.5" result="overlay" />
          <feComposite in="overlay" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
    </svg>
  );

  // ---------------------------------------------------------------- phone deck: a strip panned by touch
  const touchStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const isDraggingRef = useRef(false);
  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const container = mapContainerRef.current;
        if (!container) return;
        const maxScroll = container.scrollWidth - container.clientWidth;
        setScrollLeft(container.scrollLeft);
        setScrollProgress(maxScroll <= 0 ? 0 : Math.min(1, Math.max(0, container.scrollLeft / maxScroll)));
      }, 16),
    [setScrollProgress],
  );
  useEffect(() => () => handleScroll.cancel(), [handleScroll]);
  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    scrollStartRef.current = mapContainerRef.current?.scrollLeft ?? 0;
    isDraggingRef.current = true;
  };
  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    const container = mapContainerRef.current;
    if (!isDraggingRef.current || !container) return;
    const next = scrollStartRef.current + touchStartXRef.current - e.touches[0].clientX;
    container.scrollLeft = Math.max(0, Math.min(container.scrollWidth - container.clientWidth, next));
  };
  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // ---------------------------------------------------------------- desktop deck: parallax, or a panning strip
  // The decks mount on the client only (HomeEntry), so the first render can read the query.
  const [pan, setPan] = useState(() => !phone && typeof window !== 'undefined' && window.matchMedia(MAP_PAN_QUERY).matches);
  useEffect(() => {
    if (phone) return;
    const mq = window.matchMedia(MAP_PAN_QUERY);
    const update = () => setPan(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [phone]);
  const handlePanScroll = useMemo(
    () =>
      throttle(() => {
        if (mapContainerRef.current) setScrollLeft(mapContainerRef.current.scrollLeft);
      }, 16),
    [],
  );
  useEffect(() => () => handlePanScroll.cancel(), [handlePanScroll]);

  // Portrait strip: start on Europe and Asia (as the phone map does), and bring an opened dot to 40 % of the width, so
  // its badges (to the right) and a card hanging to the left both fit.
  useEffect(() => {
    const container = mapContainerRef.current;
    if (phone || !pan || !container) return;
    gsap.set(mapContentRef.current, { clearProps: 'transform' });
    container.scrollLeft = container.scrollWidth * 0.35;
  }, [phone, pan, mapWidth]);
  useEffect(() => {
    const container = mapContainerRef.current;
    if (phone || !pan || !container) return;
    const active =
      activeMeetingDot !== null
        ? `.world-map-dot-${activeMeetingDot}`
        : activeBookDot !== null
          ? `.world-map-dot-book-${activeBookDot}`
          : activeSponsorDot !== null
            ? `.world-map-dot-sponsor-${activeSponsorDot}`
            : null;
    const el = active ? container.querySelector<HTMLElement>(active) : null;
    if (!el) return;
    container.scrollTo({
      left: Math.max(0, el.offsetLeft - container.clientWidth * 0.4),
      behavior: isReducedMotion() ? 'auto' : 'smooth',
    });
  }, [phone, pan, activeMeetingDot, activeBookDot, activeSponsorDot]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // No parallax on the panning strip, while a card is open, or with reduced motion (MOT-02).
      if (pan || !mapContainerRef.current || !mapContentRef.current || isAnyActive || isReducedMotion()) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(mapContentRef.current, {
        x: -normalizedX * parallaxFactor,
        y: -normalizedY * parallaxFactor,
        rotateX: -normalizedY,
        rotateY: normalizedX * 2,
        duration: DURATION.camera,
        ease: EASE.out,
        overwrite: 'auto',
      });
    },
    [pan, isAnyActive],
  );

  if (phone) {
    return (
      // The strip's height is --map-h: 55 % of the window, or on a phone in landscape (compact height) what is left
      // between the compact title and the arrows.
      <div className="absolute inset-x-0 top-[5dvh] mt-[180px] h-[var(--map-h)] w-full [--map-h:55vh] shortScreen:top-0 shortScreen:mt-[124px] shortScreen:[--map-h:calc(100svh_-_188px)]">
        <div
          ref={mapContainerRef}
          className="world-map-container hide-scrollbar relative h-full w-full touch-none overflow-x-auto overflow-y-hidden bg-black/20 font-sans opacity-0"
          onClick={handleBackgroundClick}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* The SVG is absolutely positioned; this spacer gives the strip its scroll width. */}
          <div className="h-px shrink-0" style={{ width: 'calc(var(--map-h) * 63 / 30)' }} />
          <WorldMapSVG
            ref={ref}
            className="world-map-img pointer-events-none absolute top-0 h-full select-none bg-top opacity-0 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
          />
          {regionDotsPoints}
          {points}
          {filterDefs}
        </div>
        {/* Cards sit outside the scroller (so they are not clipped) and follow its scroll. */}
        <div
          className="pointer-events-none absolute inset-0 overflow-visible"
          style={{ transform: `translateX(-${scrollLeft}px)` }}
        >
          {contents}
        </div>
      </div>
    );
  }

  // One element tree for both layouts, so switching (a rotation) never remounts the dots the section timeline animates.
  return (
    <div
      className={cn(
        'relative font-sans',
        pan ? 'h-[68svh] w-full' : 'mt-18 aspect-[63/30] h-[88svh] justify-center overflow-hidden',
      )}
      onMouseMove={handleMouseMove}
      style={{ perspective: pan ? undefined : '1000px' }}
    >
      <div
        ref={mapContainerRef}
        className={cn(
          'size-full',
          // Horizontal drags stay native in the desktop deck's touch driver; vertical ones still step sections.
          pan && 'hide-scrollbar touch-pan-x overflow-x-auto overflow-y-hidden',
        )}
        onClick={handleBackgroundClick}
        onScroll={pan ? handlePanScroll : undefined}
      >
        <div ref={mapContentRef} className={cn('relative', pan ? 'aspect-[63/30] h-full' : '-left-14 size-full')}>
          <WorldMapAnimBackground className="absolute left-0 top-0 size-full" ref={ref} />
          {regionDotsPoints}
          {points}
          {!pan && contents}
          {filterDefs}
        </div>
      </div>
      {/* Portrait strip: the cards sit outside the scroller (which clips vertically) and follow its scroll. */}
      {pan && (
        <div
          className="pointer-events-none absolute inset-0 overflow-visible"
          style={{ transform: `translateX(-${scrollLeft}px)` }}
        >
          {contents}
        </div>
      )}
    </div>
  );
});
WorldMap.displayName = 'WorldMap';
export default memo(WorldMap);
