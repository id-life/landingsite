import { useMemo } from 'react';
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

export type SpectrumLinkItem = {
  label: string;
  link?: string; // jumpTo link
  onClick?: () => void; // jumpTo some where
  className?: string;
};

export type SpectrumItemInfo = {
  title: string;
  titleCn: string;
  icon: JSX.Element;
  links?: SpectrumLinkItem[];
};

export const useSpectrumData = () => {
  const spectrumData: SpectrumItemInfo[] = useMemo(() => {
    const data: SpectrumItemInfo[] = [
      {
        title: 'Insights Sharing',
        titleCn: '演讲与洞见',
        icon: <MeetingSVG />,
        links: [
          {
            label: 'Timepie Longevity Forum',
            // onClick: jumpTo engagement meetings
          },
          {
            label: "Founder's Longevity Forum",
            // onClick: jumpTo engagement meetings
          },
          {
            label: 'Vitalist Bay Investor Forum',
            // onClick: jumpTo engagement meetings
          },
          {
            label: 'Edge City Lanna',
            // onClick: jumpTo engagement meetings
          },
          {
            label: 'Oxford Future Innovation Forum',
            // onClick: jumpTo engagement meetings
          },
        ],
      },
      {
        title: 'Translation & Publishing',
        titleCn: '翻译与出版',
        icon: <BookSVG />,
        links: [
          {
            label: 'bio/acc manifesto',
            // onClick: jumpTo engagement book
          },
          {
            label: 'The Network State',
            // onClick: jumpTo engagement book
          },
          {
            label: 'The case against death',
            // onClick: jumpTo engagement book
          },
          {
            label: 'Better With Age',
            // onClick: jumpTo engagement book
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
            // onClick: jumpTo engagement sponsors
          },
          {
            label: 'EthPanda',
            // onClick: jumpTo engagement sponsors
          },
          {
            label: 'BiohackerDAO',
            // onClick: jumpTo engagement sponsors
          },
          {
            label: 'Vitalist Bay',
            // onClick: jumpTo engagement sponsors
          },
        ],
      },
      {
        title: 'Podcast',
        titleCn: '播客',
        icon: <PodcastSVG />,
        links: [
          {
            label: 'Immortal Dragon  不朽真龙',
          },
          {
            label: 'Long Talk  龙门阵',
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
          },
        ],
      },
      {
        title: 'Digital Twin',
        titleCn: '数字孪生',
        icon: <DigitalTwinSVG />,
        links: [
          {
            label: 'Access Digital Twin',
          },
        ],
      },
      {
        title: 'ID Gallery Museum',
        titleCn: '总部办公室',
        icon: <MuseumSVG />,
        links: [
          {
            label: 'Coming Soon',
          },
        ],
      },
      {
        title: 'Global Internship',
        titleCn: '实习生计划',
        icon: <InternSVG />,
        links: [
          {
            label: 'Contact Us  Apply (CN)  /  Apply (EN)',
          },
        ],
      },
    ];
    return data;
  }, []);
  return spectrumData;
};

export const spectrumGetSourceImgInfos = (isMobile: boolean) => {
  return [
    {
      url: '/imgs/particle/0.png',
      scaleNum: isMobile ? 0.8 : 2.2,
      resize: [512, 300],
    },
    {
      url: '/imgs/particle/spectrum/01.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: 0.003,
    },
    {
      url: '/imgs/particle/spectrum/02.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: 0.003,
    },
    {
      url: '/imgs/particle/spectrum/03.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: 0.003,
    },
    {
      url: '/imgs/particle/spectrum/04.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: 0.003,
    },
    {
      url: '/imgs/particle/spectrum/05.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: 0.003,
    },
    {
      url: '/imgs/particle/spectrum/06.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: 0.003,
    },
    {
      url: '/imgs/particle/spectrum/07.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: 0.003,
    },
    {
      url: '/imgs/particle/spectrum/08.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.9,
      loadPercentage: 0.003,
    },
  ];
};
