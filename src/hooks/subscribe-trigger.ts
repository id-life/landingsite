/**
 * Put this attribute on every control that opens the SUBSCRIBE popup, so pressing it is not an "outside" press.
 * Its own module: the buttons on content pages import it without pulling in the popup's Floating UI code
 * (src/hooks/useSubscribeDialog.ts, which re-exports it).
 */
export const SUBSCRIBE_TRIGGER = { 'data-subscribe-trigger': '' } as const;
