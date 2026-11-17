import React, { useEffect, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import * as Popover from '@radix-ui/react-popover';
import { useAtomValue, useSetAtom } from 'jotai';
import DesktopMusicContent from './DesktopAudioContent';
import { useFetchAudioData } from '@/hooks/audio/fetch';
import AudioTitle from '@/components/audio/AudioTitle';
import DesktopAudioSiriWave from './DesktopAudioSiriWave';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import useCurrentMusicControl, {
  cancelPlayWhenReady,
  getAudioContext,
  isPlayWhenReadyPending,
  requestPlayWhenReady,
} from '@/hooks/audio/useCurrentAudio';
import {
  AUDIO_DISPATCH,
  audioListRequestedAtom,
  currentAudioAtom,
  currentPlayStatusAtom,
  hasInteractedAtom,
  musicListAtom,
  playlistAtom,
} from '@/atoms/audio-player';
import { AnimatePresence, motion } from 'motion/react';
import PlayListSVG from '@/../public/svgs/player/play_list.svg?component';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { PLAY_TRIGGER } from '@/atoms/audio-player';

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
  const { retryIfFailed: retryAudioList } = useFetchAudioData();
  const musicList = useAtomValue(musicListAtom);
  const { data, isPlaying, dispatch } = useCurrentMusicControl();
  const [isOpen, setIsOpen] = useState(false);
  const setPlaylistAtom = useSetAtom(playlistAtom);
  const setCurrentMusic = useSetAtom(currentAudioAtom);
  const setHasInteracted = useSetAtom(hasInteractedAtom);
  const setPlayStatus = useSetAtom(currentPlayStatusAtom);
  // The player list is fetched on intent: pointing at, focusing or pressing the player (PERF-07).
  const requestAudioList = useSetAtom(audioListRequestedAtom);
  const onIntent = () => {
    requestAudioList(true);
    retryAudioList();
  };
  // The play button is not the popover's trigger, so Radix counts a press on it as outside the playlist. It plays or
  // pauses and leaves the playlist open (the whole pill used to be the trigger, which never closes it).
  const pillRef = useRef<HTMLDivElement>(null);

  // The first track becomes current once, when the list first arrives. A player mounting again (the visitor back on
  // the home page from another page of the site) keeps the track and playlist the visitor had.
  useEffect(() => {
    if (!musicList.length) return;
    if (data) return;
    setCurrentMusic(musicList[0]);
    setPlaylistAtom(musicList);
  }, [data, musicList, setCurrentMusic, setPlaylistAtom]);

  const handleChangePlayStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHasInteracted(true);
    onIntent();
    const audioContext = getAudioContext();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    // Pressed before the list has arrived: the control shows the press at once, and a second press cancels it.
    if (!data) {
      if (isPlayWhenReadyPending()) cancelPlayWhenReady();
      else requestPlayWhenReady();
      setPlayStatus(isPlayWhenReadyPending());
    } else dispatch({ type: AUDIO_DISPATCH.TOGGLE_PLAY, value: PLAY_TRIGGER.TOGGLE });
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
          button pattern). Sound also starts at the first click anywhere on the page (useCurrentAudio). */}
      <div
        ref={pillRef}
        onPointerEnter={onIntent}
        onPointerDown={onIntent}
        onFocus={onIntent}
        className={clsx('flex items-center rounded-full bg-tone-750', className)}
      >
        <button
          type="button"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          onClick={handleChangePlayStatus}
          className="relative flex cursor-pointer items-center rounded-full tap-area"
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
            className="relative mx-[4px] flex cursor-pointer select-none items-center gap-[8px] rounded-full pr-[4px] tap-area"
          >
            <AudioTitle width={148} title={title || 'Music'} />
            <span aria-hidden="true" className="h-[14px] w-px bg-tone-650" />
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
            <Popover.Content
              forceMount
              asChild
              align="end"
              side="top"
              avoidCollisions={false}
              sideOffset={16}
              onInteractOutside={(event) => {
                if (pillRef.current?.contains(event.target as Node)) event.preventDefault();
              }}
            >
              <motion.div
                variants={motionVariants}
                transition={motionTransition}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{ originX: 1, originY: 1 }}
                className="z-[51] w-[400px] overflow-hidden rounded-lg bg-tone-950/80 p-[20px] before:absolute before:inset-0 before:-z-10 before:backdrop-blur"
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
