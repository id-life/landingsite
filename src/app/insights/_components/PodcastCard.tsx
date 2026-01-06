import { useSetAtom, useAtomValue } from 'jotai';
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
    <div className="podcast-card-clip relative bg-white p-0.5">
      <div className="podcast-card-clip-inner bg-[#F6F8FB] p-4 mobile:p-3">
        <div className="flex items-center justify-between gap-3 mobile:gap-2">
          <h3 className="line-clamp-1 flex-1 font-poppins text-xl/8 font-bold mobile:line-clamp-2 mobile:text-xs/4.5">
            {item.title}
          </h3>
          <img
            src="/imgs/podcast/podcast-play-white.svg"
            className="size-10 shrink-0 cursor-pointer duration-300 hover:scale-110 mobile:size-8"
            alt="Play"
            onClick={handlePlay}
          />
        </div>
        <p className="line-clamp-1 text-base font-medium mobile:text-[10px]/4">{item.description}</p>
      </div>
    </div>
  );
}
