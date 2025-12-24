'use client';

import { useSessionInvisibilityTracker } from '@/hooks/useSessionInvisibilityTracker';

export function SessionInvisibilityTracker() {
  useSessionInvisibilityTracker();
  return null;
}
