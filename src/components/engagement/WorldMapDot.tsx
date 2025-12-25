import { activeMeetingDotClickOpenAtom } from '@/atoms/engagement';
import { DEFAULT_PULSE_CONFIG, MapDotData, PulseConfig } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { MouseEvent, useEffect, useMemo, useRef } from 'react';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';
import {
  PulseDot,
  ConferenceBadges,
  VideoTalkButton,
  ContentSection,
  ExtraSponsorSection,
  ContentHotAreas,
} from './WorldMapDotComponents';

const pointVariants: Variants = {
  initial: { scale: 1 },
  active: { scale: 1.2 },
};

export function WorldMapDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const { country, label, lat, lng, pulseConfig, isSponsor, extraSponsor } = dot;
  // const isClickOpenRef = useRef(false);
  const [activeMeetingDotClickOpen, setActiveMeetingDotClickOpen] = useAtom(activeMeetingDotClickOpenAtom);
  const { handleClickPoint, handleMouseEnter, activeMeetingDot } = useEngagementClickPoint();
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

  useEffect(() => {
    if (!activeMeetingDot) setActiveMeetingDotClickOpen(false);
  }, [activeMeetingDot, setActiveMeetingDotClickOpen]);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    if (!activeMeetingDotClickOpen) {
      setActiveMeetingDotClickOpen(true);
      handleClickPoint('meeting', index, true);
    } else {
      setActiveMeetingDotClickOpen(false);
      handleClickPoint('meeting', index, false);
    }
  };
  return (
    <motion.div
      className={cn(
        `world-map-dot world-map-dot-${index}`,
        'pointer-events-auto absolute origin-[center_left] cursor-pointer overflow-visible',
        isActive && 'z-20',
      )}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.stopPropagation();
        if (activeMeetingDotClickOpen) return;
        handleMouseEnter(e, index, 'meeting');
      }}
      variants={pointVariants}
      animate={isActive ? 'active' : 'initial'}
      whileHover="active"
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      <div className="absolute -inset-5 cursor-pointer" />
      <div className={cn('flex items-center gap-1', { 'opacity-50': isOtherActive }, { 'opacity-25': isDarker })}>
        {/* 中心红点和波纹 */}
        <PulseDot
          svgSize={svgSize}
          centerPoint={centerPoint}
          centerRadius={centerRadius}
          color={color}
          pulse1={pulse1}
          pulse2={pulse2}
          isActive={isActive}
        />
        {/* 标签 */}
        <motion.p className="-ml-1.5 flex flex-col items-start whitespace-nowrap font-oxanium text-base/6 font-semibold capitalize text-white">
          {label ? `${label}, ` : ''}
          {country}
          <AnimatePresence>
            {isActive && <ConferenceBadges isSponsor={isSponsor} extraSponsor={extraSponsor} />}
          </AnimatePresence>
        </motion.p>
      </div>
    </motion.div>
  );
}

export function WorldMapDotContent({
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
    contentTransformClass,
    period,
    lat,
    lng,
    pcDotHotAreaClass,
    link,
    label,
    country,
    videoUrl,
    secondImgs,
    secondTitle,
    extraSponsor,
  } = dot;
  const { activeMeetingDot, handleMouseLeave, handleClickPoint } = useEngagementClickPoint();
  const isActive = activeMeetingDot === index;
  const [activeMeetingDotClickOpen, setActiveMeetingDotClickOpen] = useAtom(activeMeetingDotClickOpenAtom);
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

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    if (!activeMeetingDotClickOpen) {
      setActiveMeetingDotClickOpen(true);
      handleClickPoint('meeting', index, true);
    } else {
      setActiveMeetingDotClickOpen(false);
      handleClickPoint('meeting', index, false);
    }
  };

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeMeetingDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    // 检查鼠标是否移出到非点区域
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-content-${index}`)) {
      handleMouseLeave(e, index, 'meeting');
    }
  };

  const handleLinkClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (link) {
      trackEvent({
        name: GA_EVENT_NAMES.PRESENCE_DETAIL,
        label: `${label ? `${label}, ` : ''}${country}`,
      });
    }
  };

  const handleVideoClick = (e: MouseEvent) => {
    e.stopPropagation();
    trackEvent({ name: GA_EVENT_NAMES.PRESENCE_TALK_VIDEO, label: title });
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
          {/* 移出判断热区 */}
          <div
            className={cn(
              'absolute inset-0 top-4 -z-10 flex h-[70dvh] w-[20.25rem] origin-top-left flex-col items-center gap-4 font-oxanium',
              contentTransformClass,
            )}
            onMouseLeave={handleContentMouseLeave}
          >
            <ContentHotAreas
              link={link}
              pcDotHotAreaClass={pcDotHotAreaClass}
              videoUrl={videoUrl}
              extraSponsor={extraSponsor}
              onClick={handleClick}
            />
            {videoUrl && <VideoTalkButton videoUrl={videoUrl} onClick={handleVideoClick} />}
          </div>
          <div className={cn('absolute inset-0 top-4 flex size-max origin-top-left items-center gap-4', contentTransformClass)}>
            <ContentSection
              title={title}
              period={period}
              imgs={imgs}
              link={link}
              scrollContainerRef={scrollContainerRef}
              onClick={handleLinkClick}
            />
            {secondTitle && (
              <ContentSection title={secondTitle} period={period} imgs={secondImgs} link={link} onClick={handleLinkClick} />
            )}
            {extraSponsor && <ExtraSponsorSection extraSponsor={extraSponsor} onClick={handleLinkClick} />}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
