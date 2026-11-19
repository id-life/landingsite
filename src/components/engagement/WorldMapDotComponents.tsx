import ResearchSVG from '@/../public/svgs/engagement/research.svg?component';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import { MOBILE_MAP_SCALE } from '@/constants/engagement';
import { cn } from '@/utils';
import { motion } from 'motion/react';
import {
  createContext,
  MouseEvent,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
  type Ref,
  type RefObject,
} from 'react';
import { cutTapSquare, polygonClipPath, type Point } from './tapCut';
import { createPortal } from 'react-dom';
import ArrowSVG from '@/../public/svgs/arrow.svg?component';
import MeetingSVG from '@/../public/svgs/engagement/meeting.svg?component';
import SponsorSVG from '@/../public/svgs/engagement/sponsor.svg?component';
import FeatherImg from './FeatherImg';
import { VideoWithPoster } from './VideoWithPoster';
import { DURATION, EASE } from '@/motion/tokens';
import { useReducedMotionPref } from '@/motion/preference';

// ============================================================================
// Shared Components (Desktop & Mobile)
// ============================================================================

/** Which deck the map is drawn for (RWD-02): the scrolled mouse/tablet deck or the paged phone deck. */
export type MapDeck = 'desktop' | 'phone';
export type CalcPoint = (lat: number, lng: number) => { x: number; y: number; left: number; top: number };

/** Map labels at the original's sizes: scaled with the layout on the scrolled deck, 8 px on the phone map. */
export const MAP_LABEL_CLASS: Record<MapDeck, string> = {
  desktop: 'map-label -ml-1.5 whitespace-nowrap font-display text-base/6 font-semibold capitalize text-white',
  phone:
    'map-label whitespace-nowrap font-display text-[8px]/[12px] phoneScaled:text-[0.5rem]/[0.75rem] font-semibold capitalize text-white',
};

/**
 * RWD-06: on coarse pointers a map point is hit within 44 x 44 px around it; its box and look are the original's. The
 * 44 px area is not on the dot itself: an area on a dot lies on top of the dots drawn before it, and centred on the dot
 * with its label (the tap-area utility it had) it ran the label's full width, so on the phone Berkeley's point was
 * under Lifespan Research Institute's area (24 of 31 reads) and a tap on it opened the other card.
 *
 * The layer under the map's dots that holds their 44 px tap areas (MapPointHit): it comes before every dot, so a drawn
 * point or label is always above any tap area and is hit where it is drawn; an area only takes the taps around a point
 * that land on nothing else.
 */
export type MapHitLayer = {
  /** The layer the tap areas are portalled into. */
  layer: HTMLElement | null;
  /**
   * The phone strip's layer above every dot and label and below every card (z 25: an open dot is z 20, a card z 30):
   * each drawn point's own circle is a tap target there, so a tap on a drawn point reaches that point even in the
   * instant the tour opens a neighbour, whose dot rises (z 20, scale 1.2) and whose icon or label then lies over the
   * point (London's icon over Aix's and Oxford's points, Aix's label over Lustica's). Null on the laptop deck.
   */
  pointLayer?: HTMLElement | null;
  /** Every point's centre in the map, by tap area, so each area can be cut at the half-way line to its neighbours. */
  centres: Readonly<Record<string, Point>>;
  register: (id: string, centre: Point | null) => void;
};
export const MapHitLayerContext = createContext<MapHitLayer>({
  layer: null,
  pointLayer: null,
  centres: {},
  register: () => {},
});

/**
 * A point's 44 x 44 px tap area, centred on the drawn point, in the hit layer under every dot (coarse pointers only).
 * left/top are the dot's place in the map; pointRef is the point's box (PulseDot), read for its centre in the dot.
 * Where a neighbour's square overlaps it, the square is cut at the half-way line to that neighbour (cutTapSquare), so a
 * tap between two points goes to the nearer one instead of to the one drawn later.
 */
export function MapPointHit({
  left,
  top,
  pointRef,
  onClick,
  open = false,
}: {
  left: number;
  top: number;
  pointRef: RefObject<HTMLDivElement | null>;
  onClick: (e: MouseEvent) => void;
  /** The dot is open: it is drawn above every other dot, so its own point needs no target above it. */
  open?: boolean;
}) {
  const { layer, pointLayer, centres, register } = useContext(MapHitLayerContext);
  const id = useId();
  const [centre, setCentre] = useState<Point | null>(null);
  // The drawn circle's radius, for the point target (the circle itself, not more).
  const [radius, setRadius] = useState(0);
  useLayoutEffect(() => {
    const point = pointRef.current;
    if (!point) return;
    // The drawn point's centre (its first circle), from the dot's own box: the point's box is 2 px off it on the phone.
    // A dot scaled up while open would skew the reading, so the box is read only from a dot at rest (scale 1).
    const dot = point.offsetParent as HTMLElement | null;
    const circle = point.querySelector('circle');
    const dotBox = dot?.getBoundingClientRect();
    const circleBox = circle?.getBoundingClientRect();
    const atRest = dot && dotBox && Math.abs(dotBox.width - dot.offsetWidth) < 0.5;
    if (atRest && circleBox && circleBox.width > 0) {
      setRadius(circleBox.width / 2);
      setCentre([
        left + circleBox.left + circleBox.width / 2 - dotBox.left,
        top + circleBox.top + circleBox.height / 2 - dotBox.top,
      ]);
      return;
    }
    setCentre([left + point.offsetLeft + point.offsetWidth / 2, top + point.offsetTop + point.offsetHeight / 2]);
  }, [left, top, pointRef]);
  useEffect(() => {
    register(id, centre);
    return () => register(id, null);
  }, [id, centre, register]);
  const clipPath = useMemo(() => {
    if (!centre) return undefined;
    const others = Object.entries(centres)
      .filter(([key]) => key !== id)
      .map(([, c]) => c);
    const cut = cutTapSquare(centre, others, 22);
    return cut ? polygonClipPath(cut) : undefined;
  }, [centre, centres, id]);
  if (!layer || !centre) return null;
  return (
    <>
      {createPortal(
        <span
          aria-hidden
          className="pointer-events-auto absolute hidden size-[44px] -translate-x-1/2 -translate-y-1/2 cursor-pointer coarse:block"
          style={{ left: `${centre[0]}px`, top: `${centre[1]}px`, clipPath }}
          onClick={onClick}
        />,
        layer,
      )}
      {pointLayer &&
        radius > 0 &&
        !open &&
        createPortal(
          <span
            aria-hidden
            className="pointer-events-auto absolute hidden -translate-x-1/2 -translate-y-1/2 rounded-full coarse:block"
            style={{ left: `${centre[0]}px`, top: `${centre[1]}px`, width: `${2 * radius}px`, height: `${2 * radius}px` }}
            onClick={onClick}
          />,
          pointLayer,
        )}
    </>
  );
}

/** A badge under an open dot's label (Conference, Sponsorship, Research, Translation) on the scrolled deck. */
export const BADGE_CLASS =
  'flex items-center gap-1 whitespace-nowrap rounded-lg p-1 px-2 py-1 text-base/5 font-semibold backdrop-blur-2xl';
/**
 * The text of an open card sits on the section background, so the card occludes the dimmed labels under it instead of
 * mixing with them (the Oxford sponsor titles crossed "Abu Dhabi, UAE" at 2.9:1). Inline, so only the glyph lines are
 * backed.
 */
export const CARD_TEXT_BACKING = 'bg-background box-decoration-clone px-1';
/** Badge icons in the text unit (--t), so they keep their size beside the text on every tier. */
export const BADGE_ICON_CLASS = 'size-[calc(var(--t)*1.25)]';

// Badge blur background layer
// Note: Parent elements must not have active CSS animations (e.g., animate-fade-in)
// as they create stacking contexts that break backdrop-filter
export function BadgeBlurBg({ className }: { className?: string }) {
  return <div className={cn('absolute inset-0 -z-10 rounded backdrop-blur-2xl', className)} />;
}

// Pulsing dot SVG animation with center point and ripple effects
export function PulseDot({
  svgSize,
  centerPoint,
  centerRadius,
  color,
  pulse1,
  pulse2,
  isActive,
  containerClassName,
  svgClassName = 'absolute -left-full -top-full size-18',
  ref,
  tapOnDrawn = false,
}: {
  svgSize: number;
  centerPoint: number;
  centerRadius: number;
  color: string;
  pulse1: { fromRadius: number; toRadius: number; duration: number };
  pulse2: { fromRadius: number; toRadius: number; duration: number };
  isActive?: boolean;
  containerClassName?: string;
  svgClassName?: string;
  /** The point's box, for its tap area (MapPointHit). */
  ref?: Ref<HTMLDivElement>;
  /** Phone: only the drawn circle takes a tap; the point's 20 px box and the 56 px svg around it let it through. */
  tapOnDrawn?: boolean;
}) {
  // Reduced motion (MOT-02): the pulse rings hold still.
  const reduced = useReducedMotionPref();
  return (
    <div
      ref={ref}
      className={cn(
        'pulse-dot relative',
        tapOnDrawn && 'pointer-events-none',
        containerClassName ?? MOBILE_MAP_SCALE.dotContainerSize,
        isActive ? 'overflow-visible' : 'overflow-hidden',
      )}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className={svgClassName}>
        <circle
          cx={centerPoint}
          cy={centerPoint}
          r={centerRadius}
          fill={color}
          style={tapOnDrawn ? { pointerEvents: 'auto' } : undefined}
        />
        {isActive && (
          <>
            {/* 使用SVG animate元素来创建平滑的波纹效果 */}
            <circle cx={centerPoint} cy={centerPoint} r={pulse1.fromRadius} fill={color} opacity="0.5">
              {!reduced && (
                <animate
                  attributeName="r"
                  from={pulse1.fromRadius}
                  to={pulse1.toRadius}
                  dur={`${pulse1.duration}s`}
                  begin="0s"
                  repeatCount="indefinite"
                />
              )}
              {!reduced && (
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur={`${pulse1.duration}s`}
                  begin="0s"
                  repeatCount="indefinite"
                />
              )}
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
              {!reduced && (
                <animate
                  attributeName="r"
                  from={pulse2.fromRadius}
                  to={pulse2.toRadius}
                  dur={`${pulse2.duration}s`}
                  begin="0s"
                  repeatCount="indefinite"
                />
              )}
              {!reduced && (
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur={`${pulse2.duration}s`}
                  begin="0s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}

// ============================================================================
// Desktop Components
// ============================================================================

// Conference and Sponsor badges that appear on hover
export function ConferenceBadges({
  isSponsor,
  isResearch,
  extraSponsor,
}: {
  isSponsor?: boolean;
  isResearch?: boolean;
  extraSponsor?: { alt: string; coverUrl: string; videoUrl: string; link: string }[];
}) {
  return (
    <motion.div className="absolute -left-0.5 top-[calc(100%_+_0.25rem)] flex items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 0.83 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={cn(BADGE_CLASS, 'bg-data-purple/20 text-data-purple')}
      >
        <MeetingSVG className={cn(BADGE_ICON_CLASS, 'fill-data-purple')} />
        Conference
      </motion.div>
      {(isSponsor || (extraSponsor && extraSponsor.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 0.83 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className={cn(BADGE_CLASS, '-ml-1.5 bg-data-yellow/20 text-data-yellow')}
        >
          <SponsorSVG className={cn(BADGE_ICON_CLASS, 'fill-data-yellow')} />
          Sponsorship
        </motion.div>
      )}
      {isResearch && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 0.83 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className={cn(BADGE_CLASS, '-ml-1.5 bg-data-orange/20 text-data-orange')}
        >
          <ResearchSVG className={cn(BADGE_ICON_CLASS, 'fill-data-orange')} />
          Research
        </motion.div>
      )}
    </motion.div>
  );
}

// Talk video button that appears in the content popup
export function VideoTalkButton({ videoUrl, onClick }: { videoUrl: string; onClick: (e: MouseEvent) => void }) {
  return (
    <motion.a
      href={videoUrl}
      target="_blank"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 0.85 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="pointer-events-auto absolute -left-[calc(100%_-_3.75rem)] top-[calc(22dvh_+_5rem)] z-10 flex cursor-pointer flex-col items-center"
    >
      <div className="clip-talk-content bg-white p-0.5">
        <div className="clip-talk-content flex items-center gap-1 bg-tone-970 px-3.5 py-2.5 [--clip-offset:.75rem]">
          <YoutubeSVG className={cn(BADGE_ICON_CLASS, 'fill-white')} />
          <span className="inline-block text-base/5 font-semibold text-white">Talk</span>
          <ArrowSVG className="size-[calc(var(--t)*1)] -rotate-90 fill-white" />
        </div>
      </div>
    </motion.a>
  );
}

// Main or secondary content section with images
export function ContentSection({
  title,
  period,
  imgs,
  link,
  scrollContainerRef,
  onClick,
}: {
  title?: string;
  period?: string;
  imgs?: { src: string; alt: string }[];
  link?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  onClick: (e: MouseEvent) => void;
}) {
  const content = (
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
          height: '70dvh',
        },
      }}
      transition={{
        staggerChildren: 0.1,
        duration: DURATION.base,
        ease: EASE.inOut,
      }}
      className={cn('flex h-full w-[calc(var(--t)*20.25)] origin-top-left flex-col items-center gap-4 font-display')}
    >
      {title && (
        <h3 className="whitespace-nowrap text-center text-xl/6 font-semibold capitalize text-white">
          <span className={cn('mr-2 whitespace-pre-wrap', CARD_TEXT_BACKING)}>{title}</span>
          {/*{period}*/}
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
  );

  if (!link) {
    return <div className="pointer-events-auto">{content}</div>;
  }

  return (
    <a href={link} target="_blank" className="pointer-events-auto" onClick={onClick}>
      {content}
    </a>
  );
}

// Extra sponsor section with video
export function ExtraSponsorSection({
  extraSponsor,
  onClick,
  className,
}: {
  extraSponsor: {
    alt: string;
    coverUrl: string;
    videoUrl: string;
    link: string;
  };
  onClick: (e: MouseEvent) => void;
  className?: string;
}) {
  const content = (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="flex w-[calc(var(--t)*17)] origin-top-left flex-col items-center overflow-visible font-display"
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
        duration: DURATION.base,
        ease: EASE.inOut,
      }}
    >
      <h4 className="-mx-10 whitespace-pre-wrap text-center text-xl/6 font-semibold capitalize text-white">
        <span className={CARD_TEXT_BACKING}>{extraSponsor.alt}</span>
      </h4>
      <VideoWithPoster
        coverUrl={extraSponsor.coverUrl}
        videoUrl={extraSponsor.videoUrl}
        // The heading above names the sponsor in the same link, so the logo is decorative (axe image-redundant-alt).
        title=""
        containerClass="-mt-5"
        videoClass="size-[calc(var(--t)*15.5)]"
        coverClass="size-[calc(var(--t)*15.5)]"
      />
    </motion.div>
  );

  if (!extraSponsor.link) {
    return <div className={cn('pointer-events-auto absolute -right-[90%] top-0 overflow-visible', className)}>{content}</div>;
  }

  return (
    <a
      href={extraSponsor.link}
      target="_blank"
      rel="noreferrer"
      className={cn('pointer-events-auto absolute -right-[90%] top-0 overflow-visible', className)}
      onClick={onClick}
    >
      {content}
    </a>
  );
}

// Hot areas for click/hover interactions
export function ContentHotAreas({
  link,
  pcDotHotAreaClass,
  videoUrl,
  extraSponsor,
  onClick,
}: {
  link?: string;
  pcDotHotAreaClass?: string;
  videoUrl?: string;
  extraSponsor?: { alt: string; coverUrl: string; videoUrl: string; link: string }[];
  onClick: (e: MouseEvent) => void;
}) {
  return (
    <>
      {link ? (
        <a
          href={link}
          target="_blank"
          className="pointer-events-auto absolute -inset-4 bottom-auto z-10 h-[38dvh] cursor-pointer"
        ></a>
      ) : null}
      <div className="pointer-events-auto absolute -inset-10 cursor-pointer"></div>
      <div
        className={cn('pointer-events-auto absolute -right-80 left-full h-20', pcDotHotAreaClass, {
          'top-[22dvh] h-36': videoUrl,
        })}
        onClick={onClick}
      ></div>
      {extraSponsor?.map((sponsor, sponsorIndex) =>
        sponsor.link ? (
          <a
            key={sponsor.link || `extra-sponsor-${sponsorIndex}`}
            href={sponsor.link}
            target="_blank"
            className="pointer-events-auto absolute -right-[90%] top-0 h-[40dvh] w-[calc(var(--t)*17)] cursor-pointer"
          ></a>
        ) : null,
      )}
    </>
  );
}

// ============================================================================
// Mobile Components
// ============================================================================

// Mobile conference badges and video button (inline version for mobile)
export function MobileConferenceBadgesWithVideo({
  isSponsor,
  isResearch,
  extraSponsor,
  videoUrl,
  onVideoClick,
}: {
  isSponsor?: boolean;
  isResearch?: boolean;
  extraSponsor?: { alt: string; coverUrl: string; videoUrl: string; link: string }[];
  videoUrl?: string;
  onVideoClick?: (e: MouseEvent) => void;
}) {
  return (
    <div
      className={cn(
        'absolute flex flex-col items-start',
        MOBILE_MAP_SCALE.badgeContainerTopClass,
        MOBILE_MAP_SCALE.badgeGapClass,
      )}
    >
      <div
        className={cn(
          'relative flex items-center gap-0.5 rounded',
          MOBILE_MAP_SCALE.badgePaddingClass,
          MOBILE_MAP_SCALE.badgeTextClass,
          'font-semibold text-data-purple',
        )}
      >
        {/* 10 %, not 20 %: data-purple on its own 20 % tint over the map was 4.3:1 at the 12 px caption (VIS-02). */}
        <BadgeBlurBg className="bg-data-purple/10" />
        <MeetingSVG className={cn(MOBILE_MAP_SCALE.badgeIconSize, 'fill-data-purple')} />
        Conference
      </div>
      {(isSponsor || (extraSponsor && extraSponsor.length > 0)) && (
        <div
          className={cn(
            'relative flex items-center gap-0.5 rounded',
            MOBILE_MAP_SCALE.badgePaddingClass,
            MOBILE_MAP_SCALE.badgeTextClass,
            'font-semibold text-data-yellow',
          )}
        >
          <BadgeBlurBg className="bg-data-yellow/20" />
          <SponsorSVG className={cn(MOBILE_MAP_SCALE.badgeIconSize, 'fill-data-yellow')} />
          Sponsorship
        </div>
      )}
      {isResearch && (
        <div
          className={cn(
            'relative flex items-center gap-0.5 rounded',
            MOBILE_MAP_SCALE.badgePaddingClass,
            MOBILE_MAP_SCALE.badgeTextClass,
            'font-semibold text-data-orange',
          )}
        >
          <BadgeBlurBg className="bg-data-orange/20" />
          <ResearchSVG className={cn(MOBILE_MAP_SCALE.badgeIconSize, 'fill-data-orange')} />
          Research
        </div>
      )}
      {videoUrl && onVideoClick && (
        <motion.a
          href={videoUrl}
          target="_blank"
          onClick={onVideoClick}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 0.85 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="pointer-events-auto flex cursor-pointer flex-col"
        >
          <div className="clip-talk-content -ml-1 bg-white p-px [--clip-offset:0.375rem]">
            <div className="clip-talk-content flex items-center gap-0.5 bg-tone-970 px-1.5 py-1 [--clip-offset:0.375rem]">
              <YoutubeSVG className="size-3 fill-white" />
              <span className="inline-block text-[10px]/3 font-semibold text-white phoneScaled:text-[0.625rem]/3">Talk</span>
              <ArrowSVG className="size-2.5 -rotate-90 fill-white" />
            </div>
          </div>
        </motion.a>
      )}
    </div>
  );
}

// Mobile content section with images
export function MobileContentSection({
  title,
  period,
  imgs,
  link,
  scrollContainerRef,
  onClick,
}: {
  title?: string;
  period?: string;
  imgs?: { src: string; alt: string }[];
  link?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  onClick: (e: MouseEvent) => void;
}) {
  const scrollContent = imgs?.length ? (
    <div
      ref={scrollContainerRef}
      className="pointer-events-auto flex flex-col [mask-image:linear-gradient(to_bottom,transparent,white_0%,white_75%,transparent)]"
    >
      {imgs.map((img) => (
        <FeatherImg className={MOBILE_MAP_SCALE.contentImageClass} key={img.src} src={img.src} alt={img.alt} />
      ))}
    </div>
  ) : null;

  const content = (
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
          height: '45dvh',
        },
      }}
      transition={{
        staggerChildren: 0.1,
        duration: DURATION.base,
        ease: EASE.inOut,
      }}
      className={cn('flex h-full', MOBILE_MAP_SCALE.contentMaxWidth, 'flex-col items-center gap-3 font-display')}
    >
      {title && (
        <h3
          className={cn(
            'cursor-pointer whitespace-nowrap text-center',
            MOBILE_MAP_SCALE.contentTitleClass,
            'font-semibold capitalize text-white',
          )}
        >
          <span className="mr-2 whitespace-pre-wrap">{title}</span>
          {/*{period}*/}
        </h3>
      )}
      {link ? (
        <a
          href={link}
          target="_blank"
          className="hide-scrollbar pointer-events-auto h-full grow overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_0%,white_90%,transparent)]"
          onClick={onClick}
        >
          {scrollContent}
        </a>
      ) : (
        <div className="hide-scrollbar pointer-events-auto h-full grow overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_0%,white_90%,transparent)]">
          {scrollContent}
        </div>
      )}
    </motion.div>
  );

  return content;
}

// Mobile extra sponsor section with smaller sizes for mobile viewport
export function MobileExtraSponsorSection({
  extraSponsor,
  onClick,
  className,
}: {
  extraSponsor: {
    alt: string;
    coverUrl: string;
    videoUrl: string;
    link: string;
  };
  onClick: (e: MouseEvent) => void;
  className?: string;
}) {
  const content = (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={cn(
        'flex origin-top-left flex-col items-center overflow-visible font-display',
        MOBILE_MAP_SCALE.extraSponsorWidth,
      )}
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
        duration: DURATION.base,
        ease: EASE.inOut,
      }}
    >
      <h4
        className={cn(
          'whitespace-pre-wrap text-center font-semibold capitalize text-white',
          MOBILE_MAP_SCALE.extraSponsorTitleClass,
        )}
      >
        {extraSponsor.alt}
      </h4>
      <VideoWithPoster
        coverUrl={extraSponsor.coverUrl}
        videoUrl={extraSponsor.videoUrl}
        // The heading above names the sponsor in the same link, so the logo is decorative (axe image-redundant-alt).
        title=""
        containerClass={MOBILE_MAP_SCALE.extraSponsorMarginTop}
        videoClass={MOBILE_MAP_SCALE.extraSponsorLogoSize}
        coverClass={MOBILE_MAP_SCALE.extraSponsorLogoSize}
      />
    </motion.div>
  );

  if (!extraSponsor.link) {
    return <div className={cn('pointer-events-auto absolute -right-[90%] top-0 overflow-visible', className)}>{content}</div>;
  }

  return (
    <a
      href={extraSponsor.link}
      target="_blank"
      rel="noreferrer"
      className={cn('pointer-events-auto absolute -right-[90%] top-0 overflow-visible', className)}
      onClick={onClick}
    >
      {content}
    </a>
  );
}
