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

// 使用memo包装WorldMap组件避免不必要的重渲染
export const WorldMap = memo(function WorldMapComponent({ dots = [], lineColor = '#0ea5e9' }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // 缓存地图实例和SVG结果，使用优化后的参数
  const svgMap = useMemo(() => {
    // 根据优化级别调整网格和点的密度
    const gridType = 'diagonal';
    const pointRadius = 0.3;

    const map = new DottedMap({
      height: 100, // 减少高度可以减少点的数量
      grid: gridType,
    });

    return map.getSVG({
      radius: pointRadius,
      color: '#FFFFFF40',
      shape: 'circle',
      backgroundColor: 'black',
    });
  }, []);

  // 将经纬度转换为屏幕坐标的函数放入useCallback中避免重复创建
  const projectPoint = useCallback((lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  }, []);

  // 同样将创建曲线路径的函数放入useCallback中
  const createCurvedPath = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  }, []);

  // 优化线条渲染，根据优化级别调整复杂度
  const renderDotsLines = useMemo(() => {
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

  // 优化点的渲染，减少动画复杂度
  const renderDotsPoints = useMemo(() => {
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
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none bg-top"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
        priority={true}
        loading="eager"
        unoptimized={true}
      />
      <svg ref={svgRef} viewBox="0 0 800 400" className="pointer-events-none absolute inset-0 h-full w-full select-none">
        {renderDotsLines}
        {renderDotsPoints}
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
