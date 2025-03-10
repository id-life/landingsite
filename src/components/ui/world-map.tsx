'use client';

import DottedMap from 'dotted-map';
import Image from 'next/image';
import { memo, useCallback, useMemo, useRef } from 'react';
import { ClockSVG } from '../svg';

export type MapRegionDotData = {
  lat: number;
  lng: number;
  icon?: React.ReactNode;
};
export type MapDotData = {
  lat: number;
  lng: number;
  label?: string;
  period?: string;
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
      height: 100,
      grid: 'diagonal',
    });

    return map.getSVG({
      radius: 0.3,
      color: '#FFFFFF40',
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
        <g key={`points-group-${i}`}>
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
      const point = projectPoint(dot.lat, dot.lng);
      const animationDuration = '1s';
      return (
        <g key={`points-group-${i}`} className="pointer-events-auto cursor-pointer">
          <circle cx={point.x} cy={point.y} r="2" fill={lineColor} />
          <circle cx={point.x} cy={point.y} r="2" fill={lineColor} opacity="0.5">
            <animate attributeName="r" from={2} to={6} dur={animationDuration} begin="0s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur={animationDuration} begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx={point.x} cy={point.y} r="6" stroke={lineColor} strokeWidth="1" opacity="0.5" fill="none">
            <animate attributeName="r" from={6} to={10} dur={animationDuration} begin="0s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur={animationDuration} begin="0s" repeatCount="indefinite" />
          </circle>
          <foreignObject x={point.x + 6} y={point.y - 7} width={120} height={16}>
            <div className="flex items-center font-oxanium text-[.5625rem] text-white">
              {dot?.label && <span className="mr-1">{dot.label}</span>}
              {dot?.period && (
                <div className="flex-center gap-0.5">
                  <ClockSVG className="size-2" />
                  {dot.period}
                </div>
              )}
            </div>
          </foreignObject>
        </g>
      );
    });
  }, [dots, lineColor, projectPoint]);

  return (
    <div className="flex-center relative mt-18 h-[100svh] w-full overflow-hidden bg-black/20 font-sans [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]">
      <Image
        src={src}
        className="pointer-events-none size-full select-none bg-top"
        alt="world map"
        fill
        draggable={false}
        loading="eager"
      />
      <svg ref={svgRef} viewBox="0 0 800 400" className="pointer-events-none absolute inset-0 h-full w-full select-none">
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

export { WorldMap as default };
