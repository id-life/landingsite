import { activeSponsorDotClickOpenAtom } from '@/atoms/engagement';
import { DEFAULT_PULSE_CONFIG, MapSponsorDotData, MOBILE_MAP_SCALE, PulseConfig } from '@/constants/engagement';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { memo, useMemo } from 'react';
import { MeetingSVG, SponsorSVG } from '../svg';
import { VideoWithPoster } from './VideoWithPoster';
import { BadgeBlurBg, PulseDot } from './WorldMapDotComponents';

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
  const { lat, lng, title, pulseConfig, mobileLat, mobileLng, sponsorText, extraText } = dot;
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

  const { left, top } = useMemo(
    () => calcPoint(mobileLat ?? lat, mobileLng ?? lng),
    [calcPoint, lat, lng, mobileLat, mobileLng],
  );

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
          containerClassName={MOBILE_MAP_SCALE.dotContainerSize}
          svgClassName={`${MOBILE_MAP_SCALE.dotSvgPosition} ${MOBILE_MAP_SCALE.dotSvgSize}`}
        />
        {/* 标签 */}
        <motion.p
          className={cn(
            'flex items-center whitespace-nowrap font-oxanium',
            MOBILE_MAP_SCALE.labelTextClass,
            'font-semibold capitalize text-white',
          )}
        >
          {title}
          <AnimatePresence>
            {isActive ? (
              <>
                {sponsorText === 'Conference' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 0.83 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={cn(
                      'relative flex items-center gap-0.5 rounded',
                      MOBILE_MAP_SCALE.badgePaddingClass,
                      MOBILE_MAP_SCALE.badgeTextClass,
                      'font-semibold text-purple',
                    )}
                  >
                    <BadgeBlurBg className="bg-purple/20" />
                    <MeetingSVG className={cn(MOBILE_MAP_SCALE.badgeIconSize, 'fill-purple')} />
                    Conference
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 0.83 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={cn(
                      'relative flex items-center gap-0.5 rounded',
                      MOBILE_MAP_SCALE.badgePaddingClass,
                      MOBILE_MAP_SCALE.badgeTextClass,
                      'font-semibold text-orange',
                    )}
                  >
                    <BadgeBlurBg className="bg-orange/20" />
                    <SponsorSVG className={cn(MOBILE_MAP_SCALE.badgeIconSize, 'fill-orange')} />
                    {sponsorText ?? 'Sponsorship'}
                  </motion.span>
                )}
                {extraText && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 0.83 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={cn(
                      'relative -ml-2 flex items-center gap-0.5 rounded',
                      MOBILE_MAP_SCALE.badgePaddingClass,
                      MOBILE_MAP_SCALE.badgeTextClass,
                      'font-semibold text-orange',
                    )}
                  >
                    <BadgeBlurBg className="bg-orange/20" />
                    <SponsorSVG className={cn(MOBILE_MAP_SCALE.badgeIconSize, 'fill-orange')} />
                    {extraText}
                  </motion.span>
                )}
              </>
            ) : null}
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
  calcPoint: (lat: number, lng: number) => { x: number; y: number; left: number; top: number };
}) {
  const { alt, link, coverUrl, videoUrl, lat, lng, mobileLat, mobileLng, title, extraSponsor } = dot;
  const { handleMouseLeave, activeSponsorDot } = useEngagementClickPoint();
  const isActive = activeSponsorDot === index;
  const activeSponsorDotClickOpen = useAtomValue(activeSponsorDotClickOpenAtom);
  const { left, top } = useMemo(
    () => calcPoint(mobileLat ?? lat, mobileLng ?? lng),
    [calcPoint, lat, lng, mobileLat, mobileLng],
  );

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
            'pointer-events-auto absolute z-30 flex h-20 translate-y-4 flex-col overflow-visible',
          )}
          style={{
            left: `${left}px`,
            top: `${top}px`,
          }}
        >
          <div className="flex items-center">
            <MobileSponsorItem
              key="sponsor-item-1"
              alt={alt}
              link={link}
              coverUrl={coverUrl}
              videoUrl={videoUrl}
              onMouseLeave={handleContentMouseLeave}
              onClick={handleLinkClick}
            />
            {extraSponsor ? (
              <MobileSponsorItem
                key="sponsor-item-2"
                alt={extraSponsor.alt}
                link={extraSponsor.link}
                coverUrl={extraSponsor.coverUrl}
                videoUrl={extraSponsor.videoUrl}
                onMouseLeave={handleContentMouseLeave}
                onClick={handleLinkClick}
                className="-ml-6"
              />
            ) : null}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

const MobileSponsorItem = memo(
  ({
    alt,
    link,
    coverUrl,
    videoUrl,
    onMouseLeave,
    onClick,
    className,
  }: {
    alt?: string;
    link?: string;
    coverUrl?: string;
    videoUrl?: string;
    onMouseLeave: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    className?: string;
  }) => {
    return (
      <a href={link} target="_blank" rel="noreferrer" className={cn('pointer-events-auto', className)} onClick={onClick}>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={cn(
            'clip-sponsor-content flex w-[10rem] origin-top-left flex-col items-center overflow-hidden font-oxanium',
          )}
          onMouseLeave={onMouseLeave}
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
            ease: 'easeInOut',
          }}
        >
          <VideoWithPoster
            coverUrl={coverUrl}
            videoUrl={videoUrl}
            title={alt}
            containerClass="-mt-4"
            videoClass="size-[8.5rem]"
            coverClass="size-[8.5rem]"
          />
          <h4 className="-mt-5 whitespace-pre-wrap text-center text-xs/4 font-semibold capitalize text-white">{alt}</h4>
        </motion.div>
      </a>
    );
  },
);

MobileSponsorItem.displayName = 'MobileSponsorItem';
