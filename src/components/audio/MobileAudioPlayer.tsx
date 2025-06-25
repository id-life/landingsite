import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PlayListSVG from '@/../public/svgs/player/play_list.svg?component';
import { AUDIO_DISPATCH, currentAudioAtom, musicListAtom, playlistAtom } from '@/atoms/audio-player';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import DesktopMusicContent from './DesktopAudioContent';
import DesktopAudioSiriWave from './DesktopAudioSiriWave';
import { useFetchAudioData } from '@/hooks/audio/fetch';
import useCurrentMusicControl from '@/hooks/audio/useCurrentAudio';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';

function MobileAudioPlayer({ className, injectClassName }: { className?: string; injectClassName?: string }) {
  useFetchAudioData();
  const { isPlaying, dispatch } = useCurrentMusicControl();
  const { trackEvent } = useGA();
  const musicList = useAtomValue(musicListAtom);
  const [isOpen, setIsOpen] = useState(false);
  const setPlaylistAtom = useSetAtom(playlistAtom);
  const setCurrentMusic = useSetAtom(currentAudioAtom);

  useEffect(() => {
    if (!musicList.length) return;
    setCurrentMusic(musicList[0]);
    setPlaylistAtom(musicList);
  }, [musicList, setCurrentMusic, setPlaylistAtom]);

  const handleChangePlayStatus = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const label = isPlaying ? GA_EVENT_LABELS.MUSIC_PLAYER_START.PAUSE : GA_EVENT_LABELS.MUSIC_PLAYER_START.START;
    trackEvent({ name: GA_EVENT_NAMES.MUSIC_PLAYER_END, label });
    dispatch({ type: AUDIO_DISPATCH.TOGGLE_PLAY });
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={clsx(
          'flex w-[4.875rem] cursor-pointer items-center gap-1 rounded-full bg-gray-750 px-1.5 transition duration-300',
          className,
          injectClassName,
        )}
      >
        <DesktopAudioSiriWave className="w-6 overflow-hidden" />
        <div onClick={handleChangePlayStatus} className="size-4">
          {isPlaying ? <PauseSVG className="w-full fill-white" /> : <PlaySVG className="w-full fill-white" />}
        </div>
        <Popover.Trigger asChild>
          <div onClick={() => setIsOpen((v) => !v)} className="size-4">
            <PlayListSVG className="w-full fill-white" />
          </div>
        </Popover.Trigger>
        <Popover.Anchor className={clsx('pointer-events-none h-6.5 w-71', className)} />
        <Popover.Portal forceMount>
          <Popover.Content
            forceMount
            align="end"
            sideOffset={16}
            className={clsx(
              // 'border-gray-760 z-10 ml-4 w-[calc(100vw_-_2rem)] rounded-lg border-2 bg-gray-900 p-4.5 data-[state=closed]:hidden',
              'z-10 ml-4 w-[calc(100vw_-_2rem)] rounded-lg bg-[#121212CC] p-4.5 backdrop-blur data-[state=closed]:hidden',
              injectClassName,
            )}
          >
            <DesktopMusicContent />
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>
  );
}

export default React.memo(MobileAudioPlayer);
