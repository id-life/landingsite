'use client';

import { innerPageIndexAtom, innerPageNavigateToAtom } from '@/atoms';
import { jotaiStore } from '@/atoms/store';
import { noteInnerPage, registerInnerPage, takeInnerPage } from '@/motion/innerPages';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

/**
 * The page a paged section of the phone deck starts on when it is entered: the one the history entry kept when the
 * browser brought the entry back (NAV-02), otherwise the first. Taken once.
 */
export function keptStartPage(section: string, total: number) {
  const kept = takeInnerPage(section, 'page');
  return typeof kept === 'number' && Number.isInteger(kept) && kept > 0 && kept < total ? kept : 0;
}

/**
 * Keeps the inner page of a paged phone section (Portfolio, Spectrum) in the history entry while the section is the
 * current one: the shared inner-page atoms the SectionPager and the swipe drive. The first page is the start, so it is
 * not kept.
 */
export function useKeptInnerPage(section: string, active: boolean, total: number) {
  const index = useAtomValue(innerPageIndexAtom);

  useEffect(() => {
    if (!active) return;
    return registerInnerPage(
      section,
      'page',
      () => {
        const now = jotaiStore.get(innerPageIndexAtom);
        return now > 0 ? now : undefined;
      },
      (value) => {
        if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < total) {
          jotaiStore.set(innerPageNavigateToAtom, value);
        }
        return true;
      },
    );
  }, [section, active, total]);

  useEffect(() => {
    if (active) noteInnerPage(section);
  }, [section, active, index]);
}
