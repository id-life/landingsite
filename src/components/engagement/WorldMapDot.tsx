import { ACTIVE_DOT_SCALE } from '@/hooks/anim/cardFit';
import { activeMeetingDotClickOpenAtom } from '@/atoms/engagement';
import { DEFAULT_PULSE_CONFIG, MapDotData, MOBILE_MAP_SCALE, PulseConfig } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { MouseEvent, useEffect, useMemo, useRef } from 'react';
import {
  PulseDot,
  ConferenceBadges,
  VideoTalkButton,
  ContentSection,
  ExtraSponsorSection,
  ContentHotAreas,
  MobileConferenceBadgesWithVideo,
  MobileContentSection,
  MobileExtraSponsorSection,
  MAP_LABEL_CLASS,
  MapPointHit,
  type CalcPoint,
  type MapDeck,
} from './WorldMapDotComponents';
import { trackOutbound } from '@/lib/analytics/outbound';
import { track, slugId, youtubeId } from '@/lib/analytics/track';

const pointVariants: Variants = {
  initial: { scale: 1 },
  active: { scale: ACTIVE_DOT_SCALE },
};

/**
 * A meeting dot on the Presence map, one component for both decks (RWD-02; it was WorldMapDot and MobileWorldMapDot).
 * By deck: the mouse deck opens the card on hover and pins it on click, and shows the badges under the label; the
 * phone deck toggles on tap, uses its smaller dot and puts the Talk link among the badges (its card has no room).
 */
export function WorldMapDotPoint({
  deck,
  dot,
  index,
  calcPoint,
}: {
  deck: MapDeck;
  dot: MapDotData;
  index: number;
  calcPoint: CalcPoint;
}) {
  const phone = deck === 'phone';
  const { country, label, lat, lng, pulseConfig, isSponsor, isResearch, extraSponsor, videoUrl, title } = dot;
  const [activeMeetingDotClickOpen, setActiveMeetingDotClickOpen] = useAtom(activeMeetingDotClickOpenAtom);
  const { handleClickPoint, handleMouseEnter, activeMeetingDot } = useEngagementClickPoint();
  const { isDarker, isOtherActive, isActive } = useEngagementDotInfo({
    id: `world-map-dot-${index}`,
    index,
    type: 'meeting',
  });

  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);
  const pointRef = useRef<HTMLDivElement>(null);
  const { svgSize, centerRadius, color, pulse1, pulse2 }: PulseConfig = useMemo(
    () => pulseConfig || DEFAULT_PULSE_CONFIG,
    [pulseConfig],
  );
  const centerPoint = svgSize / 2;

  useEffect(() => {
    if (!phone && !activeMeetingDot) setActiveMeetingDotClickOpen(false);
  }, [phone, activeMeetingDot, setActiveMeetingDotClickOpen]);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (phone) {
      handleClickPoint('meeting', index);
      return;
    }
    setActiveMeetingDotClickOpen(!activeMeetingDotClickOpen);
    handleClickPoint('meeting', index, !activeMeetingDotClickOpen);
  };

  const handleVideoClick = (e: MouseEvent) => {
    e.stopPropagation();
    track('video_open', { video_id: videoUrl ? youtubeId(videoUrl) : slugId(title), placement: 'presence_map' });
  };

  const Label = phone ? motion.div : motion.p;
  return (
    <motion.div
      className={cn(
        `world-map-dot world-map-dot-${index}`,
        'pointer-events-auto absolute origin-[center_left] cursor-pointer overflow-visible',
        isActive && 'z-20',
      )}
      data-active={isActive ? 'true' : undefined}
      onClick={handleClick}
      onMouseEnter={
        phone
          ? undefined
          : (e) => {
              e.stopPropagation();
              if (activeMeetingDotClickOpen) return;
              handleMouseEnter(e, index, 'meeting');
            }
      }
      variants={pointVariants}
      animate={isActive ? 'active' : 'initial'}
      whileHover="active"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      {/* Hover hit area around the dot (mouse deck). */}
      {!phone && <div className="absolute -inset-5 cursor-pointer" />}
      <div
        className={cn(
          'flex items-center',
          !phone && 'gap-1',
          { 'map-dot-dim-soft': isOtherActive },
          { 'map-dot-dim-strong': isDarker },
        )}
      >
        <MapPointHit left={left} top={top} pointRef={pointRef} onClick={handleClick} />
        <PulseDot
          ref={pointRef}
          containerClassName={phone ? undefined : 'size-6'}
          svgSize={svgSize}
          centerPoint={centerPoint}
          centerRadius={centerRadius}
          color={color}
          pulse1={pulse1}
          pulse2={pulse2}
          isActive={isActive}
          svgClassName={phone ? `${MOBILE_MAP_SCALE.dotSvgPosition} ${MOBILE_MAP_SCALE.dotSvgSize}` : undefined}
        />
        <Label className={cn('flex flex-col items-start', MAP_LABEL_CLASS[deck])}>
          {label ? `${label}, ` : ''}
          {country}
          {phone ? (
            isActive && (
              <MobileConferenceBadgesWithVideo
                isSponsor={isSponsor}
                isResearch={isResearch}
                extraSponsor={extraSponsor}
                videoUrl={videoUrl}
                onVideoClick={handleVideoClick}
              />
            )
          ) : (
            <AnimatePresence>
              {isActive && <ConferenceBadges isSponsor={isSponsor} isResearch={isResearch} extraSponsor={extraSponsor} />}
            </AnimatePresence>
          )}
        </Label>
      </div>
    </motion.div>
  );
}

/** The meeting card (event photos), one component for both decks; the decks differ in layout (listed inline). */
export function WorldMapDotContent({
  deck,
  dot,
  index,
  calcPoint,
}: {
  deck: MapDeck;
  dot: MapDotData;
  index: number;
  calcPoint: CalcPoint;
}) {
  const phone = deck === 'phone';
  const {
    title,
    imgs,
    contentTransformClass,
    mobileContentTransformClass,
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
    extraSponsorContainerClassPc,
    extraSponsorContainerClassMobile,
    period,
  } = dot;
  const { activeMeetingDot, handleMouseLeave, handleClickPoint } = useEngagementClickPoint();
  const isActive = activeMeetingDot === index;
  const [activeMeetingDotClickOpen, setActiveMeetingDotClickOpen] = useAtom(activeMeetingDotClickOpenAtom);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);

  // While open, the photo strip scrolls without moving the page (overscroll-behavior alone is not enough).
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isActive) return;
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) e.preventDefault();
      e.stopPropagation();
    };
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, [isActive]);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setActiveMeetingDotClickOpen(!activeMeetingDotClickOpen);
    handleClickPoint('meeting', index, !activeMeetingDotClickOpen);
  };

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeMeetingDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-content-${index}`)) {
      handleMouseLeave(e, index, 'meeting');
    }
  };

  const handleLinkClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (link) {
      trackOutbound(link, 'outbound_click', {
        link_type: 'talk',
        item_id: slugId(`${label ? `${label}, ` : ''}${country}`),
        placement: 'presence_map',
      });
    }
  };

  const handleVideoClick = (e: MouseEvent) => {
    e.stopPropagation();
    track('video_open', { video_id: videoUrl ? youtubeId(videoUrl) : slugId(title), placement: 'presence_map' });
  };

  const Section = phone ? MobileContentSection : ContentSection;
  const Extra = phone ? MobileExtraSponsorSection : ExtraSponsorSection;
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <div
          className={cn(
            `world-map-dot-content world-map-dot-content-${index}`,
            'pointer-events-none absolute z-30 flex flex-col overflow-visible',
            // In the text unit (--t), so on tablets the card keeps the size its text has (the original's 1440 px size).
            'max-h-[calc(var(--t)*42.5)]',
          )}
          style={{ left: `${left}px`, top: `${top}px` }}
        >
          {/* Mouse deck: the hover-out area, the hot areas around the card and the Talk link beside it. */}
          {!phone && (
            <div
              className={cn(
                'absolute inset-0 top-4 -z-10 flex h-[70dvh] w-[calc(var(--t)*20.25)] origin-top-left flex-col items-center gap-4 font-display',
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
          )}
          <div
            className={cn(
              'absolute flex size-max origin-top-left items-center gap-4',
              phone ? '-inset-4 z-10 cursor-pointer' : 'inset-0 top-4',
              phone ? mobileContentTransformClass : contentTransformClass,
            )}
          >
            <Section
              title={title}
              period={period}
              imgs={imgs}
              link={link}
              scrollContainerRef={scrollContainerRef}
              onClick={handleLinkClick}
            />
            {secondTitle && (
              <Section title={secondTitle} period={period} imgs={secondImgs} link={link} onClick={handleLinkClick} />
            )}
            {extraSponsor && extraSponsor.length > 0 && (
              <div className={phone ? extraSponsorContainerClassMobile : extraSponsorContainerClassPc}>
                {extraSponsor.map((sponsor, sponsorIndex) => (
                  <Extra
                    key={sponsor.link || `extra-sponsor-${sponsorIndex}`}
                    extraSponsor={sponsor}
                    onClick={handleLinkClick}
                    className={phone ? cn('-right-[90%]', sponsor.classNameMobile) : sponsor.classNamePc}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
