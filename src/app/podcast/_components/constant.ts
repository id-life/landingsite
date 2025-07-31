export const PODCAST_NAV_LIST = [
  { id: 'id', title: 'immortal dragon 不朽真龙' },
  { id: 'lt', title: 'long talk 龙门阵' },
] as const;

export type PodcastCategory = (typeof PODCAST_NAV_LIST)[number]['id'];

export type PodcastHeaderItem = {
  cover: string;
  title: string;
  enTitle: string;
  description: string;
  xyzLink?: string;
  spotifyLink?: string;
  appleLink?: string;
};

export const PODCAST_COVER: Record<PodcastCategory, PodcastHeaderItem> = {
  [PODCAST_NAV_LIST[0].id]: {
    cover: 'https://cdn.id.life/audio/idfm_logo.webp',
    title: '不朽真龙',
    enTitle: 'Immortal Dragon',
    description:
      'Immrtal Dragons是一家投资长生不老领域的使命驱动基金。投资之外，我们出版翻译书籍，资助行业会议和学术机构，制作播客和媒体内容，从而支持抗衰科学研究，布道延寿理念信仰。在这个播客中，我们将带你从行业专家的第一视角出发，深入探访延长健康寿命的前沿技术、伦理争议与产业脉动——让我们一起破解永生密码。',
    xyzLink: 'https://www.xiaoyuzhoufm.com/podcast/68244dd700fe41f83952e9d8',
    appleLink: 'https://podcasts.apple.com/cn/podcast/%E4%B8%8D%E6%9C%BD%E7%9C%9F%E9%BE%99-immortaldragons/id1815210084',
    spotifyLink: 'https://open.spotify.com/show/5j7IvewaR6znPMk4XC4Bvu',
  },
  [PODCAST_NAV_LIST[1].id]: {
    cover: 'https://cdn.id.life/audio/longtalk_logo.webp',
    title: '龙门阵',
    enTitle: 'Long Talk',
    description:
      '一档由「不朽真龙」出品的摸鱼指南，记录团队在茶水间的灵感碎片！🫧☕ 🧪 关于不朽真龙： 永生研究所，正在探寻生命的终极课题。 血肉苦弱，科技飞升。 衰老与死亡并非美丽的宿命。不！它不过是一道我们终将攻克的技术难题。',
    xyzLink: 'https://www.xiaoyuzhoufm.com/podcast/67cff760566d55be46eb7ead',
    appleLink: 'https://podcasts.apple.com/cn/podcast/%E9%BE%99%E9%97%A8%E9%98%B5-longtalk/id1815210229',
    spotifyLink: 'https://open.spotify.com/show/5P0N1ApxJnMrtomHKoVLmb',
  },
};
