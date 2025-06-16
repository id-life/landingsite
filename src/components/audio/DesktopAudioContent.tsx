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
  podcastListAtom,
} from '@/atoms/audio-player';
import { AudioDataItem } from '@/apis/types';
import { PlayMode } from '@/atoms/audio-player';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

const underLineClassName =
  'after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:mx-auto after:h-0.5 after:w-9 after:bg-gray-800';

export default function DesktopMusicContent() {
  const musicList = useAtomValue(musicListAtom);
  const podcastList = useAtomValue(podcastListAtom);
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
    } else {
      setPlaylist(podcastList);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex-center gap-3 text-xs/3 font-bold">
          <div
            className={clsx('relative cursor-pointer', currentList === PlayList.MUSIC && underLineClassName)}
            onClick={() => handleChangeList(PlayList.MUSIC)}
          >
            MUSIC 音乐
          </div>
          <div
            className={clsx('relative cursor-pointer', currentList === PlayList.PODCAST && underLineClassName)}
            onClick={() => handleChangeList(PlayList.PODCAST)}
          >
            PODCAST 播客
          </div>
        </div>
        <div
          onClick={handleChangePlayMode}
          className="flex-center h-6.5 cursor-pointer select-none gap-0.5 rounded-full bg-white px-2 text-center text-ss/3 font-semibold"
        >
          {playMode === PlayMode.ORDER && (
            <>
              <img className="w-4" src="/svgs/player/play_order.svg" alt="" />
              <div className="w-18">Play in Order</div>
            </>
          )}
          {playMode === PlayMode.SHUFFLE && (
            <>
              <img className="w-4" src="/svgs/player/play_shuffle.svg" alt="" />
              <div className="w-18">Shuffle</div>
            </>
          )}
          {playMode === PlayMode.REPEAT_ALL && (
            <>
              <img className="w-4" src="/svgs/player/play_repeat.svg" alt="" />
              <div className="w-18">Repeat All</div>
            </>
          )}
          {playMode === PlayMode.REPEAT_ONE && (
            <>
              <img className="w-4" src="/svgs/player/play_repeat_one.svg" alt="" />
              <div className="w-18">Repeat One</div>
            </>
          )}
        </div>
      </div>
      <div className={clsx('mt-5 grid grid-cols-1 gap-5', currentList !== PlayList.MUSIC && 'hidden')}>
        {musicList.map((item) => (
          <DesktopMusicItem
            key={item.id}
            data={item}
            currentMusicId={currentMusic?.id}
            onClick={() => handleChangeAudio(item)}
            onSeekTo={(value) => dispatch({ type: 'SEEK_TO', value })}
          />
        ))}
      </div>
      <div className={clsx('mt-5 grid grid-cols-1 gap-5', currentList !== PlayList.PODCAST && 'hidden')}>
        {podcastList.map((item) => (
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
