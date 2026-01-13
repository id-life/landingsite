import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { HTMLAttributes, useCallback, useMemo } from 'react';
import { BookSVG, DigitalTwinSVG, InternSVG, RelationSVG, SponsorSVG } from '../../components/svg';
import { useEngagementClickPoint } from '../engagement/useEngagementClickPoint';
import { useIsMobile } from '../useIsMobile';
import { useMobileNavigation } from '../useMobileNavigation';
import { useNavigation } from '../useNavigation';
import { SpectrumRouteConfig, useSpectrumRouter } from './useSpectrumRouter';

export type SpectrumLinkItem = {
  key?: string;
  label: string;
  link?: string; // jumpTo link
  onClick?: () => void; // jumpTo some where
  className?: string;
  isComingSoon?: boolean;
  labelClassName?: string;
  routeKey?: string; // for URL routing
  icon?: string;
  size?: string;
  mobileSize?: string;
};

export type SpectrumItemInfo = {
  title: string;
  titleCn: string;
  icon: JSX.Element;
  links?: SpectrumLinkItem[];
  linksClassName?: string;
  className?: string;
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

  const spectrumData: SpectrumItemInfo[] = useMemo(() => {
    const data: SpectrumItemInfo[] = [
      {
        title: 'Translation & Publishing',
        titleCn: '翻译与出版',
        icon: <BookSVG />,
        linksClassName: 'grid grid-cols-2',
        links: [
          {
            label: 'Bio/Acc Manifesto',
            routeKey: 'biohacker-dao',
          },
          {
            label: 'The case against death',
            isComingSoon: true,
            labelClassName: '-ml-4 mobile:ml-0 text-[.5rem]/3',
          },
          {
            label: 'The Network State',
            routeKey: 'the-network-state',
          },
          {
            label: 'Better With Age',
            labelClassName: '-ml-4 mobile:ml-0',
            routeKey: 'better-with-age',
          },
        ],
      },
      {
        title: 'Evanglism',
        titleCn: '布道者',
        icon: <RelationSVG />,
        links: [
          {
            label: 'Influence Network',
            link: '/spectrum/influence-network',
          },
          {
            label: 'Disease Management',
            link: '/spectrum/disease-management',
          },
        ],
      },
      {
        title: 'Digital Twin',
        titleCn: '数字孪生',
        icon: <DigitalTwinSVG />,
        className: 'mobile:pt-4',
        links: [
          {
            label: 'Access Digital Twin',
            routeKey: 'digital-twin',
          },
        ],
      },
      {
        title: 'Global Internship',
        titleCn: '实习生计划',
        icon: <InternSVG />,
        className: 'mobile:pt-4',
        links: [
          {
            label: 'Apply (CN)',
            link: 'https://id.life/career',
          },
          {
            label: 'Apply (EN)',
            link: 'https://id.life/career-en',
          },
        ],
      },
      {
        className: 'mobile:text-xl',
        title: 'Proudly Sponsoring & Supporting',
        titleCn: '本机构赞助支持',
        icon: <SponsorSVG />,
        links: [
          {
            label: 'ARDD',
            routeKey: 'ardd-2025',
            icon: '/imgs/investments/sponsors/ardd.png',
            size: 'h-15',
            mobileSize: 'h-10.5 ipad:h-15',
          },
          {
            label: 'TimePie Longevity Forum',
            routeKey: 'timepie-longevity-forum',
            icon: '/imgs/investments/sponsors/time-pie.png',
            size: 'h-15',
            mobileSize: 'h-10.5 ipad:h-14',
          },
          {
            label: 'Lifespan Research Institute',
            routeKey: 'lifespan-research-institute',
            icon: '/imgs/investments/sponsors/lifespan.png',
            size: 'h-12',
            mobileSize: 'h-8 ipad:h-13',
          },
          {
            label: 'Public Longevity Group',
            routeKey: 'public-longevity-group',
            icon: '/imgs/investments/sponsors/public-longevity.png',
            size: 'h-15',
            mobileSize: 'h-10.5 ipad:h-15',
          },
          {
            label: '2060 Longevity Forum',
            routeKey: '2060-longevity-forum',
            icon: '/imgs/investments/sponsors/2060-longevity.png',
            size: 'h-12',
            mobileSize: 'h-8 ipad:h-13',
          },
          {
            label: 'REVIVE ME',
            routeKey: 'revive-me-2025',
            icon: '/imgs/investments/sponsors/revive-me.png',
            size: 'h-12',
            mobileSize: 'h-8 ipad:h-13',
          },
          {
            label: 'Health Longevity and Medicine Conference',
            routeKey: 'healthy-longevity-medicine-conference',
            icon: '/imgs/investments/sponsors/healthy-longevity.png',
            size: 'h-15',
            mobileSize: 'h-10.5 ipad:h-15',
          },
          {
            label: 'Vitalist Bay Summit',
            routeKey: 'vitalist-bay-summit-grant',
            icon: '/imgs/investments/sponsors/vitalist-bay.png',
            size: 'h-12',
            mobileSize: 'h-8 ipad:h-13',
          },
          {
            label: 'Cornerstone Non-profit Foundation',
            link: 'https://www.cornerstoneondemand.org',
            icon: '/imgs/investments/sponsors/cornerstone.png',
            size: 'h-6.5',
            mobileSize: 'h-4.5 ipad:h-6.5',
          },
          {
            label: 'Beyond Tomorrow Podcast',
            link: 'https://beyondtomorrowpodcast.com/',
            icon: '/imgs/investments/sponsors/beyond-tomorrow.png',
            size: 'h-5',
            mobileSize: 'h-3.5 ipad:h-4.5',
          },
          {
            label: 'HackAging.ai Hackathon', // 11
            link: 'https://www.hackaging.ai/',
            icon: '/imgs/investments/sponsors/hackaging.png',
            size: 'h-5',
            mobileSize: 'h-3.5 ipad:h-4.5',
          },
          {
            label: 'BioHackerDAO',
            link: 'https://biohackerdao.org/',
            icon: '/imgs/investments/sponsors/biohackerdao.png',
            size: 'h-15',
            mobileSize: 'h-10.5 ipad:h-15',
          },
        ],
      },
    ];
    return data;
  }, []);

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
