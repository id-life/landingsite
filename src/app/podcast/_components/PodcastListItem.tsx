import React from 'react';
import dayjs from 'dayjs';
import { PodcastItem } from '@/apis/types';
import { formatDuration } from '@/utils/podcast';
import EpisodeClickTracker from '@/app/podcast/_components/EpisodeClickTracker';

type PodcastListItemProps = {
  data: PodcastItem;
};

// A server component: dates and durations are formatted here, so the list ships no date library; the click
// event is the only client code (EpisodeClickTracker).
export default function PodcastListItem({ data }: PodcastListItemProps) {
  return (
    <EpisodeClickTracker episodeId={String(data.id)} channel={data.category}>
      {/* Square artwork: the box is reserved before the image loads, so the list does not shift (CLS). */}
      <img className="aspect-square w-16 shrink-0 self-start rounded object-cover mobile:w-21" src={data.album} alt="" />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-read font-semibold group-hover:text-accent">{data.title}</h3>
          <div className="shrink-0 text-read-xs text-tone-550 mobile:hidden">
            <span>{formatDuration(data.duration)}</span>
            <span>·</span>
            <span>{dayjs(data.createdAt).format('YYYY/MM/DD')}</span>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-read-sm font-medium">{data.description}</p>
        <div className="mt-3 hidden text-read-xs text-tone-550 mobile:block">
          <span>{formatDuration(data.duration)}</span>
          <span>·</span>
          <span>{dayjs(data.createdAt).format('YYYY/MM/DD')}</span>
        </div>
      </div>
    </EpisodeClickTracker>
  );
}
