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

export type SpectrumLinkItem = {
  key?: string;
  label: string;
  link?: string; // jumpTo link
  onClick?: () => void; // jumpTo some where
  className?: string;
  isComingSoon?: boolean;
  labelClassName?: string;
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
    isMobile ? setIsMobileCharacterRelationShow(true) : setIsCharacterRelationShow(true);
  }, [isMobile, setIsCharacterRelationShow, setIsMobileCharacterRelationShow]);

  const handleDiseaseManagementClick = useCallback(() => {
    setShowDiseaseManagement(true);
  }, [setShowDiseaseManagement]);

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

  const spectrumData: SpectrumItemInfo[] = useMemo(() => {
    const data: SpectrumItemInfo[] = [
      {
        title: 'Insights Sharing',
        titleCn: '演讲与洞见',
        icon: <MeetingSVG />,
        links: [
          {
            label: 'Founders Forum Global',
            onClick: handleClickDot('meeting', 5),
          },
          {
            label: 'Founders Longevity Forum London',
            onClick: handleClickDot('meeting', 5),
          },
          {
            label: 'Founders Longevity Forum Singapore',
            onClick: handleClickDot('meeting', 2),
          },
          {
            label: 'Vitalist Bay Summit',
            onClick: handleClickDot('meeting', 4),
          },
          {
            label: 'Timepie Longevity Forum',
            onClick: handleClickDot('meeting', 0),
          },
          {
            label: 'Edge City Lanna',
            onClick: handleClickDot('meeting', 1),
          },
          {
            label: 'Oxford Future Innovation Forum',
            onClick: handleClickDot('sponsor', 1),
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
            onClick: handleClickDot('book', 1),
          },
          {
            label: 'The Network State',
            onClick: handleClickDot('book', 0),
            labelClassName: 'italic',
          },
          {
            label: 'Better With Age',
            onClick: handleClickDot('book', 2),
            labelClassName: 'italic',
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
            onClick: handleClickDot('meeting', 4),
          },
          {
            label: 'ARDD 2025',
            onClick: handleClickDot('sponsor', 4),
          },
          {
            label: '2060 Longevity Forum',
            onClick: handleClickDot('sponsor', 5),
          },
          {
            label: 'Lifespan Research Institute',
            onClick: handleClickDot('sponsor', 3),
          },
          {
            label: 'Public Longevity Group',
            onClick: handleClickDot('sponsor', 3),
          },
          {
            label: 'Beyond Tomorrow Podcast',
            link: 'https://beyondtomorrowpodcast.com/',
          },
          {
            label: 'BiohackerDAO',
            onClick: handleClickDot('sponsor', 2),
          },
          {
            label: 'ETHPanda 青年黑客远航计划',
            onClick: handleClickDot('sponsor', 0),
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
            onClick: handleCharacterRelationShow,
          },
          {
            label: 'Disease Management & Cure Status',
            onClick: handleDiseaseManagementClick,
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
            onClick: handleClickDigitalTwin,
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
  }, [handleClickDot, handleDiseaseManagementClick, handleCharacterRelationShow, handleClickDigitalTwin]);

  return spectrumData;
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
