'use client';

import { MapBookDotData, MapDotData, MapRegionDotData, MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
// import DottedMap from 'dotted-map';
import { currentPageAtom } from '@/atoms';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom } from '@/atoms/engagement';
import { globalLoadedAtom } from '@/atoms/geo';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useEvent, useMeasure } from 'react-use';
import { NAV_LIST } from '../nav/nav';
import { WorldMapSVG } from '../svg';
import { WorldMapBookDotContent, WorldMapBookDotPoint } from './WorldMapBookDot';
import { WorldMapDotContent, WorldMapDotPoint } from './WorldMapDot';
import { WorldMapSponsorDotContent, WorldMapSponsorDotPoint } from './WorldMapSponsorDot';

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

export const WorldMap = memo(function WorldMapComponent({
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
  const currentPage = useAtomValue(currentPageAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const [ref, { width: mapWidth }] = useMeasure<SVGSVGElement>();
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
      console.log({ x, y, left, top, w, h, width, height });
      return { x, y, left, top };
    },
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
  }, [regionDots, calcPoint, isAnyActive, lineColor]);

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
      className="0 relative mt-18 aspect-[63/30] h-[88svh] justify-center overflow-hidden font-sans"
      onClick={handleBackgroundClick}
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
      <WorldMapSVG
        ref={ref}
        className={cn(
          'world-map-img pointer-events-none absolute left-0 top-0 size-full select-none bg-top [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
          // 'opacity-0', // anim init state
        )}
      />
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
      <svg
        id="world-map-svg"
        ref={svgRef}
        viewBox={`0 0 756 360`}
        className="pointer-events-none absolute -left-10 top-0 z-30 size-full select-none overflow-visible"
      >
        {bookDotsContents}
        {sponsorDotsContents}
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
  );
});
WorldMap.displayName = 'WorldMap';
export default memo(WorldMap);
