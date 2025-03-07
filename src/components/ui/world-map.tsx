'use client';

import DottedMap from 'dotted-map';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { memo, useCallback, useMemo, useRef } from 'react';

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export const WorldMap = memo(function WorldMapComponent({ dots = [], lineColor = '#0ea5e9' }: MapProps) {
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

  const createCurvedPath = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  }, []);

  const dotsLines = useMemo(() => {
    return dots.map((dot, i) => {
      const startPoint = projectPoint(dot.start.lat, dot.start.lng);
      const endPoint = projectPoint(dot.end.lat, dot.end.lng);
      return (
        <g key={`path-group-${i}`}>
          <motion.path
            d={createCurvedPath(startPoint, endPoint)}
            fill="none"
            stroke="url(#path-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              delay: 0.5 * i,
              ease: 'easeOut',
            }}
          ></motion.path>
        </g>
      );
    });
  }, [createCurvedPath, dots, projectPoint]);

  const src = useMemo(() => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`;
  }, [svgMap]);

  // 优化点的渲染，减少动画复杂度
  const dotsPoints = useMemo(() => {
    return dots.map((dot, i) => {
      const startPoint = projectPoint(dot.start.lat, dot.start.lng);
      const endPoint = projectPoint(dot.end.lat, dot.end.lng);

      // 高优化级别时禁用或简化动画
      const animationDuration = '1.5s';
      const maxRadius = '8';

      return (
        <g key={`points-group-${i}`}>
          <g key={`start-${i}`}>
            <circle cx={startPoint.x} cy={startPoint.y} r="2" fill={lineColor} />
            <circle cx={startPoint.x} cy={startPoint.y} r="2" fill={lineColor} opacity="0.5">
              <animate attributeName="r" from="2" to={maxRadius} dur={animationDuration} begin="0s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur={animationDuration} begin="0s" repeatCount="indefinite" />
            </circle>
          </g>
          <g key={`end-${i}`}>
            <circle cx={endPoint.x} cy={endPoint.y} r="2" fill={lineColor} />
            <circle cx={endPoint.x} cy={endPoint.y} r="2" fill={lineColor} opacity="0.5">
              <animate attributeName="r" from="2" to={maxRadius} dur={animationDuration} begin="0s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur={animationDuration} begin="0s" repeatCount="indefinite" />
            </circle>
          </g>
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
        {dotsLines}
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
