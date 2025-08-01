'use client';

import React from 'react';
import dayjs from 'dayjs';
import { PodcastItem } from '@/apis/types';
import dayjsDuration from 'dayjs/plugin/duration';

dayjs.extend(dayjsDuration);

type PodcastListItemProps = {
  data: PodcastItem;
};

export default function PodcastListItem({ data }: PodcastListItemProps) {
  const handleItemClick = () => {
    console.log('Link clicked');
  };

  return (
    <div onClick={() => handleItemClick()} className="group flex cursor-pointer gap-4">
      <img className="w-16 rounded mobile:w-21" src={data.album} alt="" />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold group-hover:text-red-600">{data.title}</h3>
          <div className="text-xs text-gray-500 mobile:hidden">
            <span>{dayjs.duration(data.duration, 'seconds').format('m')}min</span>
            <span>·</span>
            <span>{dayjs(data.createdAt).format('YYYY/MM/DD')}</span>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-xs/4.5 font-medium mobile:text-xs">{data.description}</p>
        <div className="mt-3 hidden text-xs/3 text-gray-500 mobile:block">
          <span>{dayjs.duration(data.duration, 'seconds').format('m')}min</span>
          <span>·</span>
          <span>{dayjs(data.createdAt).format('YYYY/MM/DD')}</span>
        </div>
      </div>
    </div>
  );
}
