'use client';

import { useCallback, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { noteRowPage, useKeptRowPage } from '@/hooks/insights/useKeptRowPage';
import { rowKeyboardProps } from '@/app/insights/_components/rowKeyboard';
import YouTubeThumbnail from '@/app/insights/_components/YouTubeThumbnail';
import VideoModal from '@/app/insights/_components/VideoModal';
import { PCNavigationArrowButton, MobileNavigationArrowButton } from '@/app/insights/_components/NavigationArrowButton';
import ViewAllButton, { HEADING, HEADING_PHONE } from '@/app/insights/_components/ViewAllButton';
import CardShell from '@/components/common/CardShell';
import { isInternalHref } from '@/constants/site';
import { cn } from '@/utils';
import { STORAGE_KEY } from '@/constants/storage';
import { InsightItem } from '@/hooks/insights/fetch';
import { useContainerResize } from '@/hooks/useContainerResize';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { useWindowResize } from '@/hooks/useWindowResize';
import { layoutUnitPx } from '@/utils/layout-unit';
import { safeHref } from '@/utils/safe-href';
import { trackOutbound } from '@/lib/analytics/outbound';
import { track } from '@/lib/analytics/track';
import SectionLoadError from '@/components/common/SectionLoadError';
import { youtubeWatchUrl } from '@/utils/youtube';

type NewsAndTalksSectionProps = {
  items?: InsightItem[];
  isLoading?: boolean;
  /** The list failed to load (ENG-08): show an error with a retry, not an empty list. */
  isError?: boolean;
  onRetry?: () => void;
  isMobile?: boolean;
  isVisible?: boolean;
};

const ITEMS_PER_PAGE_DESKTOP = 8; // 4x2 grid

function NewsCard({ item, isMobile = false }: { item: InsightItem; isMobile?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isYouTube = !!item.videoId;

  // Articles are real links (preview, copy, middle-click, keyboard): our own pages in the same tab, external
  // press in a new tab. Videos open the modal on a plain click and are real links to their YouTube page; an item with neither is not interactive.
  const href = isYouTube ? undefined : safeHref(item.url);
  const external = Boolean(href && !isInternalHref(href));
  const openVideo = isYouTube ? () => setIsModalOpen(true) : undefined;
  // DATA-03: external press is outbound_click (press), our own articles news_item_click; videos send video_open.
  const onNavigate = () => {
    if (!href) return;
    if (external) {
      trackOutbound(href, 'outbound_click', { link_type: 'press', item_id: String(item.id), placement: 'insights_news' });
    } else {
      track('news_item_click', { item_id: String(item.id), placement: 'insights_news' });
    }
  };

  // Use imageUrl if available, otherwise fallback for YouTube videos
  const thumbnailPic = item.imageUrl ?? '';

  // Mobile layout: card style matching Figma design
  if (isMobile) {
    return (
      <>
        <CardShell
          href={href}
          external={external}
          onActivate={openVideo}
          onNavigate={onNavigate}
          linkFallback={isYouTube ? youtubeWatchUrl(item.videoId!) : undefined}
          className="group flex cursor-pointer flex-col overflow-hidden"
        >
          {/* Image */}
          <div className="relative h-[4.25rem] w-full overflow-hidden">
            <YouTubeThumbnail pic={thumbnailPic} videoId={item.videoId ?? ''} title={item.title} onClick={() => {}} />
          </div>
          {/* Card content */}
          <div className="flex flex-col gap-0.5 bg-white p-2 pt-1.5">
            {/* The original's phone sizes: title 12 px, source and date 10 px. */}
            <h3 className="line-clamp-1 font-text text-xs/4 font-medium text-black">{item.title}</h3>
            <div className="flex w-full flex-col text-left font-text text-[0.625rem]/3 text-black/60">
              {item.publisher && <p className="line-clamp-1">{item.publisher}</p>}
              {item.publishDate ? <p>{dayjs(item.publishDate).format('MMM DD, YYYY')}</p> : <br />}
            </div>
          </div>
        </CardShell>
        {isYouTube && (
          <VideoModal
            placement="insights_news"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            videoId={item.videoId!}
            title={item.title}
          />
        )}
      </>
    );
  }

  // Desktop layout: vertical card with image on top, text below
  return (
    <>
      <CardShell
        href={href}
        external={external}
        onActivate={openVideo}
        onNavigate={onNavigate}
        linkFallback={isYouTube ? youtubeWatchUrl(item.videoId!) : undefined}
        className="group flex cursor-pointer flex-col overflow-hidden"
      >
        {/* Image */}
        <div className="relative h-[9.25rem] w-full overflow-hidden">
          <YouTubeThumbnail pic={thumbnailPic} videoId={item.videoId ?? ''} title={item.title} onClick={() => {}} />
        </div>
        {/* Card content */}
        {/* The original's sizes (the owner's rule on font sizes), scaled with the window. The source and date never
            truncate: where they do not fit one line the date moves to the next. */}
        <div className="flex flex-col gap-3 bg-white/80 p-4 backdrop-blur-sm">
          <h3 className="line-clamp-2 font-text text-lg/6 font-semibold text-black desktop:line-clamp-1">{item.title}</h3>
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 font-text text-sm/5 font-medium text-black/60">
            {item.publisher && <span>{item.publisher}</span>}
            {item.publisher && item.publishDate && <span>·</span>}
            {item.publishDate && <span className="whitespace-nowrap">{dayjs(item.publishDate).format('MMM DD, YYYY')}</span>}
          </div>
        </div>
      </CardShell>
      {isYouTube && (
        <VideoModal
          placement="insights_news"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoId={item.videoId!}
          title={item.title}
        />
      )}
    </>
  );
}

// The phone column: the owner's rule for how many rows of news cards a page holds, exactly as on his site (his answer
// of 2026-11-18, "Keep 6": six at 390x844, four at 375x667 and 360x740, eight at 430x932), which reverses wave 1's
// stricter count (it took the weekly row into the sum and drew four at 390x844). His count leaves the column taller
// than the screen; on his site the column was centred and the NEWS & TALKS heading went under the header. Here the
// column is a scroll box between the header and the bottom controls with its top kept in view ("safe" centring,
// Insights.tsx), so nothing lies under either and the weekly row is reached by scrolling the column.
const NEWS_HEADER_HEIGHT = 44; // his: the heading's height
const NEWS_CONTENT_GAP = 20; // mt-5 gap between header and content
const PODCAST_SECTION_HEIGHT = 128; // heading (44) + gap (12) + one row of cards (72)
const SECTION_GAP = 24; // gap-6 between the news and podcast rows
const NEWS_CARD_ROW_HEIGHT = 124; // Card: image (68px) + content padding + text (56px)
const NEWS_CARD_GAP = 10; // gap-y-2.5 between rows

function calculateMobileItemCount(containerPx: number, columns: number): number {
  // The heights above are the phone's, at its 16 px unit; the phone deck scales up with the window above phone width
  // (an upright tablet), so the column is measured in that unit before the rows are counted.
  const containerHeight = containerPx / (layoutUnitPx() / 16 || 1);
  const availableForNews = containerHeight - NEWS_HEADER_HEIGHT - NEWS_CONTENT_GAP - SECTION_GAP - PODCAST_SECTION_HEIGHT;
  // Rows that fit: the first is a row, each further one a gap and a row.
  const rows = Math.floor((availableForNews + NEWS_CARD_GAP) / (NEWS_CARD_ROW_HEIGHT + NEWS_CARD_GAP));
  // His clamp: two rows at least, four at most.
  const clampedRows = Math.max(2, Math.min(4, rows));
  return clampedRows * columns;
}

export default function NewsAndTalksSection({
  items = [],
  isLoading,
  isError = false,
  onRetry,
  isMobile = false,
  isVisible = true,
}: NewsAndTalksSectionProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMobileBeginning, setIsMobileBeginning] = useState(true);
  const [isMobileEnd, setIsMobileEnd] = useState(false);
  const [mobileItemCount, setMobileItemCount] = useState(8); // Default to max
  const swiperRef = useRef<SwiperType>(undefined);
  const mobileSwiperRef = useRef<SwiperType>(undefined);
  // The page each row shows is kept in the history entry (NAV-02).
  useKeptRowPage('news', swiperRef, !isMobile);
  useKeptRowPage('news-phone', mobileSwiperRef, isMobile);
  const containerRef = useRef<HTMLDivElement>(null);
  const profile = useDeviceProfile();
  const itemsPerPage = ITEMS_PER_PAGE_DESKTOP;
  // Phone deck in landscape (a compact-height window): four cards across instead of two wide strips.
  const mobileColumns = profile?.height === 'compact' ? 4 : 2;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const totalMobilePages = Math.ceil(items.length / mobileItemCount);

  const containerResizeCallback = useCallback(
    (entry: ResizeObserverEntry) => {
      if (!isMobile) return;
      // The column's whole box: its bottom padding is room the last row may use.
      const containerHeight = (entry.target as HTMLElement).clientHeight || entry.contentRect.height;
      const count = calculateMobileItemCount(containerHeight, mobileColumns);
      setMobileItemCount(count);
    },
    [isMobile, mobileColumns],
  );

  // Mobile: calculate items based on container height (using ResizeObserver)
  useContainerResize(containerRef, containerResizeCallback, '.mobile-insights-content', [isVisible]);

  const windowResizeCallback = useCallback(() => {
    if (!isMobile) return;

    // Only use this fallback if parent container doesn't exist
    const parentContainer = containerRef.current?.closest('.mobile-insights-content');
    if (parentContainer) return;

    const viewportHeight = window.innerHeight;
    const containerHeight = viewportHeight - 140 - 80;
    const count = calculateMobileItemCount(containerHeight, mobileColumns);
    setMobileItemCount(count);
  }, [isMobile, mobileColumns]);

  // Mobile: fallback to window resize if parent container is not found
  useWindowResize(windowResizeCallback);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleMobilePrev = () => {
    mobileSwiperRef.current?.slidePrev();
  };

  const handleMobileNext = () => {
    mobileSwiperRef.current?.slideNext();
  };

  // The VIEW ALL link navigates (same tab on every device); this only marks the return page so Back
  // restores Insights on the phone (desktop restores it from the /insights URL).
  const handleViewAllClick = () => {
    if (isMobile) sessionStorage.setItem(STORAGE_KEY.MOBILE_RETURN_PAGE, 'insights_page');
  };

  const renderContent = () => {
    if (isError && onRetry) return <SectionLoadError onRetry={onRetry} />;
    if (isLoading) {
      if (isMobile) {
        // Show skeleton based on calculated item count (default 8 initially)
        const skeletonCount = mobileItemCount || 8;
        return (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={index} className="flex flex-col overflow-hidden">
                <div className="h-[4.25rem] w-full animate-pulse bg-tone-800/50" />
                <div className="space-y-1 bg-white p-3">
                  <div className="h-4 w-3/4 animate-pulse bg-tone-800/30" />
                  <div className="h-3 w-1/2 animate-pulse bg-tone-800/20" />
                </div>
              </div>
            ))}
          </div>
        );
      }
      // Desktop loading: 4x2 grid skeleton
      return (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="h-[148px] animate-pulse bg-tone-800/50" />
              <div className="mt-0 space-y-2 border-2 border-white bg-white/50 p-3">
                <div className="h-12 animate-pulse bg-tone-800/30" />
                <div className="h-4 w-2/3 animate-pulse bg-tone-800/20" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Mobile layout: Swiper with 2-column grid pages (2×3 or 2×2 based on screen height)
    if (isMobile) {
      return (
        <Swiper
          {...rowKeyboardProps}
          className="h-full w-full"
          onSlideChange={(swiper) => {
            noteRowPage();
            setIsMobileBeginning(swiper.isBeginning);
            setIsMobileEnd(swiper.isEnd);
          }}
          onBeforeInit={(swiper) => (mobileSwiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={16}
        >
          {Array.from({ length: totalMobilePages }).map((_, pageIndex) => {
            const pageItems = items.slice(pageIndex * mobileItemCount, (pageIndex + 1) * mobileItemCount);
            return (
              <SwiperSlide key={pageIndex}>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 shortScreen:grid-cols-4">
                  {pageItems.map((item) => (
                    <NewsCard key={item.id} item={item} isMobile />
                  ))}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      );
    }

    // Desktop layout: 4x2 grid per page
    return (
      <Swiper
        {...rowKeyboardProps}
        className="h-full w-full"
        onSlideChange={(swiper) => {
          noteRowPage();
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        spaceBetween={24}
      >
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          const pageItems = items.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

          return (
            <SwiperSlide key={pageIndex}>
              <div className="grid grid-cols-4 gap-4">
                {pageItems.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  };

  return (
    <div ref={containerRef} className="flex h-full flex-col mobile:h-auto">
      {/* Mobile: wrap header + content for vertical centering */}
      <div className={cn(isMobile ? 'flex flex-col' : 'flex flex-1 flex-col')}>
        {/* Header. On the phone deck too: its VIEW ALL is the phone's only way to the news list. */}
        <div className="flex items-center justify-between">
          <h2 className={cn(HEADING, isMobile && HEADING_PHONE)}>NEWS & TALKS</h2>
          <ViewAllButton href="/news" onClick={handleViewAllClick} isMobile={isMobile} />
        </div>

        {/* Content with arrow navigation */}
        {/* Phone deck in landscape: the cards are inset by the arrows' width (four across, the 44 px arrows would cover
            the first and last card's text). */}
        <div className={cn('relative mt-5', !isMobile && 'flex-1', isMobile && totalMobilePages > 1 && 'shortScreen:px-6')}>
          {/* Desktop left arrow */}
          {!isMobile && totalPages > 1 && (
            <PCNavigationArrowButton onClick={handlePrev} disabled={isBeginning} direction="prev" />
          )}

          {/* Mobile left arrow */}
          {isMobile && totalMobilePages > 1 && (
            <MobileNavigationArrowButton onClick={handleMobilePrev} disabled={isMobileBeginning} direction="prev" />
          )}

          {renderContent()}

          {/* Desktop right arrow */}
          {!isMobile && totalPages > 1 && <PCNavigationArrowButton onClick={handleNext} disabled={isEnd} direction="next" />}

          {/* Mobile right arrow */}
          {isMobile && totalMobilePages > 1 && (
            <MobileNavigationArrowButton onClick={handleMobileNext} disabled={isMobileEnd} direction="next" />
          )}
        </div>
      </div>
    </div>
  );
}
