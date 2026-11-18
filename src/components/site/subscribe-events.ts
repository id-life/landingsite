/**
 * The SUBSCRIBE popup's two DOM events (NAV-04, PERF-10). Header and menu buttons ask for the popup with
 * `idl:subscribe`; whoever owns the popup (the experience, or SubscribePopup on content pages) answers every change of
 * its open state with `idl:subscribe-state`. A plain event, so a button on a content page needs neither jotai nor
 * the popup's code until the visitor asks for it.
 */
export type SubscribeRequest =
  | { type: 'toggle' | 'open'; placement: 'nav' | 'content' | 'auto' }
  | { type: 'close'; method: 'scroll' | 'x' };

export const SUBSCRIBE_REQUEST_EVENT = 'idl:subscribe';
export const SUBSCRIBE_STATE_EVENT = 'idl:subscribe-state';

export function requestSubscribe(request: SubscribeRequest) {
  window.dispatchEvent(new CustomEvent<SubscribeRequest>(SUBSCRIBE_REQUEST_EVENT, { detail: request }));
}

export function announceSubscribeState(open: boolean) {
  window.dispatchEvent(new CustomEvent<boolean>(SUBSCRIBE_STATE_EVENT, { detail: open }));
}
