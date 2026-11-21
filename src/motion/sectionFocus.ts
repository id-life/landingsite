import { NAV_LIST } from '@/components/nav/nav';

/**
 * Keyboard and screen-reader paths through the deck (NAV-05), driven by the section controller:
 *
 * - inert: only what cannot be shown. While a move runs, every section other than the one it starts from and the one
 *   it goes to (a far jump passes the others under its cover), and every section while a modal dialog is open. A
 *   section at rest off screen stays reachable: Tab reaching it moves the deck there (useSkipToSection).
 * - focus: after a section change asked for from the keyboard (Enter or Space on a nav link, an arrow, the menu), the
 *   section reached takes focus once the move has landed, so the next Tab is its first control and not the next nav
 *   link. A change asked for with the pointer leaves focus where it is.
 */

/** The elements that belong to a section: the section itself and parts of it rendered elsewhere (data-section-of). */
function partsOf(id: string): HTMLElement[] {
  const parts: HTMLElement[] = [];
  const section = document.getElementById(id);
  if (section) parts.push(section);
  document.querySelectorAll<HTMLElement>(`[data-section-of="${id}"]`).forEach((el) => parts.push(el));
  return parts;
}

/** The section ids that take inert, given the controller's state and whether a modal is open. */
export function inertSections(state: { index: number; target: number; phase: 'idle' | 'moving' }, modal: boolean): string[] {
  return NAV_LIST.filter((_, i) => modal || (state.phase === 'moving' && i !== state.index && i !== state.target)).map(
    (item) => item.id,
  );
}

let lastState: { index: number; target: number; phase: 'idle' | 'moving' } = { index: 0, target: 0, phase: 'idle' };
const marked = new Set<HTMLElement>();

/** Put `inert` on exactly the sections that cannot be shown now. */
export function applySectionInert(state = lastState) {
  lastState = state;
  if (typeof document === 'undefined' || typeof document.querySelector !== 'function') return;
  const modal = document.querySelector('[aria-modal="true"]') !== null;
  const want = new Set(inertSections(state, modal).flatMap(partsOf));
  for (const el of marked) {
    if (want.has(el)) continue;
    el.inert = false;
    marked.delete(el);
  }
  for (const el of want) {
    if (marked.has(el) || el.inert) continue;
    el.inert = true;
    marked.add(el);
  }
}

let watching = false;
/** A dialog opening or closing (aria-modal set or cleared) changes what is inert. */
export function watchModals() {
  if (watching || typeof MutationObserver === 'undefined' || typeof document === 'undefined' || !document.body) return;
  watching = true;
  new MutationObserver(() => applySectionInert()).observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['aria-modal'],
  });
}

/**
 * Focus a section without scrolling: it takes focus only for that moment (its tabindex is removed when it loses
 * focus), so a press on its text never focuses it, and the next Tab is its first control.
 */
export function focusSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return false;
  section.setAttribute('tabindex', '-1');
  section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
  section.focus({ preventScroll: true });
  return true;
}

/** How long after Enter or Space a section change counts as asked for from the keyboard. */
const KEY_WINDOW_MS = 1000;
let keyAt = -Infinity;
let listening = false;
/** Enter or Space on a control marks the next section change as the keyboard's; any pointer press clears it. */
export function listenForKeyboardActivation() {
  if (listening || typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
  listening = true;
  window.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') keyAt = performance.now();
    },
    { capture: true },
  );
  window.addEventListener(
    'pointerdown',
    () => {
      keyAt = -Infinity;
    },
    { capture: true },
  );
}

/** Whether a section change starting now was asked for from the keyboard (taken once). */
export function takeKeyboardActivation(now = performance.now()) {
  const keyboard = now - keyAt <= KEY_WINDOW_MS;
  keyAt = -Infinity;
  return keyboard;
}
