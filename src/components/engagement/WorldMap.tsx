'use client';

import { MapBookDotData, MapDotData, MapRegionDotData, MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
// import DottedMap from 'dotted-map';
import { currentPageAtom } from '@/atoms';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom } from '@/atoms/engagement';
import { globalLoadedAtom } from '@/atoms/geo';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMeasure } from 'react-use';
import { NAV_LIST } from '../nav/nav';
import { WorldMapAnimBackground } from './WorldMapAnimBackground';
import { WorldMapBookDotContent, WorldMapBookDotPoint } from './WorldMapBookDot';
import { WorldMapDotContent, WorldMapDotPoint } from './WorldMapDot';
import { WorldMapSponsorDotContent, WorldMapSponsorDotPoint } from './WorldMapSponsorDot';

const svgViewBox = {
  w: 756,
  h: 360,
};
const parallaxFactor = 20; // 视差移动的最大像素值
interface MapProps {
  dots?: Array<MapDotData>;
  regionDots?: Array<MapRegionDotData>;
  bookDots?: Array<MapBookDotData>;
  sponsorDots?: Array<MapSponsorDotData>;
  lineColor?: string;
}

export const WorldMap = memo(function WorldMapComponent({
  dots,
  regionDots,
  bookDots,
  sponsorDots,
  lineColor = '#C11111',
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const setActiveBookDot = useSetAtom(activeBookDotAtom);
  const setActiveSponsorDot = useSetAtom(activeSponsorDotAtom);
  const setActiveMeetingDot = useSetAtom(activeMeetingDotAtom);
  const currentPage = useAtomValue(currentPageAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const [ref, { width: mapWidth }] = useMeasure<SVGSVGElement>();
  // 视差效果参数
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 缓存地图实例和SVG结果，使用优化后的参数
  // const svgMap = useMemo(() => {
  //   const map = new DottedMap({
  //     height: 60,
  //     grid: 'diagonal',
  //   });

  //   return map.getSVG({
  //     radius: 0.245,
  //     color: '#ffffff33',
  //     shape: 'circle',
  //     backgroundColor: 'var(--background)',
  //   });
  // }, []);

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
  const { activeBookDot, activeMeetingDot, activeSponsorDot } = useEngagementClickPoint();
  const isAnyActive = useMemo(
    () => activeBookDot !== null || activeMeetingDot !== null || activeSponsorDot !== null,
    [activeBookDot, activeMeetingDot, activeSponsorDot],
  );
  // const src = useMemo(() => {
  //   return `data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`;
  // }, [svgMap]);

  // // 添加下载SVG的函数
  // const downloadSVG = useCallback(() => {
  //   const blob = new Blob([svgMap], { type: 'image/svg+xml' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'map.svg';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // }, [svgMap]);

  const regionDotsPoints = useMemo(() => {
    if (!regionDots?.length) return null;
    return regionDots.map((dot, i) => {
      const startPoint = calcPoint(dot.lat, dot.lng);
      return (
        <div
          key={`points-group-${i}`}
          className="world-map-region flex-center pointer-events-auto absolute size-7 cursor-pointer text-3xl opacity-0"
          style={{
            left: startPoint.left,
            top: startPoint.top,
            filter: 'url(#black-overlay)',
          }}
        >
          <div className={cn({ 'opacity-80': isAnyActive })}>{dot.icon}</div>
        </div>
      );
    });
  }, [regionDots, calcPoint, isAnyActive]);

  const dotsPoints = useMemo(() => {
    if (!dots?.length) return null;
    return dots.map((dot, i) => {
      return <WorldMapDotPoint key={`world-map-dot-point-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, dots]);

  const dotsContents = useMemo(() => {
    if (!dots?.length) return null;
    return dots.map((dot, i) => {
      return <WorldMapDotContent key={`world-map-dot-content-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, dots]);

  const bookDotsPoints = useMemo(() => {
    if (!bookDots?.length) return null;
    return bookDots.map((dot, i) => {
      return <WorldMapBookDotPoint key={`world-map-dot-book-point-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, bookDots]);

  const bookDotsContents = useMemo(() => {
    if (!bookDots?.length) return null;
    return bookDots.map((dot, i) => {
      return <WorldMapBookDotContent key={`world-map-dot-book-content-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, bookDots]);

  const sponsorDotsPoints = useMemo(() => {
    if (!sponsorDots?.length) return null;
    return sponsorDots.map((dot, i) => {
      return <WorldMapSponsorDotPoint key={`world-map-dot-sponsor-point-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
    });
  }, [calcPoint, sponsorDots]);

  const sponsorDotsContents = useMemo(() => {
    if (!sponsorDots?.length) return null;
    return sponsorDots.map((dot, i) => {
      return <WorldMapSponsorDotContent key={`world-map-dot-sponsor-content-${i}`} dot={dot} calcPoint={calcPoint} index={i} />;
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
    if (currentPage?.id !== NAV_LIST[2].id) {
      setActiveBookDot(null);
      setActiveSponsorDot(null);
      setActiveMeetingDot(null);
    }
  }, [currentPage, setActiveBookDot, setActiveSponsorDot, setActiveMeetingDot, globalLoaded]);

  // 处理鼠标移动，更新视差效果
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current || !mapContentRef.current) return;

    const containerRect = mapContainerRef.current.getBoundingClientRect();

    // 计算鼠标在容器中的相对位置 (0 到 1)
    const relativeX = (e.clientX - containerRect.left) / containerRect.width;
    const relativeY = (e.clientY - containerRect.top) / containerRect.height;

    // 将相对位置转换为 -0.5 到 0.5 的范围，中心点为(0,0)
    const normalizedX = relativeX - 0.5;
    const normalizedY = relativeY - 0.5;

    setMousePosition({ x: normalizedX, y: normalizedY });

    // 计算位移量 - 鼠标在左上角时，地图向右下角移动
    const moveX = -normalizedX * parallaxFactor;
    const moveY = -normalizedY * parallaxFactor;

    // 使用GSAP实现平滑的移动效果
    gsap.to(mapContentRef.current, {
      x: moveX,
      y: moveY,
      duration: 1.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="relative mt-18 aspect-[63/30] h-[88svh] justify-center overflow-hidden font-sans"
      onClick={handleBackgroundClick}
      onMouseMove={handleMouseMove}
    >
      {/* <button
        onClick={downloadSVG}
        className="absolute right-4 top-4 z-10 rounded bg-white/10 px-3 py-1 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        下载SVG
      </button> */}
      {/* <Image
        id="world-map-img"
        // src={src}
        className={cn(
          'pointer-events-none size-full select-none bg-top [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
          'opacity-0', // anim init state
        )}
        alt="world map"
        fill
        draggable={false}
        loading="eager"
      /> */}
      <div ref={mapContentRef} className="relative size-full">
        <WorldMapAnimBackground className="absolute left-0 top-0 size-full" ref={ref} />
        {/* <WorldMapSVG
          className={cn(
            'world-map-img pointer-events-none absolute left-[calc(100%_-_10rem)] top-0 size-full select-none bg-top [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
            // 'opacity-0', // anim init state
          )}
        /> */}
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
          className="pointer-events-none absolute left-0 top-0 size-full select-none overflow-visible"
        >
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <filter id="black-overlay" x="0" y="0" width="100%" height="100%">
              <feFlood floodColor="black" floodOpacity="0.5" result="overlay" />
              <feComposite in="overlay" in2="SourceGraphic" operator="over" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
});
WorldMap.displayName = 'WorldMap';
export default memo(WorldMap);
