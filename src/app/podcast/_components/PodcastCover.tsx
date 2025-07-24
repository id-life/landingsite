'use client';

import { useSearchParams } from 'next/navigation';
import { PODCAST_COVER, PODCAST_NAV_LIST, PodcastCategory } from '@/app/podcast/_components/constant';

export default function PodcastCover() {
  const searchParams = useSearchParams();
  const search = (searchParams.get('tab') ?? PODCAST_NAV_LIST[0].id) as PodcastCategory;
  const data = PODCAST_COVER[search];

  return (
    <div className="flex gap-8.5">
      <img className="w-45 rounded-xl" src={data.cover} alt="" />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h2 className="text-[1.625rem]/[2.5rem] font-semibold">{data.title}</h2>
          <p className="mt-4 text-sm font-medium">{data.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-center gap-4">
            {data.op.map((item) => (
              <div className="flex-center gap-1.5" key={item.name}>
                <div className="size-7.5 rounded-full bg-gray-300" />
                {item.name}
              </div>
            ))}
          </div>
          <div className="flex-center gap-2">
            <img className="w-7.5 cursor-pointer" src="/imgs/podcast/fm_xyz.png" alt="" />
            <img className="w-7.5 cursor-pointer" src="/imgs/podcast/fm_spotify.png" alt="" />
            <img className="w-7.5 cursor-pointer" src="/imgs/podcast/fm_podcast.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
