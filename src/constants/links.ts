import { ValueOf } from '@/constants/config';

export const MediaLinkType = {
  Youtube: 'youtube',
  Linkedin: 'linkedin',
  Media: 'media',
  Podcast: 'podcast',
  Xyz: 'xyz',
} as const;

export type MediaLinkTypeKey = ValueOf<typeof MediaLinkType>;

export const DigitalTwinYoutubeLink = 'https://www.youtube.com/watch?v=NHaU1GLd2kA';

export const Links = {
  [MediaLinkType.Youtube]: 'https://www.youtube.com/@Immortal-Dragons',
  [MediaLinkType.Linkedin]: 'https://www.linkedin.com/company/immortaldragons/',
  [MediaLinkType.Media]: 'https://drive.google.com/drive/folders/1vajrjCq-nAX1LVSzJ_fETL2GKI0-ckrG',
  [MediaLinkType.Podcast]: 'https://podcasts.apple.com/cn/podcast/不朽真龙-immortaldragons/id1815210084',
  [MediaLinkType.Xyz]: 'https://www.xiaoyuzhoufm.com/podcast/68244dd700fe41f83952e9d8',
} as const;
