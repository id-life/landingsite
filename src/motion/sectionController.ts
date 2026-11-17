import { atom } from 'jotai';
import { jotaiStore } from '@/atoms/store';
import { NAV_LIST } from '@/components/nav/nav';
import { sectionTitle } from '@/constants/section-titles';
import { SPECTRUM_HASH_ROUTES } from '@/hooks/spectrum/spectrum-routes';
import { noteSectionView } from '@/lib/analytics/section-view';
import { applyInnerRestore, dropInnerRestore, setRestingSectionReader } from './innerPages';
import { isReducedMotion } from './preference';
import { wakeMotion } from './runtime';

/**
 * The one section controller of the experience (MOT-01). Every way of changing section (wheel, keys, touch,
 * the nav, the arrows, the phone menu and swipe, deep links, Back and Forward) calls goToSection() or
 * stepSection(); nothing else moves between sections, and nothing else writes the section into the URL.
 *
 * - State lives in one jotai atom (sectionStateAtom, in the app's store): the section reached (`index`), the
 *   section being moved to (`target`), `phase` ('idle' | 'moving') and `direction`. Code that used to read the
 *   window flags isNavScrolling / isSmootherScrolling reads this instead (isSectionMoving()).
 * - How a section change looks belongs to the tree that is mounted: each tree registers a SectionDriver (the
 *   desktop deck: useDesktopSections; the phone: usePhoneSectionDriver). The controller asks it for the
 *   section in view and for the transition, and owns everything else: interruption, URL, title, analytics.
 * - A transition can always be interrupted. An opposite step reverses it (back to where it started); any other
 *   destination (a nav click, Back, a far key like End) retargets it from wherever the view is.
 * - When a transition ends, the URL names the section actually reached: pushState for explicit navigation,
 *   replaceState for scrolling, nothing for a deep link or Back (the address is already right). Each change of
 *   the URL records exactly one section view (noteSectionView, DATA-05); Back and Forward record one too.
 */
export type SectionSource =
  | 'wheel'
  | 'key'
  | 'touch'
  | 'nav'
  | 'arrow'
  | 'menu'
  | 'swipe'
  | 'link'
  | 'restore'
  | 'deeplink'
  | 'layout'
  | 'history';

export type SectionPhase = 'idle' | 'moving';

export type SectionState = {
  /** The section the view rests on (during a transition: the one it started from). */
  index: number;
  /** The section being moved to (equal to index when idle). */
  target: number;
  phase: SectionPhase;
  /** -1 up, 1 down, 0 idle. */
  direction: -1 | 0 | 1;
  source: SectionSource | null;
};

/** A transition the controller can reverse or stop. GSAP tweens and timelines fit. */
export type SectionTransition = {
  play: () => unknown;
  reverse: () => unknown;
  kill: () => unknown;
  eventCallback: (type: 'onComplete' | 'onReverseComplete', callback: (() => void) | null) => unknown;
};

export type SectionDriver = {
  tree: 'desktop' | 'phone';
  /** The section in view now. */
  current: () => number;
  /**
   * Where one step from the view goes: usually current() + dir. The desktop deck returns the current section
   * when the view is past its rest pose (the footer), and null when there is nothing to step to (so the input
   * is left to the browser).
   */
  stepTarget: (dir: -1 | 1) => number | null;
  /**
   * Start moving to `to`. Return the transition PAUSED (the controller attaches its callbacks, then plays it),
   * or null when the change is immediate. `reversible` false: an opposite step retargets instead of reversing.
   */
  move: (
    to: number,
    context: { from: number; source: SectionSource },
  ) => { transition: SectionTransition; reversible: boolean } | null;
  /** Called once a transition ended or was cut short, with the section reached. */
  settle?: (index: number) => void;
  /** Stop a running transition (clean up covers, restore smoothing). */
  interrupt?: () => void;
};

const IDLE: SectionState = { index: 0, target: 0, phase: 'idle', direction: 0, source: null };

export const sectionStateAtom = atom<SectionState>(IDLE);

/** Sources that create a history entry; the rest replace the current one (or leave it). */
const PUSH_SOURCES = new Set<SectionSource>(['nav', 'arrow', 'menu', 'swipe', 'link', 'restore']);

let driver: SectionDriver | null = null;
let running: { transition: SectionTransition; reversible: boolean } | null = null;
let refreshing = false;
let lastStepAt = -Infinity;
const REDUCED_STEP_GAP_MS = 400;

const read = () => jotaiStore.get(sectionStateAtom);

// The section the view rests on, for the inner pages kept in history (NAV-02): none while a transition runs.
setRestingSectionReader(() => {
  if (!driver || read().phase !== 'idle') return null;
  return NAV_LIST[driver.current()]?.id ?? null;
});

/** Moves that bring a history entry back or only re-lay the deck out keep a pending inner-page restore (NAV-02). */
const KEEPS_RESTORE = new Set<SectionSource>(['history', 'deeplink', 'layout']);
const write = (next: SectionState) => {
  jotaiStore.set(sectionStateAtom, next);
  // Readable from outside React (the e2e suite, probes, CSS): <html data-section-phase data-section-target>.
  const root = typeof document === 'undefined' ? null : document.documentElement;
  if (root) {
    root.dataset.sectionPhase = next.phase;
    root.dataset.sectionTarget = NAV_LIST[next.target]?.id ?? '';
  }
};

/** Register the mounted tree's driver; returns the unregister function. */
export function registerSectionDriver(next: SectionDriver) {
  stopRunning();
  driver = next;
  write({ ...IDLE, index: next.current(), target: next.current() });
  return () => {
    if (driver !== next) return;
    stopRunning();
    driver = null;
    write(IDLE);
  };
}

export function getSectionState() {
  return read();
}

/** True while a section transition runs (what the window flags isNavScrolling / isSmootherScrolling meant). */
export function isSectionMoving() {
  return read().phase === 'moving';
}

/** Set while ScrollTrigger refreshes after a resize: section callbacks must not act on the jumps it causes. */
export function setLayoutRefreshing(value: boolean) {
  refreshing = value;
}

export function isLayoutRefreshing() {
  return refreshing;
}

/** The index of a section id in NAV_LIST, or -1. */
export function sectionIndex(id: string) {
  return NAV_LIST.findIndex((item) => item.id === id);
}

function stopRunning() {
  if (!running) return;
  const { transition } = running;
  running = null;
  transition.eventCallback('onComplete', null);
  transition.eventCallback('onReverseComplete', null);
  transition.kill();
  driver?.interrupt?.();
}

function keepHash(id: string) {
  const { hash } = window.location;
  return hash && SPECTRUM_HASH_ROUTES.some((route) => `#${route.key}` === hash && route.section === id) ? hash : '';
}

/** Put the section reached into the address bar and the tab title, and record the view (DATA-05). */
function commitUrl(index: number, source: SectionSource) {
  const item = NAV_LIST[index];
  // A deep link: the landing page_view is sent by the analytics stream. A layout re-snap changes no section.
  if (!item || source === 'deeplink' || source === 'layout') return;
  if (window.location.pathname === item.href) {
    // Back / Forward: the browser already changed the address; GA4 sees the popstate, the log records it once.
    if (source === 'history') noteSectionView(sectionTitle(item));
    return;
  }
  // The title first: GA4 reads it when its history listener sees the URL change.
  document.title = sectionTitle(item);
  const url = `${item.href}${window.location.search}${keepHash(item.id)}`;
  if (PUSH_SOURCES.has(source)) window.history.pushState({}, '', url);
  else window.history.replaceState(window.history.state, '', url);
  noteSectionView(document.title);
}

function finish(index: number, source: SectionSource) {
  running = null;
  write({ index, target: index, phase: 'idle', direction: 0, source });
  driver?.settle?.(index);
  commitUrl(index, source);
  // The inner pages: put back what the entry kept (Back, Forward, reload), or keep what the view now shows.
  const id = NAV_LIST[index]?.id;
  if (id) applyInnerRestore(id);
}

/**
 * Go to the section at `index` (NAV_LIST order). Returns false when no tree is mounted or the index is out of
 * range. During a transition: the same target is a no-op, the origin reverses it, anything else retargets.
 */
export function goToSection(target: number | string, source: SectionSource): boolean {
  const index = typeof target === 'string' ? sectionIndex(target) : target;
  if (!driver || index < 0 || index >= NAV_LIST.length) return false;
  // Whatever asks for a section, the page must be drawing to show it (MOT-03): Back and Forward, a hash link and any
  // later caller wake the idle pause here, by construction, not by a list of events.
  wakeMotion();
  if (!KEEPS_RESTORE.has(source)) dropInnerRestore();
  const state = read();
  if (running && state.phase === 'moving') {
    if (index === state.target) return true;
    if (index === state.index && running.reversible) {
      write({ ...state, target: index, direction: index > state.target ? 1 : -1, source });
      running.transition.reverse();
      return true;
    }
    stopRunning();
  }
  const from = driver.current();
  const move = driver.move(index, { from, source });
  if (!move) {
    finish(index, source);
    return true;
  }
  running = move;
  write({ index: from, target: index, phase: 'moving', direction: index === from ? 0 : index > from ? 1 : -1, source });
  const ran = move;
  move.transition.eventCallback('onComplete', () => {
    if (running === ran) finish(index, read().source ?? source);
  });
  move.transition.eventCallback('onReverseComplete', () => {
    if (running === ran) finish(from, read().source ?? source);
  });
  move.transition.play();
  return true;
}

/**
 * One step up (-1) or down (1), as a wheel flick, a key or a swipe asks. Returns false when there is nothing to
 * step to, so the caller can leave the input to the browser (the footer below Connect).
 */
export function stepSection(dir: -1 | 1, source: SectionSource): boolean {
  if (!driver) return false;
  const state = read();
  // Reduced motion (MOT-02): a change is a 0.2 s crossfade, so the lock must not end with it: at least
  // REDUCED_STEP_GAP_MS between two steps, whatever the gesture rules of the input let through.
  if (isReducedMotion() && performance.now() - lastStepAt < REDUCED_STEP_GAP_MS) return true;
  if (state.phase === 'moving') {
    // The same direction while moving: the step is already happening. The opposite one turns it around.
    if (state.direction === dir || state.direction === 0) return true;
    return goToSection(state.index, source);
  }
  const target = driver.stepTarget(dir);
  if (target === null) return false;
  lastStepAt = performance.now();
  return goToSection(target, source);
}

/** True when a step in this direction would be taken (or is already under way), so the input is the deck's. */
export function canStepSection(dir: -1 | 1) {
  if (!driver) return false;
  return read().phase === 'moving' || driver.stepTarget(dir) !== null;
}

/** The section in view (the mounted tree's answer), or -1 when no tree is mounted. */
export function currentSection() {
  return driver ? driver.current() : -1;
}

/** After a resize re-laid the deck out: put the view back on the rest pose of `index` (no URL change). */
export function resnapSection(index: number) {
  if (!driver || index < 0 || read().phase === 'moving') return;
  goToSection(index, 'layout');
}

/** Run `callback` once no section transition runs (at once when idle). Returns a cancel function. */
export function afterSectionSettles(callback: () => void) {
  if (read().phase === 'idle') {
    callback();
    return () => undefined;
  }
  const unsubscribe = jotaiStore.sub(sectionStateAtom, () => {
    if (read().phase !== 'idle') return;
    unsubscribe();
    callback();
  });
  return unsubscribe;
}
