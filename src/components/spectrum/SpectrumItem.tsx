import { SpectrumItemInfo, SpectrumLinkItem } from '@/hooks/spectrum/useSpectrumData';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'motion/react';
import { cloneElement, forwardRef, HTMLAttributes, memo, useCallback, useMemo, useState } from 'react';
import { spectrumLinkProps } from './spectrumLinkProps';
import ArrowSVG from '@/../public/svgs/arrow.svg?component';
import { SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';
import { trackSpectrumLink } from '@/lib/analytics/spectrum';
import { DURATION, EASE } from '@/motion/tokens';

interface SpectrumItemProps {
  item: SpectrumItemInfo;
  link?: string;
  className?: string;
  onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
  onHover?: () => void;
  executeSpectrumRoute?: (key: string) => void;
  updateUrlAndExecute?: (key: string) => void;
  routeConfigs?: SpectrumRouteConfig[];
  isSponsor?: boolean;
  /** False until the section is approached: logo images keep their boxes but fetch nothing yet (PERF). */
  loadImages?: boolean;
}

// A 1x1 transparent GIF: an image box that is laid out at its final height but makes no request.
const NO_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const SpectrumLink = memo(
  ({
    item,
    executeSpectrumRoute,
    loadImage = true,
  }: {
    item: SpectrumLinkItem;
    executeSpectrumRoute?: (key: string) => void;
    updateUrlAndExecute?: (key: string) => void;
    routeConfigs?: SpectrumRouteConfig[];
    loadImage?: boolean;
  }) => {
    const { key, label, link, isComingSoon, icon, labelClassName, routeKey, size } = item;
    const hasLink = Boolean(link);
    const anchorProps = spectrumLinkProps({
      link,
      routeKey,
      executeSpectrumRoute,
      onTrack: () => trackSpectrumLink({ key, label, link }),
    });

    const content = icon ? (
      <div className={cn('relative flex items-center gap-1', hasLink ? 'cursor-pointer' : 'cursor-default')}>
        <img src={loadImage ? icon : NO_IMAGE} alt={`${label} logo`} className={cn('duration-300 hover:scale-110', size)} />
      </div>
    ) : (
      <div className={cn('relative flex items-center gap-1', hasLink ? 'cursor-pointer' : 'cursor-default')}>
        <p
          className={cn(
            'spectrum-link-text group relative whitespace-nowrap font-text text-xs/5 font-medium capitalize',
            hasLink &&
              'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition after:duration-300 hover:after:scale-x-100',
            labelClassName,
          )}
        >
          {label}
        </p>
        {isComingSoon && (
          <span className="flex-center inline-block h-5 whitespace-nowrap rounded-sm bg-white/20 px-1 font-display text-xs capitalize text-white/50 backdrop-blur-2xl">
            coming soon
          </span>
        )}
      </div>
    );

    // A logo link keeps its box and grows its hit area to 44 px on coarse pointers (RWD-06).
    return anchorProps ? (
      <a {...anchorProps} className={icon ? 'relative block tap-area' : undefined}>
        {content}
      </a>
    ) : (
      content
    );
  },
);

SpectrumLink.displayName = 'SpectrumLink';

const SpectrumItem = memo(
  forwardRef<HTMLDivElement, SpectrumItemProps>(
    (
      {
        item,
        onClick,
        onHover,
        className,
        executeSpectrumRoute,
        updateUrlAndExecute,
        routeConfigs,
        isSponsor,
        loadImages = true,
      },
      ref,
    ) => {
      const { title, titleCn, icon, links, linksClassName, className: itemClassName } = item;
      const [currentPage, setCurrentPage] = useState(0);
      const linksPerPage = 21;
      const onMouseEnter = () => {
        onHover?.();
      };

      const totalLinks = links?.length ?? 0;
      const totalPages = totalLinks > 0 ? Math.ceil(totalLinks / linksPerPage) : 0;
      const safePage = totalPages > 0 ? currentPage % totalPages : 0;

      const handleMoreClick = useCallback(
        (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (totalPages === 0) return;
          setCurrentPage((prev) => (prev + 1) % totalPages);
        },
        [totalPages],
      );

      const { visibleLinks, showMoreButton, buttonText } = useMemo(() => {
        if (!links || totalLinks === 0) {
          return { visibleLinks: [], showMoreButton: false, isLastPage: false, buttonText: 'More' };
        }

        if (totalLinks <= linksPerPage) {
          return {
            visibleLinks: links,
            showMoreButton: false,
            isLastPage: false,
          };
        }

        const startIndex = safePage * linksPerPage;
        const endIndex = Math.min(totalLinks, startIndex + linksPerPage);

        const visibleLinks = links.slice(startIndex, endIndex);
        const buttonText = 'More';
        return {
          visibleLinks,
          showMoreButton: true,
          buttonText,
        };
      }, [links, totalLinks, safePage, linksPerPage]);

      const spectrumLinks = useMemo(() => {
        return visibleLinks.map((item, index) => (
          <motion.div
            key={`${item.label}-${safePage}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATION.base,
              delay: index * 0.05,
              ease: EASE.out,
            }}
          >
            <SpectrumLink
              item={item}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
              loadImage={loadImages}
            />
          </motion.div>
        ));
      }, [visibleLinks, safePage, executeSpectrumRoute, updateUrlAndExecute, routeConfigs, loadImages]);

      // Keep the supporting institutions visible together in three rows.
      const sponsorFirstRowLinks = useMemo(() => {
        if (!isSponsor) return [];
        return visibleLinks.map((item, index) => (
          <motion.div
            key={`${item.label}-${safePage}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATION.base,
              delay: index * 0.05,
              ease: EASE.out,
            }}
          >
            <SpectrumLink
              item={item}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
              loadImage={loadImages}
            />
          </motion.div>
        ));
      }, [isSponsor, visibleLinks, safePage, executeSpectrumRoute, updateUrlAndExecute, routeConfigs, loadImages]);

      return (
        <div
          ref={ref}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          className={cn(
            'spectrum-item relative cursor-pointer overflow-visible p-4 text-foreground',
            isSponsor ? '' : 'h-[13.75rem]',
            className,
          )}
        >
          <div className={cn('spectrum-item-content flex items-start gap-1.5', itemClassName)}>
            {isSponsor
              ? null
              : cloneElement(icon, {
                  className: cn(icon.props.className, 'spectrum-icon size-7.5 shrink-0 fill-white'),
                })}
            <div className={cn('flex flex-col', isSponsor && 'w-full items-center')}>
              {isSponsor ? (
                <h4 className="spectrum-title bilingual-font whitespace-nowrap text-xl/6 font-semibold capitalize">
                  <div className="flex gap-3">
                    {cloneElement(icon, { className: 'spectrum-icon size-7.5 shrink-0 fill-white' })}
                    <p>{title}</p>
                    <p>{titleCn}</p>
                  </div>
                </h4>
              ) : (
                <h4 className="spectrum-title bilingual-font whitespace-nowrap text-[1.625rem]/7.5 font-semibold capitalize">
                  {title}
                </h4>
              )}
              <h4 className={cn('spectrum-title-cn bilingual-font mt-2 text-xl/6 font-bold capitalize', isSponsor && 'hidden')}>
                {titleCn}
              </h4>
              <div
                className={cn(
                  'spectrum-links-container flex flex-col',
                  isSponsor ? 'mt-6 w-full [@media(max-width:1199.98px)_and_(max-height:1100px)]:mt-4' : 'mt-5',
                )}
              >
                <AnimatePresence mode="wait">
                  {isSponsor ? (
                    <motion.div
                      key="spectrum-links-sponsor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: DURATION.fast }}
                      className="flex w-full flex-col"
                    >
                      {/* Seven logos a row, as the original. Below 1200 px wide only: ten (two rows) on a window under 860 px tall, where three rows ran under the
                          fixed bottom controls once the section's text was set in the type roles (RWD-01); rows closer up to 900 px; logos at most 3 units tall up to 1100 px, 2.5 under 860 (the peer reviews' running text is 16 px). */}
                      <div className="grid w-full grid-cols-7 items-center justify-items-center gap-x-5 gap-y-6 [&_img]:max-h-14 [&_img]:max-w-full [&_img]:object-contain [@media(max-width:1199.98px)_and_(max-height:860px)]:grid-cols-10 [@media(max-width:1199.98px)_and_(max-height:860px)]:[&_img]:max-h-10 [@media(max-width:1199.98px)_and_(max-height:900px)]:gap-y-4 [@media(max-width:1199.98px)_and_(min-height:861px)_and_(max-height:1100px)]:[&_img]:max-h-12">
                        {sponsorFirstRowLinks}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="spectrum-links"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: DURATION.fast }}
                      className={linksClassName || 'flex flex-col'}
                    >
                      {spectrumLinks}
                    </motion.div>
                  )}
                </AnimatePresence>
                {showMoreButton && (
                  <motion.button
                    onClick={handleMoreClick}
                    className={cn(
                      'mt-1 flex items-center gap-1 font-text text-xs/5 font-medium text-data-sky opacity-90 transition-colors tap hover:text-data-sky/80 hover:opacity-100',
                      isSponsor && 'mt-4 self-center',
                    )}
                  >
                    {buttonText}
                    <ArrowSVG className="size-3 fill-current transition duration-300" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
  ),
);

SpectrumItem.displayName = 'SpectrumItem';

export default SpectrumItem;
