import { fetchAudioData } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { musicListAtom, PlayList, podcastListAtom } from '@/atoms/audio-player';
import { AudioDataItem } from '@/apis/types';
import { useSetAtom } from 'jotai';

export function useFetchAudioData() {
  const setMusicList = useSetAtom(musicListAtom);
  const setPodcastList = useSetAtom(podcastListAtom);

  const { data } = useQuery({
    queryKey: ['fetch_audio_data'],
    queryFn: () => fetchAudioData(),
    select: (res) => (res.code === 200 ? res.data : []),
  });

  useEffect(() => {
    if (!data) return;
    const musicList: AudioDataItem[] = [];
    const podcastList: AudioDataItem[] = [];

    data.forEach((item) => {
      if (item.category === PlayList.MUSIC) {
        musicList.push(item);
      }
      if (item.category === PlayList.PODCAST) {
        podcastList.push(item);
      }
    });

    setPodcastList(podcastList);
    setMusicList(musicList);
  }, [data, setMusicList, setPodcastList]);
}
