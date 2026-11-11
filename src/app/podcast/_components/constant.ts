import type { Metadata } from 'next';

export type PodcastNavItem = {
  id: string;
  title: string;
  link: string;
};
export const PODCAST_NAV_LIST: PodcastNavItem[] = [
  { id: 'id', title: 'immortal dragons 不朽真龙', link: '/podcast' },
  { id: 'lt', title: 'long talk 龙门阵', link: '/podcast?c=lt' },
] as const;

export type PodcastCategory = (typeof PODCAST_NAV_LIST)[number]['id'];

export type PodcastHeaderItem = {
  cover: string;
  title: string;
  enTitle: string;
  description: string;
  xyzLink?: string;
  spotifyLink?: string;
  podcastLink?: string;
};

export const PODCAST_COVER: Record<PodcastCategory, PodcastHeaderItem> = {
  [PODCAST_NAV_LIST[0].id]: {
    cover: 'https://resources.id.life/audio/idfm_logo@small.webp',
    title: '不朽真龙',
    enTitle: 'Immortal Dragons',
    description:
      'Immortal Dragons是一家投资长生不老领域的使命驱动基金。投资之外，我们出版翻译书籍，资助行业会议和学术机构，制作播客和媒体内容，从而支持抗衰科学研究，布道延寿理念信仰。在这个播客中，我们将带你从行业专家的第一视角出发，深入探访延长健康寿命的前沿技术、伦理争议与产业脉动——让我们一起破解永生密码。',
    xyzLink: 'https://www.xiaoyuzhoufm.com/podcast/68244dd700fe41f83952e9d8',
    podcastLink: 'https://podcasts.apple.com/cn/podcast/%E4%B8%8D%E6%9C%BD%E7%9C%9F%E9%BE%99-immortaldragons/id1815210084',
    spotifyLink: 'https://open.spotify.com/show/5j7IvewaR6znPMk4XC4Bvu',
  },
  [PODCAST_NAV_LIST[1].id]: {
    cover: 'https://resources.id.life/audio/longtalk_logo@small.webp',
    title: '龙门阵',
    enTitle: 'Long Talk',
    description:
      '一档由「不朽真龙」出品的摸鱼指南，记录团队在茶水间的灵感碎片！🫧☕ 🧪 关于不朽真龙： 永生研究所，正在探寻生命的终极课题。 血肉苦弱，科技飞升。 衰老与死亡并非美丽的宿命。不！它不过是一道我们终将攻克的技术难题。',
    xyzLink: 'https://www.xiaoyuzhoufm.com/podcast/67cff760566d55be46eb7ead',
    podcastLink: 'https://podcasts.apple.com/cn/podcast/%E9%BE%99%E9%97%A8%E9%98%B5-longtalk/id1815210229',
    spotifyLink: 'https://open.spotify.com/show/5P0N1ApxJnMrtomHKoVLmb',
  },
} as const;

export const COMMENTS_TYPE = {
  XYZ: 'xyz',
} as const;

export const PODCAST_METADATA: Record<PodcastCategory, Metadata> = {
  [PODCAST_NAV_LIST[0].id]: {
    title: 'Podcast 播客 | Immortal Dragons 不朽真龙',
    description:
      '解码长寿革命。聚焦前沿科技，洞察投资先机。Decoding the longevity revolution. A deep dive into breakthrough science, tech, and investments.',
    keywords: ['Longevity', 'Health', 'Science', 'Tech', 'Investment', 'Biotech', '长寿', '健康', '科技', '投资', '生物科技'],
    openGraph: {
      title: 'Podcast 播客 | Immortal Dragons 不朽真龙',
      siteName: 'Immortal Dragons',
      description:
        '解码长寿革命。聚焦前沿科技，洞察投资先机。Decoding the longevity revolution. A deep dive into breakthrough science, tech, and investments.',
      images: [
        {
          url: 'https://resources.id.life/audio/idfm_logo@small.webp',
        },
      ],
    },
  },
  [PODCAST_NAV_LIST[1].id]: {
    title: '龙门阵 Long Talk Podcast | Immortal Dragons',
    description:
      '包罗万象的随性漫谈。记录不朽真龙团队在茶水间的灵感碎片！A casual conversation exploring everything. Join the Immortal Dragons team as we chase our curiosity down the rabbit hole.',
    keywords: [
      'Behind the Scenes',
      'Rabbit Hole',
      'Random Thoughts',
      'General Knowledge',
      'Team Chat',
      '幕后故事',
      '兔子洞',
      '奇思妙想',
      '知识分享',
      '团队闲聊',
    ],
    openGraph: {
      title: '龙门阵 Long Talk Podcast | Immortal Dragons',
      siteName: 'Immortal Dragons',
      description:
        '包罗万象的随性漫谈。记录不朽真龙团队在茶水间的灵感碎片！A casual conversation exploring everything. Join the Immortal Dragons team as we chase our curiosity down the rabbit hole.',
      images: [
        {
          url: 'https://resources.id.life/audio/longtalk_logo@small.webp',
        },
      ],
    },
  },
};
