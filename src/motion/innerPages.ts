/**
 * Where the visitor was inside a section: its inner page (NAV-02, the owner's answer 6a of 2026-11-18: "Back, Forward
 * and reload return to the same section and inner page -> YES"). His site returns to the start of the section.
 *
 * What counts as an inner page is registered by the part that owns it (registerInnerPage): the phone's pages of
 * Portfolio and Spectrum, the page of each Insights row, Spectrum's opened paper groups and its sponsors' page, the map
 * card the visitor opened on Presence, and the Digital Twin's model, skin or anatomy, and anatomy view.
 *
 * The rule:
 * - Stored in the history entry itself (history.state, under STATE_KEY), never in storage: it lives as long as that
 *   entry of this tab, and an address opened anew (a link, a typed address, the menu) is a new entry with nothing in
 *   it, so it shows the start of its section, as before.
 * - Written for the section the view rests on, whenever one of its inner pages changes and when the view settles on a
 *   section; a section's own reset when the view leaves it (the Twin puts its demo back) is not written, so the entry
 *   keeps what the visitor last saw there.
 * - Restored only when the browser brings an entry back: Back and Forward inside the deck, a reload, and a return to
 *   the deck from a content page by Back. Only the section the address names is restored, once the view rests there,
 *   each part when what it depends on is in place: a part whose apply() answers "not ready" is tried again when the
 *   view settles, when a part registers, and when a part's subscribe() reports a change; never on a timer. Any other
 *   move of the deck (a step, the nav, the menu, a hash link) and any input of the visitor's own (a press, a key, a
 *   wheel, a touch) drop a restore that has not been applied yet: what the visitor does wins.
 * - The address rules are unchanged: one address per section, push for explicit navigation, replace for scrolling.
 */

/** A JSON value small enough for history.state. */
export type InnerValue = string | number | boolean | null | InnerValue[] | { [key: string]: InnerValue };
/** Section id -> inner key -> value. */
export type InnerSnapshot = Record<string, Record<string, InnerValue>>;

export const STATE_KEY = '__idlInner';

type Adapter = {
  section: string;
  key: string;
  /** The value now, or undefined when there is nothing to keep (the start of the section). */
  read: () => InnerValue | undefined;
  /** Put the value back; false when the part is not ready yet (it is tried again on the next frames). */
  apply: (value: InnerValue) => boolean;
  /** Order of application inside a section (the Twin's model before its view). */
  order: number;
  /**
   * Calls back whenever what `apply` waits for may have changed (the Twin's stage state, a row's slides, the phone map's
   * entrance): a waiting restore is tried again then, and only then. Returns the unsubscribe function.
   */
  subscribe?: (onChange: () => void) => () => void;
};

/** The inner pages kept in a history state object (any object Next.js or the deck put there), or {}. */
export function innerOf(state: unknown): InnerSnapshot {
  if (!state || typeof state !== 'object') return {};
  const value = (state as Record<string, unknown>)[STATE_KEY];
  return value && typeof value === 'object' ? (value as InnerSnapshot) : {};
}

/**
 * A copy of `state` with `section`'s inner pages replaced by `values` (keys whose value is undefined are dropped: the
 * start of the section), every other key of the state and every other section kept.
 */
export function withInner(state: unknown, section: string, values: Record<string, InnerValue | undefined>) {
  const base = state && typeof state === 'object' ? (state as Record<string, unknown>) : {};
  const kept: Record<string, InnerValue> = {};
  for (const [key, value] of Object.entries(values)) if (value !== undefined) kept[key] = value;
  const inner = { ...innerOf(base) };
  if (Object.keys(kept).length) inner[section] = kept;
  else delete inner[section];
  return { ...base, [STATE_KEY]: inner };
}

/** Two inner values equal as JSON. */
export function sameInner(a: InnerValue | undefined, b: InnerValue | undefined) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

const adapters = new Map<string, Adapter>();
let shown: () => string | null = () => null;
let pending: { section: string; values: Record<string, InnerValue> } | null = null;
let queued = false;
const scheduled = new Set<string>();

/** The section the view rests on, or null while it moves (registered by the section controller). */
export function setRestingSectionReader(reader: () => string | null) {
  shown = reader;
}

/** Register one inner page of a section; returns the unregister function. */
export function registerInnerPage(
  section: string,
  key: string,
  read: Adapter['read'],
  apply: Adapter['apply'],
  order = 0,
  subscribe?: Adapter['subscribe'],
) {
  const id = `${section}/${key}`;
  const adapter: Adapter = { section, key, read, apply, order, subscribe };
  adapters.set(id, adapter);
  const unsubscribe = subscribe?.(() => {
    if (pending?.section === section) schedule();
  });
  // A part that mounts while a restore for its section waits (the Insights rows once their data is in) takes it.
  if (pending?.section === section) schedule();
  return () => {
    unsubscribe?.();
    if (adapters.get(id) === adapter) adapters.delete(id);
  };
}

function write(section: string) {
  if (typeof window === 'undefined') return;
  const values: Record<string, InnerValue | undefined> = {};
  for (const adapter of adapters.values()) if (adapter.section === section) values[adapter.key] = adapter.read();
  const before = innerOf(window.history.state)[section] ?? {};
  const after = withInner(window.history.state, section, values);
  if (sameInner(before, innerOf(after)[section] ?? {})) return;
  // The same address: only this entry's state changes (no new entry, no section view).
  window.history.replaceState(after, '', window.location.href);
}

const changeListeners = new Set<(section: string) => void>();
/** Called whenever an inner page changes (before it is written to history); for parts that lay out around it. */
export function onInnerPageChange(listener: (section: string) => void) {
  changeListeners.add(listener);
  return () => {
    changeListeners.delete(listener);
  };
}

/**
 * Something inside `section` changed. Written to the current history entry once the view rests on that section, and
 * not while a restore of it is still being applied (the half-restored state would overwrite the kept one).
 */
export function noteInnerPage(section: string) {
  if (typeof window === 'undefined') return;
  for (const listener of changeListeners) listener(section);
  if (scheduled.has(section)) return;
  scheduled.add(section);
  setTimeout(() => {
    scheduled.delete(section);
    if (pending?.section === section) return;
    if (shown() !== section) return;
    write(section);
  }, 120);
}

const VISITOR_INPUT = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
const onVisitorInput = () => dropInnerRestore();
function listenForInput(on: boolean) {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
  for (const type of VISITOR_INPUT) {
    if (on) window.addEventListener(type, onVisitorInput, { capture: true, passive: true });
    else window.removeEventListener(type, onVisitorInput, { capture: true });
  }
}

function setPending(next: typeof pending) {
  if (!pending && next) listenForInput(true);
  if (pending && !next) listenForInput(false);
  pending = next;
}

/**
 * The browser brought an entry back (Back, Forward, reload, a return by Back): the inner pages it kept for `section`
 * are applied once the view rests there. Nothing kept: nothing to do.
 */
export function beginInnerRestore(section: string | null) {
  setPending(null);
  if (!section || typeof window === 'undefined') return;
  const values = innerOf(window.history.state)[section];
  if (values && Object.keys(values).length) setPending({ section, values: { ...values } });
}

/** Any other move of the deck, or an input of the visitor's own: a restore not applied yet is dropped. */
export function dropInnerRestore() {
  setPending(null);
}

/**
 * For a part that resets its inner page when its section is entered (the phone's Portfolio and Spectrum pages): the
 * kept value instead of the start, taken once, so the entrance shows the right page with no flash of the first.
 */
export function takeInnerPage(section: string, key: string): InnerValue | undefined {
  if (!pending || pending.section !== section || !(key in pending.values)) return undefined;
  const value = pending.values[key];
  delete pending.values[key];
  return value;
}

/** True while a restore for `section` waits to be applied. */
export function innerRestorePending(section: string) {
  return pending?.section === section;
}

/** The view settled on `section`: apply what the entry kept, or keep what the view now shows. */
export function applyInnerRestore(section: string) {
  if (pending?.section !== section) {
    noteInnerPage(section);
    return;
  }
  schedule();
}

/** One attempt at the end of the current task (several triggers in one task make one attempt). */
function schedule() {
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    queued = false;
    attempt();
  });
}

/** Apply every kept part that is ready, in order; what is not ready waits for its next trigger. */
export function attempt() {
  if (!pending) return;
  const { section, values } = pending;
  // Not resting there yet (a transition still running): the settle tries again.
  if (shown() !== section) return;
  const parts = [...adapters.values()]
    .filter((a) => a.section === section && a.key in values)
    .sort((a, b) => a.order - b.order);
  // In order: a part waits for every part of a lower order (the Twin's view needs anatomy on stage first); parts of one
  // order are independent (one Insights row still loading does not hold the others back).
  let waitingOrder: number | null = null;
  for (const adapter of parts) {
    if (waitingOrder !== null && adapter.order > waitingOrder) break;
    if (adapter.apply(values[adapter.key])) delete values[adapter.key];
    else waitingOrder = adapter.order;
  }
  // Something still waits (a part not ready, or not mounted yet): its trigger tries again.
  if (Object.keys(values).length) return;
  setPending(null);
  noteInnerPage(section);
}
