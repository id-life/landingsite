'use client';

import { useEffect } from 'react';
import { NAV_LIST } from '@/components/nav/nav';
import { getSectionState } from '@/motion/sectionController';

/**
 * Skip to content on the experience (both decks): the link's target, #content-start, sits after the header, and every
 * section follows it in the document. When the target takes focus, focus moves on to the section in view, so the next
 * Tab is that section's first control rather than the first section's. The section takes focus only for that moment:
 * its tabindex is removed when it loses focus, so a press on its text never focuses it.
 */
export function useSkipToSection() {
  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement) || event.target.id !== 'content-start') return;
      const section = document.getElementById(NAV_LIST[getSectionState().index]?.id ?? '');
      if (!section) return;
      section.setAttribute('tabindex', '-1');
      section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
      section.focus({ preventScroll: true });
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);
}
