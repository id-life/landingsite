'use client';

import { SpectrumItemInfo, SpectrumLinkItem } from '@/hooks/spectrum/useSpectrumData';
import { SpectrumRouteConfig } from '@/hooks/spectrum/useSpectrumRouter';
import { spectrumLinkProps } from './spectrumLinkProps';
import { cn } from '@/utils';
import { cloneElement, memo, useEffect, useState } from 'react';
import { trackSpectrumLink } from '@/lib/analytics/spectrum';
import { layoutUnitPx } from '@/utils/layout-unit';

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
    const { key, label, link, routeKey, icon, mobileSize } = item;
    const anchorProps = spectrumLinkProps({
      link,
      routeKey,
      executeSpectrumRoute,
      onTrack: () => trackSpectrumLink({ key, label, link }, 'sponsor'),
    });
    // Each logo link is at least a 44 px box on coarse pointers (RWD-06), in the phone deck's unit (this page is drawn
    // only by the phone deck, whose unit is never below 16 px), so an upright tablet keeps the phone's picture at its
    // factor.
    const className =
      'flex items-center justify-center transition-opacity coarse:min-h-[2.75rem] coarse:min-w-[2.75rem] hover:opacity-80';
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
    const DESIGN_HEIGHT = 844; // iPhone 12 Pro viewport height, at the phone's 16 px unit
    const [zoom, setZoom] = useState(1);
    useEffect(() => {
      // The window's height in the deck's unit, so an upright tablet scales the block exactly as the phone it stands
      // for (the unit is 16 px on every phone up to 599 px wide, where this is the plain height).
      const updateZoom = () => setZoom(Math.min(1, window.innerHeight / (layoutUnitPx() / 16 || 1) / DESIGN_HEIGHT));
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
          <h4 className="font-display text-base font-semibold">Proudly Supporting</h4>
          <span className="bilingual-font text-sm font-bold">本机构赞助支持</span>
        </div>

        {/* Logo Wall - max-w (in the deck unit) locks the layout at every phone-deck width */}
        <div className="flex w-full max-w-[21.375rem] flex-wrap items-center justify-center gap-4">
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
