import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { useSetAtom, useAtomValue } from 'jotai';
import { formatDuration } from '@/utils/podcast';
import { PodcastItem } from '@/app/insights/_components/PodcastSection';
import { currentAudioAtom, playlistAtom, podcastIDAtom, podcastLTAtom, PlayList } from '@/atoms/audio-player';

type PodcastCardProps = {
  item: PodcastItem;
  isMobile?: boolean;
};

export function PodcastCard({ item, isMobile = false }: PodcastCardProps) {
  const setCurrentAudio = useSetAtom(currentAudioAtom);
  const setPlaylist = useSetAtom(playlistAtom);
  const podcastIDList = useAtomValue(podcastIDAtom);
  const podcastLTList = useAtomValue(podcastLTAtom);

  const handleLinkClick = (type: string, url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const handlePlay = () => {
    const audioData = podcastIDList.find((p) => p.id === item.id) || podcastLTList.find((p) => p.id === item.id);
    if (!audioData) return;

    setCurrentAudio(audioData);

    if (audioData.category === PlayList.PODCAST_ID) {
      setPlaylist(podcastIDList);
    } else if (audioData.category === PlayList.PODCAST_LT) {
      setPlaylist(podcastLTList);
    }
  };

  // Mobile layout: keep original detailed card
  if (isMobile) {
    return (
      <div className="border-0 bg-white/50 p-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 font-poppins text-base font-bold leading-6">{item.title}</h3>
          </div>
          <img
            src="/imgs/podcast/podcast-play.png"
            className="h-11 w-[45px] shrink-0 cursor-pointer duration-300 hover:scale-110"
            alt=""
            onClick={handlePlay}
          />
        </div>
        <p className="mt-2 truncate text-sm font-medium text-gray-450">{item.subtitle}</p>
        <p className="mt-1 truncate text-sm font-medium">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              onClick={() => handleLinkClick('xyz', item.xyzLink)}
              className={clsx(
                'h-6 w-6 rounded-md border border-black/20',
                item.xyzLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale',
              )}
              src="/imgs/podcast/fm_xyz.png"
              alt=""
            />
            <img
              onClick={() => handleLinkClick('spotify', item.spotifyLink)}
              className={clsx('h-6 w-6 rounded-md', item.spotifyLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
              src="/imgs/podcast/fm_spotify.png"
              alt=""
            />
            <img
              onClick={() => handleLinkClick('podcast', item.podcastLink)}
              className={clsx('h-6 w-6 rounded-md', item.podcastLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
              src="/imgs/podcast/fm_podcast.png"
              alt=""
            />
          </div>
          <div className="text-sm text-gray-450">
            {dayjs(item.date).format('MMM DD, YYYY')} · {formatDuration(item.duration)}
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout: simplified card with title + description + play button
  return (
    <div className="podcast-card-clip relative bg-white p-0.5">
      <div className="podcast-card-clip-inner bg-[#F6F8FB]">
        <div className="flex items-center justify-between gap-4">
          <h3 className="line-clamp-1 flex-1 font-poppins text-xl font-bold leading-8">{item.title}</h3>
          <img
            src="/imgs/podcast/podcast-play-white.svg"
            className="h-10 w-10 shrink-0 cursor-pointer duration-300 hover:scale-110"
            alt="Play"
            onClick={handlePlay}
          />
        </div>
        <p className="mt-1 line-clamp-1 text-base font-medium">{item.description}</p>
      </div>
    </div>
  );
}
