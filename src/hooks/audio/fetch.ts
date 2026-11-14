import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { fetchAudioData } from '@/apis';
import { AudioDataItem } from '@/apis/types';
import { useQuery } from '@tanstack/react-query';
import { musicListAtom, PlayList, podcastIDAtom, podcastLTAtom } from '@/atoms/audio-player';

export function useFetchAudioData() {
  const setMusicList = useSetAtom(musicListAtom);
  const setPodcastID = useSetAtom(podcastIDAtom);
  const setPodcastLT = useSetAtom(podcastLTAtom);

  // The list is 1.3 MB (uncompressed from the API) and nothing on the first screen needs it:
  // fetch it once the page has loaded and the main thread is idle.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      if (!cancelled) setEnabled(true);
    };
    const schedule = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(start, { timeout: 4000 });
      else timerId = setTimeout(start, 2500);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, []);

  const { data } = useQuery({
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
}
