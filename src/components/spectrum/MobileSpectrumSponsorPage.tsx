'use client';

import { GA_EVENT_NAMES } from '@/constants/ga';
import { SpectrumItemInfo, SpectrumLinkItem } from '@/hooks/spectrum/useSpectrumData';
import { SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';
import { spectrumLinkProps } from './spectrumLinkProps';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { cloneElement, memo, useEffect, useState } from 'react';

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
  }: {
    item: SpectrumLinkItem;
    executeSpectrumRoute?: (key: string) => void;
    updateUrlAndExecute?: (key: string) => void;
    routeConfigs?: SpectrumRouteConfig[];
  }) => {
    const { trackEvent } = useGA();
    const { key, label, link, routeKey, icon, mobileSize } = item;
    const anchorProps = spectrumLinkProps({
      link,
      routeKey,
      executeSpectrumRoute,
      onTrack: () => trackEvent({ name: GA_EVENT_NAMES.SPECTRUM_CLICK, label: key ?? label }),
    });
    const className = 'flex items-center justify-center transition-opacity hover:opacity-80';
    const logo = icon && (
      <div className={cn('flex items-center justify-center', mobileSize || 'h-10')}>
        <img src={icon} alt={label} className="h-full w-auto object-contain" />
      </div>
    );

    return anchorProps ? (
      <a {...anchorProps} className={className}>
        {logo}
      </a>
    ) : (
      <div className={className}>{logo}</div>
    );
  },
);

SponsorLogoItem.displayName = 'SponsorLogoItem';

const MobileSpectrumSponsorPage = memo(
  ({ sponsorItem, executeSpectrumRoute, updateUrlAndExecute, routeConfigs, className }: MobileSpectrumSponsorPageProps) => {
    const { icon, links } = sponsorItem;

    // Scale down the entire sponsor block on short viewports (e.g. iPhone SE)
    // so all logos remain visible without scrolling.
    const DESIGN_HEIGHT = 844; // iPhone 12 Pro viewport height
    const [zoom, setZoom] = useState(1);
    useEffect(() => {
      const updateZoom = () => setZoom(Math.min(1, window.innerHeight / DESIGN_HEIGHT));
      updateZoom();
      window.addEventListener('resize', updateZoom);
      return () => window.removeEventListener('resize', updateZoom);
    }, []);

    return (
      <div
        className={cn('mt-3 flex w-full flex-col items-center justify-center px-6', className)}
        style={zoom < 1 ? { zoom } : undefined}
      >
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          {cloneElement(icon, { className: 'size-6 shrink-0 fill-white' })}
          <h4 className="font-oxanium text-base font-semibold">Proudly Supporting</h4>
          <span className="bilingual-font text-sm font-bold">本机构赞助支持</span>
        </div>

        {/* Logo Wall - max-w locks layout across all phone sizes, released on ipad */}
        <div className="flex w-full max-w-[342px] flex-wrap items-center justify-center gap-4 ipad:max-w-none">
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
