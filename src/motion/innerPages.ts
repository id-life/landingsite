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
 *   the deck from a content page by Back. Only the section the address names is restored. Any other move of the
 *   deck (a step, the nav, the menu, a hash link) drops a restore that has not been applied yet.
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
let applying = 0;
const scheduled = new Set<string>();

/** The section the view rests on, or null while it moves (registered by the section controller). */
export function setRestingSectionReader(reader: () => string | null) {
  shown = reader;
}

/** Register one inner page of a section; returns the unregister function. */
export function registerInnerPage(section: string, key: string, read: Adapter['read'], apply: Adapter['apply'], order = 0) {
  const id = `${section}/${key}`;
  const adapter: Adapter = { section, key, read, apply, order };
  adapters.set(id, adapter);
  // A part that mounts while a restore for its section waits (the Insights rows once their data is in) takes it.
  if (pending?.section === section) kick();
  return () => {
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

/**
 * Something inside `section` changed. Written to the current history entry once the view rests on that section, and
 * not while a restore of it is still being applied (the half-restored state would overwrite the kept one).
 */
export function noteInnerPage(section: string) {
  if (typeof window === 'undefined' || scheduled.has(section)) return;
  scheduled.add(section);
  setTimeout(() => {
    scheduled.delete(section);
    if (pending?.section === section) return;
    if (shown() !== section) return;
    write(section);
  }, 120);
}

/**
 * The browser brought an entry back (Back, Forward, reload, a return by Back): the inner pages it kept for `section`
 * are applied once the view rests there. Nothing kept: nothing to do.
 */
export function beginInnerRestore(section: string | null) {
  pending = null;
  if (!section || typeof window === 'undefined') return;
  const values = innerOf(window.history.state)[section];
  if (values && Object.keys(values).length) pending = { section, values: { ...values } };
}

/** Any other move of the deck: a restore not applied yet is dropped. */
export function dropInnerRestore() {
  pending = null;
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

/** The view settled on `section` after a restore: apply what is kept, in order, retrying until each part is ready. */
export function applyInnerRestore(section: string) {
  if (pending?.section !== section) {
    noteInnerPage(section);
    return;
  }
  kick();
}

const RETRY_MS = 10000;

/** The next frame (a timer where there are no frames, as in unit tests of other modules). */
const nextFrame = (fn: () => void) => {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(fn);
  else setTimeout(fn, 16);
};

function kick() {
  if (typeof window === 'undefined' || !pending) return;
  const run = ++applying;
  const started = performance.now();
  const step = () => {
    if (run !== applying || !pending) return;
    const { section, values } = pending;
    if (shown() !== section) {
      // Not resting there yet (a transition still running): try again.
      if (performance.now() - started < RETRY_MS) nextFrame(step);
      return;
    }
    const parts = [...adapters.values()]
      .filter((a) => a.section === section && a.key in values)
      .sort((a, b) => a.order - b.order);
    // In order: a part waits for every part of a lower order (the Twin's view needs its model on stage first); parts of
    // one order are independent (one Insights row still loading does not hold the others back).
    let waitingOrder: number | null = null;
    for (const adapter of parts) {
      if (waitingOrder !== null && adapter.order > waitingOrder) break;
      if (adapter.apply(values[adapter.key])) delete values[adapter.key];
      else waitingOrder = adapter.order;
    }
    if (waitingOrder !== null) {
      if (performance.now() - started < RETRY_MS) nextFrame(step);
      else pending = null;
      return;
    }
    // Keys whose part never registered (another deck's part) wait for it until the time is up.
    if (Object.keys(values).length && performance.now() - started < RETRY_MS) {
      nextFrame(step);
      return;
    }
    pending = null;
    noteInnerPage(section);
  };
  nextFrame(step);
}
