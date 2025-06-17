import { isMobileEngagementJumpAtom } from '@/atoms/engagement';
import { NAV_LIST } from '@/components/nav/nav';
import { useSetAtom } from 'jotai';
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
import { isCharacterRelationShowAtom, isMobileCharacterRelationShowAtom } from '@/atoms/character-relation';
import { showDiseaseManagementContentAtom } from '@/atoms/spectrum';

export type SpectrumLinkItem = {
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

  const scrollToActivePoint = useCallback((type: 'meeting' | 'book' | 'sponsor', index: number) => {
    const scrollContainer = document.querySelector('.world-map-container');
    const activeEle =
      type === 'meeting'
        ? document.querySelector(`.world-map-dot-${index}`)
        : type === 'book'
          ? document.querySelector(`.world-map-dot-book-${index}`)
          : document.querySelector(`.world-map-dot-sponsor-${index}`);
    if (scrollContainer && activeEle) {
      activeEle.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  const handleClickDigitalTwin = useCallback(() => {
    isMobile ? mobileNavChange(NAV_LIST[4]) : handleNavClick(NAV_LIST[4]);
  }, [isMobile, mobileNavChange, handleNavClick]);

  const handleClickDot = useCallback(
    (type: 'book' | 'sponsor' | 'meeting', index: number) => {
      isMobile ? mobileNavChange(NAV_LIST[3]) : handleNavClick(NAV_LIST[3]);
      isMobile && setIsMobileEngagementJump(true);
      setTimeout(() => {
        handleClickPoint(type, index, true);
        if (isMobile) scrollToActivePoint(type, index);
      }, 300);
    },
    [isMobile, mobileNavChange, handleNavClick, setIsMobileEngagementJump, handleClickPoint, scrollToActivePoint],
  );

  const handleCharacterRelationShow = useCallback(() => {
    isMobile ? setIsMobileCharacterRelationShow(true) : setIsCharacterRelationShow(true);
  }, [isMobile, setIsCharacterRelationShow, setIsMobileCharacterRelationShow]);

  const handleDiseaseManagementClick = useCallback(() => {
    setShowDiseaseManagement(true);
  }, [setShowDiseaseManagement]);


  const spectrumData: SpectrumItemInfo[] = useMemo(() => {
    const data: SpectrumItemInfo[] = [
      {
        title: 'Insights Sharing',
        titleCn: '演讲与洞见',
        icon: <MeetingSVG />,
        links: [
          {
            label: 'Timepie Longevity Forum',
            onClick: () => handleClickDot('meeting', 0),
          },
          {
            label: "Founder's Longevity Forum",
            onClick: () => handleClickDot('meeting', 2),
          },
          {
            label: 'Vitalist Bay Investor Forum',
            onClick: () => handleClickDot('meeting', 4),
          },
          {
            label: 'Edge City Lanna',
            onClick: () => handleClickDot('meeting', 1),
          },
          {
            label: 'Oxford Future Innovation Forum',
            onClick: () => handleClickDot('sponsor', 1),
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
            onClick: () => handleClickDot('book', 1),
          },
          {
            label: 'The Network State',
            onClick: () => handleClickDot('book', 0),
            labelClassName: 'italic',
          },
          {
            label: 'Better With Age',
            onClick: () => handleClickDot('book', 2),
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
            label: 'Public Longevity Group',
            onClick: () => handleClickDot('sponsor', 3),
          },
          {
            label: 'ETHPanda 青年黑客远航计划',
            onClick: () => handleClickDot('sponsor', 0),
          },
          {
            label: 'BiohackerDAO',
            onClick: () => handleClickDot('sponsor', 2),
          },
          {
            label: 'Vitalist Bay',
            onClick: () => handleClickDot('sponsor', 4),
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
            link: 'https://www.xiaoyuzhoufm.com/podcast/68244dd700fe41f83952e9d8',
          },
          {
            label: 'Long Talk  龙门阵',
            link: 'https://www.xiaoyuzhoufm.com/podcast/67cff760566d55be46eb7ead ',
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
            onClick: () => handleCharacterRelationShow(),
          },
          {
            label: 'Disease Management & Cure Status',
            onClick: () => {
              setShowDiseaseManagement(true);
            },
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
  }, [handleCharacterRelationShow, handleClickDigitalTwin, handleClickDot, setShowDiseaseManagement]);

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
