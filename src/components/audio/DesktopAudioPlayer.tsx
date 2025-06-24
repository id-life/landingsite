import React, { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useGA } from '@/hooks/useGA';
import * as Popover from '@radix-ui/react-popover';
import { useAtomValue, useSetAtom } from 'jotai';
import DesktopMusicContent from './DesktopAudioContent';
import { useFetchAudioData } from '@/hooks/audio/fetch';
import AudioTitle from '@/components/audio/AudioTitle';
import DesktopAudioSiriWave from './DesktopAudioSiriWave';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import useCurrentMusicControl from '@/hooks/audio/useCurrentAudio';
import { AUDIO_DISPATCH, currentAudioAtom, musicListAtom, playlistAtom } from '@/atoms/audio-player';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';

function DesktopAudioPlayer({ className, injectClassName }: { className?: string; injectClassName?: string }) {
  useFetchAudioData();
  const { trackEvent } = useGA();
  const musicList = useAtomValue(musicListAtom);
  const { data, isPlaying, dispatch } = useCurrentMusicControl();
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

  const title = useMemo(
    () => (data?.artist ? `${data?.title} - ${data?.artist}` : `${data?.title}`),
    [data?.title, data?.artist],
  );

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div
          onClick={() => setIsOpen((v) => !v)}
          className={clsx(
            'flex w-[284px] cursor-pointer items-center gap-[10px] rounded-full bg-audio-player px-[8px]',
            className,
            injectClassName,
          )}
        >
          <DesktopAudioSiriWave />
          <AudioTitle width={148} title={title} />
          <div onClick={handleChangePlayStatus} className="size-[16px]">
            {isPlaying ? <PauseSVG className="w-full fill-background" /> : <PlaySVG className="w-full fill-background" />}
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Anchor className={clsx('pointer-events-none h-[26px] w-[284px]', className)} />
      <Popover.Portal forceMount>
        <Popover.Content
          forceMount
          align="end"
          sideOffset={16}
          className={clsx(
            'z-[51] w-[400px] rounded-lg border-2 border-audio-border bg-audio-content p-[20px] data-[state=closed]:hidden',
            injectClassName,
          )}
        >
          <DesktopMusicContent />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default React.memo(DesktopAudioPlayer);
