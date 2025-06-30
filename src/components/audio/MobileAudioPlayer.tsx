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
import { motion } from 'motion/react';
import { motionTransition, motionVariants } from '@/components/audio/DesktopAudioPlayer';

function MobileAudioPlayer({ className }: { className?: string }) {
  useFetchAudioData();
  const { isPlaying, dispatch, amplitude, waveSpeed } = useCurrentMusicControl();
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
      <Popover.Trigger asChild>
        <div
          className={clsx(
            'flex w-[4.875rem] cursor-pointer items-center gap-1 rounded-full bg-gray-750 px-1.5 transition duration-300',
            className,
          )}
          onClick={() => setIsOpen((v) => !v)}
        >
          <DesktopAudioSiriWave className="w-6 overflow-hidden" amplitude={amplitude} speed={waveSpeed} />
          <div onClick={handleChangePlayStatus} className="size-4">
            {isPlaying ? <PauseSVG className="w-full fill-white" /> : <PlaySVG className="w-full fill-white" />}
          </div>
          <div className="size-4">
            <PlayListSVG className="w-full fill-white" />
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Anchor className={clsx('pointer-events-none h-6.5 w-71', className)} />
      <Popover.Portal forceMount>
        <Popover.Content asChild align="end" side="top" avoidCollisions={false} sideOffset={16}>
          <motion.div
            variants={motionVariants}
            transition={motionTransition}
            initial="hidden"
            className="z-10 w-[calc(100vw_-_2rem)] rounded-lg bg-[#121212CC] p-4.5 before:absolute before:inset-0 before:-z-10 before:block before:backdrop-blur"
            animate={isOpen ? 'visible' : 'hidden'}
            style={{ originX: 1, originY: 1 }}
          >
            <DesktopMusicContent />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default React.memo(MobileAudioPlayer);
