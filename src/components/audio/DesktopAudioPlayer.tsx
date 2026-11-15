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
import useCurrentMusicControl, { getAudioContext, requestPlayWhenReady } from '@/hooks/audio/useCurrentAudio';
import {
  AUDIO_DISPATCH,
  audioListRequestedAtom,
  currentAudioAtom,
  hasInteractedAtom,
  musicListAtom,
  playlistAtom,
} from '@/atoms/audio-player';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { AnimatePresence, motion } from 'motion/react';
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
  const { data, isPlaying, dispatch } = useCurrentMusicControl();
  const [isOpen, setIsOpen] = useState(false);
  const setPlaylistAtom = useSetAtom(playlistAtom);
  const setCurrentMusic = useSetAtom(currentAudioAtom);
  const setHasInteracted = useSetAtom(hasInteractedAtom);
  // The player list is fetched on intent: pointing at, focusing or pressing the player (PERF-07).
  const requestAudioList = useSetAtom(audioListRequestedAtom);
  const onIntent = () => requestAudioList(true);

  useEffect(() => {
    if (!musicList.length) return;
    setCurrentMusic(musicList[0]);
    setPlaylistAtom(musicList);
  }, [musicList, setCurrentMusic, setPlaylistAtom]);

  const handleChangePlayStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHasInteracted(true);
    requestAudioList(true);
    const audioContext = getAudioContext();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const label = isPlaying ? GA_EVENT_LABELS.MUSIC_PLAYER_START.PAUSE : GA_EVENT_LABELS.MUSIC_PLAYER_START.START;
    trackEvent({ name: GA_EVENT_NAMES.MUSIC_PLAYER_START, label });
    // Pressed before the list has arrived: start the first track as soon as it is in.
    if (!data) requestPlayWhenReady();
    else dispatch({ type: AUDIO_DISPATCH.TOGGLE_PLAY, value: GA_EVENT_LABELS.MUSIC_AUTO_PLAY.TOGGLE });
    eventBus.next({ type: MessageType.CHANGE_PLAY_STATUS });
  };

  const title = useMemo(
    () => (data?.artist ? `${data?.title} - ${data?.artist}` : `${data?.title ?? ''}`),
    [data?.title, data?.artist],
  );

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (open) onIntent();
        setIsOpen(open);
      }}
    >
      {/* Two buttons (they were clickable divs, unreachable by keyboard): play / pause, and the playlist. The
          play button's name switches between "Play music" and "Pause music" (no aria-pressed, per the APG
          button pattern). Sound starts only from this button. */}
      <div
        onPointerEnter={onIntent}
        onPointerDown={onIntent}
        onFocus={onIntent}
        className={clsx('flex items-center rounded-full bg-gray-750', className)}
      >
        <button
          type="button"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          onClick={handleChangePlayStatus}
          className="flex cursor-pointer items-center rounded-full"
        >
          <span aria-hidden="true" className="px-[8px]">
            <DesktopAudioSiriWave />
          </span>
          <span aria-hidden="true" className="size-[16px]">
            {isPlaying ? <PauseSVG className="w-full fill-white" /> : <PlaySVG className="w-full fill-white" />}
          </span>
        </button>
        <Popover.Trigger asChild>
          <button
            type="button"
            // The name contains the visible title (WCAG 2.5.3 label in name).
            aria-label={`${title || 'Music'}, playlist`}
            className="mx-[4px] flex cursor-pointer select-none items-center gap-[8px] rounded-full pr-[4px]"
          >
            <AudioTitle width={148} title={title || 'Music'} />
            <span aria-hidden="true" className="h-[14px] w-px bg-[#57595C]" />
            <PlayListSVG aria-hidden="true" className="size-[16px] fill-white" />
          </button>
        </Popover.Trigger>
      </div>
      <Popover.Anchor className={clsx('pointer-events-none h-[26px]', className)} />
      {/* Mounted only while open (plus its exit animation). A permanently mounted Content keeps Radix's
          invisible focus-guard spans in <body>, which made the first Tab stop on the page an invisible element,
          and it mounted the playlist (and its waveform download) on every page load. */}
      <AnimatePresence>
        {isOpen && (
          <Popover.Portal forceMount key="playlist">
            <Popover.Content forceMount asChild align="end" side="top" avoidCollisions={false} sideOffset={16}>
              <motion.div
                variants={motionVariants}
                transition={motionTransition}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{ originX: 1, originY: 1 }}
                className="z-[51] w-[400px] overflow-hidden rounded-lg bg-[#121212CC] p-[20px] before:absolute before:inset-0 before:-z-10 before:backdrop-blur"
              >
                <DesktopMusicContent isPlaying={isPlaying} />
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
}

export default React.memo(DesktopAudioPlayer);
