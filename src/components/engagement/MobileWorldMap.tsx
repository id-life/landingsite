'use client';

import { mobileCurrentPageAtom } from '@/atoms';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, mobileMapScrollProgressAtom } from '@/atoms/engagement';
import { globalLoadedAtom } from '@/atoms/geo';
import { MapBookDotData, MapDotData, MapRegionDotData, MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMeasure } from 'react-use';
import { NAV_LIST } from '../nav/nav';
import { WorldMapSVG } from '../svg';
import { MobileWorldMapBookDotContent, MobileWorldMapBookDotPoint } from './MobileWorldMapBookDot';
import { MobileWorldMapDotContent, MobileWorldMapDotPoint } from './MobileWorldMapDot';
import { MobileWorldMapSponsorDotContent, MobileWorldMapSponsorDotPoint } from './MobileWorldMapSponsorDot';

const svgViewBox = {
  w: 756,
  h: 360,
};
interface MapProps {
  dots?: Array<MapDotData>;
  regionDots?: Array<MapRegionDotData>;
  bookDots?: Array<MapBookDotData>;
  sponsorDots?: Array<MapSponsorDotData>;
  lineColor?: string;
}

export const MobileWorldMap = memo(function WorldMapComponent({
  dots,
  regionDots,
  bookDots,
  sponsorDots,
  lineColor = '#C11111',
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBookDot, setActiveBookDot] = useAtom(activeBookDotAtom);
  const [activeSponsorDot, setActiveSponsorDot] = useAtom(activeSponsorDotAtom);
  const [activeMeetingDot, setActiveMeetingDot] = useAtom(activeMeetingDotAtom);
  const setScrollProgress = useSetAtom(mobileMapScrollProgressAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const [ref, { width: mapWidth }] = useMeasure<SVGSVGElement>();
  const [scrollLeft, setScrollLeft] = useState(0);

  // 处理滚动进度更新 - throttled for performance on mobile devices
  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const container = containerRef.current;
        if (!container) return;
        const maxScroll = container.scrollWidth - container.clientWidth;
        setScrollLeft(container.scrollLeft);
        if (maxScroll <= 0) {
          setScrollProgress(0);
          return;
        }
        const progress = container.scrollLeft / maxScroll;
        setScrollProgress(Math.min(1, Math.max(0, progress)));
      }, 16), // Update at ~60fps for smooth sync
    [setScrollProgress],
  );
  const isAnyActive = useMemo(
    () => activeBookDot !== null || activeMeetingDot !== null || activeSponsorDot !== null,
    [activeBookDot, activeMeetingDot, activeSponsorDot],
  );
  const calcPoint = useCallback(
    (lat: number, lng: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0, left: 0, top: 0 };
      const { w, h } = svgViewBox;
      const { width, height } = svg.getBoundingClientRect();
      const x = (lng + 180) * (w / 360);
      const y = (90 - lat) * (h / 180);
      const left = (x / w) * width;
      const top = (y / h) * height;
      // console.log({ x, y, left, top, w, h, width, height });
      return { x, y, left, top };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapWidth],
  );
  const currentPage = useAtomValue(mobileCurrentPageAtom);

  const regionDotsPoints = useMemo(() => {
    if (!regionDots?.length) return null;
    return regionDots.map((dot, i) => {
      const { left, top } = calcPoint(dot.lat, dot.lng);
      return (
        <div
          key={`points-group-${i}`}
          className={cn(
            'world-map-region flex-center pointer-events-auto absolute size-7 cursor-pointer text-3xl opacity-0',
            isAnyActive && 'opacity-80',
          )}
          style={{
            left: left,
            top: top,
            filter: 'url(#black-overlay)',
          }}
        >
          {dot.icon}
        </div>
      );
    });
  }, [regionDots, calcPoint, isAnyActive]);

  const dotsPoints = useMemo(() => {
    if (!dots?.length) return null;
    return dots.map((dot, i) => {
      return <MobileWorldMapDotPoint key={`world-map-dot-point-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, dots]);

  const dotsContents = useMemo(() => {
    if (!dots?.length) return null;
    return dots.map((dot, i) => {
      return <MobileWorldMapDotContent key={`world-map-dot-content-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, dots]);

  const bookDotsPoints = useMemo(() => {
    if (!bookDots?.length) return null;
    return bookDots.map((dot, i) => {
      return <MobileWorldMapBookDotPoint key={`world-map-dot-book-point-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, bookDots]);

  const bookDotsContents = useMemo(() => {
    if (!bookDots?.length) return null;
    return bookDots.map((dot, i) => {
      return <MobileWorldMapBookDotContent key={`world-map-dot-book-content-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, bookDots]);

  const sponsorDotsPoints = useMemo(() => {
    if (!sponsorDots?.length) return null;
    return sponsorDots.map((dot, i) => {
      return (
        <MobileWorldMapSponsorDotPoint key={`world-map-dot-sponsor-point-${i}`} dot={dot} calcPoint={calcPoint} index={i} />
      );
    });
  }, [calcPoint, sponsorDots]);

  const sponsorDotsContents = useMemo(() => {
    if (!sponsorDots?.length) return null;
    return sponsorDots.map((dot, i) => {
      return (
        <MobileWorldMapSponsorDotContent key={`world-map-dot-sponsor-content-${i}`} dot={dot} calcPoint={calcPoint} index={i} />
      );
    });
  }, [calcPoint, sponsorDots]);

  // 点击地图背景时关闭所有激活的书籍详情
  const handleBackgroundClick = useCallback(() => {
    setActiveBookDot(null);
    setActiveSponsorDot(null);
    setActiveMeetingDot(null);
  }, [setActiveBookDot, setActiveSponsorDot, setActiveMeetingDot]);

  // 确保在组件卸载时重置状态
  useEffect(() => {
    if (!globalLoaded) return;
    if (currentPage?.id !== NAV_LIST[3].id) {
      setActiveBookDot(null);
      setActiveSponsorDot(null);
      setActiveMeetingDot(null);
    }
  }, [currentPage, setActiveBookDot, setActiveSponsorDot, setActiveMeetingDot, globalLoaded]);

  // Cleanup throttled function on unmount
  useEffect(() => {
    return () => {
      handleScroll.cancel();
    };
  }, [handleScroll]);

  return (
    <div className="absolute inset-x-0 top-[5dvh] mt-[180px] h-[55vh] w-full">
      {/* Scrollable map container */}
      <div
        ref={containerRef}
        className="world-map-container hide-scrollbar relative h-full w-full overflow-x-auto overflow-y-hidden bg-black/20 font-sans opacity-0"
        onClick={handleBackgroundClick}
        onScroll={handleScroll}
      >
        {/* Spacer for scroll width - creates scrollable area since SVG is absolutely positioned */}
        <div className="h-px shrink-0" style={{ width: 'calc(55vh * 63 / 30)' }} />
        <WorldMapSVG
          ref={ref}
          className={cn(
            'world-map-img pointer-events-none absolute top-0 h-full select-none bg-top opacity-0 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
          )}
        />
        {regionDotsPoints}
        {dotsPoints}
        {bookDotsPoints}
        {sponsorDotsPoints}
        <svg
          ref={svgRef}
          viewBox={`0 0 756 360`}
          className="pointer-events-none absolute left-0 top-0 h-full select-none overflow-visible"
        >
          <defs>
            <filter id="black-overlay" x="0" y="0" width="100%" height="100%">
              <feFlood floodColor="black" floodOpacity="0.5" result="overlay" />
              <feComposite in="overlay" in2="SourceGraphic" operator="over" />
            </filter>
          </defs>
        </svg>
      </div>
      {/* Popup content container - positioned outside scrollable area to avoid clipping */}
      <div
        className="pointer-events-none absolute inset-0 overflow-visible"
        style={{ transform: `translateX(-${scrollLeft}px)` }}
      >
        {dotsContents}
        {bookDotsContents}
        {sponsorDotsContents}
      </div>
    </div>
  );
});
MobileWorldMap.displayName = 'MobileWorldMap';
export default memo(MobileWorldMap);
