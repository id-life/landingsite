/**
 * Whether a focus change is the direct result of a Tab key press in this page: the only focus change the experience's
 * deck may follow (NAV). Not the window or the tab coming back (the browser gives the focused element a focus event
 * again), not a script's focus(), not a dialog handing focus back, not a press, not the wheel.
 *
 * The press is armed at the keydown of Tab or Shift+Tab alone (Tab with Ctrl, Cmd or Alt is a browser or system
 * shortcut) and lives only as long as the key's own default action:
 * - it is consumed by the first focus change that follows;
 * - a keydown whose default was prevented (a focus trap) moved nothing, so it counts for nothing; it is read when the
 *   focus change arrives, after every listener has run, since the rule listens in the capture phase;
 * - it is dropped at that key's keyup, when the window loses focus and at a pointer press;
 * - and a focus change counts only within TAB_FOCUS_WINDOW_MS of the keydown. In Chrome (measured) and Safari
 *   (WebKit's EventHandler::defaultTabEventHandler) the focus moves inside the keydown's own task, before any timer;
 *   Firefox moves it on the keypress that follows an unprevented keydown (Gecko's EventStateManager::
 *   PostHandleKeyboardEvent), which can arrive as a separate message, so the bound is a short time rather than "the
 *   same task".
 * A held key keeps working: every repeat is a keydown and arms it again.
 */
export const TAB_FOCUS_WINDOW_MS = 100;

/** The parts of a keydown the rule reads. `defaultPrevented` is read live, when the focus change arrives. */
export type TabKeyDown = {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  readonly defaultPrevented: boolean;
};

export const isPlainTab = (event: Pick<TabKeyDown, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>) =>
  event.key === 'Tab' && !event.ctrlKey && !event.metaKey && !event.altKey;

export function createTabIntent() {
  let armed: { event: TabKeyDown; at: number } | null = null;
  return {
    /** Any keydown: a plain Tab arms, every other key disarms. `at` is the event's timeStamp. */
    keydown(event: TabKeyDown, at: number) {
      armed = isPlainTab(event) ? { event, at } : null;
    },
    /** A focus change at `at`: true when it is that Tab press's own. Consumes the press either way. */
    focus(at: number) {
      const press = armed;
      armed = null;
      return press !== null && !press.event.defaultPrevented && at - press.at >= 0 && at - press.at <= TAB_FOCUS_WINDOW_MS;
    },
    /** The keyup of the key, the window losing focus, a pointer press. */
    clear() {
      armed = null;
    },
  };
}
