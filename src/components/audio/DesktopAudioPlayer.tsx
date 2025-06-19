import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import * as Popover from '@radix-ui/react-popover';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import DesktopMusicContent from './DesktopAudioContent';
import { useFetchAudioData } from '@/hooks/audio/fetch';
import AudioTitle from '@/components/audio/AudioTitle';
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
            'flex w-[284px] cursor-pointer items-center gap-[10px] rounded-full bg-audio-player px-[8px]',
            className,
          )}
        >
          <DesktopAudioSiriWave />
          {/*<div className="w-[148px] text-[12px]/[14px] font-semibold text-background">*/}
          {/*  <div>*/}
          {/*    {data?.title} - {data?.artist}*/}
          {/*  </div>*/}
          {/*</div>*/}
          <AudioTitle width={148} title={`${data?.title} - ${data?.artist}`} />
          <div onClick={handleChangePlayStatus} className="size-[16px]">
            {playStatus ? <PauseSVG className="w-full fill-background" /> : <PlaySVG className="w-full fill-background" />}
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Anchor className={clsx('pointer-events-none h-[26px] w-[284px]', className)} />
      <Popover.Portal forceMount>
        <Popover.Content
          forceMount
          align="end"
          sideOffset={16}
          className="z-10 w-[400px] rounded-lg border-2 border-audio-border bg-audio-content p-[20px] data-[state=closed]:hidden"
        >
          <DesktopMusicContent />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default React.memo(DesktopAudioPlayer);
