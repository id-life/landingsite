import ResearchSVG from '@/../public/svgs/engagement/research.svg?component';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import { MOBILE_MAP_SCALE } from '@/constants/engagement';
import { cn } from '@/utils';
import { motion } from 'motion/react';
import { MouseEvent } from 'react';
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

/**
 * Type roles of the map labels (RWD-01): label (14 px and up) on the scrolled deck, caption (12 px) on the phone map,
 * which is a 55 % tall strip where neighbouring cities sit a label's height apart.
 */
export const MAP_LABEL_CLASS: Record<MapDeck, string> = {
  desktop: '-ml-1.5 whitespace-nowrap font-display text-label font-semibold capitalize text-white',
  phone: 'whitespace-nowrap font-display text-caption leading-[14px] font-semibold capitalize text-white',
};

/**
 * RWD-06: on coarse pointers a map point's box is at least 44x44. The box grows 12 px above the dot and the content is
 * padded back down by the same amount, so the dot and its label stay exactly on their coordinate.
 */
export const MAP_POINT_TAP_CLASS = 'coarse:-mt-[12px] coarse:min-h-[44px] coarse:min-w-[44px] coarse:pt-[12px]';

/** A badge under an open dot's label (Conference, Sponsorship, Research, Translation) on the scrolled deck. */
export const BADGE_CLASS =
  'flex items-center gap-1 whitespace-nowrap rounded-lg p-1 px-2 py-1 text-label font-semibold backdrop-blur-2xl';
/**
 * The text of an open card sits on the section background, so the card occludes the dimmed labels under it instead of
 * mixing with them (the Oxford sponsor titles crossed "Abu Dhabi, UAE" at 2.9:1). Inline, so only the glyph lines are
 * backed.
 */
export const CARD_TEXT_BACKING = 'bg-background box-decoration-clone px-1';
/** Badge icons keep their 1440 px size on tablets, beside a label that has a floor. */
export const BADGE_ICON_CLASS = 'size-[max(1.25rem,15px)]';

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
}) {
  // Reduced motion (MOT-02): the pulse rings hold still.
  const reduced = useReducedMotionPref();
  return (
    <div
      className={cn(
        'pulse-dot relative',
        containerClassName ?? MOBILE_MAP_SCALE.dotContainerSize,
        isActive ? 'overflow-visible' : 'overflow-hidden',
      )}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className={svgClassName}>
        <circle cx={centerPoint} cy={centerPoint} r={centerRadius} fill={color} />
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
          <span className="inline-block text-label font-semibold text-white">Talk</span>
          <ArrowSVG className="size-[max(1rem,12px)] -rotate-90 fill-white" />
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
      className={cn('flex h-full w-[max(20.25rem,243px)] origin-top-left flex-col items-center gap-4 font-display')}
    >
      {title && (
        <h3 className="whitespace-nowrap text-center text-lead font-semibold capitalize text-white">
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
      className="flex w-[max(17rem,204px)] origin-top-left flex-col items-center overflow-visible font-display"
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
      <h4 className="-mx-10 whitespace-pre-wrap text-balance text-center text-lead font-semibold capitalize text-white">
        <span className={CARD_TEXT_BACKING}>{extraSponsor.alt}</span>
      </h4>
      <VideoWithPoster
        coverUrl={extraSponsor.coverUrl}
        videoUrl={extraSponsor.videoUrl}
        // The heading above names the sponsor in the same link, so the logo is decorative (axe image-redundant-alt).
        title=""
        containerClass="-mt-5"
        videoClass="size-[max(15.5rem,186px)]"
        coverClass="size-[max(15.5rem,186px)]"
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
            className="pointer-events-auto absolute -right-[90%] top-0 h-[40dvh] w-[max(17rem,204px)] cursor-pointer"
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
        <BadgeBlurBg className="bg-data-purple/20" />
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
          <div className="clip-talk-content -ml-1 bg-white p-px [--clip-offset:6px]">
            <div className="clip-talk-content flex items-center gap-0.5 bg-tone-970 px-1.5 py-1 [--clip-offset:6px]">
              <YoutubeSVG className="size-3 fill-white" />
              <span className="inline-block text-caption font-semibold leading-4 text-white">Talk</span>
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
