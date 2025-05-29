import { isMobileEngagementJumpAtom } from '@/atoms/engagement';
import { NAV_LIST } from '@/components/nav/nav';
import { useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
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
};

export const useSpectrumData = () => {
  const isMobile = useIsMobile();
  const { handleNavClick } = useNavigation();
  const { mobileNavChange } = useMobileNavigation();
  const { handleClickPoint } = useEngagementClickPoint();
  const setIsMobileEngagementJump = useSetAtom(isMobileEngagementJumpAtom);

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

  const spectrumData: SpectrumItemInfo[] = useMemo(() => {
    const handleClickMeeting = (index: number) => {
      isMobile ? mobileNavChange(NAV_LIST[3]) : handleNavClick(NAV_LIST[3]);
      isMobile && setIsMobileEngagementJump(true);
      setTimeout(() => {
        handleClickPoint('meeting', index, true);
        if (isMobile) scrollToActivePoint('meeting', index);
      }, 300);
    };
    const handleClickBook = (index: number) => {
      isMobile ? mobileNavChange(NAV_LIST[3]) : handleNavClick(NAV_LIST[3]);
      isMobile && setIsMobileEngagementJump(true);
      setTimeout(() => {
        handleClickPoint('book', index, true);
        if (isMobile) scrollToActivePoint('book', index);
      }, 300);
    };
    const handleClickSponsor = (index: number) => {
      isMobile ? mobileNavChange(NAV_LIST[3]) : handleNavClick(NAV_LIST[3]);
      isMobile && setIsMobileEngagementJump(true);
      setTimeout(() => {
        handleClickPoint('sponsor', index, true);
        if (isMobile) scrollToActivePoint('sponsor', index);
      }, 300);
    };
    const data: SpectrumItemInfo[] = [
      {
        title: 'Insights Sharing',
        titleCn: '演讲与洞见',
        icon: <MeetingSVG />,
        links: [
          {
            label: 'Timepie Longevity Forum',
            onClick: () => handleClickMeeting(0),
          },
          {
            label: "Founder's Longevity Forum",
            onClick: () => handleClickMeeting(2),
          },
          {
            label: 'Vitalist Bay Investor Forum',
            onClick: () => handleClickMeeting(4),
          },
          {
            label: 'Edge City Lanna',
            onClick: () => handleClickMeeting(1),
          },
          {
            label: 'Oxford Future Innovation Forum',
            onClick: () => handleClickSponsor(1),
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
            onClick: () => handleClickBook(1),
          },
          {
            label: 'The Network State',
            onClick: () => handleClickBook(0),
            labelClassName: 'italic',
          },
          {
            label: 'Better With Age',
            onClick: () => handleClickBook(2),
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
            onClick: () => handleClickSponsor(3),
          },
          {
            label: 'EthPanda',
            onClick: () => handleClickSponsor(0),
          },
          {
            label: 'BiohackerDAO',
            onClick: () => handleClickSponsor(2),
          },
          {
            label: 'Vitalist Bay',
            onClick: () => handleClickMeeting(4),
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
            isComingSoon: true,
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
            onClick: () => {
              isMobile ? mobileNavChange(NAV_LIST[4]) : handleNavClick(NAV_LIST[4]);
            },
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
            link: 'https://maps.app.goo.gl/vJKVYdnnjgxaydfq9',
            isComingSoon: true,
          },
        ],
      },
      {
        title: 'Global Internship',
        titleCn: '实习生计划',
        icon: <InternSVG />,
        links: [
          {
            label: 'Contact Us  Apply (CN)',
            link: 'https://id.life/career',
          },
          {
            label: 'Contact Us  Apply (EN)',
            link: 'https://id.life/career-en',
          },
        ],
      },
    ];
    return data;
  }, [isMobile, mobileNavChange, handleNavClick, setIsMobileEngagementJump, handleClickPoint, scrollToActivePoint]);

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
      loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/02.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/03.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/04.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/05.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/06.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/07.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: isMobile ? 0.01 : 0.015,
    },
    {
      url: '/imgs/particle/spectrum/08.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: isMobile ? 0.01 : 0.015,
    },
  ];
};
