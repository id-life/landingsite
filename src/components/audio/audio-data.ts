import { PlayListKey } from '@/atoms/audio-player';

export type AudioDataItem = {
  id: number;
  title: string;
  artist: string;
  duration: number;
  url: string;
  type: PlayListKey;
  album?: string;
  description?: string;
  createdAt?: string;
  xyzLink?: string;
  podcastLink?: string;
};

export const MusicData: AudioDataItem[] = [
  {
    id: 1,
    title: 'Make Death Optional1',
    artist: 'Boyang',
    duration: 100,
    type: 'music',
    url: 'https://cdn.id.life/audio/music/bgm-02.mp3',
  },
  {
    id: 2,
    title: 'Make Death Optional2',
    artist: 'Boyang',
    duration: 100,
    type: 'music',
    url: 'https://cdn.id.life/audio/music/bgm-02.mp3',
  },
  {
    id: 3,
    title: 'Make Death Optional3',
    artist: 'Boyang',
    duration: 100,
    type: 'music',
    url: 'https://cdn.id.life/audio/music/bgm-03.mp3',
  },
] as const;

export const PodcastData: AudioDataItem[] = [
  {
    id: 4,
    title: '当我说「我没用力」时，到底在和什么较劲 | 网球教会我的事',
    artist: '茄子',
    duration: 100,
    type: 'podcast',
    url: 'https://cdn.id.life/audio/podcast/e01.flac',
    album: 'https://image.xyzcdn.net/FhENErATOCQRcyXGH256VQQVJ0sM.png@small',
    description:
      '近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body ons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body',
    createdAt: '2025-06-03',
    xyzLink: 'https://www.xiaoyuzhoufm.com/episode/67d2f2dd0766616acdc41231?s=eyJ1IjogIjVmNGZjZWU4ZTBmNWU3MjNiYmFjNzM3OSJ9',
  },
  {
    id: 5,
    title: '人为什么总是无能狂怒 | 社会性自我威胁理论',
    artist: '茄子',
    duration: 1000,
    type: 'podcast',
    url: 'https://cdn.id.life/audio/podcast/e02.flac',
    album: 'https://image.xyzcdn.net/FhENErATOCQRcyXGH256VQQVJ0sM.png@small',
    description:
      '近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body ons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body',
    createdAt: '2025-06-04',
    xyzLink: 'https://www.xiaoyuzhoufm.com/episode/67d2fbca0766616acdc60b33?s=eyJ1IjogIjVmNGZjZWU4ZTBmNWU3MjNiYmFjNzM3OSJ9',
  },
  {
    id: 6,
    title: 'City Walk 指南 | 城市是我们的客厅',
    artist: '红瓷',
    duration: 2000,
    type: 'podcast',
    url: 'https://cdn.id.life/audio/podcast/e03.flac',
    album: 'https://image.xyzcdn.net/FhENErATOCQRcyXGH256VQQVJ0sM.png@small',
    description:
      '近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body ons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body',
    createdAt: '2025-06-05',
    xyzLink: 'https://www.xiaoyuzhoufm.com/episode/67d414a0e924d4525aa2c606',
    podcastLink: 'https://brainvat.sg.larksuite.com/minutes/obsgaaqpwa5cyjas9k9f8438?from=from_parent_docs',
  },
] as const;
