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

export function MobileWorldMapBookDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapBookDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { title, lat, lng, mobilePointTransformStyle } = dot;
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
      className={`world-map-dot-book opacity-0 world-map-dot-book-${index} pointer-events-auto cursor-pointer overflow-visible`}
      initial="initial"
      whileHover="hover"
      onClick={handleClick}
      variants={containerVariants}
      style={{ transform: mobilePointTransformStyle }}
    >
      <motion.g variants={pointVariants}>
        <foreignObject x={point.x} y={point.y - 5} width={12} height={12}>
          <div>
            <BookSVG className="size-2.5" />
          </div>
        </foreignObject>
      </motion.g>
      {/* 标签 */}
      <foreignObject x={point.x} y={point.y - 4} width={150} height={12}>
        <motion.p
          variants={labelVariants}
          className="whitespace-nowrap pl-2.5 align-middle font-oxanium font-semibold capitalize leading-3 text-white"
        >
          {title}
        </motion.p>
      </foreignObject>
    </motion.g>
  );
}

export function MobileWorldMapBookDotContent({
  dot,
  index,
  calcPoint,
}: {
  dot: MapBookDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { title, desc, coverUrl, videoUrl, lat, lng, link, mobileContentTransformStyle, mobileIsUp } = dot;
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
          y={point.y + 8}
          className={cn(`world-map-dot-book-content world-map-dot-book-content-${index} flex h-20 flex-col overflow-visible`)}
          onClick={onClick}
        >
          <a href={link} target="_blank" rel="noreferrer" className="pointer-events-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={cn('absolute left-0 top-0 flex w-[25vw] flex-col items-center overflow-hidden font-oxanium')}
              style={{ transform: mobileContentTransformStyle }}
            >
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: mobileIsUp ? 30 : -30,
                    scaleY: 0,
                    transformOrigin: mobileIsUp ? 'bottom' : 'top',
                  },
                  visible: {
                    opacity: 1,
                    scaleY: 1,
                    y: 0,
                    transformOrigin: mobileIsUp ? 'bottom' : 'top',
                  },
                }}
                transition={{
                  duration: 0.5,
                  type: 'easeInOut',
                }}
                className={cn('flex-center relative', {
                  'order-2': mobileIsUp,
                })}
              >
                {coverUrl && !videoLoaded && <img src={coverUrl} alt={title} className="size-full object-contain" />}
                {videoUrl && (
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={cn('size-full object-contain', videoLoaded ? 'block' : 'hidden')}
                    onLoadedData={() => setVideoLoaded(true)}
                  />
                )}
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: mobileIsUp ? 30 : -30 },
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
                className={cn('flex cursor-pointer flex-col items-center whitespace-nowrap', {
                  'order-1': mobileIsUp,
                })}
              >
                <ArrowSVG
                  className={cn('size-2 rotate-180 fill-gray-350', {
                    'order-2 rotate-0': mobileIsUp,
                  })}
                />
                <p
                  className={cn('scale-50 text-xs/3 text-gray-350', {
                    'order-1': mobileIsUp,
                  })}
                >
                  {desc}
                </p>
              </motion.div>
            </motion.div>
          </a>
        </foreignObject>
      )}
    </AnimatePresence>
  );
}
