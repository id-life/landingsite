'use client';

import { MapBookDotData, MapDotData, MapRegionDotData, MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, mobileMapScrollProgressAtom } from '@/atoms/engagement';
import { globalLoadedAtom } from '@/atoms/geo';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useKeptMapCard } from '@/hooks/engagement/useKeptMapCard';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { useMeasure } from 'react-use';
import { NAV } from '../nav/nav';
import WorldMapSVG from '@/../public/svgs/engagement/world-map.svg?component';
import { WorldMapAnimBackground } from './WorldMapAnimBackground';
import { WorldMapBookDotContent, WorldMapBookDotPoint } from './WorldMapBookDot';
import { WorldMapDotContent, WorldMapDotPoint } from './WorldMapDot';
import { WorldMapSponsorDotContent, WorldMapSponsorDotPoint } from './WorldMapSponsorDot';
import { MapHitLayerContext, type MapDeck } from './WorldMapDotComponents';
import type { Point } from './tapCut';
import { useCompactLabelRule } from './useCompactLabelRule';
import { color } from '@/styles/tokens';
import { isReducedMotion } from '@/motion/preference';
import { SECTIONS } from '@/motion/original';
import {
  CardMeasureContext,
  cardHitBoxes,
  cardMeasuresVersion,
  measureCards,
  measureIsRequested,
  onMeasureRequest,
  takeCardMeasures,
  type CardKind,
} from '@/hooks/anim/cardFit';

const svgViewBox = { w: 756, h: 360 };
const parallaxFactor = 20; // largest parallax shift in px (mouse deck)

interface MapProps {
  /** The deck the map is drawn for: 'desktop' (scrolled deck: hover, parallax) or 'phone'. */
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
 * - desktop: the map fills 88 % of the window height with pointer parallax, as on the original at every laptop window;
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
  // The card the visitor opened is kept in the history entry (NAV-02).
  useKeptMapCard(phone);
  const svgRef = useRef<SVGSVGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const phoneMapRef = useRef<HTMLDivElement>(null);
  const desktopMapRef = useRef<HTMLDivElement>(null);
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
  // The layer of the points' tap areas, first in the map so every dot is drawn above it (MapPointHit).
  const [hitLayer, setHitLayer] = useState<HTMLDivElement | null>(null);
  // Phone only: the layer of the drawn points' own tap targets, above every dot and below every card (MapPointHit).
  const [pointLayer, setPointLayer] = useState<HTMLDivElement | null>(null);
  const [cardLayer, setCardLayer] = useState<HTMLDivElement | null>(null);
  const [hitCentres, setHitCentres] = useState<Record<string, Point>>({});
  const registerHit = useCallback((id: string, centre: Point | null) => {
    setHitCentres((prev) => {
      const old = prev[id];
      if (centre ? old && old[0] === centre[0] && old[1] === centre[1] : !old) return prev;
      const next = { ...prev };
      if (centre) next[id] = centre;
      else delete next[id];
      return next;
    });
  }, []);
  const hitContext = useMemo(
    () => ({ layer: hitLayer, pointLayer: phone ? pointLayer : null, centres: hitCentres, register: registerHit }),
    [hitLayer, pointLayer, phone, hitCentres, registerHit],
  );
  const hitLayerEl = <div ref={setHitLayer} className="pointer-events-none absolute left-0 top-0" />;

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

  // Phone: an open card takes every tap that lands on it, also where a point lies beneath. The point targets
  // (MapPointHit) are in a layer above the dots (z 25) so a point reached by a neighbour's risen icon still takes its
  // tap; but the card layer is its own stacking context at z 0 (it is moved by a transform), so a z 30 card sits below
  // that layer and the target of a point under a card took the tap (39 of 39 places, 9 of them on a card's link).
  // Moving the card layer up would draw the cards over the open dot, which the original draws on top. Instead a target
  // whose point lies under the open card stops taking taps while it is open, from the moment it opens: decided from
  // the card as it stands grown in, the boxes of it that take a tap as measured at the section's entry on a copy that
  // does not grow in (cardFit). So it does not depend on the frame the grow-in has reached (a card grows in by its
  // height and by animations no reading of the drawn card can set aside), and the strip's scroll moves the targets
  // and the cards together. One reading when a card opens or closes and when the cards are measured again; no loop,
  // no hit test, no frame requested.
  const measuresVersion = useSyncExternalStore(onMeasureRequest, cardMeasuresVersion, () => 0);
  useEffect(() => {
    if (!phone || !pointLayer) return;
    const targets = [...pointLayer.children] as HTMLElement[];
    for (const t of targets) t.style.removeProperty('pointer-events');
    const open: [CardKind, number][] = [];
    if (activeMeetingDot !== null) open.push(['meeting', activeMeetingDot]);
    if (activeBookDot !== null) open.push(['book', activeBookDot]);
    if (activeSponsorDot !== null) open.push(['sponsor', activeSponsorDot]);
    if (!open.length) return;
    const boxes = open.map(([kind, index]) => cardHitBoxes(kind, index));
    // A card opened before the cards were measured (the section not yet entered): measure them now; this runs again.
    if (boxes.some((b) => !b)) {
      void measureCards();
      return;
    }
    const map = phoneMapRef.current;
    const scroller = mapContainerRef.current;
    if (!map || !scroller) return;
    const origin = map.getBoundingClientRect();
    const hits = boxes.flatMap((b) => b ?? []);
    for (const t of targets) {
      const r = t.getBoundingClientRect();
      if (r.width === 0) continue;
      // The point's centre in the card layer's own coordinates (the strip's content across, the map's top down).
      const x = r.left + r.width / 2 - origin.left + scroller.scrollLeft;
      const y = r.top + r.height / 2 - origin.top;
      if (hits.some(([left, top, right, bottom]) => x >= left && x <= right && y >= top && y <= bottom))
        t.style.pointerEvents = 'none';
    }
  }, [phone, pointLayer, activeMeetingDot, activeBookDot, activeSponsorDot, measuresVersion]);

  // Phone: while a card grows in, its drawn part does not yet reach where it will stand, and a point drawn there (its
  // circle, its name) would take the tap. The card's grown boxes are laid under it in the card layer, transparent and
  // inert to the eye, taking a tap like the card's picture does (nothing happens): above the points and their tap
  // areas, below the open dot and the card itself, so from the moment a card opens its whole grown area is the card's.
  const grownArea = useMemo(() => {
    if (!phone) return null;
    const open: [CardKind, number][] = [];
    if (activeMeetingDot !== null) open.push(['meeting', activeMeetingDot]);
    if (activeBookDot !== null) open.push(['book', activeBookDot]);
    if (activeSponsorDot !== null) open.push(['sponsor', activeSponsorDot]);
    const boxes = open.flatMap(([kind, index]) => cardHitBoxes(kind, index) ?? []);
    if (!boxes.length) return null;
    return boxes.map(([left, top, right, bottom], i) => (
      <span
        key={`${measuresVersion}-${i}`}
        aria-hidden
        className="pointer-events-auto absolute"
        style={{ left, top, width: right - left, height: bottom - top }}
      />
    ));
  }, [phone, activeMeetingDot, activeBookDot, activeSponsorDot, measuresVersion]);

  // A touch is not taken by what is under the finger alone: the browser moves it onto a nearby element that answers
  // taps when the element under it does not. A card's picture answers none, so a tap on Oxford's picture where Aix lies
  // beneath went to Oxford's own dot 9 px away and closed the card. A click listener on the card layer makes every
  // part of a card answer taps; the layer itself takes none (pointer-events none), so the map around it is unchanged.
  useEffect(() => {
    if (!phone || !cardLayer) return;
    const take = () => {};
    cardLayer.addEventListener('click', take);
    return () => cardLayer.removeEventListener('click', take);
  }, [phone, cardLayer]);

  const regionDotsPoints = useMemo(() => {
    if (!regionDots?.length) return null;
    return regionDots.map((dot, i) => {
      const { left, top } = calcPoint(dot.lat, dot.lng);
      return (
        <div
          key={`points-group-${i}`}
          // Phone: a region's flag answers no tap (it has no action), so it lets a tap through to the points' tap areas
          // beneath, where the nearest point wins; it took the taps between London and Oxford when the dots did.
          className={cn(
            'world-map-region flex-center absolute size-7 cursor-pointer text-3xl opacity-0',
            phone ? 'pointer-events-none' : 'pointer-events-auto',
          )}
          style={{ left, top, filter: 'url(#black-overlay)' }}
        >
          <div className={cn({ 'opacity-80': isAnyActive })}>{dot.icon}</div>
        </div>
      );
    });
  }, [regionDots, calcPoint, isAnyActive, phone]);

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

  // Phone: every card measured when the section is entered (cardFit), as copies that are never drawn (invisible,
  // hidden from assistive technology, inert) and fetch nothing (their pictures are empty boxes); taken down at once.
  const measuring = useSyncExternalStore(onMeasureRequest, measureIsRequested, () => false);
  const [measureLayer, setMeasureLayer] = useState<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (measuring && measureLayer) takeCardMeasures(measureLayer);
  }, [measuring, measureLayer]);
  // The map laid out again (a resize, a turn): the cards measured again if they had been.
  useEffect(() => {
    if (phone && cardMeasuresVersion() > 0) void measureCards();
  }, [phone, calcPoint]);
  const measureContents = useMemo(
    () =>
      phone && measuring ? (
        <CardMeasureContext.Provider value>
          {dots?.map((dot, i) => (
            <WorldMapDotContent key={`m-${i}`} deck={deck} dot={dot} calcPoint={calcPoint} index={i} measure />
          ))}
          {bookDots?.map((dot, i) => (
            <WorldMapBookDotContent key={`mb-${i}`} deck={deck} dot={dot} calcPoint={calcPoint} index={i} measure />
          ))}
          {sponsorDots?.map((dot, i) => (
            <WorldMapSponsorDotContent key={`ms-${i}`} deck={deck} dot={dot} calcPoint={calcPoint} index={i} measure />
          ))}
        </CardMeasureContext.Provider>
      ) : null,
    [phone, measuring, deck, dots, bookDots, sponsorDots, calcPoint],
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

  // ---------------------------------------------------------------- desktop deck: parallax
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // No parallax while a card is open, or with reduced motion (MOT-02).
      if (!mapContainerRef.current || !mapContentRef.current || isAnyActive || isReducedMotion()) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(mapContentRef.current, {
        x: -normalizedX * parallaxFactor,
        y: -normalizedY * parallaxFactor,
        rotateX: -normalizedY,
        rotateY: normalizedX * 2,
        duration: SECTIONS.presenceParallax.duration,
        ease: SECTIONS.presenceParallax.ease,
        overwrite: 'auto',
      });
    },
    [isAnyActive],
  );

  // Compact heights: each phone label takes a free side of its dot, or waits until its dot is tapped (RWD-02 A3).
  useCompactLabelRule(phoneMapRef, [phone, calcPoint, activeMeetingDot, activeBookDot, activeSponsorDot]);
  // Desktop deck: a label at the edge of the window takes the other side of its dot.
  useCompactLabelRule(desktopMapRef, [phone, calcPoint, activeMeetingDot, activeBookDot, activeSponsorDot], 'desktop');

  if (phone) {
    return (
      // The strip's height is --map-h: 55 % of the window, or on a phone in landscape (compact height) what is left
      // between the compact title and the arrows.
      // overflow-x: clip. The card layer below follows the strip's scroll, so mid-pan a card reaches up to 176 px past the
      // window's right edge (the original's too). The original locked zoom (maximum-scale=1), so the phone ignored it;
      // with pinch zoom allowed (WCAG 1.4.4) a phone browser widens its layout viewport to fit it, which pushed the menu,
      // SUBSCRIBE and the player off the screen. Clipping the x axis only keeps the cards' vertical overflow, creates no
      // scroll container and hides nothing the screen showed: the part past the window was never on the screen.
      <MapHitLayerContext.Provider value={hitContext}>
        <div
          ref={phoneMapRef}
          className="absolute inset-x-0 top-[5dvh] mt-[11.25rem] h-[var(--map-h)] w-full overflow-x-clip [--map-h:55vh] shortScreen:top-0 shortScreen:mt-[8.5rem] shortScreen:[--map-h:calc(100svh_-_12.25rem)]"
        >
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
            {hitLayerEl}
            <WorldMapSVG
              ref={ref}
              className="world-map-img pointer-events-none absolute top-0 h-full select-none bg-top opacity-0 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
            />
            {regionDotsPoints}
            {points}
            {/* opacity 0: the targets take taps and draw nothing (transparent but visible ones changed how a dimmed neighbour under them is rasterised, by up to 13 levels in a 4 px circle). */}
            <div ref={setPointLayer} className="pointer-events-none absolute left-0 top-0 z-[25] opacity-0" />
            {filterDefs}
          </div>
          {/* Cards sit outside the scroller (so they are not clipped) and follow its scroll. */}
          <div
            ref={setCardLayer}
            data-card-layer
            className="pointer-events-none absolute inset-0 overflow-visible"
            style={{ transform: `translateX(-${scrollLeft}px)` }}
          >
            {grownArea}
            {contents}
          </div>
          {measureContents && (
            <div
              ref={setMeasureLayer}
              aria-hidden
              inert
              className="pointer-events-none invisible absolute inset-0 overflow-visible"
            >
              {measureContents}
            </div>
          )}
        </div>
      </MapHitLayerContext.Provider>
    );
  }

  // One element tree for both layouts, so switching (a rotation) never remounts the dots the section timeline animates.
  return (
    <MapHitLayerContext.Provider value={hitContext}>
      <div
        ref={desktopMapRef}
        className="relative mt-18 aspect-[63/30] h-[88svh] justify-center overflow-hidden font-sans"
        onMouseMove={handleMouseMove}
        style={{ perspective: '1000px' }}
      >
        <div ref={mapContainerRef} className="size-full" onClick={handleBackgroundClick}>
          <div ref={mapContentRef} className="relative -left-14 size-full">
            <WorldMapAnimBackground className="absolute left-0 top-0 size-full" ref={ref} />
            {hitLayerEl}
            {regionDotsPoints}
            {points}
            {contents}
            {filterDefs}
          </div>
        </div>
      </div>
    </MapHitLayerContext.Provider>
  );
});
WorldMap.displayName = 'WorldMap';
export default memo(WorldMap);
