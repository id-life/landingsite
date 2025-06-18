import clsx from 'clsx';
import DesktopMusicItem from './DesktopMusicItem';
import DesktopPodcastItem from './DesktopPodcastItem';
import {
  audioControlsAtom,
  currentAudioAtom,
  playModeAtom,
  PlayList,
  PlayListKey,
  playlistAtom,
  currentPlayListAtom,
  musicListAtom,
  podcastIDAtom,
  podcastLTAtom,
  currentPlayPodcastAtom,
} from '@/atoms/audio-player';
import { AudioDataItem } from '@/apis/types';
import { PlayMode } from '@/atoms/audio-player';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import PlayOrderSVG from '@/../public/svgs/player/play_order.svg?component';
import PlayShuffleSVG from '@/../public/svgs/player/play_shuffle.svg?component';
import PlayRepeatSVG from '@/../public/svgs/player/play_repeat.svg?component';
import PlayRepeatOneSVG from '@/../public/svgs/player/play_repeat_one.svg?component';
import PodcastSelected from '@/components/audio/PodcastSelected';

const underLineClassName =
  'after:absolute after:-bottom-2 after:left-0 after:right-0 after:mx-auto after:h-0.5 after:w-9 after:bg-foreground';

export default function DesktopMusicContent() {
  const musicList = useAtomValue(musicListAtom);
  const podcastID = useAtomValue(podcastIDAtom);
  const podcastLT = useAtomValue(podcastLTAtom);
  const currentPlayPodcast = useAtomValue(currentPlayPodcastAtom);
  const [currentList, setCurrentList] = useAtom<PlayListKey>(currentPlayListAtom);
  const playMode = useAtomValue(playModeAtom);
  const [playlist, setPlaylist] = useAtom(playlistAtom);
  const [currentMusic, setCurrentMusic] = useAtom(currentAudioAtom);
  const dispatch = useSetAtom(audioControlsAtom);

  const handleChangeList = (list: PlayListKey) => {
    setCurrentList(list);
  };

  const handleChangePlayMode = () => {
    const nextMode = Object.values(PlayMode)[(Object.values(PlayMode).indexOf(playMode) + 1) % Object.values(PlayMode).length];
    dispatch({ type: 'SET_PLAY_MODE', value: nextMode });
  };

  const handleChangeAudio = (audio: AudioDataItem) => {
    setCurrentMusic(audio);
    if (audio.category === playlist[0].category) return;
    if (audio.category === PlayList.MUSIC) {
      setPlaylist(musicList);
    }
    if (audio.category === PlayList.PODCAST_ID) {
      setPlaylist(podcastID);
    }
    if (audio.category === PlayList.PODCAST_LT) {
      setPlaylist(podcastLT);
    }
  };

  return (
    <div className="text-foreground">
      <div className="flex items-center justify-between">
        <div className="flex-center gap-3 text-xs/3 font-bold">
          <div
            className={clsx('relative cursor-pointer', currentList === PlayList.MUSIC && underLineClassName)}
            onClick={() => handleChangeList(PlayList.MUSIC)}
          >
            MUSIC 音乐
          </div>
          <div
            className={clsx('relative cursor-pointer', currentList !== PlayList.MUSIC && underLineClassName)}
            onClick={() => handleChangeList(currentPlayPodcast)}
          >
            PODCAST 播客
          </div>
        </div>
        <div
          onClick={handleChangePlayMode}
          className="flex-center h-6.5 cursor-pointer select-none gap-0.5 rounded-full bg-audio-order px-2 text-center text-ss/3 font-semibold"
        >
          {playMode === PlayMode.ORDER && (
            <>
              <PlayOrderSVG className="w-4 stroke-foreground" />
              <div className="w-18">Play in Order</div>
            </>
          )}
          {playMode === PlayMode.SHUFFLE && (
            <>
              <PlayShuffleSVG className="w-4 stroke-foreground" />
              <div className="w-18">Shuffle</div>
            </>
          )}
          {playMode === PlayMode.REPEAT_ALL && (
            <>
              <PlayRepeatSVG className="w-4 stroke-foreground" />
              <div className="w-18">Repeat All</div>
            </>
          )}
          {playMode === PlayMode.REPEAT_ONE && (
            <>
              <PlayRepeatOneSVG className="w-4 stroke-foreground" />
              <div className="w-18">Repeat One</div>
            </>
          )}
        </div>
      </div>
      {currentList !== PlayList.MUSIC && (
        <div className="mt-4 flex items-center justify-start">
          <PodcastSelected />
        </div>
      )}
      <div className="hide-scrollbar mt-5 grid max-h-[17rem] grid-cols-1 gap-5 overflow-y-auto overflow-x-hidden">
        {currentList === PlayList.MUSIC &&
          musicList.map((item) => (
            <DesktopMusicItem
              key={item.id}
              data={item}
              currentMusicId={currentMusic?.id}
              onClick={() => handleChangeAudio(item)}
              onSeekTo={(value) => dispatch({ type: 'SEEK_TO', value })}
            />
          ))}

        {currentList === PlayList.PODCAST_ID &&
          podcastID.map((item) => (
            <DesktopPodcastItem
              key={item.id}
              data={item}
              currentMusicId={currentMusic?.id}
              onClick={() => handleChangeAudio(item)}
              onSeekTo={(value) => dispatch({ type: 'SEEK_TO', value })}
            />
          ))}
        {currentList === PlayList.PODCAST_LT &&
          podcastLT.map((item) => (
            <DesktopPodcastItem
              key={item.id}
              data={item}
              currentMusicId={currentMusic?.id}
              onClick={() => handleChangeAudio(item)}
              onSeekTo={(value) => dispatch({ type: 'SEEK_TO', value })}
            />
          ))}
      </div>
    </div>
  );
}
