'use client';

import { ReactNode } from 'react';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { trackEvent } from '@/hooks/useGA';

/** The episode row's click event (GA), the only script a row of the server-rendered list needs. */
export default function EpisodeClickTracker({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      onClick={() => trackEvent({ name: GA_EVENT_NAMES.EPISODE_ITEM_CLICK, label })}
      className="group flex cursor-pointer gap-4"
    >
      {children}
    </div>
  );
}
