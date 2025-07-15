import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PlayOrderSVG from '@/../public/svgs/player/play_order.svg?component';
import PlayRepeatSVG from '@/../public/svgs/player/play_repeat.svg?component';
import PlayRepeatOneSVG from '@/../public/svgs/player/play_repeat_one.svg?component';
import PlayShuffleSVG from '@/../public/svgs/player/play_shuffle.svg?component';
import { AudioDataItem } from '@/apis/types';
import {
  AUDIO_DISPATCH,
  PlayList,
  PlayListKey,
  PlayMode,
  audioControlsAtom,
  currentAudioAtom,
  currentPlayListAtom,
  currentPlayPodcastAtom,
  lastPlayStatusAtom,
  musicListAtom,
  playModeAtom,
  playlistAtom,
  podcastIDAtom,
  podcastLTAtom,
} from '@/atoms/audio-player';
import PodcastSelected from '@/components/audio/PodcastSelected';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import clsx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react';
import DesktopAudioSiriWave from './DesktopAudioSiriWave';
import DesktopMusicItem from './DesktopMusicItem';
import DesktopPodcastItem from './DesktopPodcastItem';

export default function DesktopMusicContent({ isPlaying, audioContext }: { isPlaying: boolean; audioContext: AudioContext }) {
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

  const handleChangePlayStatus = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const label = isPlaying ? GA_EVENT_LABELS.MUSIC_PLAYER_START.PAUSE : GA_EVENT_LABELS.MUSIC_PLAYER_START.START;
    trackEvent({ name: GA_EVENT_NAMES.MUSIC_PLAYER_START, label });
    dispatch({ type: AUDIO_DISPATCH.TOGGLE_PLAY });
  };
  const handleSeekTo = (value: number) => {
    setLastPlayStatus(true);
    dispatch({ type: AUDIO_DISPATCH.SEEK_TO, value });
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-between">
        <div className="flex-center gap-[16px] text-[14px]/[14px] font-bold mobile:gap-3 mobile:text-xs/3">
          <div
            className={clsx('audio-tab-item relative cursor-pointer', currentList === PlayList.MUSIC && 'audio-tab-active')}
            onClick={() => handleChangeList(PlayList.MUSIC)}
          >
            TRACKS 专辑
          </div>
          <div
            className={clsx('audio-tab-item relative cursor-pointer', currentList !== PlayList.MUSIC && 'audio-tab-active')}
            onClick={() => handleChangeList(currentPlayPodcast)}
          >
            PODCAST 播客
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="z-[101] flex h-[26px] cursor-pointer items-center gap-[8px] rounded-full bg-white/10 px-[8px] transition duration-300">
            <div onClick={handleChangePlayStatus} className="flex items-center gap-[8px]">
              <DesktopAudioSiriWave className="w-[33px] overflow-hidden mobile:h-[22px]" />
              <div className="size-[22px]">
                {isPlaying ? <PauseSVG className="size-full fill-white" /> : <PlaySVG className="size-full fill-white" />}
              </div>
            </div>
          </div>
          <div
            onClick={handleChangePlayMode}
            className="flex-center h-[26px] cursor-pointer select-none gap-[2px] rounded-full bg-white/10 px-[8px] text-center text-[10px]/[12px] font-semibold"
          >
            {playMode === PlayMode.ORDER && <PlayOrderSVG className="w-[16px] stroke-white" />}
            {playMode === PlayMode.SHUFFLE && <PlayShuffleSVG className="w-[16px] stroke-white" />}
            {playMode === PlayMode.REPEAT_ALL && <PlayRepeatSVG className="w-[16px] stroke-white" />}
            {playMode === PlayMode.REPEAT_ONE && <PlayRepeatOneSVG className="w-[16px] stroke-white" />}
          </div>
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
