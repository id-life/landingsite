// NAV: the experience's deck follows a focus change only when it is the direct result of a Tab key press in this
// page. The checker's case (2026-11-17): Tab, Enter on "Skip to content", Tab, a wheel notch to Presence, the window
// left and come back: the browser re-fires focus on the focused link and the deck went back to Spectrum by itself.
import { describe, expect, test } from 'vitest';
import { createTabIntent, isPlainTab, TAB_FOCUS_WINDOW_MS } from '@/motion/tabIntent';

const key = (k, mods = {}) => {
  const event = { key: k, ctrlKey: false, metaKey: false, altKey: false, defaultPrevented: false, ...mods };
  return event;
};

describe('tabIntent', () => {
  test("a Tab press's own focus change moves the deck (Shift+Tab too)", () => {
    const rule = createTabIntent();
    rule.keydown(key('Tab'), 1000);
    expect(rule.focus(1000.4)).toBe(true);
    rule.keydown(key('Tab'), 2000); // Shift+Tab has key "Tab" with shiftKey, which the rule does not read
    expect(rule.focus(2000.1)).toBe(true);
  });

  test('the press is consumed by the first focus change: a second one (a script, the window coming back) does not move', () => {
    const rule = createTabIntent();
    rule.keydown(key('Tab'), 1000);
    expect(rule.focus(1000.2)).toBe(true);
    expect(rule.focus(1000.3)).toBe(false);
    expect(rule.focus(5000)).toBe(false);
  });

  test("the checker's case: Tab, wheel, the window left and back; the returning focus does not move", () => {
    const rule = createTabIntent();
    rule.keydown(key('Tab'), 1000);
    expect(rule.focus(1000.2)).toBe(true); // the ring on "Bio/Acc Manifesto"
    rule.clear(); // the window loses focus (blur)
    expect(rule.focus(9000)).toBe(false); // the window comes back: focus re-fired on the link
  });

  test('a Tab whose focus never came (it left the page) does not arm a later focus change', () => {
    const rule = createTabIntent();
    rule.keydown(key('Tab'), 1000);
    expect(rule.focus(1000 + TAB_FOCUS_WINDOW_MS + 1)).toBe(false);
    rule.keydown(key('Tab'), 2000);
    rule.clear(); // its keyup
    expect(rule.focus(2000.5)).toBe(false);
  });

  test('a script focus() after a Tab press, 0, 100 or 2000 ms later, does not move once the press has been used', () => {
    for (const later of [0, 100, 2000]) {
      const rule = createTabIntent();
      rule.keydown(key('Tab'), 1000);
      expect(rule.focus(1000.2)).toBe(true);
      expect(rule.focus(1000.2 + later)).toBe(false);
    }
  });

  test('Tab with Ctrl, Cmd or Alt is a browser or system shortcut and arms nothing', () => {
    for (const mod of ['ctrlKey', 'metaKey', 'altKey']) {
      const rule = createTabIntent();
      rule.keydown(key('Tab', { [mod]: true }), 1000);
      expect(rule.focus(1000.1)).toBe(false);
      expect(isPlainTab(key('Tab', { [mod]: true }))).toBe(false);
    }
  });

  test('a Tab whose keydown was prevented (a focus trap, after the capture phase) moves nothing', () => {
    const rule = createTabIntent();
    const event = key('Tab');
    rule.keydown(event, 1000);
    event.defaultPrevented = true; // set by a later listener, read when the focus change arrives
    expect(rule.focus(1000.1)).toBe(false);
  });

  test('any other key disarms; a pointer press disarms', () => {
    const rule = createTabIntent();
    rule.keydown(key('Tab'), 1000);
    rule.keydown(key('Enter'), 1000.05);
    expect(rule.focus(1000.1)).toBe(false);
    rule.keydown(key('Tab'), 2000);
    rule.clear(); // pointerdown
    expect(rule.focus(2000.1)).toBe(false);
  });

  test('a held key keeps working: every repeat arms again', () => {
    const rule = createTabIntent();
    for (let i = 0; i < 5; i += 1) {
      rule.keydown(key('Tab'), 1000 + i * 33);
      expect(rule.focus(1000 + i * 33 + 0.2)).toBe(true);
    }
  });

  test('without any Tab, no focus change moves the deck', () => {
    const rule = createTabIntent();
    expect(rule.focus(10)).toBe(false);
  });
});
