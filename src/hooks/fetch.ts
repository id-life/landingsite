import { fetchTestData } from '@/apis';
import { useQuery } from '@tanstack/react-query';

export function useFetchTestData(testId?: number) {
  return useQuery({
    queryKey: ['fetch_test_data', testId],
    queryFn: () => fetchTestData(testId),
    select: (res) => (res.code === 200 ? res.data : undefined),
    enabled: !!testId,
  });
}
