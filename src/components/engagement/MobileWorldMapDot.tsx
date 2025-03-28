import { DEFAULT_PULSE_CONFIG, MapDotData, PulseConfig } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { cn } from '@/utils';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import { MeetingSVG } from '../svg';
import FeatherImg from './FeatherImg';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';

const pointVariants: Variants = {
  initial: { scale: 1 },
  active: { scale: 1.2 },
};

export function MobileWorldMapDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const { country, label, lat, lng, pulseConfig } = dot;
  const { handleClickPoint } = useEngagementClickPoint();
  const { isDarker, isOtherActive, isActive } = useEngagementDotInfo({ id: `world-map-dot-${index}`, index, type: 'meeting' });

  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  // 使用自定义配置或默认配置
  const { svgSize, centerRadius, color, pulse1, pulse2 }: PulseConfig = useMemo(
    () => pulseConfig || DEFAULT_PULSE_CONFIG,
    [pulseConfig],
  );

  // 计算SVG中心点
  const centerPoint = useMemo(() => svgSize / 2, [svgSize]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    handleClickPoint('meeting', index);
  };

  return (
    <motion.div
      className={cn(
        `world-map-dot world-map-dot-${index}`,
        'pointer-events-auto absolute z-20 origin-[center_left] cursor-pointer overflow-visible',
      )}
      onClick={handleClick}
      variants={pointVariants}
      animate={isActive ? 'active' : 'initial'}
      whileHover="active"
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
        <motion.p className="flex flex-col items-start whitespace-nowrap font-oxanium text-base/5 font-semibold capitalize text-white">
          {label ? `${label}, ` : ''}
          {country}
          <AnimatePresence>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 0.83 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-[calc(100%_+_0.25rem)] flex items-center gap-1 rounded-lg bg-purple/20 p-1 px-2 py-1 text-sm/4 font-semibold text-purple backdrop-blur-2xl"
              >
                <MeetingSVG className="size-5 fill-purple" />
                Conference
              </motion.span>
            )}
          </AnimatePresence>
        </motion.p>
      </div>
    </motion.div>
  );
}

export function MobileWorldMapDotContent({
  dot,
  index,
  calcPoint,
}: {
  dot: MapDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number };
}) {
  const { title, imgs, contentTransformStyle, period, lat, lng } = dot;
  const { activeMeetingDot } = useEngagementClickPoint();
  const isActive = activeMeetingDot === index;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const point = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  // 打开时禁用弹窗内的滚动, overscroll-none 不顶用
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isActive) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // 滚动到边界时阻止默认行为
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }

      // 无论如何都阻止冒泡
      e.stopPropagation();
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [isActive]);

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
          >
            <div className="pointer-events-auto absolute -inset-10"></div>
            <div className={cn('pointer-events-auto absolute -right-72 left-[90%] h-28')}></div>
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
              <div
                ref={scrollContainerRef}
                className="hide-scrollbar pointer-events-auto flex grow flex-col overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_0%,white_75%,transparent)]"
              >
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
