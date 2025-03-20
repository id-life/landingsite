import { MapDotData } from '@/constants/engagement';
import { useEngagementJumpTo } from '@/hooks/engagement/useEngagementJumpTo';
import { cn } from '@/utils';
import { motion, Variants } from 'motion/react';
import { useMemo } from 'react';
import { MeetingSVG } from '../svg';
import FeatherImg from './FeatherImg';

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
    fontSize: '1rem',
  },
  hover: {
    fontSize: '1.125rem',
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

export function MobileWorldMapDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { country, label, lat, lng } = dot;
  const { jumpTo } = useEngagementJumpTo();

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  return (
    <motion.g
      className={`world-map-dot world-map-dot-${index} pointer-events-auto cursor-pointer overflow-visible`}
      initial="initial"
      whileHover="hover"
      onClick={(e) => {
        e.stopPropagation();
        jumpTo(index);
      }}
      variants={containerVariants}
    >
      <motion.g variants={pointVariants}>
        <foreignObject x={point.x} y={point.y - 5} width={16} height={16}>
          <MeetingSVG
            className="size-5"
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          />
        </foreignObject>
      </motion.g>
      {/* 标签 */}
      <motion.foreignObject variants={labelVariants} x={point.x} y={point.y - 5} width={140} height={28}>
        <div
          className="flex flex-col items-start pl-5.5 font-oxanium leading-5 text-white"
          style={{
            transform: 'scale(var(--inverse-scale, 1))',
            transformOrigin: 'top left',
          }}
        >
          {country && <span className="font-semibold">{country}</span>}
          {label}
        </div>
      </motion.foreignObject>
    </motion.g>
  );
}

export function MobileWorldMapDotContent({
  dot,
  index,
  calcPoint,
}: {
  dot: MapDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { title, imgs, contentTransformStyle, period, lat, lng } = dot;

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  return (
    <foreignObject
      x={point.x - 16}
      y={0}
      width={160}
      className={cn(
        `world-map-dot-content world-map-dot-content-${index} pointer-events-none flex h-[78vh] max-h-[78vh] flex-col overflow-visible`,
      )}
    >
      <div
        className={cn('absolute inset-0 top-7 flex h-full w-[50vw] flex-col items-center font-oxanium')}
        style={{
          transform: `scale(var(--inverse-scale, 1)) ${contentTransformStyle}`,
          transformOrigin: 'top left',
        }}
      >
        {title && (
          <h3 className="w-[55vw] text-base/5 font-semibold capitalize text-white">
            <span className="mr-2">{title}</span>
            {period}
          </h3>
        )}
        {imgs?.length ? (
          <div className="pointer-events-auto -ml-4 -mt-2 flex h-[80vh] grow flex-col overflow-auto pb-3 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_75%,transparent)]">
            {imgs.map((img) => (
              <FeatherImg key={img.src} src={img.src} alt={img.alt} />
            ))}
          </div>
        ) : null}
      </div>
    </foreignObject>
  );
}
