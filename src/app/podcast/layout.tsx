'use client';

import React, { ReactNode } from 'react';
import PodcastHeader from '@/app/podcast/_components/PodcastHeader';

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto max-w-[50rem] mobile:px-2">
      <PodcastHeader />
      {children}
    </div>
  );
}
