import { spectrumBaseData, SpectrumItemData, SpectrumLinkData } from '@/app/spectrum/_components/spectrumData';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { HTMLAttributes, useCallback, useMemo } from 'react';
import { useEngagementClickPoint } from '../engagement/useEngagementClickPoint';
import { useIsMobile } from '../useIsMobile';
import { useMobileNavigation } from '../useMobileNavigation';
import { useNavigation } from '../useNavigation';
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

  const handleClickDigitalTwin = useCallback(() => {
    isMobile ? mobileNavChange(NAV_LIST[4]) : handleNavClick(NAV_LIST[4]);
  }, [isMobile, mobileNavChange, handleNavClick]);

  const handleClickDot = useCallback(
    (type: 'book' | 'sponsor' | 'meeting', index: number) => {
      return () => {
        if (isMobile) {
          mobileNavChange(NAV_LIST[3]);
        } else {
          handleNavClick(NAV_LIST[3]);
        }
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
    () => [
      // meeting
      { key: 'founders-forum-global', action: handleClickDot('meeting', 5) },
      { key: 'founders-longevity-forum-london', action: handleClickDot('meeting', 5) },
      { key: 'founders-longevity-forum-singapore', action: handleClickDot('meeting', 2) },
      { key: 'vitalist-bay-summit', action: handleClickDot('meeting', 4) },
      { key: 'timepie-longevity-forum', action: handleClickDot('meeting', 0) },
      { key: 'edge-city-lanna', action: handleClickDot('meeting', 1) },
      { key: 'oxford-future-innovation-forum', action: handleClickDot('sponsor', 1) },
      // book
      { key: 'the-network-state', action: handleClickDot('book', 0) },
      { key: 'better-with-age', action: handleClickDot('book', 1) },
      // sponsor
      { key: 'vitalist-bay-summit-grant', action: handleClickDot('meeting', 4) },
      { key: 'ardd-2025', action: handleClickDot('meeting', 6) },
      { key: '2060-longevity-forum', action: handleClickDot('meeting', 7) },
      { key: 'lifespan-research-institute', action: handleClickDot('sponsor', 3) },
      { key: 'public-longevity-group', action: handleClickDot('sponsor', 3) },
      { key: 'biohacker-dao', action: handleClickDot('sponsor', 2) },
      { key: 'eth-panda', action: handleClickDot('sponsor', 0) },
      { key: 'revive-me-2025', action: handleClickDot('sponsor', 2) },
      { key: 'healthy-longevity-medicine-conference', action: handleClickDot('meeting', 2) },
      // digital twin
      { key: 'digital-twin', action: handleClickDigitalTwin, pathname: '/digitaltwin', useHash: false },
    ],
    [handleClickDot, handleClickDigitalTwin],
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
      url: '/imgs/particle/spectrum/08.png',
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
