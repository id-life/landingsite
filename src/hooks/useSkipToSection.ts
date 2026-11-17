'use client';

import { useEffect } from 'react';
import { NAV_LIST } from '@/components/nav/nav';
import { getSectionState, goToSection } from '@/motion/sectionController';

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
    // Reached by the Tab key alone, a section other than the one in view is brought to its rest pose, so its
    // focused control is drawn (it was left at the start of its entrance, its text at opacity 0). Only after a Tab
    // key, so a press or a programmatic focus never moves the deck; through the controller's public goToSection.
    let tabbing = false;
    const onKeyDown = (event: KeyboardEvent) => {
      tabbing = event.key === 'Tab';
    };
    const onPointerDown = () => {
      tabbing = false;
    };
    const onTabFocus = (event: FocusEvent) => {
      if (!tabbing || !(event.target instanceof Element)) return;
      const state = getSectionState();
      if (state.phase === 'moving') return;
      const index = NAV_LIST.findIndex((item) => event.target instanceof Element && event.target.closest(`#${item.id}`));
      if (index < 0 || index === state.index) return;
      goToSection(index, 'key');
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusin', onTabFocus);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusin', onTabFocus);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, []);
}
