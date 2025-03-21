import { activeSponsorDotAtom, toggleDotIndex } from '@/atoms/engagement';
import { MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useMemo } from 'react';
import { SponsorSVG } from '../svg';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';

const pointVariants: Variants = {
  initial: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    scale: 1.2,
    // rotate: [0, 4, -8, 8, -8, 8, -8, -4, 4, 0],
    transition: {
      // rotate: { duration: 1.5, repeat: Infinity, type: 'linear', repeatDelay: 0.5 },
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
  const { lat, lng, title } = dot;
  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);
  const { handleClickPoint, activeSponsorDot, activeBookDot, activeMeetingDot } = useEngagementClickPoint();
  const isActive = activeSponsorDot === index;
  const isOtherActive = useMemo(
    () => (activeSponsorDot !== null && !isActive) || activeBookDot !== null || activeMeetingDot !== null,
    [activeBookDot, activeMeetingDot, activeSponsorDot, isActive],
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    handleClickPoint('sponsor', index);
  };

  return (
    <motion.g
      className={`world-map-dot-sponsor world-map-dot-sponsor-${index} pointer-events-auto cursor-pointer`}
      initial="initial"
      whileHover="hover"
      onClick={handleClick}
      variants={containerVariants}
    >
      <g className={cn(isOtherActive && 'opacity-50')}>
        {/* <motion.g variants={pointVariants}>
        <foreignObject x={point.x} y={point.y - 5} width={10} height={10}>
          <SponsorSVG
            className="size-6"
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          />
        </foreignObject>
      </motion.g> */}
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
        <foreignObject x={point.x} y={point.y - 4.5} width={170} height={10}>
          <motion.p
            variants={labelVariants}
            className="flex w-full origin-top-left items-center gap-2 whitespace-nowrap pl-5 font-oxanium font-semibold capitalize text-white"
          >
            {title}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-orange bg-orange/20 flex items-center gap-1 rounded-lg p-1 px-2 py-1 text-base/5 font-semibold backdrop-blur-2xl"
                >
                  <SponsorSVG className="fill-orange size-5" />
                  Sponsorship
                </motion.span>
              )}
            </AnimatePresence>
          </motion.p>
        </foreignObject>
      </g>
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
  const { alt, icon, iconClass, link, lat, lng, containerClass } = dot;
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
            className={cn(
              'clip-sponsor-content absolute left-0 top-0 flex h-[7.875rem] w-[10rem] max-w-[18.75rem] origin-top-left flex-col items-start gap-5 overflow-hidden bg-gray-700/50 px-8 py-5 font-oxanium backdrop-blur-3xl',
              containerClass,
            )}
            variants={{
              hidden: {
                opacity: 0,
                transform: `scale(var(--inverse-scale, 1)) translateY(-10px)`,
                transformOrigin: 'top left',
              },
              visible: {
                opacity: 1,
                transform: `scale(var(--inverse-scale, 1))`,
                transformOrigin: 'top left',
              },
            }}
            transition={{
              staggerChildren: 0.05,
              duration: 0.3,
              type: 'easeInOut',
            }}
          >
            <h4 className="text-xl/6 font-semibold capitalize text-white">Sponsorship</h4>
            <motion.div>{icon && <img src={icon} alt={alt} className={cn('h-10.5 object-contain', iconClass)} />}</motion.div>
          </motion.div>
          {/* </a> */}
        </foreignObject>
      )}
    </AnimatePresence>
  );
}
