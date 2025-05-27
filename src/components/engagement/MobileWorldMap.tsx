'use client';

import { mobileCurrentPageAtom } from '@/atoms';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom } from '@/atoms/engagement';
import { globalLoadedAtom } from '@/atoms/geo';
import { MapBookDotData, MapDotData, MapRegionDotData, MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { useAtom, useAtomValue } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
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
  const [activeBookDot, setActiveBookDot] = useAtom(activeBookDotAtom);
  const [activeSponsorDot, setActiveSponsorDot] = useAtom(activeSponsorDotAtom);
  const [activeMeetingDot, setActiveMeetingDot] = useAtom(activeMeetingDotAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const [ref, { width: mapWidth }] = useMeasure<SVGSVGElement>();
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

  return (
    <div
      className="world-map-container relative mt-5 aspect-[63/30] h-[calc(100svh_-_1.25rem)] w-full justify-center overflow-auto bg-black/20 font-sans opacity-0"
      onClick={handleBackgroundClick}
    >
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
      {dotsContents}
      {bookDotsContents}
      {sponsorDotsContents}
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
  );
});
MobileWorldMap.displayName = 'MobileWorldMap';
export default memo(MobileWorldMap);
