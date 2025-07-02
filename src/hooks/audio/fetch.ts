import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { fetchAudioData } from '@/apis';
import { AudioDataItem } from '@/apis/types';
import { useQuery } from '@tanstack/react-query';
import { musicListAtom, PlayList, podcastIDAtom, podcastLTAtom } from '@/atoms/audio-player';

export function useFetchAudioData() {
  const setMusicList = useSetAtom(musicListAtom);
  const setPodcastID = useSetAtom(podcastIDAtom);
  const setPodcastLT = useSetAtom(podcastLTAtom);

  const { data } = useQuery({
    queryKey: ['fetch_audio_data'],
    queryFn: () => fetchAudioData(),
    select: (res) => (res.code === 200 ? res.data : []),
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
