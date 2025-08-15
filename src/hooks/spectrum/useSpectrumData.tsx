import { isMobileEngagementJumpAtom } from '@/atoms/engagement';
import { NAV_LIST } from '@/components/nav/nav';
import { useSetAtom } from 'jotai';
import { HTMLAttributes, useCallback, useEffect, useMemo } from 'react';
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
import { isCharacterRelationShowAtom, isMobileCharacterRelationShowAtom } from '@/atoms/character-relation';
import { showDiseaseManagementContentAtom } from '@/atoms/spectrum';
import { getMobileDotShowInfo } from '@/constants/engagement';
import { useSpectrumRouter, SpectrumRouteConfig } from './useSpectrumRouter';

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
  const setIsMobileEngagementJump = useSetAtom(isMobileEngagementJumpAtom);
  const setIsCharacterRelationShow = useSetAtom(isCharacterRelationShowAtom);
  const setIsMobileCharacterRelationShow = useSetAtom(isMobileCharacterRelationShowAtom);
  const setShowDiseaseManagement = useSetAtom(showDiseaseManagementContentAtom);

  const scrollToActivePoint = useCallback((type: 'meeting' | 'book' | 'sponsor', index: number, offset: number = 0) => {
    const scrollContainer = document.querySelector('.world-map-container');
    const activeEle =
      type === 'meeting'
        ? document.querySelector(`.world-map-dot-${index}`)
        : type === 'book'
          ? document.querySelector(`.world-map-dot-book-${index}`)
          : document.querySelector(`.world-map-dot-sponsor-${index}`);
    if (scrollContainer && activeEle) {
      const containerEl = scrollContainer as HTMLDivElement;
      const eleEl = activeEle as HTMLDivElement;
      const targetScrollLeft = eleEl.offsetLeft - offset;
      containerEl.scrollTo({ behavior: 'smooth', left: targetScrollLeft });
    }
  }, []);

  const handleClickDigitalTwin = useCallback(() => {
    isMobile ? mobileNavChange(NAV_LIST[4]) : handleNavClick(NAV_LIST[4]);
  }, [isMobile, mobileNavChange, handleNavClick]);

  const handleCharacterRelationShow = useCallback(() => {
    if (isMobile) {
      mobileNavChange(NAV_LIST[2]);
      setTimeout(() => {
        setIsMobileCharacterRelationShow(true);
      }, 400);
    } else {
      handleNavClick(NAV_LIST[2]);
      setTimeout(() => {
        setIsCharacterRelationShow(true);
      }, 400);
    }
  }, [handleNavClick, isMobile, mobileNavChange, setIsCharacterRelationShow, setIsMobileCharacterRelationShow]);

  const handleDiseaseManagementClick = useCallback(() => {
    isMobile ? mobileNavChange(NAV_LIST[2]) : handleNavClick(NAV_LIST[2]);
    setTimeout(() => {
      setShowDiseaseManagement(true);
    }, 400);
  }, [handleNavClick, isMobile, mobileNavChange, setShowDiseaseManagement]);

  const handleClickDot = useCallback(
    (type: 'book' | 'sponsor' | 'meeting', index: number) => {
      return () => {
        if (isMobile) {
          mobileNavChange(NAV_LIST[3]);
          setIsMobileEngagementJump(true);
        } else {
          handleNavClick(NAV_LIST[3]);
        }
        setTimeout(() => {
          handleClickPoint(type, index, true);
          if (isMobile) {
            const offset = getMobileDotShowInfo(type, index)?.offset ?? 0;
            scrollToActivePoint(type, index, offset);
          }
        }, 300);
      };
    },
    [isMobile, mobileNavChange, handleNavClick, setIsMobileEngagementJump, handleClickPoint, scrollToActivePoint],
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
      { key: 'ardd-2025', action: handleClickDot('sponsor', 4) },
      { key: '2060-longevity-forum', action: handleClickDot('sponsor', 5) },
      { key: 'lifespan-research-institute', action: handleClickDot('sponsor', 3) },
      { key: 'public-longevity-group', action: handleClickDot('sponsor', 3) },
      { key: 'biohacker-dao', action: handleClickDot('sponsor', 2) },
      { key: 'eth-panda', action: handleClickDot('sponsor', 0) },
      // evanglism
      { key: 'influence-network', action: handleCharacterRelationShow },
      { key: 'disease-management', action: handleDiseaseManagementClick },
      // digital twin
      { key: 'digital-twin', action: handleClickDigitalTwin },
    ],
    [handleClickDot, handleCharacterRelationShow, handleDiseaseManagementClick, handleClickDigitalTwin],
  );

  const { openSpectrumInNewTab, executeSpectrumRoute } = useSpectrumRouter(routeConfigs);

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
        className: '-ml-8',
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
            routeKey: 'influence-network',
          },
          {
            label: 'Disease Management & Cure Status',
            routeKey: 'disease-management',
          },
        ],
      },
      {
        title: 'Digital Twin',
        titleCn: '数字孪生',
        icon: <DigitalTwinSVG />,
        className: '-ml-8',
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

  return { spectrumData, openSpectrumInNewTab, executeSpectrumRoute };
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
      resize: [1060, 700],
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
