import { STORAGE_KEY } from '@/constants/storage';

/**
 * Explicit dismissals of the subscribe prompt (X, Escape or a successful submit), stored with their time.
 *
 * Nothing opens the prompt by itself any more. It is kept so newsletter_view can report previously_dismissed
 * (DATA-11 folded the old subscribe_popup_storage event into it), and so a future
 * engagement prompt can honour the rule: after an explicit dismissal, nothing unrequested for 30 days.
 * The key used to hold `true` (no time); such values count as expired.
 */
export const SUBSCRIBE_PROMPT_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

export function recordSubscribeDismissal(now: number = Date.now()) {
  try {
    localStorage.setItem(STORAGE_KEY.SUBSCRIBE_POPUP_DISMISSED, String(now));
  } catch {
    // Storage blocked (private mode, disabled site data): the dismissal is simply not remembered.
  }
}

/** Whether a dismissal stored as `stored` (the raw localStorage value) still applies at `now`. */
export function isSubscribePromptSnoozed(stored: string | null, now: number = Date.now()) {
  const at = Number(stored);
  return Number.isFinite(at) && at > 0 && at <= now && now - at < SUBSCRIBE_PROMPT_SNOOZE_MS;
}

/** Whether this browser ever explicitly dismissed the prompt (any stored dismissal, expired or not). */
export function wasSubscribePromptDismissed() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY.SUBSCRIBE_POPUP_DISMISSED));
  } catch {
    return false;
  }
}
