/**
 * Every section view the experience makes (DATA-05), recorded by the navigation code right after it changes the URL
 * (nav click, arrows, menu, swipe, scroll, Back and Forward). No dependencies: the navigation hooks import it in
 * every build, analytics or not.
 *
 * GA4 counts section changes with its own history listener (enhanced measurement), but that listener only notices a
 * change when the next history call arrives (Next's router follows each pushState with a replaceState), so two quick
 * changes reach it as one and the first is never counted; it also does not exist until gtag/js has loaded. The
 * stream (./stream.ts) reads this log: views from before the tag loaded are sent as page_views, and a later view the
 * listener did not record within VIEW_CHECK_MS is sent once by hand. Views the listener did record are left to it.
 */
export type SectionView = { href: string; title: string; at: number };

type Listener = (view: SectionView) => void;

const pending: SectionView[] = [];
let listener: Listener | null = null;

export function noteSectionView(title: string) {
  if (typeof window === 'undefined') return;
  const view = { href: window.location.href, title, at: Date.now() };
  if (listener) listener(view);
  else if (pending.length < 50) pending.push(view);
}

/** Hand the views recorded so far to the stream, and every later one as it happens. */
export function onSectionView(fn: Listener) {
  listener = fn;
  pending.splice(0).forEach(fn);
}
