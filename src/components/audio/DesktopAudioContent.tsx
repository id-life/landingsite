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
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';

const underLineClassName =
  'after:absolute after:-bottom-2 after:left-0 after:right-0 after:mx-auto after:h-0.5 after:w-[36px] after:bg-foreground';

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
  const { trackEvent } = useGA();

  const handleChangeList = (list: PlayListKey) => {
    trackEvent({
      name: GA_EVENT_NAMES.PLAYER_MENU,
      label: list === PlayList.MUSIC ? GA_EVENT_LABELS.PLAYER_MENU.MUSIC : GA_EVENT_LABELS.PLAYER_MENU.PODCAST,
    });
    setCurrentList(list);
  };

  const handleChangePlayMode = () => {
    const nextMode = Object.values(PlayMode)[(Object.values(PlayMode).indexOf(playMode) + 1) % Object.values(PlayMode).length];
    trackEvent({
      name: GA_EVENT_NAMES.PLAYER_TYPE,
      label: nextMode,
    });
    dispatch({ type: 'SET_PLAY_MODE', value: nextMode });
  };

  const handleChangeAudio = (audio: AudioDataItem) => {
    trackEvent({
      name: GA_EVENT_NAMES.MUSIC_SWITCH,
      label: audio.title,
    });
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
        <div className="flex-center gap-[12px] text-[12px]/[12px] font-bold">
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
          className="flex-center h-[26px] cursor-pointer select-none gap-[2px] rounded-full bg-audio-order px-[8px] text-center text-[10px]/[12px] font-semibold"
        >
          {playMode === PlayMode.ORDER && (
            <>
              <PlayOrderSVG className="w-[16px] stroke-foreground" />
              <div className="w-[72px]">Play in Order</div>
            </>
          )}
          {playMode === PlayMode.SHUFFLE && (
            <>
              <PlayShuffleSVG className="w-[16px] stroke-foreground" />
              <div className="w-[72px]">Shuffle</div>
            </>
          )}
          {playMode === PlayMode.REPEAT_ALL && (
            <>
              <PlayRepeatSVG className="w-[16px] stroke-foreground" />
              <div className="w-[72px]">Repeat All</div>
            </>
          )}
          {playMode === PlayMode.REPEAT_ONE && (
            <>
              <PlayRepeatOneSVG className="w-[16px] stroke-foreground" />
              <div className="w-[72px]">Repeat One</div>
            </>
          )}
        </div>
      </div>
      {currentList !== PlayList.MUSIC && (
        <div className="mt-[16px] flex items-center justify-start">
          <PodcastSelected />
        </div>
      )}
      <div className="hide-scrollbar mt-[20px] grid max-h-[272px] grid-cols-1 gap-[20px] overflow-y-auto overflow-x-hidden">
        {musicList.map((item) => (
          <DesktopMusicItem
            key={item.id}
            data={item}
            className={currentList !== PlayList.MUSIC ? 'hidden' : ''}
            currentMusicId={currentMusic?.id}
            onClick={() => handleChangeAudio(item)}
            onSeekTo={(value) => dispatch({ type: 'SEEK_TO', value })}
          />
        ))}
        {podcastID.map((item) => (
          <DesktopPodcastItem
            key={item.id}
            data={item}
            className={currentList !== PlayList.PODCAST_ID ? 'hidden' : ''}
            currentMusicId={currentMusic?.id}
            onClick={() => handleChangeAudio(item)}
            onSeekTo={(value) => dispatch({ type: 'SEEK_TO', value })}
          />
        ))}
        {podcastLT.map((item) => (
          <DesktopPodcastItem
            key={item.id}
            data={item}
            className={currentList !== PlayList.PODCAST_LT ? 'hidden' : ''}
            currentMusicId={currentMusic?.id}
            onClick={() => handleChangeAudio(item)}
            onSeekTo={(value) => dispatch({ type: 'SEEK_TO', value })}
          />
        ))}
      </div>
    </div>
  );
}
