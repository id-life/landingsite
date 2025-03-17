import { MapBookDotData } from '@/constants/engagement';
import { useEngagementJumpTo } from '@/hooks/engegement/useEngagementJumpTo';
import { cn } from '@/utils';
import { motion, Variants } from 'motion/react';
import { useMemo } from 'react';
import { BookSVG } from '../svg';

const pointVariants: Variants = {
  initial: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    scale: 1.2,
    rotate: [0, 4, -8, 8, -8, 8, -8, -4, 4, 0],
    transition: {
      rotate: { duration: 1.5, repeat: Infinity, type: 'linear', repeatDelay: 0.5 },
      scale: { duration: 0.3 },
    },
  },
};

const labelVariants: Variants = {
  initial: {
    fontSize: '20px',
  },
  hover: {
    fontSize: '24px',
    transition: {
      duration: 0.3,
      type: 'easeInOut',
    },
  },
};

// 添加父元素动画变体
const containerVariants: Variants = {
  initial: {
    opacity: 1,
  },
  hover: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export function WorldMapBookDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapBookDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { title, lat, lng } = dot;
  const { jumpTo } = useEngagementJumpTo();

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  return (
    <motion.g
      className={`world-map-dot-book world-map-dot-book-${index} pointer-events-auto cursor-pointer`}
      initial="initial"
      whileHover="hover"
      onClick={() => jumpTo(index)}
      variants={containerVariants}
    >
      <motion.g variants={pointVariants}>
        <foreignObject x={point.x - 6} y={point.y - 5} width={10} height={10}>
          <BookSVG
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          />
        </foreignObject>
      </motion.g>
      {/* 标签 */}
      <motion.foreignObject variants={labelVariants} x={point.x + 6} y={point.y - 5} width={240} height={28}>
        <div
          className="flex flex-col items-start font-oxanium font-semibold capitalize leading-[1.1] text-white"
          style={{
            transform: 'scale(var(--inverse-scale, 1))',
            transformOrigin: 'top left',
          }}
        >
          {title}
        </div>
      </motion.foreignObject>
    </motion.g>
  );
}

export function WorldMapBookDotContent({
  dot,
  index,
  calcPoint,
}: {
  dot: MapBookDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { title, desc, coverUrl, lat, lng } = dot;

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  return (
    <foreignObject
      x={point.x}
      y={point.y + 6}
      width={120}
      className={cn(
        `world-map-dot-book-content world-map-dot-book-content-${index} pointer-events-none flex h-20 flex-col overflow-visible`,
      )}
    >
      <div
        className={cn('absolute left-0 top-0 flex w-50 flex-col items-center gap-4 pt-4 font-oxanium')}
        style={{
          transform: `scale(var(--inverse-scale, 1))`,
          transformOrigin: 'top left',
        }}
      >
        <div className="flex-center">{coverUrl && <img src={coverUrl} alt={title} className="h-32 object-contain" />}</div>
        {desc && <p className="text-xs/3 text-gray-350">{desc}</p>}
      </div>
    </foreignObject>
  );
}
