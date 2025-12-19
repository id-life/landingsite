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
    <div className="footer-contact-clip border-2 border-[var(--subscribe-border)] bg-white/50 p-6 backdrop-blur-md mobile:border-0 mobile:p-5">
      <span className="absolute left-0 top-0 block rotate-90 border-[1rem] border-[var(--subscribe-border)] border-r-transparent border-t-transparent mobile:hidden" />
      <div className="flex items-start justify-between gap-4 mobile:gap-3">
        <div>
          <h3 className="line-clamp-2 font-poppins text-xl/6 font-bold mobile:text-base mobile:leading-6">{item.title}</h3>
        </div>
        <img
          src="/imgs/podcast/podcast-play.png"
          className="w-11 shrink-0 cursor-pointer duration-300 hover:scale-110 mobile:h-11 mobile:w-[45px]"
          alt=""
          onClick={handlePlay}
        />
      </div>
      <p className="mt-3 truncate text-base font-medium text-gray-450 mobile:mt-2 mobile:text-sm">{item.subtitle}</p>
      <p className="mt-2 truncate text-base/6 font-medium mobile:mt-1 mobile:text-sm">{item.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            onClick={() => handleLinkClick('xyz', item.xyzLink)}
            className={clsx(
              'w-7.5 mobile:h-6 mobile:w-6 mobile:rounded-md mobile:border mobile:border-black/20',
              item.xyzLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale',
            )}
            src="/imgs/podcast/fm_xyz.png"
            alt=""
          />
          <img
            onClick={() => handleLinkClick('spotify', item.spotifyLink)}
            className={clsx(
              'w-7.5 mobile:h-6 mobile:w-6 mobile:rounded-md',
              item.spotifyLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale',
            )}
            src="/imgs/podcast/fm_spotify.png"
            alt=""
          />
          <img
            onClick={() => handleLinkClick('podcast', item.podcastLink)}
            className={clsx(
              'w-7.5 mobile:h-6 mobile:w-6 mobile:rounded-md',
              item.podcastLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale',
            )}
            src="/imgs/podcast/fm_podcast.png"
            alt=""
          />
        </div>
        <div className="text-base/6 text-gray-450 mobile:text-sm">
          {dayjs(item.date).format('MMM DD, YYYY')} · {formatDuration(item.duration)}
        </div>
      </div>
    </div>
  );
}
