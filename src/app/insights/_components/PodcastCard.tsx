import { PodcastItem } from '@/app/insights/_components/PodcastSection';
import { clsx } from 'clsx';

export function PodcastCard({ item }: { item: PodcastItem }) {
  return (
    <div className="">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="line-clamp-1 font-poppins text-xl/6 font-semibold">{item.title}</h3>
          <p className="mt-3 line-clamp-1 text-base text-gray-450">{item.subtitle}</p>
        </div>
        <img src="/imgs/podcast/podcast-play.png" className="w-11" alt="" />
      </div>
      <p className="mt-2 line-clamp-3 text-base/6">{item.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            // onClick={() => handleLinkClick('xyz', data.xyzLink)}
            className={clsx('w-7.5 mobile:w-6', item.xyzLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
            src="/imgs/podcast/fm_xyz.png"
            alt=""
          />
          <img
            // onClick={() => handleLinkClick('spotify', data.spotifyLink)}
            className={clsx('w-7.5 mobile:w-6', item.spotifyLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
            src="/imgs/podcast/fm_spotify.png"
            alt=""
          />
          <img
            // onClick={() => handleLinkClick('podcast', data.podcastLink)}
            className={clsx('w-7.5 mobile:w-6', item.podcastLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
            src="/imgs/podcast/fm_podcast.png"
            alt=""
          />
        </div>
        <div className="text-base/6 text-gray-450">
          {item.date} · {item.duration}
        </div>
      </div>
    </div>
  );
}
