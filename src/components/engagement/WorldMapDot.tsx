import { MapDotData } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { cn } from '@/utils';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useMemo } from 'react';
import { MeetingSVG } from '../svg';
import FeatherImg from './FeatherImg';
import { activeMeetingDotClickOpenAtom } from '@/atoms/engagement';
import { useAtom, useAtomValue } from 'jotai';

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
  // const isClickOpenRef = useRef(false);
  const [activeMeetingDotClickOpen, setActiveMeetingDotClickOpen] = useAtom(activeMeetingDotClickOpenAtom);
  const { activeMeetingDot, handleClickPoint, activeSponsorDot, activeBookDot, handleMouseEnter, handleMouseLeave } =
    useEngagementClickPoint();
  const isActive = useMemo(() => activeMeetingDot === index, [activeMeetingDot, index]);

  const isOtherActive = useMemo(
    () => (activeMeetingDot !== null && !isActive) || activeBookDot !== null || activeSponsorDot !== null,
    [activeBookDot, activeMeetingDot, activeSponsorDot, isActive],
  );
  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    handleClickPoint('meeting', index);
  };

  return (
    <motion.g
      className={`world-map-dot world-map-dot-${index} pointer-events-auto cursor-pointer overflow-visible`}
      initial="initial"
      whileHover="hover"
      animate={isActive ? 'hover' : 'initial'}
      variants={containerVariants}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (activeMeetingDotClickOpen) setActiveMeetingDotClickOpen(false);
        handleMouseEnter(e, index, 'meeting');
      }}
    >
      <g className={cn(isOtherActive && 'opacity-50')}>
        {/* <motion.g variants={pointVariants}>
        <foreignObject x={point.x} y={point.y} width={8} height={8}>
          <MeetingSVG
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
          {isActive && (
            <>
              <circle cx={point.x} cy={point.y} r="2" fill="#C11111" opacity="0.5">
                <animate attributeName="r" from={2} to={6} dur="1.2s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" begin="0s" repeatCount="indefinite" />
              </circle>
              <circle cx={point.x} cy={point.y} r="6" stroke="#C11111" strokeWidth="1" opacity="0.5" fill="none">
                <animate attributeName="r" from={6} to={10} dur="1.2s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" begin="0s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </motion.g>
        {/* 标签 */}
        <foreignObject
          x={point.x}
          y={point.y - 4.5}
          width={isActive ? '8rem' : '7rem'}
          height={isActive ? '1.75rem' : '.75rem'}
        >
          <motion.p
            variants={labelVariants}
            transition={{ duration: 0.3 }}
            className="relative origin-top-left overflow-visible whitespace-nowrap pl-5 font-oxanium font-semibold capitalize text-white"
          >
            {label ? `${label}, ` : ''}
            {country}

            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-[calc(100%_+_0.25rem)] flex items-center gap-1 rounded-lg bg-purple/20 p-1 px-2 py-1 text-base/5 font-semibold text-purple backdrop-blur-2xl"
                >
                  <MeetingSVG className="size-5 fill-purple" />
                  Conference
                </motion.span>
              )}
            </AnimatePresence>
          </motion.p>
        </foreignObject>
      </g>
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
  const { title, imgs, contentTransformStyle, period, lat, lng, pcDotHotAreaClass } = dot;
  const { activeMeetingDot, handleMouseLeave } = useEngagementClickPoint();
  const isActive = activeMeetingDot === index;
  const activeMeetingDotClickOpen = useAtomValue(activeMeetingDotClickOpenAtom);

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeMeetingDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    // 检查鼠标是否移出到非点区域
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-content-${index}`)) {
      handleMouseLeave(e, index, 'meeting');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <foreignObject
          x={point.x - 16}
          y={0}
          width="18.75rem"
          className={cn(
            `world-map-dot-content world-map-dot-content-${index} pointer-events-none flex max-h-[42.5rem] flex-col overflow-visible`,
          )}
        >
          {/* 移出判断热区 */}
          <div
            className={cn(
              'absolute inset-0 top-4 -z-10 flex h-[70vh] w-[20.25rem] origin-top-left flex-col items-center gap-4 font-oxanium',
            )}
            style={{
              transform: `scale(var(--inverse-scale, 1)) ${contentTransformStyle}`,
            }}
            onMouseLeave={handleContentMouseLeave}
          >
            <div className="pointer-events-auto absolute -inset-10"></div>
            <div className={cn('pointer-events-auto absolute -right-72 left-[90%] h-28', pcDotHotAreaClass)}></div>
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {
                opacity: 0,
                height: 0,
              },
              visible: {
                opacity: 1,
                height: '70vh',
              },
            }}
            transition={{
              staggerChildren: 0.1,
              duration: 0.3,
              type: 'easeInOut',
            }}
            className={cn(
              'absolute inset-0 top-4 flex h-full w-[20.25rem] origin-top-left flex-col items-center gap-4 font-oxanium',
            )}
            style={{
              transform: `scale(var(--inverse-scale, 1)) ${contentTransformStyle}`,
            }}
          >
            {title && (
              <h3 className="whitespace-nowrap text-center text-xl/6 font-semibold capitalize text-white">
                <span className="mr-2">{title}</span>
                {period}
              </h3>
            )}
            {imgs?.length ? (
              <div className="hide-scrollbar pointer-events-auto flex grow flex-col overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_0%,white_75%,transparent)]">
                {imgs.map((img) => (
                  <FeatherImg key={img.src} src={img.src} alt={img.alt} />
                ))}
              </div>
            ) : null}
          </motion.div>
        </foreignObject>
      )}
    </AnimatePresence>
  );
}
