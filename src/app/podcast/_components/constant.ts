export const PODCAST_NAV_LIST = [
  { id: 'id', title: 'immortal dragon 不朽真龙' },
  { id: 'lt', title: 'long talk 龙门阵' },
] as const;

export type PodcastCategory = (typeof PODCAST_NAV_LIST)[number]['id'];

export type PodcastHeaderItem = {
  cover: string;
  title: string;
  description: string;
  op: { name: string; avatar: string }[];
  xyzLink?: string;
  spotifyLink?: string;
  podcastLink?: string;
};

export const PODCAST_COVER: Record<PodcastCategory, PodcastHeaderItem> = {
  [PODCAST_NAV_LIST[0].id]: {
    cover: 'https://cdn.id.life/audio/idfm_logo.webp',
    title: '不朽真龙 Immortal Dragon',
    description:
      '不朽真龙是一家投资不老领域得实名驱动基金。投资之外，我们出版翻译书籍，资助行业会议和学术机构。制作播客和媒体内容，从而支持抗衰科学研究。布道续命理念信仰。',
    op: [
      { name: 'Boyang', avatar: '' },
      { name: 'RK', avatar: '' },
    ],
  },
  [PODCAST_NAV_LIST[1].id]: {
    cover: 'https://cdn.id.life/audio/longtalk_logo.webp',
    title: '龙门阵 Long Talk',
    description:
      '不朽真龙是一家投资不老领域得实名驱动基金。投资之外，我们出版翻译书籍，资助行业会议和学术机构。制作播客和媒体内容，从而支持抗衰科学研究。布道续命理念信仰。',
    op: [
      { name: 'Boyang', avatar: '' },
      { name: 'RK', avatar: '' },
    ],
  },
};
