import { activeSponsorDotClickOpenAtom } from '@/atoms/engagement';
import { DEFAULT_PULSE_CONFIG, MapSponsorDotData, MOBILE_MAP_SCALE, PulseConfig } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';
import { cn } from '@/utils';
import { useAtom, useAtomValue } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { memo, useEffect, useMemo, useRef, type ReactNode } from 'react';
import ResearchSVG from '@/../public/svgs/engagement/research.svg?component';
import MeetingSVG from '@/../public/svgs/engagement/meeting.svg?component';
import SponsorSVG from '@/../public/svgs/engagement/sponsor.svg?component';
import { VideoWithPoster } from './VideoWithPoster';
import {
  BADGE_CLASS,
  BADGE_ICON_CLASS,
  BadgeBlurBg,
  CARD_TEXT_BACKING,
  MAP_LABEL_CLASS,
  MapPointHit,
  PulseDot,
  type CalcPoint,
  type MapDeck,
} from './WorldMapDotComponents';
import { trackOutbound } from '@/lib/analytics/outbound';
import { slugId } from '@/lib/analytics/track';
import { DURATION, EASE } from '@/motion/tokens';

const pointVariants: Variants = {
  initial: { scale: 1 },
  active: { scale: 1.2 },
};

const badgeMotion = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 0.83 },
  exit: { opacity: 0, scale: 0.5 },
};

/** One badge of an open sponsor dot; the phone badge is smaller and blurs its own background layer. */
function SponsorBadge({
  deck,
  tone,
  icon,
  children,
}: {
  deck: MapDeck;
  tone: 'purple' | 'yellow' | 'orange';
  icon: ReactNode;
  children: ReactNode;
}) {
  const toneClass = { purple: 'text-data-purple', yellow: 'text-data-yellow', orange: 'text-data-orange' }[tone];
  // The phone's 12 px purple badge takes a 10 % tint (4.3:1 on 20 %, VIS-02); the 14 px desktop badges keep 20 %.
  const bgClass = {
    purple: deck === 'phone' ? 'bg-data-purple/10' : 'bg-data-purple/20',
    yellow: 'bg-data-yellow/20',
    orange: 'bg-data-orange/20',
  }[tone];
  if (deck === 'phone') {
    return (
      <motion.span
        {...badgeMotion}
        className={cn(
          'relative flex items-center gap-0.5 rounded',
          MOBILE_MAP_SCALE.badgePaddingClass,
          MOBILE_MAP_SCALE.badgeTextClass,
          'font-semibold',
          toneClass,
        )}
      >
        <BadgeBlurBg className={bgClass} />
        {icon}
        {children}
      </motion.span>
    );
  }
  return (
    <motion.span {...badgeMotion} className={cn(BADGE_CLASS, bgClass, toneClass)}>
      {icon}
      {children}
    </motion.span>
  );
}

/**
 * A sponsor dot, one component for both decks (RWD-02; it was WorldMapSponsorDot and MobileWorldMapSponsorDot). By
 * deck: hover and click-to-pin vs tap; the phone map may place the dot at its own coordinate (mobileLat / mobileLng)
 * and uses its smaller dot and badges.
 */
export function WorldMapSponsorDotPoint({
  deck,
  dot,
  index,
  calcPoint,
}: {
  deck: MapDeck;
  dot: MapSponsorDotData;
  index: number;
  calcPoint: CalcPoint;
}) {
  const phone = deck === 'phone';
  const {
    lat,
    lng,
    mobileLat,
    mobileLng,
    title,
    pulseConfig,
    isConference,
    conferenceText,
    isSponsor,
    sponsorText,
    isResearch,
    researchText,
  } = dot;
  const { handleClickPoint, handleMouseEnter, handleMouseLeave, activeSponsorDot } = useEngagementClickPoint();
  const [activeSponsorDotClickOpen, setActiveSponsorDotClickOpen] = useAtom(activeSponsorDotClickOpenAtom);
  const { isDarker, isOtherActive, isActive } = useEngagementDotInfo({
    id: `world-map-dot-sponsor-${index}`,
    index,
    type: 'sponsor',
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phone && !activeSponsorDotClickOpen) {
      setActiveSponsorDotClickOpen(true);
      handleClickPoint('sponsor', index, true);
    } else {
      handleClickPoint('sponsor', index);
    }
  };

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeSponsorDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-sponsor-${index}`)) {
      handleMouseLeave(e, index, 'sponsor');
    }
  };

  useEffect(() => {
    if (!phone && !activeSponsorDot) setActiveSponsorDotClickOpen(false);
  }, [phone, activeSponsorDot, setActiveSponsorDotClickOpen]);

  const pLat = phone ? (mobileLat ?? lat) : lat;
  const pLng = phone ? (mobileLng ?? lng) : lng;
  const { left, top } = useMemo(() => calcPoint(pLat, pLng), [calcPoint, pLat, pLng]);
  const pointRef = useRef<HTMLDivElement>(null);
  const { svgSize, centerRadius, color, pulse1, pulse2 }: PulseConfig = useMemo(
    () => pulseConfig || DEFAULT_PULSE_CONFIG,
    [pulseConfig],
  );
  const iconClass = phone ? MOBILE_MAP_SCALE.badgeIconSize : BADGE_ICON_CLASS;

  return (
    <motion.div
      className={cn(
        `world-map-dot-sponsor world-map-dot-sponsor-${index}`,
        'pointer-events-auto absolute origin-[center_left] cursor-pointer overflow-visible',
        isActive && 'z-20',
      )}
      data-active={isActive ? 'true' : undefined}
      initial="initial"
      whileHover="active"
      animate={isActive ? 'active' : 'initial'}
      onClick={handleClick}
      variants={pointVariants}
      onMouseEnter={
        phone
          ? undefined
          : (e) => {
              if (activeSponsorDotClickOpen) setActiveSponsorDotClickOpen(false);
              handleMouseEnter(e, index, 'sponsor');
            }
      }
      onMouseLeave={phone ? undefined : handleContentMouseLeave}
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div
        className={cn(
          'flex items-center',
          !phone && 'gap-1',
          { 'map-dot-dim-soft': isOtherActive },
          { 'map-dot-dim-strong': isDarker },
        )}
      >
        <MapPointHit left={left} top={top} pointRef={pointRef} onClick={handleClick} open={isActive} />
        <PulseDot
          ref={pointRef}
          containerClassName={phone ? MOBILE_MAP_SCALE.dotContainerSize : 'size-6'}
          svgSize={svgSize}
          centerPoint={svgSize / 2}
          centerRadius={centerRadius}
          color={color}
          pulse1={pulse1}
          pulse2={pulse2}
          isActive={isActive}
          svgClassName={phone ? `${MOBILE_MAP_SCALE.dotSvgPosition} ${MOBILE_MAP_SCALE.dotSvgSize}` : undefined}
        />
        <motion.p className={cn('flex items-center', MAP_LABEL_CLASS[deck])}>
          {title}
          <AnimatePresence>
            {isActive ? (
              <>
                {isConference ? (
                  <SponsorBadge deck={deck} tone="purple" icon={<MeetingSVG className={cn(iconClass, 'fill-data-purple')} />}>
                    {conferenceText ?? 'Conference'}
                  </SponsorBadge>
                ) : null}
                {isSponsor ? (
                  <SponsorBadge deck={deck} tone="yellow" icon={<SponsorSVG className={cn(iconClass, 'fill-data-yellow')} />}>
                    {sponsorText ?? 'Sponsorship'}
                  </SponsorBadge>
                ) : null}
                {isResearch && (
                  <SponsorBadge deck={deck} tone="orange" icon={<ResearchSVG className={cn(iconClass, 'fill-data-orange')} />}>
                    {researchText ?? 'Research'}
                  </SponsorBadge>
                )}
              </>
            ) : null}
          </AnimatePresence>
        </motion.p>
      </div>
    </motion.div>
  );
}

/** The sponsor logos of an open sponsor dot, one component for both decks (sizes by deck). */
export function WorldMapSponsorDotContent({
  deck,
  dot,
  index,
  calcPoint,
}: {
  deck: MapDeck;
  dot: MapSponsorDotData;
  index: number;
  calcPoint: CalcPoint;
}) {
  const phone = deck === 'phone';
  const { data, lat, lng, mobileLat, mobileLng, title } = dot;
  const { handleMouseLeave, activeSponsorDot } = useEngagementClickPoint();
  const isActive = activeSponsorDot === index;
  const activeSponsorDotClickOpen = useAtomValue(activeSponsorDotClickOpenAtom);
  const pLat = phone ? (mobileLat ?? lat) : lat;
  const pLng = phone ? (mobileLng ?? lng) : lng;
  const { left, top } = useMemo(() => calcPoint(pLat, pLng), [calcPoint, pLat, pLng]);
  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeSponsorDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-sponsor-${index}`)) {
      handleMouseLeave(e, index, 'sponsor');
    }
  };

  const handleLinkClick = (e: React.MouseEvent, link?: string) => {
    e.stopPropagation();
    if (link) {
      trackOutbound(link, 'outbound_click', {
        link_type: 'sponsor',
        item_id: slugId(title),
        placement: 'presence_map',
      });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <div
          className={cn(
            `world-map-dot-sponsor-content world-map-dot-sponsor-content-${index}`,
            'pointer-events-auto absolute z-30 flex h-20 flex-col overflow-visible',
            phone ? 'translate-y-4' : 'translate-y-5',
          )}
          style={{ left: `${left}px`, top: `${top}px` }}
        >
          <div className="flex items-center">
            {data.map((item, itemIndex) => (
              <SponsorItem
                key={`sponsor-item-${itemIndex}`}
                deck={deck}
                alt={item.alt}
                link={item.link}
                coverUrl={item.coverUrl}
                videoUrl={item.videoUrl}
                onMouseLeave={handleContentMouseLeave}
                onClick={(e) => handleLinkClick(e, item.link)}
                className={cn(itemIndex > 0 && (phone ? '-ml-6' : '-ml-2'), item.className)}
              />
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

const SponsorItem = memo(
  ({
    deck,
    alt,
    link,
    coverUrl,
    videoUrl,
    onMouseLeave,
    onClick,
    className,
  }: {
    deck: MapDeck;
    alt?: string;
    link?: string;
    coverUrl?: string;
    videoUrl?: string;
    onMouseLeave: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    className?: string;
  }) => {
    const phone = deck === 'phone';
    // Scrolled deck: in the text unit (--t), so on tablets the logo keeps its text's (the original's 1440 px) scale.
    const logo = phone ? 'size-[8.5rem]' : 'size-[calc(var(--t)*15.5)]';
    const content = (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={cn(
          'clip-sponsor-content flex origin-top-left flex-col items-center overflow-hidden font-display',
          phone ? 'w-[10rem]' : 'w-[calc(var(--t)*15.5)]',
        )}
        onMouseLeave={onMouseLeave}
        variants={{
          hidden: { opacity: 0, y: -10, transformOrigin: 'top left' },
          visible: { opacity: 1, y: 0, transformOrigin: 'top left' },
        }}
        transition={{
          staggerChildren: 0.05,
          duration: DURATION.base,
          ease: EASE.inOut,
        }}
      >
        <VideoWithPoster
          coverUrl={coverUrl}
          videoUrl={videoUrl}
          // The caption below names the sponsor in the same link, so the logo is decorative (axe image-redundant-alt).
          title=""
          containerClass={phone ? '-mt-4' : '-mt-5'}
          videoClass={logo}
          coverClass={logo}
        />
        <h4
          className={cn(
            '-mt-5 whitespace-pre-wrap text-center font-semibold capitalize text-white',
            phone ? 'text-xs/4' : 'text-2xl/7',
          )}
        >
          <span className={CARD_TEXT_BACKING}>{alt}</span>
        </h4>
      </motion.div>
    );

    if (!link) {
      return <div className={cn('pointer-events-auto', className)}>{content}</div>;
    }

    return (
      <a href={link} target="_blank" rel="noreferrer" className={cn('pointer-events-auto', className)} onClick={onClick}>
        {content}
      </a>
    );
  },
);

SponsorItem.displayName = 'SponsorItem';
