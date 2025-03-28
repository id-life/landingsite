import { activeSponsorDotClickOpenAtom } from '@/atoms/engagement';
import { DEFAULT_PULSE_CONFIG, MapSponsorDotData, PulseConfig } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useMemo } from 'react';
import { SponsorSVG } from '../svg';
import { VideoWithPoster } from './VideoWithPoster';

const pointVariants: Variants = {
  initial: { scale: 1 },
  active: { scale: 1.2 },
};
export function MobileWorldMapSponsorDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapSponsorDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const { lat, lng, title, pulseConfig } = dot;
  const { handleClickPoint } = useEngagementClickPoint();
  const { isDarker, isOtherActive, isActive } = useEngagementDotInfo({
    id: `world-map-dot-sponsor-${index}`,
    index,
    type: 'sponsor',
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    handleClickPoint('sponsor', index);
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
        `world-map-dot-sponsor world-map-dot-sponsor-${index}`,
        'pointer-events-auto absolute z-20 origin-[center_left] cursor-pointer overflow-visible',
      )}
      initial="initial"
      whileHover="active"
      animate={isActive ? 'active' : 'initial'}
      onClick={handleClick}
      variants={pointVariants}
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
        <motion.p className="flex items-center whitespace-nowrap font-oxanium text-base/5 font-semibold capitalize text-white">
          {title}
          <AnimatePresence>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 0.83 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-1 rounded-lg bg-orange/20 p-1 px-2 py-1 text-sm/4 font-semibold text-orange backdrop-blur-2xl"
              >
                <SponsorSVG className="size-5 fill-orange" />
                Sponsorship
              </motion.span>
            )}
          </AnimatePresence>
        </motion.p>
      </div>
    </motion.div>
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
  const { handleMouseLeave, activeSponsorDot } = useEngagementClickPoint();
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
          y={point.y + 6}
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
              'clip-sponsor-content absolute left-0 top-2 flex w-[15.5rem] origin-top-left flex-col items-center overflow-hidden font-oxanium',
              containerClass,
            )}
            onMouseLeave={handleContentMouseLeave}
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
            <VideoWithPoster
              coverUrl={coverUrl}
              videoUrl={videoUrl}
              title={alt}
              containerClass="-mt-8"
              videoClass="size-[15.5rem]"
              coverClass="size-[15.5rem]"
            />
            <h4 className="-mt-5 whitespace-pre-wrap text-center text-2xl/7 font-semibold capitalize text-white">{alt}</h4>
          </motion.div>
          {/* </a> */}
        </foreignObject>
      )}
    </AnimatePresence>
  );
}
