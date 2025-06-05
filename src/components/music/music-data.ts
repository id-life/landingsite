export type MusicDataItem = {
  id: number;
  title: string;
  artist: string;
  duration: number;
  url: string;
  album?: string;
  description?: string;
  createdAt?: string;
  xyzLink?: string;
  podcastLink?: string;
};

export const MusicData: MusicDataItem[] = [
  {
    id: 1,
    title: 'Make Death Optional1',
    artist: 'Boyang',
    duration: 100,
    url: '',
  },
  {
    id: 2,
    title: 'Make Death Optional2',
    artist: 'Boyang',
    duration: 100,
    url: '',
  },
  {
    id: 3,
    title: 'Make Death Optional3',
    artist: 'Boyang',
    duration: 100,
    url: '',
  },
] as const;

export const PodcastData: MusicDataItem[] = [
  {
    id: 1,
    title: '我们为何投资 Whole Body Replacement (1): 从克隆到永生',
    artist: 'Boyang',
    duration: 100,
    url: '',
    album: 'https://image.xyzcdn.net/FhENErATOCQRcyXGH256VQQVJ0sM.png@small',
    description:
      '近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body ons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body',
    createdAt: '2025-06-03',
  },
  {
    id: 2,
    title: '我们为何投资 Whole Body Replacement (1): 从克隆到永生',
    artist: 'Boyang',
    duration: 1000,
    url: '',
    album: 'https://image.xyzcdn.net/FhENErATOCQRcyXGH256VQQVJ0sM.png@small',
    description:
      '近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body ons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body',
    createdAt: '2025-06-04',
  },
  {
    id: 3,
    title: '我们为何投资 Whole Body Replacement (1): 从克隆到永生',
    artist: 'Boyang',
    duration: 2000,
    url: '',
    album: 'https://image.xyzcdn.net/FhENErATOCQRcyXGH256VQQVJ0sM.png@small',
    description:
      '近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body ons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body',
    createdAt: '2025-06-05',
  },
] as const;
