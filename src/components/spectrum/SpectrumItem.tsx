import { GA_EVENT_NAMES } from '@/constants/ga';
import { SpectrumItemInfo, SpectrumLinkItem } from '@/hooks/spectrum/useSpectrumData';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'motion/react';
import { cloneElement, forwardRef, HTMLAttributes, memo, useCallback, useMemo, useState } from 'react';
import { ArrowSVG } from '../svg';
import { generateSpectrumUrl, SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';

interface SpectrumItemProps {
  item: SpectrumItemInfo;
  link?: string;
  className?: string;
  onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
  executeSpectrumRoute?: (key: string) => void;
  updateUrlAndExecute?: (key: string) => void;
  routeConfigs?: SpectrumRouteConfig[];
  isSponsor?: boolean;
}

const SpectrumLink = memo(
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

    const { key, label, link, isComingSoon, onClick, icon, labelClassName, routeKey, size } = item;
    const hasLink = Boolean(link);
    const routeConfig = routeConfigs?.find((config) => config.key === routeKey);
    const { pathname, useHash } = routeConfig ?? {};

    const url = useMemo(() => {
      if (!hasLink) return undefined;
      if (link) return link;
      // routeKey
      return generateSpectrumUrl(item?.routeKey ?? '', pathname, useHash);
    }, [hasLink, item?.routeKey, pathname, useHash, link]);

    const handleClick = useCallback(
      (event?: React.MouseEvent) => {
        if (!hasLink) return;
        event?.preventDefault();
        event?.stopPropagation();

        trackEvent({
          name: GA_EVENT_NAMES.SPECTRUM_CLICK,
          label: key ?? label,
        });

        if (link) {
          window.open(link, '_blank');
          return;
        }

        if (event?.metaKey || event?.ctrlKey) {
          // cmd + click
          if (url) window.open(url, '_blank');
        } else {
          // normal click
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
        }

        if (link) window.open(link, '_blank');
      },
      [hasLink, trackEvent, key, label, onClick, link, routeKey, executeSpectrumRoute, updateUrlAndExecute, url],
    );

    const renderContent = useCallback(() => {
      if (icon) {
        return (
          <div className={cn('relative flex items-center gap-1', hasLink ? 'cursor-pointer' : 'cursor-default')}>
            <img src={icon} onClick={handleClick} alt={`${label} logo`} className={cn('duration-300 hover:scale-110', size)} />
          </div>
        );
      }
      return (
        <div className={cn('relative flex items-center gap-1', hasLink ? 'cursor-pointer' : 'cursor-default')}>
          <p
            onClick={handleClick}
            className={cn(
              'spectrum-link-text group relative whitespace-nowrap font-poppins text-xs/5 font-medium capitalize',
              hasLink &&
                'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition after:duration-300 hover:after:scale-x-100',
              labelClassName,
            )}
          >
            {label}
          </p>
          {isComingSoon && (
            <span className="flex-center inline-block h-5 whitespace-nowrap rounded-sm bg-white/20 px-1 font-oxanium text-xs capitalize text-white/50 backdrop-blur-2xl">
              coming soon
            </span>
          )}
        </div>
      );
    }, [icon, hasLink, handleClick, labelClassName, label, isComingSoon, size]);

    return hasLink ? (
      <a href={url} target="_blank">
        {renderContent()}
      </a>
    ) : (
      renderContent()
    );
  },
);

SpectrumLink.displayName = 'SpectrumLink';

const linksPerPage = 20;
const SpectrumItem = memo(
  forwardRef<HTMLDivElement, SpectrumItemProps>(
    ({ item, onClick, className, executeSpectrumRoute, updateUrlAndExecute, routeConfigs, isSponsor }, ref) => {
      const { title, titleCn, icon, links, linksClassName, className: itemClassName } = item;
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
          >
            <SpectrumLink
              item={item}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
          </motion.div>
        ));
      }, [visibleLinks, safePage, executeSpectrumRoute, updateUrlAndExecute, routeConfigs]);

      // For sponsor: split links into first row (8 items with justify-between) and remaining rows (centered)
      const sponsorFirstRowCount = 8;
      const sponsorFirstRowLinks = useMemo(() => {
        if (!isSponsor) return [];
        return visibleLinks.slice(0, sponsorFirstRowCount).map((item, index) => (
          <motion.div
            key={`${item.label}-${safePage}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
          >
            <SpectrumLink
              item={item}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
          </motion.div>
        ));
      }, [isSponsor, visibleLinks, safePage, executeSpectrumRoute, updateUrlAndExecute, routeConfigs]);

      const sponsorRemainingLinks = useMemo(() => {
        if (!isSponsor) return [];
        return visibleLinks.slice(sponsorFirstRowCount).map((item, index) => (
          <motion.div
            key={`${item.label}-${safePage}-remaining-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: (sponsorFirstRowCount + index) * 0.05,
              ease: 'easeOut',
            }}
          >
            <SpectrumLink
              item={item}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
          </motion.div>
        ));
      }, [isSponsor, visibleLinks, safePage, executeSpectrumRoute, updateUrlAndExecute, routeConfigs]);

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
            {isSponsor ? null : cloneElement(icon, { className: 'spectrum-icon size-7.5 shrink-0 fill-white' })}
            <div className={cn('flex flex-col', isSponsor && 'w-full items-center')}>
              {isSponsor ? (
                <h4 className="spectrum-title bilingual-font whitespace-nowrap text-[1.625rem]/7.5 font-semibold capitalize">
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
              <div className={cn('spectrum-links-container flex flex-col', isSponsor ? 'mt-10 w-full' : 'mt-5')}>
                <AnimatePresence mode="wait">
                  {isSponsor ? (
                    <motion.div
                      key="spectrum-links-sponsor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex w-full flex-col gap-y-10"
                    >
                      {/* First row: justify-between to span full width */}
                      <div className="flex w-full items-center justify-between">{sponsorFirstRowLinks}</div>
                      {/* Remaining rows: centered */}
                      {sponsorRemainingLinks.length > 0 && (
                        <div className="flex w-full items-center justify-center gap-[4.625rem]">{sponsorRemainingLinks}</div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="spectrum-links"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={linksClassName || 'flex flex-col'}
                    >
                      {spectrumLinks}
                    </motion.div>
                  )}
                </AnimatePresence>
                {showMoreButton && (
                  <motion.button
                    onClick={handleMoreClick}
                    className="mt-1 flex items-center gap-1 font-poppins text-xs/5 font-medium text-blue opacity-90 transition-colors hover:text-blue/80 hover:opacity-100"
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
