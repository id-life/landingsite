import { activeBookDotAtom, toggleDotIndex } from '@/atoms/engagement';
import { MapBookDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';
import { ArrowSVG, BookSVG } from '../svg';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';

const pointVariants: Variants = {
  initial: {
    // rotate: 0,
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
  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  const { activeBookDot, handleClickPoint, activeMeetingDot, activeSponsorDot } = useEngagementClickPoint();
  const isActive = useMemo(() => activeBookDot === index, [activeBookDot, index]);
  const isOtherActive = useMemo(
    () => (activeBookDot !== null && !isActive) || activeMeetingDot !== null || activeSponsorDot !== null,
    [activeBookDot, activeMeetingDot, activeSponsorDot, isActive],
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    handleClickPoint('book', index);
  };

  return (
    <motion.g
      className={`world-map-dot-book world-map-dot-book-${index} pointer-events-auto cursor-pointer overflow-visible`}
      initial="initial"
      whileHover="hover"
      onClick={handleClick}
      variants={containerVariants}
    >
      <g className={cn(isOtherActive && 'opacity-50')}>
        {/* <motion.g variants={pointVariants}>
        <foreignObject x={point.x} y={point.y - 5} width={10} height={10}>
          <BookSVG
            className="size-6"
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          />
        </foreignObject>
      </motion.g> */}
        {/* 点 */}
        <motion.g variants={pointVariants} className="origin-center">
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
            transition={{ duration: 0.3 }}
            variants={labelVariants}
            className="flex origin-top-left items-center gap-2 whitespace-nowrap pl-5 align-top font-oxanium font-semibold capitalize text-white"
          >
            {title}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-cyan flex items-center gap-1 rounded-lg bg-cyan-500/20 p-1 px-2 py-1 text-base/5 font-semibold backdrop-blur-2xl"
                >
                  <BookSVG className="fill-cyan size-5" />
                  Translation
                </motion.span>
              )}
            </AnimatePresence>
          </motion.p>
        </foreignObject>
      </g>
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
  const { title, desc, coverUrl, videoUrl, lat, lng, link, bookTitle } = dot;
  const [activeBookDot] = useAtom(activeBookDotAtom);
  const isActive = activeBookDot === index;
  const [videoLoaded, setVideoLoaded] = useState(false);

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      window.open(link, '_blank');
    },
    [link],
  );

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <foreignObject
          x={point.x}
          y={point.y + 6}
          className={cn(
            `world-map-dot-book-content world-map-dot-book-content-${index} pointer-events-none flex h-20 flex-col overflow-visible`,
          )}
          onClick={onClick}
        >
          <a href={link} target="_blank" rel="noreferrer" className="pointer-events-auto -mt-4">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={cn('absolute -left-2 top-0 flex w-[15.5rem] flex-col items-center overflow-hidden pt-4 font-oxanium')}
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
                    scaleY: 0,
                    transformOrigin: 'top',
                  },
                  visible: {
                    opacity: 1,
                    scaleY: 1,
                    y: 0,
                    transformOrigin: 'top',
                  },
                }}
                transition={{
                  duration: 0.3,
                  type: 'easeInOut',
                }}
                className="flex-center relative -mt-5"
              >
                {coverUrl && !videoLoaded && <img src={coverUrl} alt={title} className="size-[15.5rem] object-contain" />}
                {videoUrl && (
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={cn('size-[15.5rem] object-contain', videoLoaded ? 'block' : 'hidden')}
                    onLoadedData={() => setVideoLoaded(true)}
                  />
                )}
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                transition={{
                  duration: 0.3,
                  type: 'easeInOut',
                  delay: 0.2,
                }}
                className="flex cursor-pointer flex-col items-center gap-1"
              >
                <h4 className="text-2xl/7 font-semibold capitalize text-white">{bookTitle}</h4>
                <ArrowSVG className="size-4 rotate-180 fill-gray-350" />
                <p className="text-xs/3 text-gray-350">{desc}</p>
              </motion.div>
            </motion.div>
          </a>
        </foreignObject>
      )}
    </AnimatePresence>
  );
}
