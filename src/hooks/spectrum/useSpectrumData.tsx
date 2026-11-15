import { spectrumBaseData, SpectrumItemData, SpectrumLinkData } from '@/app/spectrum/_components/spectrumData';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV, SectionId } from '@/components/nav/nav';
import { HTMLAttributes, useCallback, useMemo } from 'react';
import { useEngagementClickPoint } from '../engagement/useEngagementClickPoint';
import { useIsMobile } from '../useIsMobile';
import { useMobileNavigation } from '../useMobileNavigation';
import { useNavigation } from '../useNavigation';
import { SPECTRUM_HASH_ROUTES, SpectrumHashRoute } from './spectrum-routes';
import { SpectrumRouteConfig, useSpectrumRouter } from './useSpectrumRouter';

export type SpectrumLinkItem = SpectrumLinkData & {
  key?: string;
  onClick?: () => void;
  className?: string;
};

export type SpectrumItemInfo = SpectrumItemData & {
  onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
};

export const useSpectrumData = () => {
  const isMobile = useIsMobile();
  const { handleNavClick } = useNavigation();
  const { mobileNavChange } = useMobileNavigation();
  const { handleClickPoint } = useEngagementClickPoint(false);

  // Opens a section by id (never by position in NAV_LIST) and, after the move, the dot the link names.
  const openRoute = useCallback(
    (section: SectionId, dot?: SpectrumHashRoute['dot']) => {
      return () => {
        if (isMobile) {
          mobileNavChange(NAV[section]);
        } else {
          handleNavClick(NAV[section]);
        }
        if (!dot) return;
        const { type, index } = dot;
        setTimeout(() => {
          handleClickPoint(type, index, true);
          if (isMobile) {
            eventBus.next({
              type: MessageType.MOBILE_SCROLL_TO_ACTIVE_POINT,
              payload: { type, index },
            });
          }
        }, 300);
      };
    },
    [isMobile, mobileNavChange, handleNavClick, handleClickPoint],
  );

  const routeConfigs: SpectrumRouteConfig[] = useMemo(
    () =>
      SPECTRUM_HASH_ROUTES.map(({ key, section, dot, pathname, useHash }) => ({
        key,
        action: openRoute(section, dot),
        pathname: pathname ?? NAV[section].href,
        useHash,
      })),
    [openRoute],
  );

  const { executeSpectrumRoute, updateUrlAndExecute } = useSpectrumRouter(routeConfigs);

  const spectrumData: SpectrumItemInfo[] = spectrumBaseData;

  // For mobile: separate main items (first 4) from sponsors (last item)
  const spectrumMainItems = useMemo(() => spectrumData.slice(0, 4), [spectrumData]);
  const spectrumSponsorItem = useMemo(() => spectrumData[4], [spectrumData]);

  return {
    spectrumData,
    spectrumMainItems,
    spectrumSponsorItem,
    executeSpectrumRoute,
    updateUrlAndExecute,
    routeConfigs,
  };
};

export const spectrumGetSourceImgInfos = (isMobile: boolean) => {
  return [
    {
      url: '/imgs/particle/0.png',
      scaleNum: isMobile ? 0.4 : 1.8,
      loadPercentage: isMobile ? 0.01 : 0.015,
      resize: [512, 300],
    },
    {
      url: '/imgs/particle/spectrum/02.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.3 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/05.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.3 : 0.9, // Larger for sponsor page (single particle)
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/06.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.3 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/papers-reviews.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.3 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/03.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    // deprecated particles
    {
      url: '/imgs/particle/spectrum/01.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.3 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/07.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.3 : 0.9,
    },
    {
      url: '/imgs/particle/spectrum/04.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.3 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
  ];
};
