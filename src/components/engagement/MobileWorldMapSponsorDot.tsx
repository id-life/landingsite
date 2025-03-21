import { activeSponsorDotAtom, toggleDotIndex } from '@/atoms/engagement';
import { MapSponsorDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useMemo } from 'react';
import { SponsorSVG } from '../svg';

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
    fontSize: '.625rem',
  },
  hover: {
    fontSize: '.75rem',
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

export function MobileWorldMapSponsorDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapSponsorDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { lat, lng } = dot;
  const [activeSponsorDot, setActiveSponsorDot] = useAtom(activeSponsorDotAtom);

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    const newIndex = toggleDotIndex(index, activeSponsorDot);
    setActiveSponsorDot(newIndex);
  };

  return (
    <motion.g
      className={`world-map-dot-sponsor opacity-0 world-map-dot-sponsor-${index} pointer-events-auto cursor-pointer`}
      initial="initial"
      whileHover="hover"
      onClick={handleClick}
      variants={containerVariants}
    >
      <motion.g variants={pointVariants}>
        <foreignObject x={point.x} y={point.y - 5} width={12} height={12}>
          <SponsorSVG className="size-2.5" />
        </foreignObject>
      </motion.g>
      {/* 标签 */}
      <foreignObject x={point.x} y={point.y - 4} width={100} height={12}>
        <motion.p
          variants={labelVariants}
          className="w-full whitespace-nowrap pl-3 align-middle font-oxanium font-semibold capitalize leading-[1.1] text-white"
        >
          Sponsorship
        </motion.p>
      </foreignObject>
    </motion.g>
  );
}

export function MobileWorldMapSponsorDotContent({
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
            className={cn(
              'absolute left-0 top-0 flex h-6 flex-col items-start gap-5 overflow-hidden bg-gray-700/50 px-8 py-5 pt-1.5 font-oxanium backdrop-blur-3xl',
            )}
          >
            <h4 className="text-xl/6 font-semibold capitalize text-white">Sponsorship</h4>
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
              {icon && <img src={icon} alt={alt} className="h-4.5 w-auto" />}
            </motion.div>
          </motion.div>
          {/* </a> */}
        </foreignObject>
      )}
    </AnimatePresence>
  );
}
