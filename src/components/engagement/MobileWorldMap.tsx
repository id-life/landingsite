'use client';

import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom } from '@/atoms/engagement';
import { globalLoadedAtom } from '@/atoms/geo';
import { MapBookDotData, MapDotData, MapRegionDotData, MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useEvent, useMeasure } from 'react-use';
import { WorldMapSVG } from '../svg';
import { MobileWorldMapBookDotContent, MobileWorldMapBookDotPoint } from './MobileWorldMapBookDot';
import { MobileWorldMapDotContent, MobileWorldMapDotPoint } from './MobileWorldMapDot';
import { MobileWorldMapSponsorDotContent, MobileWorldMapSponsorDotPoint } from './MobileWorldMapSponsorDot';
import { throttle } from 'lodash-es';
import { NAV_LIST } from '../nav/nav';
import { mobileCurrentPageAtom } from '@/atoms';

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
  const setActiveBookDot = useSetAtom(activeBookDotAtom);
  const setActiveSponsorDot = useSetAtom(activeSponsorDotAtom);
  const setActiveMeetingDot = useSetAtom(activeMeetingDotAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const [ref, { width: mapWidth }] = useMeasure<SVGSVGElement>();

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
      console.log({ x, y, left, top, w, h, width, height });
      return { x, y, left, top };
    },
    [mapWidth],
  );
  const currentPage = useAtomValue(mobileCurrentPageAtom);

  const regionDotsPoints = useMemo(() => {
    if (!regionDots?.length) return null;
    return regionDots.map((dot, i) => {
      const startPoint = calcPoint(dot.lat, dot.lng);
      const size = 12;
      return (
        <g key={`points-group-${i}`} className="world-map-region">
          {dot.icon ? (
            <foreignObject x={startPoint.x - size / 2} y={startPoint.y - size / 2} width={size} height={size}>
              <div className="flex-center pointer-events-auto size-full cursor-pointer">{dot.icon}</div>
            </foreignObject>
          ) : (
            <circle cx={startPoint.x} cy={startPoint.y} r="2" fill={lineColor} />
          )}
        </g>
      );
    });
  }, [lineColor, calcPoint, regionDots]);

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

  // 创建可重用的更新比例函数
  const updateSVGScale = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // 计算SVG当前的缩放比例
    const svgRect = svg.getBoundingClientRect();
    // const winWidth = window.innerWidth;
    const svgWidth = svgRect.width;
    const svgScale = svgWidth / svg.viewBox.baseVal.width;
    // const mapScale = Math.min(1, 1 - (1920 - winWidth) / 1920);
    // console.log({ svgScale, mapScale, winWidth, svgWidth });
    // 设置地图缩放适配
    document.documentElement.style.setProperty('--map-scale', `${0.95}`);
    // 设置反向缩放CSS变量
    document.documentElement.style.setProperty('--inverse-scale', `${1 / svgScale}`);
  }, [svgRef]);

  useEvent('resize', throttle(updateSVGScale, 100));

  useEffect(() => {
    if (!globalLoaded) return;
    updateSVGScale();
  }, [globalLoaded, updateSVGScale]);

  useEffect(() => {
    if (svgRef.current && mapWidth > 0) {
      console.log('SVG refs available, updating scale');
      requestAnimationFrame(() => {
        updateSVGScale();
      });
    }
  }, [mapWidth, updateSVGScale]);

  // 点击地图背景时关闭所有激活的书籍详情
  const handleBackgroundClick = useCallback(() => {
    setActiveBookDot(null);
    setActiveSponsorDot(null);
    setActiveMeetingDot(null);
  }, [setActiveBookDot, setActiveSponsorDot, setActiveMeetingDot]);

  // 确保在组件卸载时重置状态
  useEffect(() => {
    if (!globalLoaded) return;
    if (currentPage?.id !== NAV_LIST[2].id) {
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
      {dotsPoints}
      <svg
        id="world-map-svg"
        ref={svgRef}
        viewBox={`0 0 756 360`}
        className="pointer-events-none absolute left-0 top-0 h-full select-none overflow-visible"
      >
        <g>
          {regionDotsPoints}
          {bookDotsPoints}
          {sponsorDotsPoints}
          {bookDotsContents}
          {sponsorDotsContents}
          {dotsContents}
        </g>
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
});
MobileWorldMap.displayName = 'MobileWorldMap';
export default memo(MobileWorldMap);
