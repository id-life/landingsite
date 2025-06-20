import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PlayListSVG from '@/../public/svgs/player/play_list.svg?component';
import { currentAudioAtom, currentPlayStatusAtom, musicListAtom, playlistAtom } from '@/atoms/audio-player';
import * as Popover from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import DesktopMusicContent from './DesktopAudioContent';
import DesktopAudioSiriWave from './DesktopAudioSiriWave';
import { useFetchAudioData } from '@/hooks/audio/fetch';
import useCurrentMusicControl from '@/hooks/audio/useCurrentAudio';

function MobileAudioPlayer({ className, injectClassName }: { className?: string; injectClassName?: string }) {
  useFetchAudioData();
  useCurrentMusicControl();
  const musicList = useAtomValue(musicListAtom);
  const [isOpen, setIsOpen] = useState(false);
  const setPlaylistAtom = useSetAtom(playlistAtom);
  const setCurrentMusic = useSetAtom(currentAudioAtom);
  const [playStatus, setPlayStatus] = useAtom(currentPlayStatusAtom);

  useEffect(() => {
    if (!musicList.length) return;
    setCurrentMusic(musicList[0]);
    setPlaylistAtom(musicList);
    setPlayStatus(true);
  }, [musicList, setCurrentMusic, setPlaylistAtom, setPlayStatus]);

  const handleChangePlayStatus = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setPlayStatus(!playStatus);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={clsx(
          'flex w-[4.875rem] cursor-pointer items-center gap-1 rounded-full bg-foreground px-1.5 transition duration-300',
          className,
          injectClassName,
        )}
      >
        <DesktopAudioSiriWave className="w-6 overflow-hidden" />
        <div onClick={handleChangePlayStatus} className="size-4">
          {playStatus ? <PauseSVG className="w-full fill-background" /> : <PlaySVG className="w-full fill-background" />}
        </div>
        <Popover.Trigger asChild>
          <div onClick={() => setIsOpen((v) => !v)} className="size-4">
            <PlayListSVG className="w-full fill-background" />
          </div>
        </Popover.Trigger>
        <Popover.Anchor className={clsx('pointer-events-none h-6.5 w-71', className)} />
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={16}
            className={clsx(
              'z-10 ml-4 w-[calc(100vw_-_2rem)] rounded-lg border-2 border-audio-border bg-audio-content p-4.5',
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
