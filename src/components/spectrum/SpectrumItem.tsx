import { GA_EVENT_NAMES } from '@/constants/ga';
import { SpectrumItemInfo, SpectrumLinkItem } from '@/hooks/spectrum/useSpectrumData';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { AnimatePresence, motion } from 'motion/react';
import { cloneElement, forwardRef, HTMLAttributes, memo, useCallback, useMemo, useState } from 'react';
import { spectrumLinkProps } from './spectrumLinkProps';
import ArrowSVG from '@/../public/svgs/arrow.svg?component';
import { SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';

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
}

export const SpectrumLink = memo(
  ({
    item,
    executeSpectrumRoute,
  }: {
    item: SpectrumLinkItem;
    executeSpectrumRoute?: (key: string) => void;
    updateUrlAndExecute?: (key: string) => void;
    routeConfigs?: SpectrumRouteConfig[];
  }) => {
    const { trackEvent } = useGA();

    const { key, label, link, isComingSoon, icon, labelClassName, routeKey, size } = item;
    const hasLink = Boolean(link);
    const anchorProps = spectrumLinkProps({
      link,
      routeKey,
      executeSpectrumRoute,
      onTrack: () => trackEvent({ name: GA_EVENT_NAMES.SPECTRUM_CLICK, label: key ?? label }),
    });

    const content = icon ? (
      <div className={cn('relative flex items-center gap-1', hasLink ? 'cursor-pointer' : 'cursor-default')}>
        <img src={icon} alt={`${label} logo`} className={cn('duration-300 hover:scale-110', size)} />
      </div>
    ) : (
      <div className={cn('relative flex items-center gap-1', hasLink ? 'cursor-pointer' : 'cursor-default')}>
        <p
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

    return anchorProps ? <a {...anchorProps}>{content}</a> : content;
  },
);

SpectrumLink.displayName = 'SpectrumLink';

const SpectrumItem = memo(
  forwardRef<HTMLDivElement, SpectrumItemProps>(
    ({ item, onClick, onHover, className, executeSpectrumRoute, updateUrlAndExecute, routeConfigs, isSponsor }, ref) => {
      const { title, titleCn, icon, links, linksClassName, className: itemClassName } = item;
      const [currentPage, setCurrentPage] = useState(0);
      const linksPerPage = 21;

      const { trackEvent } = useGA();

      const onMouseEnter = () => {
        onHover?.();
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
      }, [links, totalLinks, safePage, linksPerPage]);

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

      // Keep the supporting institutions visible together in three rows.
      const sponsorFirstRowLinks = useMemo(() => {
        if (!isSponsor) return [];
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
              <div className={cn('spectrum-links-container flex flex-col', isSponsor ? 'mt-6 w-full' : 'mt-5')}>
                <AnimatePresence mode="wait">
                  {isSponsor ? (
                    <motion.div
                      key="spectrum-links-sponsor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex w-full flex-col"
                    >
                      <div className="grid w-full grid-cols-7 items-center justify-items-center gap-x-5 gap-y-6 [&_img]:max-h-14 [&_img]:max-w-full [&_img]:object-contain">
                        {sponsorFirstRowLinks}
                      </div>
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
                    className={cn(
                      'mt-1 flex items-center gap-1 font-poppins text-xs/5 font-medium text-blue opacity-90 transition-colors hover:text-blue/80 hover:opacity-100',
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
