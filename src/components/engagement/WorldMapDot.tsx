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
    fontSize: '1.25rem',
    transform: 'scale(var(--inverse-scale, 1))',
  },
  hover: {
    fontSize: '1.5rem',
    y: '-0.5rem',
    transform: 'scale(var(--inverse-scale, 1)) translateY(-0.1875rem)',
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

export function WorldMapDotPoint({
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
        <foreignObject x={point.x} y={point.y} width={8} height={8}>
          <MeetingSVG
            className="size-6"
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          />
        </foreignObject>
      </motion.g>
      {/* 点 */}
      {/* <motion.g variants={pointVariants}>
          <circle cx={point.x} cy={point.y} r="2" fill="#C11111" />
          <circle cx={point.x} cy={point.y} r="2" fill="#C11111" opacity="0.5">
            <animate attributeName="r" from={2} to={6} dur="1.2s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx={point.x} cy={point.y} r="6" stroke="#C11111" strokeWidth="1" opacity="0.5" fill="none">
            <animate attributeName="r" from={6} to={10} dur="1.2s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" begin="0s" repeatCount="indefinite" />
          </circle>
        </motion.g> */}
      {/* 标签 */}
      <foreignObject x={point.x} y={point.y} width="7.5rem" height={10}>
        <motion.p
          variants={labelVariants}
          transition={{ duration: 0.3 }}
          className="origin-[top_left] overflow-visible whitespace-nowrap pl-7 align-top font-oxanium font-semibold capitalize leading-[1.2] text-white"
        >
          {label ? `${label}, ` : ''}
          {country}
        </motion.p>
      </foreignObject>
    </motion.g>
  );
}

export function WorldMapDotContent({
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
        `world-map-dot-content world-map-dot-content-${index} pointer-events-none flex max-h-[42.5rem] flex-col overflow-visible`,
      )}
    >
      <div
        className={cn('absolute inset-0 top-4 flex h-full w-[20.25rem] flex-col items-center font-oxanium')}
        style={{
          transform: `scale(var(--inverse-scale, 1)) ${contentTransformStyle}`,
          transformOrigin: 'top left',
        }}
      >
        {title && (
          <h3 className="text-center text-xl/6 font-semibold capitalize text-white">
            <span className="mr-2">{title}</span>
            {period}
          </h3>
        )}
        {imgs?.length ? (
          <div className="hide-scrollbar pointer-events-auto -mt-2.5 flex grow flex-col overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_75%,transparent)]">
            {imgs.map((img) => (
              <FeatherImg key={img.src} src={img.src} alt={img.alt} />
            ))}
          </div>
        ) : null}
      </div>
    </foreignObject>
  );
}
