// MOT-03: the experience pauses a minute after the last input, and anything that asks the page to show something
// new wakes it first: the inputs, the browser's Back and Forward (popstate), a page restored from the back/forward
// cache (pageshow), a resize or rotation, focus moved without a key (focusin), and every section change the
// controller is asked for, whatever its source. Nothing the experience does by itself (its scroll events) wakes it.
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

function fakeBrowser() {
  const win = new EventTarget();
  Object.assign(win, {
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    location: { pathname: '/', search: '', hash: '', href: 'https://example.test/' },
    history: { state: null, pushState: () => {}, replaceState: () => {} },
  });
  globalThis.window = win;
  const doc = new EventTarget();
  Object.assign(doc, { visibilityState: 'visible', title: '', documentElement: { dataset: {} } });
  globalThis.document = doc;
  return win;
}

let rt;
let win;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.resetModules();
  win = fakeBrowser();
  rt = await import('@/motion/runtime');
});

afterEach(() => {
  vi.useRealTimers();
  delete globalThis.window;
  delete globalThis.document;
});

const MINUTE = 60_000;

describe('motion runtime idle pause', () => {
  test('pauses a minute after install, and holds animation frames while paused', () => {
    const native = window.requestAnimationFrame;
    rt.installMotionRuntime();
    vi.advanceTimersByTime(MINUTE - 1);
    expect(rt.isMotionPaused()).toBe(false);
    vi.advanceTimersByTime(1);
    expect(rt.isMotionPaused()).toBe(true);
    expect(window.requestAnimationFrame).not.toBe(native);
  });

  test.each(['pointerdown', 'keydown', 'popstate', 'pageshow', 'resize', 'orientationchange', 'focusin'])(
    '%s wakes a paused page and re-arms the minute',
    (type) => {
      rt.installMotionRuntime();
      vi.advanceTimersByTime(MINUTE);
      expect(rt.isMotionPaused()).toBe(true);
      win.dispatchEvent(new Event(type));
      expect(rt.isMotionPaused()).toBe(false);
      vi.advanceTimersByTime(MINUTE - 1);
      expect(rt.isMotionPaused()).toBe(false);
      vi.advanceTimersByTime(1);
      expect(rt.isMotionPaused()).toBe(true);
    },
  );

  test("an element's own resize (a video's picture size) does not wake it; the window's does, and focusin always", () => {
    const video = { tagName: 'VIDEO' };
    expect(rt.showEventWakes({ type: 'resize', target: video }, win)).toBe(false);
    expect(rt.showEventWakes({ type: 'resize', target: win }, win)).toBe(true);
    expect(rt.showEventWakes({ type: 'popstate', target: win }, win)).toBe(true);
    expect(rt.showEventWakes({ type: 'focusin', target: video }, win)).toBe(true);
  });

  test("the experience's own scroll events do not wake it", () => {
    rt.installMotionRuntime();
    vi.advanceTimersByTime(MINUTE);
    win.dispatchEvent(new Event('scroll'));
    expect(rt.isMotionPaused()).toBe(true);
  });

  test('wakeMotion wakes and re-arms; before the runtime is installed it does nothing', () => {
    rt.wakeMotion();
    expect(rt.isMotionPaused()).toBe(false);
    vi.advanceTimersByTime(MINUTE * 2);
    expect(rt.isMotionPaused()).toBe(false); // nothing armed without an install
    rt.installMotionRuntime();
    vi.advanceTimersByTime(MINUTE);
    expect(rt.isMotionPaused()).toBe(true);
    rt.wakeMotion();
    expect(rt.isMotionPaused()).toBe(false);
    vi.advanceTimersByTime(MINUTE);
    expect(rt.isMotionPaused()).toBe(true);
  });

  test('a section change asked of the controller, from any source, wakes a paused page', async () => {
    const ctl = await import('@/motion/sectionController');
    let at = 0;
    ctl.registerSectionDriver({ tree: 'desktop', current: () => at, stepTarget: () => null, move: (to) => ((at = to), null) });
    rt.installMotionRuntime();
    for (const source of ['history', 'link', 'deeplink', 'nav']) {
      vi.advanceTimersByTime(MINUTE);
      expect(rt.isMotionPaused()).toBe(true);
      ctl.goToSection(source === 'history' ? 'spectrum_page' : 'insights_page', source);
      expect(rt.isMotionPaused()).toBe(false);
    }
  });
});
