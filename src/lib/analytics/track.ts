import { NAV_LIST } from '@/components/nav/nav';
import { ANALYTICS_ENABLED, INTERNAL_FLAG_KEY, VERCEL_EVENTS_ENABLED } from './config';
// Types only: the catalog itself (with its documentation strings) stays out of the browser bundle.
import type { EventName, EventParams, Layout } from './events';

/** The key events (mirrored to Vercel custom events when enabled); test/analytics-events.test.mjs checks the list. */
export const KEY_EVENT_NAMES: readonly EventName[] = ['newsletter_subscribe', 'contact_intent', 'portfolio_outbound_click'];

/**
 * The one way to send an analytics event (DATA-11). Names and parameters are checked against the catalog in
 * ./events.ts at compile time. track():
 *  - adds the shared context (layout, section_id, page_load_id, traffic_type);
 *  - de-duplicates `once` keys for the life of the document (a remount of the experience cannot re-send them);
 *  - queues (at most 100 events) while the consent answer and the deferred tag are pending, sends once the tag is
 *    configured, and drops everything once analytics is refused or unavailable.
 */
type TrackOptions = {
  once?: string;
  /** The path the event belongs to when it is not the current one (vitals belong to the landing URL). */
  at?: string;
};
type TrackArgs<K extends EventName> =
  {} extends EventParams<K> ? [params?: EventParams<K>, opts?: TrackOptions] : [params: EventParams<K>, opts?: TrackOptions];

type Payload = Record<string, string | number>;

let mode: 'pending' | 'on' | 'off' = 'pending';
const queue: Array<[EventName, Payload]> = [];
const onceKeys = new Set<string>();
let layout: Layout | undefined;

const randomId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
};
const PAGE_LOAD_ID = typeof window === 'undefined' ? '' : randomId();

export const setTrackLayout = (value: Layout) => void (layout = value);
export const getTrackLayout = () => layout;

export function isInternalTraffic() {
  try {
    return localStorage.getItem(INTERNAL_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

/** The experience section a path points at (undefined on content pages). */
export function sectionIdFor(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return NAV_LIST.find((item) => item.href === path)?.id;
}

function clean(params: Record<string, unknown>): Payload {
  const out: Payload = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'number') {
      if (Number.isFinite(v)) out[k] = v;
    } else if (typeof v === 'string') {
      if (v !== '') out[k] = v.slice(0, 100);
    }
  }
  return out;
}

function send(name: EventName, payload: Payload) {
  window.gtag?.('event', name, payload);
  if (VERCEL_EVENTS_ENABLED && KEY_EVENT_NAMES.includes(name)) {
    (window as Window & { va?: (...a: unknown[]) => void }).va?.('event', { name, data: payload });
  }
}

export function track<K extends EventName>(name: K, ...args: TrackArgs<K>) {
  if (!ANALYTICS_ENABLED || typeof window === 'undefined') return;
  const [params, opts] = args;
  if (opts?.once) {
    if (onceKeys.has(opts.once)) return;
    onceKeys.add(opts.once);
  }
  if (mode === 'off') return;
  const payload = clean({
    layout,
    section_id: sectionIdFor(opts?.at ?? window.location.pathname),
    page_load_id: PAGE_LOAD_ID,
    ...(isInternalTraffic() ? { traffic_type: 'internal' } : {}),
    ...(params as Record<string, unknown> | undefined),
  });
  if (mode === 'pending') {
    if (queue.length < 100) queue.push([name, payload]);
    return;
  }
  send(name, payload);
}

/** Called by the boot module: 'on' once the tag is configured (flushes the queue), 'off' when refused. */
export function setTrackMode(next: 'on' | 'off') {
  mode = next;
  const pending = queue.splice(0, queue.length);
  if (next === 'on') pending.forEach(([name, payload]) => send(name, payload));
}

/** Host of a URL for link_domain ('' when it cannot be parsed). */
export function linkDomain(url: string) {
  try {
    return new URL(url, window.location.href).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** A stable id from a title or name: lower-case ASCII slug (CJK kept), at most 60 characters. */
export function slugId(value: string | number | undefined | null) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9㐀-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** The video id of a YouTube watch, embed or youtu.be URL (or the slug of the URL when it is not YouTube). */
export function youtubeId(url: string) {
  try {
    const u = new URL(url, 'https://www.youtube.com');
    if (u.hostname.endsWith('youtu.be')) return u.pathname.slice(1, 32);
    const v = u.searchParams.get('v');
    if (v) return v.slice(0, 32);
    const embed = u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/);
    if (embed) return embed[1];
  } catch {
    // Not a URL: fall through to the slug.
  }
  return slugId(url);
}
