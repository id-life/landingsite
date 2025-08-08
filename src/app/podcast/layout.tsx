'use client';

import React, { ReactNode, Suspense } from 'react';
import PodcastHeader from '@/app/podcast/_components/PodcastHeader';

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto w-full max-w-[50rem] mobile:px-5">
      <Suspense>
        <PodcastHeader />
      </Suspense>
      {children}
    </div>
  );
}
