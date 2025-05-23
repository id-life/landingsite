'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import Home from './_components/Home';
import MobileHome from './_components/MobileHome';
// import { useFetchTestData } from '@/hooks/fetch';

export default function HomePage() {
  const isMobile = useIsMobile();
  // TODO: Del fetch test
  // const { data, isLoading, refetch } = useFetchTestData(1);

  return isMobile ? <MobileHome /> : <Home />;
}
