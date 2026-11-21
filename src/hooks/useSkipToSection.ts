'use client';

import { useEffect } from 'react';
import { NAV_LIST } from '@/components/nav/nav';
import { getSectionState, goToSection } from '@/motion/sectionController';
import { createTabIntent } from '@/motion/tabIntent';
import { focusSection } from '@/motion/sectionFocus';

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
      focusSection(NAV_LIST[getSectionState().index]?.id ?? '');
    };
    // Reached by the Tab key, a section other than the one in view is brought to its rest pose, so its focused
    // control is drawn (it was left at the start of its entrance, its text at opacity 0); through the controller's
    // public goToSection. Only a focus change that is the direct result of a Tab press in this page moves the deck
    // (tabIntent): not the window coming back, a script's focus(), a dialog handing focus back, a press or the wheel.
    const intent = createTabIntent();
    // Both times are taken when the handlers run (not event.timeStamp, the time of the key press itself): the window
    // then measures the keydown's dispatch to its focus change, which a busy main thread cannot stretch.
    const onKeyDown = (event: KeyboardEvent) => intent.keydown(event, performance.now());
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Tab') intent.clear();
    };
    const clear = () => intent.clear();
    const onTabFocus = (event: FocusEvent) => {
      if (!intent.focus(performance.now()) || !(event.target instanceof Element)) return;
      const state = getSectionState();
      // A part drawn for a section but rendered outside it (Connect's contact band, portalled to the end of the page)
      // names its section with data-section-of.
      const target = event.target;
      const owner = target.closest('[data-section-of]')?.getAttribute('data-section-of');
      const index = NAV_LIST.findIndex((item) => (owner ? item.id === owner : target.closest(`#${item.id}`)));
      // During a move the deck is headed for its target: a Tab press back out of it retargets the move (the controller
      // reverses it toward where it started, or goes on to the new section), so the deck ends where the focus is.
      const headedFor = state.phase === 'moving' ? state.target : state.index;
      if (index < 0 || index === headedFor) return;
      goToSection(index, 'key');
    };
    // The skip link on the experience: its native anchor jump scrolled the window to #content-start (near the top of
    // the page) and the smoother glided back, so the first wheel notch read the gliding position and stepped to the
    // section already in view (it did nothing; the second notch moved). Here the link focuses its target without
    // scrolling; content pages keep the native link.
    const onSkipClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('a[href="#content-start"]')) return;
      const start = document.getElementById('content-start');
      if (!start) return;
      event.preventDefault();
      start.focus({ preventScroll: true });
    };
    document.addEventListener('click', onSkipClick, true);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusin', onTabFocus);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('pointerdown', clear, true);
    window.addEventListener('blur', clear);
    return () => {
      document.removeEventListener('click', onSkipClick, true);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusin', onTabFocus);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('keyup', onKeyUp, true);
      document.removeEventListener('pointerdown', clear, true);
      window.removeEventListener('blur', clear);
    };
  }, []);
}
