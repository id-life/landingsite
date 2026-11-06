import type { PodcastEpisode, PodcastSeries } from 'schema-dts';
import type { PodcastItem } from '@/apis/types';
import { PODCAST_COVER, PODCAST_METADATA, PODCAST_NAV_LIST, type PodcastCategory } from '@/app/podcast/_components/constant';
import { ORG_REF } from '@/constants/entity';
import { absoluteUrl } from '@/constants/site';

// Seconds → ISO 8601 duration (PT{H}H{M}M{S}S).
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  let duration = 'PT';
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (secs > 0) duration += `${secs}S`;
  return duration === 'PT' ? 'PT0S' : duration;
}

// The API's `sequence` is a sort key (e.g. 2200), so the episode number comes from the "E22 …" title prefix.
function episodeNumber(title: string) {
  const match = /^E(\d+)\b/.exec(title);
  return match ? Number(match[1]) : undefined;
}

/** API categories are `podcast_<id>`; unknown values fall back to the main show. */
export function categoryOf(item: Pick<PodcastItem, 'category'>): PodcastCategory {
  const id = item.category.replace(/^podcast_/, '');
  return PODCAST_NAV_LIST.find((nav) => nav.id === id)?.id ?? PODCAST_NAV_LIST[0].id;
}

function seriesRef(category: PodcastCategory) {
  const nav = PODCAST_NAV_LIST.find((item) => item.id === category) ?? PODCAST_NAV_LIST[0];
  const { title, enTitle } = PODCAST_COVER[nav.id];
  const url = absoluteUrl(nav.link);
  return { '@type': 'PodcastSeries', '@id': `${url}#series`, name: `${title} ${enTitle}`, url } as const;
}

export function podcastEpisodeJsonLd(item: PodcastItem): PodcastEpisode {
  const number = episodeNumber(item.title);
  const sameAs = [item.xyzLink, item.podcastLink, item.spotifyLink].filter(Boolean);
  return {
    '@type': 'PodcastEpisode',
    name: item.title,
    description: item.description,
    url: absoluteUrl(`/podcast/${item.id}`),
    datePublished: item.createdAt,
    image: item.detailMedia || item.album,
    inLanguage: 'zh-CN',
    ...(number !== undefined && { episodeNumber: number }),
    ...(item.duration > 0 && { timeRequired: formatDuration(item.duration) }),
    associatedMedia: { '@type': 'MediaObject', contentUrl: item.url },
    ...(sameAs.length && { sameAs }),
    partOfSeries: seriesRef(categoryOf(item)),
  };
}

export function podcastSeriesJsonLd(category: PodcastCategory, episodes: PodcastItem[]): PodcastSeries {
  const { cover, xyzLink, podcastLink, spotifyLink } = PODCAST_COVER[category];
  const description = PODCAST_METADATA[category].description;
  const sameAs = [xyzLink, podcastLink, spotifyLink].filter((link): link is string => Boolean(link));
  return {
    ...seriesRef(category),
    ...(description && { description }),
    image: cover,
    inLanguage: 'zh-CN',
    publisher: ORG_REF,
    ...(sameAs.length && { sameAs }),
    hasPart: episodes.map(podcastEpisodeJsonLd),
  };
}
