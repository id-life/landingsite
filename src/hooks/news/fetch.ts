import { fetchNewsList } from '@/apis';
import { useQuery } from '@tanstack/react-query';

export function useFetchNewsList() {
  return useQuery({
    queryKey: ['fetch_news_list'],
    queryFn: () => fetchNewsList(),
    select: (res) => (res.code === 200 ? res.data : undefined),
  });
}
