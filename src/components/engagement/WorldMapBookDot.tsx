import { MapBookDotData } from '@/constants/engagement';
import { useEngagementJumpTo } from '@/hooks/engagement/useEngagementJumpTo';
import { cn } from '@/utils';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';
import { ArrowSVG, BookSVG } from '../svg';
import { activeBookDotAtom, toggleDotIndex } from '@/atoms/engagement';
import { useAtom } from 'jotai';

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
  const [activeBookDot, setActiveBookDot] = useAtom(activeBookDotAtom);

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    const newState = toggleDotIndex(index, activeBookDot);
    setActiveBookDot(newState);

    // // 只有当点击导致内容从隐藏变为显示时（newState不为null且不等于之前的状态），才执行跳转
    // if (newState !== null && activeBookDot !== newState) {
    //   jumpTo(-1);
    // }
  };

  return (
    <motion.g
      className={`world-map-dot-book world-map-dot-book-${index} pointer-events-auto cursor-pointer overflow-visible`}
      initial="initial"
      whileHover="hover"
      onClick={handleClick}
      variants={containerVariants}
    >
      <motion.g variants={pointVariants}>
        <foreignObject x={point.x} y={point.y - 5} width={10} height={10}>
          <BookSVG
            className="size-6"
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          />
        </foreignObject>
      </motion.g>
      {/* 标签 */}
      <foreignObject x={point.x} y={point.y - 4.5} width={80} height={10}>
        <motion.p
          transition={{ duration: 0.3 }}
          variants={labelVariants}
          className="origin-top-left whitespace-nowrap pl-7 align-top font-oxanium font-semibold capitalize leading-[1.2] text-white"
        >
          {title}
        </motion.p>
      </foreignObject>
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
