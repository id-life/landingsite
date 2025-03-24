import { activeSponsorDotAtom, activeSponsorDotClickOpenAtom } from '@/atoms/engagement';
import { MapSponsorDotData } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { cn } from '@/utils';
import { useAtom, useAtomValue } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useMemo } from 'react';
import { SponsorSVG } from '../svg';
import { VideoWithPoster } from './VideoWithPoster';

// 添加点动画变体
const pointVariants: Variants = {
  initial: {
    scale: 1,
    x: 0,
    y: 0,
    origin: 0,
  },
  hover: {
    scale: 1.2,
    x: 0,
    y: 0,
    origin: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
};
const labelVariants: Variants = {
  initial: {
    fontSize: '.75rem',
    transform: 'scale(var(--inverse-scale, 1))',
  },
  hover: {
    fontSize: '.875rem',
    y: '-0.5rem',
    transform: 'scale(var(--inverse-scale, 1)) translateY(-.1875rem)',
  },
};

// 添加父元素动画变体
const containerVariants: Variants = {
  initial: {
    opacity: 0,
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
  const { lat, lng, title } = dot;
  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);
  const { handleClickPoint, activeSponsorDot, activeBookDot, activeMeetingDot, handleMouseEnter, handleMouseLeave } =
    useEngagementClickPoint();
  const [activeSponsorDotClickOpen, setActiveSponsorDotClickOpen] = useAtom(activeSponsorDotClickOpenAtom);
  const isActive = activeSponsorDot === index;
  const isOtherActive = useMemo(
    () => (activeSponsorDot !== null && !isActive) || activeBookDot !== null || activeMeetingDot !== null,
    [activeBookDot, activeMeetingDot, activeSponsorDot, isActive],
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    if (!activeSponsorDotClickOpen) setActiveSponsorDotClickOpen(true);
    handleClickPoint('sponsor', index);
  };

  return (
    <motion.g
      className={`world-map-dot-sponsor world-map-dot-sponsor-${index} pointer-events-auto cursor-pointer`}
      initial="initial"
      whileHover="hover"
      animate={isActive ? 'hover' : 'initial'}
      onClick={handleClick}
      variants={containerVariants}
      onMouseEnter={(e) => {
        if (activeSponsorDotClickOpen) setActiveSponsorDotClickOpen(false);
        handleMouseEnter(e, index, 'sponsor');
      }}
      onMouseLeave={(e) => {
        if (activeSponsorDotClickOpen) return;
        handleMouseLeave(e, index, 'sponsor');
      }}
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
            className="flex h-5 w-full origin-top-left items-center gap-2 whitespace-nowrap pl-3 font-oxanium text-base/4 font-semibold capitalize text-white"
          >
            {title}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-0.5 rounded-lg bg-orange/20 p-0.5 px-1 py-1 text-xs/3 font-semibold text-orange backdrop-blur-2xl"
                >
                  <SponsorSVG className="size-3 fill-orange" />
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

export function MobileWorldMapSponsorDotContent({
  dot,
  index,
  calcPoint,
}: {
  dot: MapSponsorDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { alt, link, coverUrl, videoUrl, lat, lng, containerClass } = dot;
  const [activeSponsorDot] = useAtom(activeSponsorDotAtom);
  const { handleMouseLeave } = useEngagementClickPoint();
  const isActive = activeSponsorDot === index;
  const activeSponsorDotClickOpen = useAtomValue(activeSponsorDotClickOpenAtom);
  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  // const onClick = useCallback(
  //   (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     if (link) window.open(link, '_blank');
  //   },
  //   [link],
  // );

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeSponsorDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    // 检查鼠标是否移出到非点区域
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-sponsor-${index}`)) {
      handleMouseLeave(e, index, 'sponsor');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <foreignObject
          x={point.x}
          y={point.y}
          className={cn(
            `world-map-dot-sponsor-content world-map-dot-sponsor-content-${index} pointer-events-auto flex h-20 flex-col overflow-visible`,
          )}
          // onClick={onClick}
        >
          {/* <a href={link} target="_blank" rel="noreferrer" className="pointer-events-auto -mt-4"> */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              'clip-sponsor-content absolute -left-3 top-0 flex w-[35vw] origin-top-left flex-col items-center overflow-hidden font-oxanium',
              containerClass,
            )}
            onMouseLeave={handleContentMouseLeave}
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.95,
                y: -10,
                transformOrigin: 'top left',
              },
              visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transformOrigin: 'top left',
              },
            }}
            transition={{
              staggerChildren: 0.05,
              duration: 0.3,
              type: 'easeInOut',
            }}
          >
            <VideoWithPoster
              coverUrl={coverUrl}
              videoUrl={videoUrl}
              title={alt}
              containerClass="-mt-2"
              videoClass="mobile:size-[30vw]"
              coverClass="mobile:size-[30vw]"
            />
            <h4 className="-mt-2 whitespace-pre-wrap text-center text-xs/3 font-semibold capitalize text-white">{alt}</h4>
          </motion.div>
          {/* </a> */}
        </foreignObject>
      )}
    </AnimatePresence>
  );
}
