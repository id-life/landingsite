/**
 * Compile-time test of the event contract (DATA-11): `npx tsc --noEmit -p .` fails if any line marked
 * @ts-expect-error stops being an error, i.e. if track() starts accepting an unknown event name, a missing required
 * parameter, an undeclared parameter or a wrongly typed one. Never imported; checked by tsc only.
 */
import { track } from '@/lib/analytics/track';

export function contractTypeTest() {
  // Valid calls compile.
  track('contact_intent', { method: 'mailto', placement: 'footer' });
  track('relation_submit');
  track('experience_error', { kind: 'webgl_unavailable' });

  // @ts-expect-error unknown event name
  track('portfolio_view', { item_id: 'x' });
  // @ts-expect-error missing required parameter (placement)
  track('contact_intent', { method: 'mailto' });
  // @ts-expect-error value outside the declared set
  track('contact_intent', { method: 'phone', placement: 'footer' });
  // @ts-expect-error undeclared parameter (no event_label anywhere)
  track('newsletter_submit', { placement: 'nav', event_label: 'x' });
  // @ts-expect-error a number parameter given as a string
  track('experience_ready', { load_ms: '1200', assets_ms: 1, layout: 'desktop', cache_state: 'cold', fail_open: 0 });
  // @ts-expect-error parameters are required for events that declare them
  track('outbound_click');
}
