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
    <EpisodeClickTracker label={`${data.category.split('_')[1]}_${data.title}`}>
      <img className="w-16 rounded mobile:w-21" src={data.album} alt="" />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold group-hover:text-red-600">{data.title}</h3>
          <div className="text-xs text-gray-500 mobile:hidden">
            <span>{formatDuration(data.duration)}</span>
            <span>·</span>
            <span>{dayjs(data.createdAt).format('YYYY/MM/DD')}</span>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-xs/4.5 font-medium mobile:text-xs">{data.description}</p>
        <div className="mt-3 hidden text-xs/3 text-gray-500 mobile:block">
          <span>{formatDuration(data.duration)}</span>
          <span>·</span>
          <span>{dayjs(data.createdAt).format('YYYY/MM/DD')}</span>
        </div>
      </div>
    </EpisodeClickTracker>
  );
}
