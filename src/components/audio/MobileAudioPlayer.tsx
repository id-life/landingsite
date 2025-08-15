import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PlayListSVG from '@/../public/svgs/player/play_list.svg?component';
import { AUDIO_DISPATCH, currentAudioAtom, hasInteractedAtom, musicListAtom, playlistAtom } from '@/atoms/audio-player';
import Dialog from '@/components/dialog';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useFetchAudioData } from '@/hooks/audio/fetch';
import useCurrentMusicControl from '@/hooks/audio/useCurrentAudio';
import { useGA } from '@/hooks/useGA';
import { clsx } from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import DesktopMusicContent from './DesktopAudioContent';
import DesktopAudioSiriWave from './DesktopAudioSiriWave';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';

function MobileAudioPlayer({ className }: { className?: string }) {
  useFetchAudioData();
  const { isPlaying, dispatch, audioContext } = useCurrentMusicControl();
  const { trackEvent } = useGA();
  const musicList = useAtomValue(musicListAtom);
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      overlayClassName="backdrop-blur-[2px] bg-transparent"
      className="border-0 bg-transparent shadow-none"
      contentClassName="mobile:min-h-[22.625rem] pb-20"
      fixClassName="align-bottom items-end"
      showCloseButton={false}
      isDismiss={true}
      anim="fade"
      render={() => (
        <div className="w-[calc(100vw_-_2rem)] rounded-lg bg-[#121212CC] p-4.5 before:absolute before:inset-0 before:bottom-[4.75rem] before:-z-10 before:block before:backdrop-blur">
          <DesktopMusicContent isPlaying={isPlaying} audioContext={audioContext} />
        </div>
      )}
    >
      <div
        className={clsx(
          'z-[101] flex h-8 cursor-pointer items-center gap-1 rounded-full bg-gray-750 px-1.5 transition duration-300',
          className,
        )}
      >
        <div className="flex items-center gap-1" onClick={handleChangePlayStatus}>
          <DesktopAudioSiriWave className="w-6 overflow-hidden" />
          <div className="size-5">
            {isPlaying ? <PauseSVG className="size-full fill-white" /> : <PlaySVG className="size-full fill-white" />}
          </div>
        </div>
        <div className="mx-0.5 h-4 w-px bg-[#57595C]" />
        <div className="relative size-5">
          <div className="absolute left-0 top-1/2 flex size-12 -translate-y-1/2 items-center">
            <PlayListSVG className="size-5 fill-white" />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default React.memo(MobileAudioPlayer);
