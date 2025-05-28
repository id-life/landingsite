'use client';

import { cn } from '@/utils';
import dynamic from 'next/dynamic';
import { isNull } from 'lodash-es';
import { useAtomValue } from 'jotai';
import { isLoadingUIAtom } from '@/atoms/geo';
import { useIsMobile } from '@/hooks/useIsMobile';

const PCFixedUI = dynamic(() => import('./PCFixedUI'), { ssr: false });
const MobileFixedUI = dynamic(() => import('./MobileFixedUI'), { ssr: false });

export default function FixedUI() {
  const isMobile = useIsMobile();
  const isLoadingUI = useAtomValue(isLoadingUIAtom);
  if (isNull(isMobile)) return null;

  return <div className={cn(isLoadingUI ? 'opacity-100' : 'opacity-0')}>{isMobile ? <MobileFixedUI /> : <PCFixedUI />}</div>;
}
