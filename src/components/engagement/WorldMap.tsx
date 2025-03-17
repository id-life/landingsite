'use client';

import { MapBookDotData, MapDotData, MapRegionDotData } from '@/constants/engagement';
import { cn } from '@/utils';
// import DottedMap from 'dotted-map';

import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { WorldMapSVG } from '../svg';
import { WorldMapDotContent, WorldMapDotPoint } from './WorldMapDot';
import { WorldMapBookDotContent, WorldMapBookDotPoint } from './WorldMapBookDot';
import { activeBookDotAtom } from '@/atoms/engagement';
import { useAtom } from 'jotai';

interface MapProps {
  dots?: Array<MapDotData>;
  regionDots?: Array<MapRegionDotData>;
  bookDots?: Array<MapBookDotData>;
  lineColor?: string;
}

export const WorldMap = memo(function WorldMapComponent({ dots, regionDots, bookDots, lineColor = '#C11111' }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [_, setActiveBookDot] = useAtom(activeBookDotAtom);
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

  const calcPoint = useCallback((lat: number, lng: number) => {
    const x = (lng + 180) * (756 / 360);
    const y = (90 - lat) * (360 / 180);
    return { x, y };
  }, []);

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
      const size = 12;
      return (
        <g key={`points-group-${i}`} className="world-map-region opacity-0">
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

  // 添加useEffect来计算和设置反向缩放
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const updateScale = () => {
      // 计算SVG当前的缩放比例
      const svgRect = svg.getBoundingClientRect();
      const scale = svgRect.width / svg.viewBox.baseVal.width;

      // 设置反向缩放CSS变量
      document.documentElement.style.setProperty('--inverse-scale', `${1 / scale}`);
    };

    window.addEventListener('resize', updateScale);
    // 初始计算
    setTimeout(updateScale, 100); // 确保SVG完全渲染

    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // 点击地图背景时关闭所有激活的书籍详情
  const handleBackgroundClick = useCallback(() => {
    setActiveBookDot(null);
  }, [setActiveBookDot]);

  // 确保在组件卸载时重置状态
  useEffect(() => {
    return () => {
      setActiveBookDot(null);
    };
  }, [setActiveBookDot]);

  return (
    <div
      className="relative mt-18 aspect-[2/1] h-[88svh] justify-center overflow-hidden bg-black/20 font-sans"
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
        id="world-map-img"
        className={cn(
          'pointer-events-none size-full select-none bg-top [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
          'opacity-0', // anim init state
        )}
      />
      <svg
        id="world-map-svg"
        ref={svgRef}
        viewBox={`0 0 756 360`}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        {regionDotsPoints}
        {dotsPoints}
        {bookDotsPoints}
        {bookDotsContents}
        {dotsContents}
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
WorldMap.displayName = 'WorldMap';
export default memo(WorldMap);
