import { activeBookDotAtom, activeSponsorDotAtom, toggleDotIndex } from '@/atoms/engagement';
import { MapBookDotData, MapSponsorDotData } from '@/constants/engagement';
import { useEngagementJumpTo } from '@/hooks/engagement/useEngagementJumpTo';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';
import { ArrowSVG, SponsorSVG } from '../svg';

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
    transform: 'scale(var(--inverse-scale, 1)) translateY(-.1875rem)',
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

export function WorldMapSponsorDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapSponsorDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { lat, lng } = dot;
  const { jumpTo } = useEngagementJumpTo();
  const [activeSponsorDot, setActiveSponsorDot] = useAtom(activeSponsorDotAtom);

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    const newIndex = toggleDotIndex(index, activeSponsorDot);
    setActiveSponsorDot(newIndex);

    // // 只有当点击导致内容从隐藏变为显示时（newState不为null且不等于之前的状态），才执行跳转
    // if (newIndex !== null && activeSponsorDot !== newIndex) {
    //   jumpTo(-1);
    // }
  };

  return (
    <motion.g
      className={`world-map-dot-sponsor world-map-dot-sponsor-${index} pointer-events-auto cursor-pointer`}
      initial="initial"
      whileHover="hover"
      onClick={handleClick}
      variants={containerVariants}
    >
      <motion.g variants={pointVariants}>
        <foreignObject x={point.x} y={point.y - 5} width={10} height={10}>
          <SponsorSVG
            className="size-6"
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          />
        </foreignObject>
      </motion.g>
      {/* 标签 */}
      <foreignObject x={point.x} y={point.y - 4} width={80} height={10}>
        <motion.p
          variants={labelVariants}
          className="w-full origin-[top_left] whitespace-nowrap pl-7 align-middle font-oxanium font-semibold capitalize leading-[1.2] text-white"
        >
          Sponsorship
        </motion.p>
      </foreignObject>
    </motion.g>
  );
}

export function WorldMapSponsorDotContent({
  dot,
  index,
  calcPoint,
}: {
  dot: MapSponsorDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { alt, icon, link, lat, lng } = dot;
  const [activeSponsorDot] = useAtom(activeSponsorDotAtom);
  const isActive = activeSponsorDot === index;

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  // const onClick = useCallback(
  //   (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     if (link) window.open(link, '_blank');
  //   },
  //   [link],
  // );

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <foreignObject
          x={point.x}
          y={point.y + 6}
          className={cn(
            `world-map-dot-sponsor-content world-map-dot-sponsor-content-${index} pointer-events-none flex h-20 flex-col overflow-visible`,
          )}
          // onClick={onClick}
        >
          {/* <a href={link} target="_blank" rel="noreferrer" className="pointer-events-auto -mt-4"> */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn('absolute left-0 top-0 flex h-12 w-[10rem] flex-col items-start overflow-hidden pt-1.5 font-oxanium')}
            style={{
              transform: `scale(var(--inverse-scale, 1))`,
              transformOrigin: 'top left',
            }}
          >
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -30,
                  transformOrigin: 'top',
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transformOrigin: 'top',
                },
              }}
              transition={{
                duration: 0.3,
                type: 'easeInOut',
              }}
              className="flex-center relative"
            >
              {icon && <img src={icon} alt={alt} className="h-7.5 w-auto" />}
            </motion.div>
          </motion.div>
          {/* </a> */}
        </foreignObject>
      )}
    </AnimatePresence>
  );
}
