import { activeBookDotAtom, activeBookDotClickOpenAtom } from '@/atoms/engagement';
import { DEFAULT_PULSE_CONFIG, MapBookDotData, MOBILE_MAP_SCALE, PulseConfig } from '@/constants/engagement';
import { useEngagementClickPoint } from '@/hooks/engagement/useEngagementClickPoint';
import { useEngagementDotInfo } from '@/hooks/engagement/useEngagementDotInfo';
import { cn } from '@/utils';
import { useAtom, useAtomValue } from 'jotai';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import ArrowSVG from '@/../public/svgs/arrow.svg?component';
import BookSVG from '@/../public/svgs/engagement/book.svg?component';
import LinkSVG from '@/../public/svgs/engagement/link.svg?component';
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

/**
 * A book (translation) dot, one component for both decks (RWD-02; it was WorldMapBookDot and MobileWorldMapBookDot).
 * The mouse deck opens on hover and pins on click; the phone deck opens on tap, with its smaller dot and badge.
 */
export function WorldMapBookDotPoint({
  deck,
  dot,
  index,
  calcPoint,
}: {
  deck: MapDeck;
  dot: MapBookDotData;
  index: number;
  calcPoint: CalcPoint;
}) {
  const phone = deck === 'phone';
  const { title, lat, lng, pulseConfig } = dot;
  const [activeBookDotClickOpen, setActiveBookDotClickOpen] = useAtom(activeBookDotClickOpenAtom);
  const { isDarker, isOtherActive, isActive } = useEngagementDotInfo({
    id: `world-map-dot-book-${index}`,
    index,
    type: 'book',
  });
  const { handleClickPoint, handleMouseEnter, handleMouseLeave, activeBookDot } = useEngagementClickPoint();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phone) {
      handleClickPoint('book', index);
      if (!activeBookDotClickOpen) setActiveBookDotClickOpen(true);
      return;
    }
    if (!activeBookDotClickOpen) {
      setActiveBookDotClickOpen(true);
      handleClickPoint('book', index, true);
    } else {
      handleClickPoint('book', index);
    }
  };

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (activeBookDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-book-${index}`)) {
      handleMouseLeave(e, index, 'book');
    }
  };
  useEffect(() => {
    if (!phone && !activeBookDot) setActiveBookDotClickOpen(false);
  }, [phone, activeBookDot, setActiveBookDotClickOpen]);

  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);
  const pointRef = useRef<HTMLDivElement>(null);
  const { svgSize, centerRadius, color, pulse1, pulse2 }: PulseConfig = useMemo(
    () => pulseConfig || DEFAULT_PULSE_CONFIG,
    [pulseConfig],
  );

  return (
    <motion.div
      className={cn(
        `world-map-dot-book world-map-dot-book-${index}`,
        'pointer-events-auto absolute origin-[center_left] cursor-pointer overflow-visible',
        isActive && 'z-20',
      )}
      data-active={isActive ? 'true' : undefined}
      initial="initial"
      whileHover="active"
      onClick={handleClick}
      variants={pointVariants}
      animate={isActive ? 'active' : 'initial'}
      onMouseEnter={
        phone
          ? undefined
          : (e) => {
              if (activeBookDotClickOpen) return;
              handleMouseEnter(e, index, 'book');
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
          containerClassName={phone ? undefined : 'size-6'}
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
            {isActive && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 0.83 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={
                  phone
                    ? cn(
                        'relative flex items-center gap-0.5 rounded',
                        MOBILE_MAP_SCALE.badgePaddingClass,
                        MOBILE_MAP_SCALE.badgeTextClass,
                        'font-semibold text-data-sky',
                      )
                    : cn(BADGE_CLASS, 'bg-data-sky/20 text-data-sky')
                }
              >
                {phone && <BadgeBlurBg className="bg-data-sky/20" />}
                <BookSVG className={cn(phone ? MOBILE_MAP_SCALE.badgeIconSize : BADGE_ICON_CLASS, 'fill-data-cyan')} />
                Translation
              </motion.span>
            )}
          </AnimatePresence>
        </motion.p>
      </div>
    </motion.div>
  );
}

/**
 * The book card: it hangs from its dot as on the original, a little right of it (scrolled deck) or at it (phone).
 */
export function WorldMapBookDotContent({
  deck,
  dot,
  index,
  calcPoint,
}: {
  deck: MapDeck;
  dot: MapBookDotData;
  index: number;
  calcPoint: CalcPoint;
}) {
  const phone = deck === 'phone';
  const { title, desc, coverUrl, videoUrl, lat, lng, link, bookTitle, containerClass } = dot;
  const activeBookDot = useAtomValue(activeBookDotAtom);
  const { handleMouseLeave } = useEngagementClickPoint();
  const isActive = activeBookDot === index;
  const activeBookDotClickOpen = useAtomValue(activeBookDotClickOpenAtom);
  const { left, top } = useMemo(() => calcPoint(lat, lng), [calcPoint, lat, lng]);
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (link) {
      trackOutbound(link, 'outbound_click', {
        link_type: 'book',
        item_id: slugId(title),
        placement: 'presence_map',
      });
    }
  };

  const handleContentMouseLeave = (e: React.MouseEvent) => {
    if (phone || activeBookDotClickOpen) return;
    const relatedTarget = e.relatedTarget as Element;
    if (typeof relatedTarget?.closest === 'function' && !relatedTarget?.closest(`.world-map-dot-book-${index}`)) {
      handleMouseLeave(e, index, 'book');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <div
          className={cn(
            `world-map-dot-book-content world-map-dot-book-content-${index}`,
            'pointer-events-none absolute flex h-20 flex-col overflow-visible',
            phone ? 'z-30 translate-y-4' : 'z-20 -mt-2',
          )}
          style={{ left: `${left}px`, top: `${top}px` }}
        >
          <a
            href={link || undefined}
            target="_blank"
            rel="noreferrer"
            className={cn('pointer-events-auto', phone && '-mt-4')}
            onClick={onClick}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={cn(
                'absolute flex flex-col items-center overflow-hidden font-display',
                phone ? 'left-0 top-0 w-[9rem] pt-4' : 'left-2 top-5 w-[calc(var(--t)*15.5)] pt-6',
              )}
              onMouseLeave={handleContentMouseLeave}
            >
              <VideoWithPoster
                coverUrl={coverUrl}
                videoUrl={videoUrl}
                title={title}
                containerClass={phone ? cn('-mt-6', containerClass) : containerClass}
                coverClass={phone ? 'size-[8.5rem]' : undefined}
                videoClass={phone ? 'size-[8.5rem]' : undefined}
              />
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{
                  duration: DURATION.base,
                  ease: EASE.inOut,
                  delay: 0.2,
                }}
                className={cn('flex cursor-pointer flex-col items-center', phone ? '-mt-3 gap-2' : 'gap-4')}
              >
                <h4 className={cn('font-semibold capitalize text-white', phone ? 'text-xs/4' : 'text-2xl/7')}>
                  <span className={CARD_TEXT_BACKING}>{bookTitle}</span>
                </h4>
                <div className={cn('flex items-center', CARD_TEXT_BACKING)}>
                  <LinkSVG
                    className={cn(phone ? 'size-2' : 'size-[calc(var(--t)*1)]', 'fill-data-sky', { 'fill-tone-400': !link })}
                  />
                  <p
                    className={cn('ml-1 font-medium text-data-sky', phone ? 'whitespace-nowrap text-[8px]/3' : 'text-xs/3', {
                      'text-tone-400': !link,
                    })}
                  >
                    {desc}
                  </p>
                  <ArrowSVG
                    className={cn(phone ? 'size-2' : 'size-[calc(var(--t)*1)]', '-rotate-90 fill-data-sky', {
                      'fill-tone-400': !link,
                    })}
                  />
                </div>
              </motion.div>
            </motion.div>
          </a>
        </div>
      )}
    </AnimatePresence>
  );
}
