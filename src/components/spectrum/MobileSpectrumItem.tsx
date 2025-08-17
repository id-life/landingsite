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
  isHover?: boolean;
  onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
  executeSpectrumRoute?: (key: string) => void;
  updateUrlAndExecute?: (key: string) => void;
  routeConfigs?: SpectrumRouteConfig[];
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
    const pathname = routeConfig?.pathname || '/presence';

    return (
      <a href={generateSpectrumUrl(item?.routeKey ?? '', pathname)} target="_blank">
        <div className="relative flex items-center gap-1">
          <p
            onClick={handleClick}
            className={cn(
              'spectrum-link-text group relative font-poppins text-xs/5 font-medium capitalize',
              hasLink &&
                'after:absolute after:inset-x-0 after:bottom-0 after:block after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition after:duration-300 hover:after:scale-x-100',
              labelClassName,
            )}
          >
            {label}
          </p>
          {isComingSoon && (
            <span className="flex-center inline-block h-5 rounded-sm bg-white/20 px-1 font-oxanium text-xs capitalize text-white/50 backdrop-blur-2xl">
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
    ({ item, onClick, className, executeSpectrumRoute, updateUrlAndExecute, routeConfigs }, ref) => {
      const { title, titleCn, icon, links, className: itemClassName } = item;
      const [isMore, setIsMore] = useState(false);

      const { trackEvent } = useGA();

      const onMouseEnter = () => {
        trackEvent({
          name: GA_EVENT_NAMES.SPECTRUM_HOVER,
          label: title,
        });
      };

      const handleMoreClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMore((prev) => !prev);
      }, []);

      const { visibleLinks, showMoreButton, buttonText } = useMemo(() => {
        if (!links) return { visibleLinks: [], showMoreButton: false, isLastPage: false, buttonText: 'More' };

        const totalLinks = links.length;
        if (totalLinks <= linksPerPage) {
          return {
            visibleLinks: links,
            showMoreButton: false,
            isLastPage: false,
          };
        }

        const startIndex = isMore ? Math.max(0, totalLinks - 5) : 0;
        const endIndex = Math.min(totalLinks, startIndex + linksPerPage);

        const visibleLinks = links.slice(startIndex, endIndex);
        const buttonText = isMore ? 'Back' : 'More';
        return {
          visibleLinks,
          showMoreButton: true,
          buttonText,
        };
      }, [links, isMore]);

      const spectrumLinks = useMemo(() => {
        return visibleLinks.map((item, index) => (
          <motion.div
            key={`${item.label}-${isMore}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
          >
            <MobileSpectrumLink
              item={item}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
          </motion.div>
        ));
      }, [visibleLinks, isMore, executeSpectrumRoute, updateUrlAndExecute, routeConfigs]);

      return (
        <div
          ref={ref}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          className={cn(
            'spectrum-item flex-center relative h-full w-full cursor-pointer flex-col overflow-visible p-4 text-foreground',
            className,
          )}
        >
          <div className={cn('flex flex-col items-center text-center', itemClassName)}>
            <div className="flex items-center gap-1.5">
              {cloneElement(icon, { className: 'spectrum-icon size-6 shrink-0 fill-white sm:size-7.5' })}
              <h4 className="spectrum-title bilingual-font text-lg font-semibold capitalize sm:text-[1.625rem]/7.5">{title}</h4>
            </div>
            <h4 className="spectrum-title-cn bilingual-font mt-1 text-base font-bold capitalize sm:mt-2 sm:text-xl/6">
              {titleCn}
            </h4>
            <div className="spectrum-links-container mt-3 flex flex-col sm:mt-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key="spectrum-links"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center sm:items-start"
                >
                  {spectrumLinks}
                </motion.div>
              </AnimatePresence>
              {showMoreButton && (
                <motion.button
                  onClick={handleMoreClick}
                  className="mt-1 flex items-center justify-center gap-1 font-poppins text-xs/5 font-medium text-cyan opacity-90 transition-colors hover:text-cyan/80 hover:opacity-100 sm:justify-start"
                >
                  {buttonText}
                  <ArrowSVG className={cn('size-3 fill-current transition duration-300', { 'rotate-180': isMore })} />
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
