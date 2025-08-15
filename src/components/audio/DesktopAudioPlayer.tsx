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
import { AUDIO_DISPATCH, currentAudioAtom, hasInteractedAtom, musicListAtom, playlistAtom } from '@/atoms/audio-player';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { motion } from 'motion/react';
import PlayListSVG from '@/../public/svgs/player/play_list.svg?component';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';

export const motionVariants = {
  visible: {
    opacity: 1,
    scale: 1,
    display: 'block',
  },
  hidden: {
    opacity: 0,
    scale: 0.5,
    display: 'none',
  },
} as const;

export const motionTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
} as const;

function DesktopAudioPlayer({ className }: { className?: string }) {
  useFetchAudioData();
  const { trackEvent } = useGA();
  const musicList = useAtomValue(musicListAtom);
  const { data, isPlaying, dispatch, audioContext } = useCurrentMusicControl();
  const [isOpen, setIsOpen] = useState(false);
  const setPlaylistAtom = useSetAtom(playlistAtom);
  const setCurrentMusic = useSetAtom(currentAudioAtom);
  const setHasInteracted = useSetAtom(hasInteractedAtom);

  useEffect(() => {
    if (!musicList.length) return;
    setCurrentMusic(musicList[0]);
    setPlaylistAtom(musicList);
  }, [musicList, setCurrentMusic, setPlaylistAtom]);

  const handleChangePlayStatus = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setHasInteracted(true);
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const label = isPlaying ? GA_EVENT_LABELS.MUSIC_PLAYER_START.PAUSE : GA_EVENT_LABELS.MUSIC_PLAYER_START.START;
    trackEvent({ name: GA_EVENT_NAMES.MUSIC_PLAYER_START, label });
    dispatch({ type: AUDIO_DISPATCH.TOGGLE_PLAY, value: GA_EVENT_LABELS.MUSIC_AUTO_PLAY.TOGGLE });
    eventBus.next({ type: MessageType.CHANGE_PLAY_STATUS });
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
          className={clsx('flex cursor-pointer items-center rounded-full bg-gray-750', className)}
        >
          <div onClick={handleChangePlayStatus} className="flex items-center">
            <div className="px-[8px]">
              <DesktopAudioSiriWave />
            </div>
            <div className="size-[16px]">
              {isPlaying ? <PauseSVG className="w-full fill-white" /> : <PlaySVG className="w-full fill-white" />}
            </div>
          </div>
          <div className="mx-[4px] flex select-none items-center gap-[8px] pr-[4px]">
            <AudioTitle width={148} title={title} />
            <div className="h-[14px] w-px bg-[#57595C]" />
            <PlayListSVG className="size-[16px] fill-white" />
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Anchor className={clsx('pointer-events-none h-[26px]', className)} />
      <Popover.Portal forceMount>
        <Popover.Content asChild align="end" side="top" avoidCollisions={false} sideOffset={16}>
          <motion.div
            variants={motionVariants}
            transition={motionTransition}
            initial="hidden"
            animate={isOpen ? 'visible' : 'hidden'}
            style={{ originX: 1, originY: 1 }}
            className="z-[51] w-[400px] overflow-hidden rounded-lg bg-[#121212CC] p-[20px] before:absolute before:inset-0 before:-z-10 before:backdrop-blur"
          >
            <DesktopMusicContent isPlaying={isPlaying} audioContext={audioContext} />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default React.memo(DesktopAudioPlayer);
