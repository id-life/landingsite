import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as Popover from '@radix-ui/react-popover';
import DesktopMusicContent from './DesktopAudioContent';
import { useFetchAudioData } from '@/hooks/audio/fetch';
import DesktopAudioSiriWave from './DesktopAudioSiriWave';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import useCurrentMusicControl from '@/hooks/audio/useCurrentAudio';
import { currentAudioAtom, currentPlayStatusAtom, musicListAtom, playlistAtom } from '@/atoms/audio-player';

function DesktopAudioPlayer({ className }: { className?: string }) {
  useFetchAudioData();
  const musicList = useAtomValue(musicListAtom);
  const { data } = useCurrentMusicControl();
  const [isOpen, setIsOpen] = useState(false);
  const setPlaylistAtom = useSetAtom(playlistAtom);
  const setCurrentMusic = useSetAtom(currentAudioAtom);
  const [playStatus, setPlayStatus] = useAtom(currentPlayStatusAtom);

  useEffect(() => {
    if (!musicList.length) return;
    setCurrentMusic(musicList[0]);
    setPlaylistAtom(musicList);
  }, [musicList, setCurrentMusic, setPlaylistAtom]);

  const handleChangePlayStatus = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setPlayStatus(!playStatus);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div
          onClick={() => setIsOpen((v) => !v)}
          className={clsx(
            'flex w-71 cursor-pointer items-center gap-2.5 rounded-full bg-foreground px-2 transition duration-300 hover:scale-110',
            className,
          )}
        >
          <DesktopAudioSiriWave />
          <div className="w-37 truncate text-xs/3.5 font-semibold text-background">{data?.title}</div>
          <div onClick={handleChangePlayStatus} className="size-4">
            {playStatus ? <PauseSVG className="w-full fill-background" /> : <PlaySVG className="w-full fill-background" />}
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Anchor className={clsx('pointer-events-none h-6.5 w-71', className)} />
      <Popover.Portal forceMount>
        <Popover.Content
          forceMount
          align="end"
          sideOffset={16}
          className="z-10 w-100 rounded-lg border-2 border-white bg-[#cbd6ea] p-5 data-[state=closed]:hidden"
        >
          <DesktopMusicContent />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default React.memo(DesktopAudioPlayer);
