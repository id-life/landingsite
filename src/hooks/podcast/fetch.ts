import { useQuery } from '@tanstack/react-query';
import { fetchPodcastComment, fetchPodcastList } from '@/apis';

export function useFetchPodcastList(category?: string) {
  return useQuery({
    queryKey: ['fetch_podcast_list', category],
    queryFn: () => fetchPodcastList(category),
    select: (res) => (res.code === 200 ? res.data : []),
  });
}

export function useFetchPodcastComment(id?: string) {
  return useQuery({
    queryKey: ['fetch_podcast_comment', id],
    queryFn: () => fetchPodcastComment(id),
    select: (res) => (res.code === 200 ? res.data : []),
  });
}
