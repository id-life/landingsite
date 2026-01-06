import { DEFAULT_PULSE_CONFIG, MapDotData, MOBILE_MAP_SCALE, PulseConfig } from '@/constants/engagement';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { MouseEvent, useEffect, useMemo, useRef } from 'react';
import {
  MobileExtraSponsorSection,
  MobileConferenceBadgesWithVideo,
  MobileContentSection,
  PulseDot,
} from './WorldMapDotComponents';

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
  const { trackEvent } = useGA();
  const { country, label, lat, lng, pulseConfig, isSponsor, videoUrl, title, extraSponsor } = dot;
  const { handleClickPoint } = useEngagementClickPoint();
  const { isDarker, isOtherActive, isActive } = useEngagementDotInfo({
    id: `world-map-dot-${index}`,
    index,
    type: 'meeting',
  });

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

  const handleVideoClick = (e: MouseEvent) => {
    e.stopPropagation();
    trackEvent({ name: GA_EVENT_NAMES.PRESENCE_TALK_VIDEO, label: title });
  };

  return (
    <motion.div
      className={cn(
        `world-map-dot world-map-dot-${index}`,
        'pointer-events-auto absolute origin-[center_left] cursor-pointer overflow-visible',
        isActive && 'z-20',
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
      <div className={cn('flex items-center', { 'opacity-50': isOtherActive }, { 'opacity-25': isDarker })}>
        {/* 中心红点和波纹 */}
        <PulseDot
          svgSize={svgSize}
          centerPoint={centerPoint}
          centerRadius={centerRadius}
          color={color}
          pulse1={pulse1}
          pulse2={pulse2}
          isActive={isActive}
          svgClassName={`${MOBILE_MAP_SCALE.dotSvgPosition} ${MOBILE_MAP_SCALE.dotSvgSize}`}
        />
        {/* 标签 */}
        <motion.div
          className={cn(
            'flex flex-col items-start whitespace-nowrap font-oxanium',
            MOBILE_MAP_SCALE.labelTextClass,
            'font-semibold capitalize text-white',
          )}
        >
          {label ? `${label}, ` : ''}
          {country}
          {isActive && (
            <MobileConferenceBadgesWithVideo
              isSponsor={isSponsor}
              extraSponsor={extraSponsor}
              videoUrl={videoUrl}
              onVideoClick={handleVideoClick}
            />
          )}
        </motion.div>
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
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const {
    title,
    imgs,
    mobileContentTransformClass,
    period,
    lat,
    lng,
    link,
    label,
    country,
    secondImgs,
    secondTitle,
    extraSponsor,
  } = dot;
  const { activeMeetingDot } = useEngagementClickPoint();
  const isActive = activeMeetingDot === index;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { trackEvent } = useGA();

  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

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

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (link) {
      trackEvent({
        name: GA_EVENT_NAMES.PRESENCE_DETAIL,
        label: `${label ? `${label}, ` : ''}${country}`,
      });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <div
          className={cn(
            `world-map-dot-content world-map-dot-content-${index}`,
            'pointer-events-none absolute z-30 flex max-h-[42.5rem] flex-col overflow-visible',
          )}
          style={{
            left: `${left}px`,
            top: `${top}px`,
          }}
        >
          <div
            className={cn(
              'absolute -inset-4 z-10 flex size-max origin-top-left cursor-pointer items-center gap-4',
              mobileContentTransformClass,
            )}
          >
            <MobileContentSection
              title={title}
              period={period}
              imgs={imgs}
              link={link}
              scrollContainerRef={scrollContainerRef}
              onClick={handleLinkClick}
            />
            {secondTitle && (
              <MobileContentSection
                title={secondTitle}
                period={period}
                imgs={secondImgs}
                link={link}
                onClick={handleLinkClick}
              />
            )}
            {extraSponsor && (
              <MobileExtraSponsorSection extraSponsor={extraSponsor} onClick={handleLinkClick} className="-right-[90%]" />
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
