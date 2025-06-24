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
  AUDIO_DISPATCH,
  lastPlayStatusAtom,
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
  const setLastPlayStatus = useSetAtom(lastPlayStatusAtom);
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
    trackEvent({ name: GA_EVENT_NAMES.PLAYER_TYPE, label: nextMode });
    dispatch({ type: AUDIO_DISPATCH.SET_PLAY_MODE, value: nextMode });
  };

  const handleChangeAudio = (audio: AudioDataItem) => {
    trackEvent({ name: GA_EVENT_NAMES.MUSIC_SWITCH, label: audio.title });
    setLastPlayStatus(true);
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

  const handleSeekTo = (value: number) => {
    setLastPlayStatus(true);
    dispatch({ type: AUDIO_DISPATCH.SEEK_TO, value });
  };

  return (
    <div className="text-foreground">
      <div className="flex items-center justify-between">
        <div className="flex-center gap-[16px] text-[14px]/[14px] font-bold">
          <div
            className={clsx('audio-tab-item relative cursor-pointer', currentList === PlayList.MUSIC && 'audio-tab-active')}
            onClick={() => handleChangeList(PlayList.MUSIC)}
          >
            MUSIC 音乐
          </div>
          <div
            className={clsx('audio-tab-item relative cursor-pointer', currentList !== PlayList.MUSIC && 'audio-tab-active')}
            onClick={() => handleChangeList(currentPlayPodcast)}
          >
            PODCAST 播客
          </div>
        </div>
        <div
          onClick={handleChangePlayMode}
          className="flex-center h-[26px] cursor-pointer select-none gap-[2px] rounded-full bg-audio-order px-[8px] text-center text-[10px]/[12px] font-semibold"
        >
          {playMode === PlayMode.ORDER && <PlayOrderSVG className="w-[16px] stroke-foreground" />}
          {playMode === PlayMode.SHUFFLE && <PlayShuffleSVG className="w-[16px] stroke-foreground" />}
          {playMode === PlayMode.REPEAT_ALL && <PlayRepeatSVG className="w-[16px] stroke-foreground" />}
          {playMode === PlayMode.REPEAT_ONE && <PlayRepeatOneSVG className="w-[16px] stroke-foreground" />}
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
            onSeekTo={handleSeekTo}
          />
        ))}
        {podcastID.map((item) => (
          <DesktopPodcastItem
            key={item.id}
            data={item}
            className={currentList !== PlayList.PODCAST_ID ? 'hidden' : ''}
            currentMusicId={currentMusic?.id}
            onClick={() => handleChangeAudio(item)}
            onSeekTo={handleSeekTo}
          />
        ))}
        {podcastLT.map((item) => (
          <DesktopPodcastItem
            key={item.id}
            data={item}
            className={currentList !== PlayList.PODCAST_LT ? 'hidden' : ''}
            currentMusicId={currentMusic?.id}
            onClick={() => handleChangeAudio(item)}
            onSeekTo={handleSeekTo}
          />
        ))}
      </div>
    </div>
  );
}
