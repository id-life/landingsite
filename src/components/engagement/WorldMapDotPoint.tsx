import { MapDotData } from '@/constants/engagement';
import { useEngagementJumpTo } from '@/hooks/engegement/useEngagementJumpTo';
import { cn } from '@/utils';
import { motion, Variants } from 'motion/react';
import { useCallback } from 'react';
import FeatherImg from './FeatherImg';

const pointVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
    transition: {
      duration: 0.3,
      scale: { type: 'easeInOut' },
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

export default function WorldMapDotPoint({ dot, index }: { dot: MapDotData; index: number }) {
  const { title, imgs, contentTransformStyle, period, country, label, lat, lng } = dot;
  const { jumpTo } = useEngagementJumpTo();

  const projectPoint = useCallback((lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  }, []);

  const point = projectPoint(lat, lng);

  return (
    <g>
      <motion.g
        className={`world-map-dot world-map-dot-${index} pointer-events-auto cursor-pointer opacity-0`}
        initial="initial"
        whileHover="hover"
        onClick={() => jumpTo(index)}
        variants={containerVariants}
      >
        {/* 点 */}
        <motion.g variants={pointVariants}>
          <circle cx={point.x} cy={point.y} r="2" fill="#C11111" />
          <circle cx={point.x} cy={point.y} r="2" fill="#C11111" opacity="0.5">
            <animate attributeName="r" from={2} to={6} dur="1.2s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx={point.x} cy={point.y} r="6" stroke="#C11111" strokeWidth="1" opacity="0.5" fill="none">
            <animate attributeName="r" from={6} to={10} dur="1.2s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" begin="0s" repeatCount="indefinite" />
          </circle>
        </motion.g>
        {/* 标签 */}
        <motion.foreignObject variants={labelVariants} x={point.x + 6} y={point.y - 5} width={140} height={28}>
          <div
            className="flex flex-col items-start font-oxanium leading-[1.1] text-white"
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          >
            {country && <span className="mr-2 font-semibold">{country}</span>}
            {label}
          </div>
        </motion.foreignObject>
      </motion.g>
      <foreignObject
        x={point.x - 16}
        y={0}
        width={160}
        className={cn(
          `world-map-dot-content world-map-dot-content-${index} pointer-events-none flex h-0 max-h-[42.5rem] flex-col overflow-visible opacity-0`,
        )}
      >
        <div
          className={cn('absolute inset-0 top-4 z-10 flex h-full w-[20.25rem] flex-col items-center font-oxanium')}
          style={{
            transform: `scale(var(--inverse-scale, 1)) ${contentTransformStyle}`,
            transformOrigin: 'top left',
          }}
        >
          {title && (
            <h3 className="text-xl/6 font-semibold capitalize text-white">
              <span className="mr-2">{title}</span>
              {period}
            </h3>
          )}
          {imgs?.length ? (
            <div className="pointer-events-auto -ml-8 -mt-2 flex grow flex-col overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_75%,transparent)]">
              {imgs.map((img) => (
                <FeatherImg key={img.src} src={img.src} alt={img.alt} />
              ))}
            </div>
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
}
