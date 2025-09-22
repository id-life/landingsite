import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { HTMLAttributes, useCallback, useMemo } from 'react';
import {
  BookSVG,
  DigitalTwinSVG,
  InternSVG,
  MeetingSVG,
  MuseumSVG,
  PodcastSVG,
  RelationSVG,
  SponsorSVG,
} from '../../components/svg';
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
};

export type SpectrumItemInfo = {
  title: string;
  titleCn: string;
  icon: JSX.Element;
  links?: SpectrumLinkItem[];
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
      { key: 'bioacc-manifesto', action: handleClickDot('book', 1) },
      { key: 'the-network-state', action: handleClickDot('book', 0) },
      { key: 'better-with-age', action: handleClickDot('book', 2) },
      // sponsor
      { key: 'vitalist-bay-summit-grant', action: handleClickDot('meeting', 4) },
      { key: 'ardd-2025', action: handleClickDot('meeting', 6) },
      { key: '2060-longevity-forum', action: handleClickDot('meeting', 7) },
      { key: 'lifespan-research-institute', action: handleClickDot('sponsor', 3) },
      { key: 'public-longevity-group', action: handleClickDot('sponsor', 3) },
      { key: 'biohacker-dao', action: handleClickDot('sponsor', 2) },
      { key: 'eth-panda', action: handleClickDot('sponsor', 0) },
      { key: 'revive-me-2025', action: handleClickDot('sponsor', 4) },
      // digital twin
      { key: 'digital-twin', action: handleClickDigitalTwin, pathname: '/digitaltwin', useHash: false },
    ],
    [handleClickDot, handleClickDigitalTwin],
  );

  const { executeSpectrumRoute, updateUrlAndExecute } = useSpectrumRouter(routeConfigs);

  const spectrumData: SpectrumItemInfo[] = useMemo(() => {
    const data: SpectrumItemInfo[] = [
      {
        title: 'Insights & Advocacy',
        titleCn: '演讲与洞见',
        icon: <MeetingSVG />,
        links: [
          {
            label: 'Founders Forum Global',
            routeKey: 'founders-forum-global',
          },
          {
            label: 'Founders Longevity Forum London',
            routeKey: 'founders-longevity-forum-london',
          },
          {
            label: 'Founders Longevity Forum Singapore',
            routeKey: 'founders-longevity-forum-singapore',
          },
          {
            label: 'Vitalist Bay Summit',
            routeKey: 'vitalist-bay-summit',
          },
          {
            label: 'Timepie Longevity Forum',
            routeKey: 'timepie-longevity-forum',
          },
          {
            label: 'Edge City Lanna',
            routeKey: 'edge-city-lanna',
          },
          {
            label: 'Oxford Future Innovation Forum',
            routeKey: 'oxford-future-innovation-forum',
          },
        ],
      },
      {
        title: 'Translation & Publishing',
        titleCn: '翻译与出版',
        icon: <BookSVG />,
        className: '-ml-8 mobile:ml-0',
        links: [
          {
            label: 'bio/acc manifesto',
            routeKey: 'bioacc-manifesto',
          },
          {
            label: 'The Network State',
            labelClassName: 'italic',
            routeKey: 'the-network-state',
          },
          {
            label: 'Better With Age',
            labelClassName: 'italic',
            routeKey: 'better-with-age',
          },
          {
            label: 'The case against death',
            isComingSoon: true,
            labelClassName: 'italic',
          },
        ],
      },
      {
        title: 'Grant & Sponsorships',
        titleCn: '赞助',
        icon: <SponsorSVG />,
        links: [
          {
            key: 'Vitalist Bay Summit Grant',
            label: 'Vitalist Bay Summit',
            routeKey: 'vitalist-bay-summit-grant',
          },
          {
            label: 'ARDD 2025',
            routeKey: 'ardd-2025',
          },
          {
            label: '2060 Longevity Forum',
            routeKey: '2060-longevity-forum',
          },
          {
            label: 'REVIVE ME 2025',
            routeKey: 'revive-me-2025',
          },
          {
            label: 'Lifespan Research Institute',
            routeKey: 'lifespan-research-institute',
          },
          {
            label: 'Public Longevity Group',
            routeKey: 'public-longevity-group',
          },
          {
            label: 'Beyond Tomorrow Podcast',
            link: 'https://beyondtomorrowpodcast.com/',
          },
          {
            label: 'BiohackerDAO',
            routeKey: 'biohacker-dao',
          },
          {
            label: 'ETHPanda 青年黑客远航计划',
            routeKey: 'eth-panda',
          },
        ],
      },
      {
        title: 'Podcast',
        titleCn: '播客',
        icon: <PodcastSVG />,
        links: [
          {
            label: 'Immortal Dragons  不朽真龙',
            link: '/podcast',
          },
          {
            label: 'Long Talk  龙门阵',
            link: '/podcast?c=lt',
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
            label: 'Disease Management & Cure Status',
            link: '/spectrum/disease-management',
          },
        ],
      },
      {
        title: 'Digital Twin',
        titleCn: '数字孪生',
        icon: <DigitalTwinSVG />,
        className: '-ml-8 mobile:ml-0',
        links: [
          {
            label: 'Access Digital Twin',
            routeKey: 'digital-twin',
          },
        ],
      },
      {
        title: 'ID Gallery Museum',
        titleCn: '总部办公室',
        icon: <MuseumSVG />,
        links: [
          {
            label: '3 Biopolis Dr, Singapore 138623',
            link: 'https://maps.app.goo.gl/sXGuujRuCP8nmjJF9',
          },
        ],
      },
      {
        title: 'Global Internship',
        titleCn: '实习生计划',
        icon: <InternSVG />,
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
    ];
    return data;
  }, []);

  return { spectrumData, executeSpectrumRoute, updateUrlAndExecute, routeConfigs };
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
      url: '/imgs/particle/spectrum/01.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/02.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/03.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/04.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/05.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/06.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/07.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
    },
    {
      url: '/imgs/particle/spectrum/08.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      // loadPercentage: isMobile ? 0.01 : 0.015,
    },
  ];
};
