import { useCallback, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { fetchAudioData } from '@/apis';
import { AudioDataItem } from '@/apis/types';
import { useQuery } from '@tanstack/react-query';
import {
  audioListRequestedAtom,
  currentPlayStatusAtom,
  musicListAtom,
  PlayList,
  podcastIDAtom,
  podcastLTAtom,
} from '@/atoms/audio-player';
import { cancelPlayWhenReady, isPlayWhenReadyPending } from '@/hooks/audio/useCurrentAudio';

export function useFetchAudioData() {
  const setMusicList = useSetAtom(musicListAtom);
  const setPodcastID = useSetAtom(podcastIDAtom);
  const setPodcastLT = useSetAtom(podcastLTAtom);

  // The list is 1.3 MB (uncompressed from the API). The player shows the first track's name at rest, as the original
  // does, so the list is fetched once the page is idle after load (or at once on intent); no audio is fetched or played
  // until the visitor asks.
  const enabled = useAtomValue(audioListRequestedAtom);
  const requestList = useSetAtom(audioListRequestedAtom);
  useEffect(() => {
    if (enabled) return;
    let idle = 0;
    let timer = 0;
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idle = window.requestIdleCallback(() => requestList(true), { timeout: 4000 });
      } else timer = window.setTimeout(() => requestList(true), 2000);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, [enabled, requestList]);

  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['fetch_audio_data'],
    queryFn: () => fetchAudioData(),
    select: (res) => (res.code === 200 ? res.data : []),
    enabled,
  });

  useEffect(() => {
    if (!data) return;
    data.sort((a, b) => a.sequence - b.sequence);
    const musicList: AudioDataItem[] = [];
    const podcastIDList: AudioDataItem[] = [];
    const podcastLTList: AudioDataItem[] = [];

    data.forEach((item) => {
      if (item.category === PlayList.MUSIC) {
        musicList.push(item);
      }
      if (item.category === PlayList.PODCAST_ID) {
        podcastIDList.push(item);
      }
      if (item.category === PlayList.PODCAST_LT) {
        podcastLTList.push(item);
      }
    });

    setPodcastID(podcastIDList);
    setPodcastLT(podcastLTList);
    setMusicList(musicList);
  }, [data, setMusicList, setPodcastID, setPodcastLT]);

  // The list could not be fetched (it is cancelled after 15 s, and retried once): a play pressed while it was on its
  // way can no longer happen, so the control goes back to play rather than showing pause with nothing to play.
  const setPlayStatus = useSetAtom(currentPlayStatusAtom);
  useEffect(() => {
    if (!isError || isFetching || !isPlayWhenReadyPending()) return;
    cancelPlayWhenReady();
    setPlayStatus(false);
  }, [isError, isFetching, setPlayStatus]);

  /** Ask for the list again if the last request failed: a press on the player, or opening its playlist. */
  const retryIfFailed = useCallback(() => {
    if (isError && !isFetching) void refetch();
  }, [isError, isFetching, refetch]);

  return { retryIfFailed };
}
