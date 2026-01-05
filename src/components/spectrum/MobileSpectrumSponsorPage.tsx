'use client';

import { GA_EVENT_NAMES } from '@/constants/ga';
import { SpectrumItemInfo, SpectrumLinkItem } from '@/hooks/spectrum/useSpectrumData';
import { generateSpectrumUrl, SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { cloneElement, memo } from 'react';

interface MobileSpectrumSponsorPageProps {
  sponsorItem: SpectrumItemInfo;
  executeSpectrumRoute?: (key: string) => void;
  updateUrlAndExecute?: (key: string) => void;
  routeConfigs?: SpectrumRouteConfig[];
  className?: string;
}

const SponsorLogoItem = memo(
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
    const { key, label, link, onClick, routeKey, icon, mobileSize } = item;
    const hasLink = Boolean(link || onClick || routeKey);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasLink) return;
      trackEvent({
        name: GA_EVENT_NAMES.SPECTRUM_CLICK,
        label: key ?? label,
      });

      if (routeKey) {
        if (updateUrlAndExecute) {
          updateUrlAndExecute(routeKey);
        } else if (executeSpectrumRoute) {
          executeSpectrumRoute(routeKey);
        }
        return;
      }

      onClick?.();
      if (link) window.open(link, '_blank');
    };

    const routeConfig = routeConfigs?.find((config) => config.key === routeKey);
    const { pathname, useHash } = routeConfig ?? {};

    return (
      <a
        href={generateSpectrumUrl(item?.routeKey ?? '', pathname, useHash)}
        target="_blank"
        onClick={handleClick}
        className="flex items-center justify-center transition-opacity hover:opacity-80"
      >
        {icon && (
          <div className={cn('flex items-center justify-center', mobileSize || 'h-10')}>
            <img src={icon} alt={label} className="h-full w-auto object-contain" />
          </div>
        )}
      </a>
    );
  },
);

SponsorLogoItem.displayName = 'SponsorLogoItem';

const MobileSpectrumSponsorPage = memo(
  ({ sponsorItem, executeSpectrumRoute, updateUrlAndExecute, routeConfigs, className }: MobileSpectrumSponsorPageProps) => {
    const { icon, links } = sponsorItem;

    return (
      <div className={cn('flex h-full w-full flex-col items-center justify-center px-6', className)}>
        {/* Header */}
        <div className="mb-6 flex items-center gap-2">
          {cloneElement(icon, { className: 'size-6 shrink-0 fill-white' })}
          <h4 className="font-oxanium text-base font-semibold">Proudly Supporting</h4>
          <span className="bilingual-font text-sm font-bold">本机构赞助支持</span>
        </div>

        {/* Logo Wall - Flex wrap layout */}
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          {links?.map((item, index) => (
            <SponsorLogoItem
              key={item.label || index}
              item={item}
              executeSpectrumRoute={executeSpectrumRoute}
              updateUrlAndExecute={updateUrlAndExecute}
              routeConfigs={routeConfigs}
            />
          ))}
        </div>
      </div>
    );
  },
);

MobileSpectrumSponsorPage.displayName = 'MobileSpectrumSponsorPage';

export default MobileSpectrumSponsorPage;
