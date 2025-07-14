import { activeSponsorDotClickOpenAtom } from '@/atoms/engagement';
import { DEFAULT_PULSE_CONFIG, MapSponsorDotData, PulseConfig } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';
import { cn } from '@/utils';
import { useAtom, useAtomValue } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useEffect, useMemo } from 'react';
import { MeetingSVG, SponsorSVG } from '../svg';
import { VideoWithPoster } from './VideoWithPoster';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';

const pointVariants: Variants = {
  initial: { scale: 1 },
  active: { scale: 1.2 },
};

export function WorldMapSponsorDotPoint({
  dot,
  index,
  calcPoint,
}: {
  dot: MapSponsorDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const { lat, lng, title, pulseConfig, sponsorText } = dot;
  const { handleClickPoint, handleMouseEnter, handleMouseLeave, activeSponsorDot } = useEngagementClickPoint();
  const [activeSponsorDotClickOpen, setActiveSponsorDotClickOpen] = useAtom(activeSponsorDotClickOpenAtom);
  const { isDarker, isOtherActive, isActive } = useEngagementDotInfo({
    id: `world-map-dot-sponsor-${index}`,
    index,
    type: 'sponsor',
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    if (!activeSponsorDotClickOpen) {
      setActiveSponsorDotClickOpen(true);
      handleClickPoint('sponsor', index, true);
    } else {
      handleClickPoint('sponsor', index);
    }
  };

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeSponsorDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    // 检查鼠标是否移出到非点区域
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-sponsor-${index}`)) {
      handleMouseLeave(e, index, 'sponsor');
    }
  };

  useEffect(() => {
    if (!activeSponsorDot) setActiveSponsorDotClickOpen(false);
  }, [activeSponsorDot, setActiveSponsorDotClickOpen]);

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
        'pointer-events-auto absolute origin-[center_left] cursor-pointer overflow-visible',
        isActive && 'z-20',
      )}
      initial="initial"
      whileHover="active"
      animate={isActive ? 'active' : 'initial'}
      onClick={handleClick}
      variants={pointVariants}
      onMouseEnter={(e) => {
        if (activeSponsorDotClickOpen) setActiveSponsorDotClickOpen(false);
        handleMouseEnter(e, index, 'sponsor');
      }}
      onMouseLeave={handleContentMouseLeave}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      <div className={cn('flex items-center gap-1', { 'opacity-50': isOtherActive }, { 'opacity-25': isDarker })}>
        {/* 中心红点和波纹 */}
        <div className={cn('relative size-6', isActive ? 'overflow-visible' : 'overflow-hidden')}>
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
        <motion.p className="-ml-1.5 flex items-center whitespace-nowrap font-oxanium text-xl/6 font-semibold capitalize text-white">
          {title}
          <AnimatePresence>
            {isActive ? (
              sponsorText === 'Conference' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 0.83 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-1 rounded-lg bg-purple/20 p-1 px-2 py-1 text-base/5 font-semibold text-purple backdrop-blur-2xl"
                >
                  <MeetingSVG className="size-5 fill-purple" />
                  Conference
                </motion.div>
              ) : (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 0.83 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-1 rounded-lg bg-orange/20 p-1 px-2 py-1 text-base/5 font-semibold text-orange backdrop-blur-2xl"
                >
                  <SponsorSVG className="size-5 fill-orange" />
                  {sponsorText ?? 'Sponsorship'}
                </motion.span>
              )
            ) : null}
          </AnimatePresence>
        </motion.p>
      </div>
    </motion.div>
  );
}

export function WorldMapSponsorDotContent({
  dot,
  index,
  calcPoint,
}: {
  dot: MapSponsorDotData;
  index: number;
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const { alt, link, coverUrl, videoUrl, lat, lng, title } = dot;
  const { handleMouseLeave, activeSponsorDot } = useEngagementClickPoint();
  const isActive = activeSponsorDot === index;
  const activeSponsorDotClickOpen = useAtomValue(activeSponsorDotClickOpenAtom);
  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  const { trackEvent } = useGA();

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeSponsorDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    // 检查鼠标是否移出到非点区域
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-sponsor-${index}`)) {
      handleMouseLeave(e, index, 'sponsor');
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (link) {
      trackEvent({
        name: GA_EVENT_NAMES.PRESENCE_DETAIL,
        label: title,
      });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <div
          className={cn(
            `world-map-dot-sponsor-content world-map-dot-sponsor-content-${index}`,
            'pointer-events-auto absolute z-30 flex h-20 translate-y-5 flex-col overflow-visible',
          )}
          style={{
            left: `${left}px`,
            top: `${top}px`,
          }}
          // onClick={onClick}
        >
          <a href={link} target="_blank" rel="noreferrer" className="pointer-events-auto -mt-4" onClick={handleLinkClick}>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="clip-sponsor-content absolute left-0 top-0 flex w-[15.5rem] origin-top-left flex-col items-center overflow-hidden font-oxanium"
              onMouseLeave={handleContentMouseLeave}
              variants={{
                hidden: {
                  opacity: 0,
                  y: -10,
                  transformOrigin: 'top left',
                },
                visible: {
                  opacity: 1,
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
                containerClass="-mt-5"
                videoClass="size-[15.5rem]"
                coverClass="size-[15.5rem]"
              />
              <h4 className="-mt-5 whitespace-pre-wrap text-center text-2xl/7 font-semibold capitalize text-white">{alt}</h4>
            </motion.div>
          </a>
        </div>
      )}
    </AnimatePresence>
  );
}
