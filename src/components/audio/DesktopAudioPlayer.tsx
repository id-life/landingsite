import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useAtom, useSetAtom } from 'jotai';
import { MusicData } from './audio-data';
import * as Popover from '@radix-ui/react-popover';
import DesktopMusicContent from './DesktopAudioContent';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import { currentAudioAtom, currentPlayStatusAtom, playlistAtom } from '@/atoms/audio-player';
import useCurrentMusicControl from '@/hooks/audio/useCurrentAudio';

function DesktopAudioPlayer({ className }: { className?: string }) {
  const [playStatus, setPlayStatus] = useAtom(currentPlayStatusAtom);
  const [isOpen, setIsOpen] = useState(false);
  const setCurrentMusic = useSetAtom(currentAudioAtom);
  const setPlaylistAtom = useSetAtom(playlistAtom);
  const { data } = useCurrentMusicControl();

  useEffect(() => {
    setCurrentMusic(MusicData[0]);
    setPlaylistAtom(MusicData);
  }, [setCurrentMusic]);

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
            'flex w-71 cursor-pointer gap-2.5 rounded-full bg-foreground px-2 py-1 transition duration-300 hover:scale-110',
            className,
          )}
        >
          <div className="flex-1"></div>
          <div className="w-37 truncate text-xs/3.5 font-semibold text-background">{data?.title}</div>
          <div onClick={handleChangePlayStatus} className="size-4">
            {playStatus ? <PauseSVG className="w-full fill-background" /> : <PlaySVG className="w-full fill-background" />}
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Anchor className={clsx('pointer-events-none h-6.5 w-71', className)} />
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={16} className="z-10 w-100 rounded-lg border-2 border-white bg-[#cbd6ea] p-5">
          <DesktopMusicContent />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default React.memo(DesktopAudioPlayer);
