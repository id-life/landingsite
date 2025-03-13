'use client';

import { MapDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import DottedMap from 'dotted-map';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import WorldMapDotPoint from './WorldMapDotPoint';

export type MapRegionDotData = {
  lat: number;
  lng: number;
  icon?: React.ReactNode;
};

interface MapProps {
  dots?: Array<MapDotData>;
  regionDots?: Array<MapRegionDotData>;
  lineColor?: string;
}

export const WorldMap = memo(function WorldMapComponent({ dots, regionDots, lineColor = '#C11111' }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // 缓存地图实例和SVG结果，使用优化后的参数
  const svgMap = useMemo(() => {
    const map = new DottedMap({
      height: 60,
      grid: 'diagonal',
    });

    return map.getSVG({
      radius: 0.26,
      color: '#ffffff33',
      shape: 'circle',
      backgroundColor: 'var(--background)',
    });
  }, []);

  const projectPoint = useCallback((lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  }, []);

  const src = useMemo(() => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`;
  }, [svgMap]);

  const regionDotsPoints = useMemo(() => {
    if (!regionDots?.length) return null;
    return regionDots.map((dot, i) => {
      const startPoint = projectPoint(dot.lat, dot.lng);
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
  }, [lineColor, projectPoint, regionDots]);

  const dotsPoints = useMemo(() => {
    if (!dots?.length) return null;
    return dots.map((dot, i) => {
      return <WorldMapDotPoint key={`points-group-${i}`} dot={dot} index={i} />;
    });
  }, [dots]);

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

  return (
    <div className="relative mt-18 aspect-[2/1] h-[88svh] justify-center overflow-hidden bg-black/20 font-sans">
      <Image
        id="world-map-img"
        src={src}
        className={cn(
          'pointer-events-none size-full select-none bg-top [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
          'opacity-0', // anim init state
        )}
        alt="world map"
        fill
        draggable={false}
        loading="eager"
      />
      <svg
        id="world-map-svg"
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        {regionDotsPoints}
        {dotsPoints}
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
