import { ValueOf } from '@/constants/config';

export const MediaLinkType = {
  Youtube: 'youtube',
  Linkedin: 'linkedin',
  Spotify: 'spotify',
  Media: 'media',
  Podcast: 'podcast',
  Xyz: 'xyz',
  Xiaoyuzhou: 'xiaoyuzhou',
  Bilibili: 'bilibili',
  Redbook: 'redbook',
  Wechat: 'wechat',
} as const;

export type MediaLinkTypeKey = ValueOf<typeof MediaLinkType>;

export const DigitalTwinYoutubeLink = 'https://www.youtube.com/watch?v=NHaU1GLd2kA';

export const Links = {
  [MediaLinkType.Youtube]: 'https://www.youtube.com/@Immortal-Dragons',
  [MediaLinkType.Linkedin]: 'https://www.linkedin.com/company/immortaldragons/',
  [MediaLinkType.Spotify]: 'https://open.spotify.com/show/2KcbM8lzsA8QO7xDqtvpl5',
  [MediaLinkType.Media]: 'https://drive.google.com/drive/folders/1vajrjCq-nAX1LVSzJ_fETL2GKI0-ckrG',
  [MediaLinkType.Podcast]: 'https://podcasts.apple.com/cn/podcast/不朽真龙-immortaldragons/id1815210084',
  [MediaLinkType.Xyz]: 'https://www.xiaoyuzhoufm.com/podcast/68244dd700fe41f83952e9d8',
  [MediaLinkType.Xiaoyuzhou]: 'https://www.xiaoyuzhoufm.com/podcast/68244dd700fe41f83952e9d8',
  [MediaLinkType.Bilibili]: 'https://b23.tv/KmblPpj',
  [MediaLinkType.Redbook]: 'https://xhslink.com/m/8j90ABQa9jS',
  [MediaLinkType.Wechat]: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzcwNjE2OTY1Nw==#wechat_redirect',
} as const;
