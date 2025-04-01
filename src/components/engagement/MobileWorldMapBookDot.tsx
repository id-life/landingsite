import { activeBookDotAtom, activeBookDotClickOpenAtom } from '@/atoms/engagement';
import { DEFAULT_PULSE_CONFIG, MapBookDotData, PulseConfig } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { cn } from '@/utils';
import { useAtom, useAtomValue } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useCallback, useMemo } from 'react';
import { ArrowSVG, BookSVG } from '../svg';
import { VideoWithPoster } from './VideoWithPoster';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';

const pointVariants: Variants = {
  initial: { scale: 1 },
  active: { scale: 1.2 },
};

export function MobileWorldMapBookDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapBookDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const { title, lat, lng, pulseConfig } = dot;
  const [activeBookDotClickOpen, setActiveBookDotClickOpen] = useAtom(activeBookDotClickOpenAtom);
  const { isDarker, isOtherActive, isActive } = useEngagementDotInfo({
    id: `world-map-dot-book-${index}`,
    index,
    type: 'book',
  });
  const { handleClickPoint } = useEngagementClickPoint();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    handleClickPoint('book', index);
    if (!activeBookDotClickOpen) setActiveBookDotClickOpen(true);
  };

  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  // 使用自定义配置或默认配置
  const { svgSize, centerRadius, color, pulse1, pulse2 }: PulseConfig = useMemo(
    () => pulseConfig || DEFAULT_PULSE_CONFIG,
    [pulseConfig],
  );

  // 计算SVG中心点
  const centerPoint = useMemo(() => svgSize / 2, [svgSize]);

  return (
    <motion.div
      className={cn(
        `world-map-dot-book world-map-dot-book-${index} `,
        'pointer-events-auto absolute z-20 origin-[center_left] cursor-pointer overflow-visible',
      )}
      initial="initial"
      whileHover="active"
      onClick={handleClick}
      variants={pointVariants}
      animate={isActive ? 'active' : 'initial'}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      <div className={cn('flex items-center gap-1', { 'opacity-50': isOtherActive }, { 'opacity-25': isDarker })}>
        {/* 中心红点和波纹 */}
        <div className="relative size-6 overflow-visible">
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className="absolute -left-full -top-full size-18"
          >
            <circle cx={centerPoint} cy={centerPoint} r={centerRadius} fill={color} />
            {isActive && (
              <>
                {/* 使用SVG animate元素来创建平滑的波纹效果 */}
                <circle cx={centerPoint} cy={centerPoint} r={pulse1.fromRadius} fill={color} opacity="0.5">
                  <animate
                    attributeName="r"
                    from={pulse1.fromRadius}
                    to={pulse1.toRadius}
                    dur={`${pulse1.duration}s`}
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur={`${pulse1.duration}s`}
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={centerPoint}
                  cy={centerPoint}
                  r={pulse2.fromRadius}
                  stroke={color}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from={pulse2.fromRadius}
                    to={pulse2.toRadius}
                    dur={`${pulse2.duration}s`}
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur={`${pulse2.duration}s`}
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
          </svg>
        </div>
        {/* 标签 */}
        <motion.p className="flex items-center whitespace-nowrap font-oxanium text-xl/6 font-semibold capitalize text-white">
          {title}
          <AnimatePresence>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 0.83 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-1 rounded-lg bg-cyan/20 p-1 text-sm/4 font-semibold text-cyan backdrop-blur-2xl"
              >
                <BookSVG className="size-4 fill-cyan" />
                Translation
              </motion.span>
            )}
          </AnimatePresence>
        </motion.p>
      </div>
    </motion.div>
  );
}

export function MobileWorldMapBookDotContent({
  dot,
  index,
  calcPoint,
}: {
  dot: MapBookDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const { title, desc, coverUrl, videoUrl, lat, lng, link, bookTitle } = dot;
  const [activeBookDot] = useAtom(activeBookDotAtom);
  const isActive = activeBookDot === index;
  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

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
        <div
          className={cn(
            `world-map-dot-book-content world-map-dot-book-content-${index} pointer-events-none`,
            'absolute z-30 flex h-20 translate-y-4 flex-col overflow-visible',
          )}
          style={{
            left: `${left}px`,
            top: `${top}px`,
          }}
          onClick={onClick}
        >
          <a href={link} target="_blank" rel="noreferrer" className="pointer-events-auto -mt-4">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={cn('absolute left-0 top-0 flex w-[13.75rem] flex-col items-center overflow-hidden pt-4 font-oxanium')}
            >
              <VideoWithPoster
                coverUrl={coverUrl}
                videoUrl={videoUrl}
                title={title}
                containerClass="-mt-6"
                coverClass="size-[13.75rem]"
                videoClass="size-[13.75rem]"
              />
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
                className="-mt-3 flex cursor-pointer flex-col items-center gap-1"
              >
                <h4 className="text-base/5 font-semibold capitalize text-white">{bookTitle}</h4>
                <ArrowSVG className="mt-1 size-4 rotate-180 fill-gray-350" />
                <p className="text-xs/3 text-gray-350">{desc}</p>
              </motion.div>
            </motion.div>
          </a>
        </div>
      )}
    </AnimatePresence>
  );
}
