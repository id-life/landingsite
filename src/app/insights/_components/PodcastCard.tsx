import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { useSetAtom, useAtomValue } from 'jotai';
import { formatDuration } from '@/utils/podcast';
import { PodcastItem } from '@/app/insights/_components/PodcastSection';
import { currentAudioAtom, playlistAtom, podcastIDAtom, podcastLTAtom, PlayList } from '@/atoms/audio-player';

export function PodcastCard({ item }: { item: PodcastItem }) {
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

  return (
    <div className="">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="line-clamp-1 font-poppins text-xl/6 font-semibold">{item.title}</h3>
          <p className="mt-3 line-clamp-1 text-base text-gray-450">{item.subtitle}</p>
        </div>
        <img src="/imgs/podcast/podcast-play.png" className="w-11 cursor-pointer" alt="" onClick={handlePlay} />
      </div>
      <p className="mt-2 line-clamp-3 text-base/6">{item.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            onClick={() => handleLinkClick('xyz', item.xyzLink)}
            className={clsx('w-7.5 mobile:w-6', item.xyzLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
            src="/imgs/podcast/fm_xyz.png"
            alt=""
          />
          <img
            onClick={() => handleLinkClick('spotify', item.spotifyLink)}
            className={clsx('w-7.5 mobile:w-6', item.spotifyLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
            src="/imgs/podcast/fm_spotify.png"
            alt=""
          />
          <img
            onClick={() => handleLinkClick('podcast', item.podcastLink)}
            className={clsx('w-7.5 mobile:w-6', item.podcastLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
            src="/imgs/podcast/fm_podcast.png"
            alt=""
          />
        </div>
        <div className="text-base/6 text-gray-450">
          {dayjs(item.date).format('MMM DD, YYYY')} · {formatDuration(item.duration)}
        </div>
      </div>
    </div>
  );
}
