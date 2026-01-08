import { GA_EVENT_NAMES } from '@/constants/ga';
import { SpectrumItemInfo, SpectrumLinkItem } from '@/hooks/spectrum/useSpectrumData';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'motion/react';
import { cloneElement, forwardRef, HTMLAttributes, memo, useCallback, useMemo, useState } from 'react';
import { ArrowSVG } from '../svg';
import { generateSpectrumUrl, SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';

/** Particle configuration for position offset and scale */
export interface ParticleConfig {
  /** Offset for particle container position, e.g. { x: '10px', y: '-5px' } */
  offset?: { x?: string; y?: string };
  /** Scale factor for particle size, e.g. 0.8 for 80% size */
  scale?: number;
}

interface SpectrumItemProps {
  item: SpectrumItemInfo;
  link?: string;
  className?: string;
  isHover?: boolean;
  onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
  executeSpectrumRoute?: (key: string) => void;
  updateUrlAndExecute?: (key: string) => void;
  routeConfigs?: SpectrumRouteConfig[];
  particleContainerId?: string;
  particleActive?: boolean;
  /** Particle configuration (offset, scale) */
  particleConfig?: ParticleConfig;
  /** Display links in a row instead of column */
  linksInRow?: boolean;
}

const MobileSpectrumLink = memo(
  ({
    item,
    executeSpectrumRoute,
    updateUrlAndExecute,
    routeConfigs,
  }: {
    item: SpectrumLinkItem;
    executeSpectrumRoute?: (key: string) => void;
    updateUrlAndExecute?: (key: string) => void;
    routeConfigs?: SpectrumRouteConfig[];
  }) => {
    const { trackEvent } = useGA();

    const { key, label, link, isComingSoon, onClick, labelClassName, routeKey } = item;
    const hasLink = Boolean(link || onClick || routeKey);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!hasLink) return;
        trackEvent({
          name: GA_EVENT_NAMES.SPECTRUM_CLICK,
          label: key ?? label,
        });

        if (routeKey) {
          // Normal click - update URL and execute action in current page
          if (updateUrlAndExecute) {
            updateUrlAndExecute(routeKey);
          } else if (executeSpectrumRoute) {
            executeSpectrumRoute(routeKey);
          }
          return;
        }

        onClick?.();
        if (link) window.open(link, '_blank');
      },
      [hasLink, trackEvent, key, label, onClick, link, routeKey, executeSpectrumRoute, updateUrlAndExecute],
    );

    const routeConfig = routeConfigs?.find((config) => config.key === routeKey);
    const { pathname, useHash } = routeConfig ?? {};

    return (
      <a href={generateSpectrumUrl(item?.routeKey ?? '', pathname, useHash)} target="_blank">
        <div className="relative flex items-center gap-1">
          <p
            onClick={handleClick}
            className={cn(
              'spectrum-link-text group relative font-poppins text-[10px]/4 font-medium capitalize',
              hasLink &&
                'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition after:duration-300 hover:after:scale-x-100',
              labelClassName,
            )}
          >
            {label}
          </p>
          {isComingSoon && (
            <span className="flex-center inline-block h-3 rounded-sm bg-white/20 font-oxanium text-[.5rem]/3 capitalize text-white/50 backdrop-blur-2xl">
              coming soon
            </span>
          )}
        </div>
      </a>
    );
  },
);

MobileSpectrumLink.displayName = 'MobileSpectrumLink';

const linksPerPage = 5;
const MobileSpectrumItem = memo(
  forwardRef<HTMLDivElement, SpectrumItemProps>(
    (
      {
        item,
        onClick,
        className,
        executeSpectrumRoute,
        updateUrlAndExecute,
        routeConfigs,
        particleContainerId,
        particleActive,
        particleConfig,
        linksInRow,
      },
      ref,
    ) => {
      const { title, titleCn, icon, links, className: itemClassName } = item;
      const [currentPage, setCurrentPage] = useState(0);

      const { trackEvent } = useGA();

      const onMouseEnter = () => {
        trackEvent({
          name: GA_EVENT_NAMES.SPECTRUM_HOVER,
          label: title,
        });
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
      }, [links, totalLinks, safePage]);

      const spectrumLinks = useMemo(() => {
        return visibleLinks.map((item, index) => (
          <motion.div
            key={`${item.label}-${safePage}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
            className={linksInRow ? 'flex items-center gap-1' : ''}
          >
            {/* Separator for row layout (except first item) */}
            {linksInRow && index > 0 && <span className="font-poppins text-[10px]/4">/</span>}
            <MobileSpectrumLink
              item={item}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
          </motion.div>
        ));
      }, [visibleLinks, safePage, executeSpectrumRoute, updateUrlAndExecute, routeConfigs, linksInRow]);

      return (
        <div
          ref={ref}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          className={cn(
            'spectrum-item relative h-full w-full cursor-pointer flex-col overflow-visible p-2 text-foreground',
            className,
          )}
        >
          {/* Particle container - positioned behind content */}
          {particleContainerId && (
            <div
              id={particleContainerId}
              className={cn(
                'spectrum-particle-item-bg pointer-events-none absolute left-1/2 top-1/2 z-[-1] -translate-x-1/2 -translate-y-1/2',
                {
                  active: particleActive,
                },
              )}
              style={{
                marginLeft: particleConfig?.offset?.x,
                marginTop: particleConfig?.offset?.y,
                transform: `translate(-50%, -50%)${particleConfig?.scale ? ` scale(${particleConfig.scale})` : ''}`,
              }}
            />
          )}
          <div className={cn('flex flex-col items-center text-center', itemClassName)}>
            {/* Icon above title for grid layout */}
            {cloneElement(icon, { className: 'spectrum-icon mb-0.5 size-6 shrink-0 fill-white' })}
            <h4 className="spectrum-title bilingual-font font-oxanium text-sm font-semibold capitalize">{title}</h4>
            <h4 className="spectrum-title-cn bilingual-font mt-3 text-sm font-bold capitalize">{titleCn}</h4>
            <div className="spectrum-links-container mt-2 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key="spectrum-links"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('flex items-center gap-1 [text-shadow:0_0_4px_black]', linksInRow ? 'flex-row' : 'flex-col')}
                >
                  {spectrumLinks}
                </motion.div>
              </AnimatePresence>
              {showMoreButton && (
                <motion.button
                  onClick={handleMoreClick}
                  className="mt-1 flex items-center justify-center gap-1 font-poppins text-[10px]/4 font-medium text-blue opacity-90 transition-colors hover:text-blue/80 hover:opacity-100"
                >
                  {buttonText}
                  <ArrowSVG className="size-2.5 fill-current transition duration-300" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      );
    },
  ),
);

MobileSpectrumItem.displayName = 'MobileSpectrumItem';

export default MobileSpectrumItem;
