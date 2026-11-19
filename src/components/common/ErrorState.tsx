/**
 * The retry control of every error state, as the owner's site draws it on its route error page: one rounded,
 * outlined button with his word "Reload" and nothing else (his rule: no text he has not shown).
 */
export const RELOAD_BUTTON_CLASS = 'rounded-full border border-current px-6 py-2 font-text text-sm font-semibold uppercase';

/** His "Reload" button; what it does (retry a request, reload the page) stays the caller's. */
export function ReloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={RELOAD_BUTTON_CLASS} onClick={onClick}>
      Reload
    </button>
  );
}
