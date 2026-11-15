import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PlayListSVG from '@/../public/svgs/player/play_list.svg?component';
import {
  AUDIO_DISPATCH,
  audioListRequestedAtom,
  currentAudioAtom,
  currentPlayStatusAtom,
  hasInteractedAtom,
  musicListAtom,
  playlistAtom,
} from '@/atoms/audio-player';
import Dialog from '@/components/dialog';
import { useFetchAudioData } from '@/hooks/audio/fetch';
import useCurrentMusicControl, {
  cancelPlayWhenReady,
  getAudioContext,
  isPlayWhenReadyPending,
  requestPlayWhenReady,
} from '@/hooks/audio/useCurrentAudio';
import { clsx } from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import DesktopMusicContent from './DesktopAudioContent';
import DesktopAudioSiriWave from './DesktopAudioSiriWave';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { PLAY_TRIGGER } from '@/atoms/audio-player';

function MobileAudioPlayer({ className }: { className?: string }) {
  useFetchAudioData();
  const { data, isPlaying, dispatch } = useCurrentMusicControl();
  const musicList = useAtomValue(musicListAtom);
  const [isOpen, setIsOpen] = useState(false);
  const setPlaylistAtom = useSetAtom(playlistAtom);
  const setCurrentMusic = useSetAtom(currentAudioAtom);
  const setHasInteracted = useSetAtom(hasInteractedAtom);
  const setPlayStatus = useSetAtom(currentPlayStatusAtom);
  // The player list is fetched on intent: touching or focusing the player, or opening its playlist (PERF-07).
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
    // Pressed before the list has arrived: the control shows the press at once, and a second press cancels it.
    if (!data) {
      if (isPlayWhenReadyPending()) cancelPlayWhenReady();
      else requestPlayWhenReady();
      setPlayStatus(isPlayWhenReadyPending());
    } else dispatch({ type: AUDIO_DISPATCH.TOGGLE_PLAY, value: PLAY_TRIGGER.TOGGLE });
    eventBus.next({ type: MessageType.CHANGE_PLAY_STATUS });
  };

  return (
    // Two buttons (they were clickable divs, unreachable by keyboard): play / pause, whose name switches between
    // "Play music" and "Pause music", and the playlist, which opens the playlist dialog. Both have 44 px tall
    // touch targets through ::before. Sound starts only from the play button.
    <div
      onPointerDown={onIntent}
      onFocus={onIntent}
      className={clsx('z-[101] flex h-8 items-center gap-1 rounded-full bg-tone-750 px-1.5 transition duration-300', className)}
    >
      <button
        type="button"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        onClick={handleChangePlayStatus}
        // tap: a 44 px box on touch screens (RWD-06); the pill keeps its 32 px height.
        className="relative flex cursor-pointer items-center justify-center gap-1 tap"
      >
        <span aria-hidden="true">
          <DesktopAudioSiriWave className="w-6 overflow-hidden" />
        </span>
        <span aria-hidden="true" className="size-5">
          {isPlaying ? <PauseSVG className="size-full fill-white" /> : <PlaySVG className="size-full fill-white" />}
        </span>
      </button>
      <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-tone-650" />
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (open) onIntent();
          setIsOpen(open);
        }}
        overlayClassName="backdrop-blur-[2px] bg-transparent"
        className="border-0 bg-transparent shadow-none"
        contentClassName="mobile:min-h-[22.625rem] pb-20"
        fixClassName="align-bottom items-end"
        showCloseButton={false}
        isDismiss={true}
        anim="fade"
        render={() => (
          <div className="w-[calc(100vw_-_2rem)] rounded-lg bg-tone-950/80 p-4.5 before:absolute before:inset-0 before:bottom-[4.75rem] before:-z-10 before:block before:backdrop-blur">
            <DesktopMusicContent isPlaying={isPlaying} />
          </div>
        )}
      >
        <button
          type="button"
          aria-label="Playlist"
          // A 44 px box on touch screens (RWD-06); the icon stays 20 px.
          className="relative flex size-5 cursor-pointer items-center justify-center tap"
        >
          <PlayListSVG aria-hidden="true" className="size-5 fill-white" />
        </button>
      </Dialog>
    </div>
  );
}

export default React.memo(MobileAudioPlayer);
