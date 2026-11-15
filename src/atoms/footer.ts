import { atom } from 'jotai';
import { recordSubscribeDismissal } from '@/atoms/auto-subscribe';
import { NewsletterCloseMethod, NewsletterPlacement, trackNewsletter } from '@/utils/newsletter';

/** Whether the SUBSCRIBE popup is open. Open and close it through subscribePopupAtom, not directly. */
export const isSubscribeShowAtom = atom<boolean>(false);
export const isMobileFooterContactShowAtom = atom<boolean>(false);
/** Where the open popup was opened from. */
export const subscribeTypeAtom = atom<NewsletterPlacement | null>(null);

export type SubscribePopupAction =
  | { type: 'open'; placement: NewsletterPlacement }
  | { type: 'close'; method: NewsletterCloseMethod }
  | { type: 'toggle'; placement: NewsletterPlacement };

/**
 * The only way to open or close the SUBSCRIBE popup. The popup opens only when the visitor asks for it
 * (there is no automatic popup). Each real open sends one newsletter_view and each real close one
 * newsletter_close; acting on a popup that is already in that state does nothing, so stray taps and
 * scrolls are neither counted nor treated as a dismissal. Only an explicit close (X or Escape) records
 * the dismissal.
 */
export const subscribePopupAtom = atom(null, (get, set, action: SubscribePopupAction) => {
  const open = get(isSubscribeShowAtom);
  const wantOpen = action.type === 'toggle' ? !open : action.type === 'open';
  if (wantOpen === open) return;
  if (wantOpen) {
    const placement = (action as { placement: NewsletterPlacement }).placement;
    set(subscribeTypeAtom, placement);
    set(isSubscribeShowAtom, true);
    trackNewsletter('view', { placement });
    return;
  }
  const method: NewsletterCloseMethod = action.type === 'close' ? action.method : 'toggle';
  set(isSubscribeShowAtom, false);
  trackNewsletter('close', { placement: get(subscribeTypeAtom) ?? 'nav', method });
  if (method === 'x' || method === 'escape') recordSubscribeDismissal();
});
