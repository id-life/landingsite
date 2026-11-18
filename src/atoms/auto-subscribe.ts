import { STORAGE_KEY } from '@/constants/storage';

/**
 * Closes of the subscribe popup (X, Escape, a press outside, a move, or a successful submit), stored with their time.
 *
 * The popup opens by itself on arrival until one is stored, as on the original (the owner's answer 5c), whose key
 * this is: any stored value, its `true` included, keeps it from opening by itself, with no expiry (his has none).
 * newsletter_view also reports it as previously_dismissed (DATA-11).
 */
export const SUBSCRIBE_PROMPT_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

export function recordSubscribeDismissal(now: number = Date.now()) {
  try {
    localStorage.setItem(STORAGE_KEY.SUBSCRIBE_POPUP_DISMISSED, String(now));
  } catch {
    // Storage blocked (private mode, disabled site data): the dismissal is simply not remembered.
  }
}

/** Not used for the popup's own opening (any stored value stops it; see above). */
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

/**
 * Whether the popup may open by itself: nothing stored under its key, storage readable, and no reduced-motion
 * preference (nothing opens by itself then; SUBSCRIBE still opens it).
 */
export function mayOpenSubscribeByItself(reducedMotion: boolean) {
  if (reducedMotion) return false;
  try {
    return !localStorage.getItem(STORAGE_KEY.SUBSCRIBE_POPUP_DISMISSED);
  } catch {
    return false;
  }
}
