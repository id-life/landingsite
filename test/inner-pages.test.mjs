// NAV-02 (the owner's answer 6a): Back, Forward and reload return to the same section and the same inner page. The
// inner pages are kept in the history entry's own state, written only for the section the view rests on, and put back
// only when the browser brings an entry back; a new address has nothing kept and shows the start of its section.
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  STATE_KEY,
  applyInnerRestore,
  beginInnerRestore,
  dropInnerRestore,
  innerOf,
  innerRestorePending,
  noteInnerPage,
  registerInnerPage,
  setRestingSectionReader,
  takeInnerPage,
  withInner,
} from '@/motion/innerPages';

describe('the state kept in a history entry', () => {
  test('a state with nothing kept (a new address, or one Next.js wrote) has no inner pages', () => {
    expect(innerOf(null)).toEqual({});
    expect(innerOf({})).toEqual({});
    expect(innerOf({ __NA: true })).toEqual({});
    expect(innerOf('x')).toEqual({});
  });

  test('writing a section keeps every other key of the state and every other section', () => {
    const before = { __NA: true, tree: [1, 2], [STATE_KEY]: { portfolio_page: { page: 2 } } };
    const after = withInner(before, 'twin_page', { model: 'M2', type: undefined });
    expect(after.__NA).toBe(true);
    expect(after.tree).toEqual([1, 2]);
    expect(innerOf(after)).toEqual({ portfolio_page: { page: 2 }, twin_page: { model: 'M2' } });
  });

  test('a section back at its start is removed (nothing kept means the start)', () => {
    const before = { [STATE_KEY]: { portfolio_page: { page: 2 }, twin_page: { model: 'M1' } } };
    expect(innerOf(withInner(before, 'portfolio_page', { page: undefined }))).toEqual({ twin_page: { model: 'M1' } });
  });
});

/** A window with a history whose state replaceState writes, and frames run by hand. */
function fakeWindow(state) {
  const frames = [];
  const history = {
    state,
    replaceState: vi.fn((next) => {
      history.state = next;
    }),
  };
  globalThis.window = { history, location: { href: 'http://site/portfolio', hash: '' } };
  globalThis.requestAnimationFrame = (fn) => frames.push(fn);
  return {
    history,
    runFrames(n = 1) {
      for (let i = 0; i < n; i++) frames.splice(0).forEach((fn) => fn());
    },
  };
}

describe('writing and restoring', () => {
  let resting;
  const offs = [];
  beforeEach(() => {
    vi.useFakeTimers();
    resting = 'portfolio_page';
    setRestingSectionReader(() => resting);
    dropInnerRestore();
  });
  afterEach(() => {
    offs.splice(0).forEach((off) => off());
    vi.useRealTimers();
    delete globalThis.window;
    delete globalThis.requestAnimationFrame;
  });

  test('a change is written for the section the view rests on, never for another one', () => {
    const { history } = fakeWindow({ __NA: true });
    let page = 2;
    offs.push(
      registerInnerPage(
        'portfolio_page',
        'page',
        () => page,
        () => true,
      ),
    );
    noteInnerPage('portfolio_page');
    vi.advanceTimersByTime(200);
    expect(innerOf(history.state)).toEqual({ portfolio_page: { page: 2 } });
    expect(history.state.__NA).toBe(true);

    // The view has left Portfolio (a section's own reset as it is left): not written, the entry keeps page 2.
    resting = 'twin_page';
    page = 0;
    noteInnerPage('portfolio_page');
    vi.advanceTimersByTime(200);
    expect(innerOf(history.state)).toEqual({ portfolio_page: { page: 2 } });
  });

  test('nothing is written while the view moves', () => {
    const { history } = fakeWindow(null);
    resting = null;
    offs.push(
      registerInnerPage(
        'portfolio_page',
        'page',
        () => 1,
        () => true,
      ),
    );
    noteInnerPage('portfolio_page');
    vi.advanceTimersByTime(200);
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  test('an entry brought back restores only the section its address names, once', () => {
    fakeWindow({ [STATE_KEY]: { portfolio_page: { page: 2 }, twin_page: { model: 'M1' } } });
    beginInnerRestore('portfolio_page');
    expect(innerRestorePending('portfolio_page')).toBe(true);
    expect(takeInnerPage('twin_page', 'model')).toBeUndefined();
    expect(takeInnerPage('portfolio_page', 'page')).toBe(2);
    expect(takeInnerPage('portfolio_page', 'page')).toBeUndefined();
  });

  test('a new address (no kept state) restores nothing', () => {
    fakeWindow(null);
    beginInnerRestore('portfolio_page');
    expect(innerRestorePending('portfolio_page')).toBe(false);
  });

  test('another move of the deck drops a restore not yet applied', () => {
    fakeWindow({ [STATE_KEY]: { portfolio_page: { page: 2 } } });
    beginInnerRestore('portfolio_page');
    dropInnerRestore();
    expect(takeInnerPage('portfolio_page', 'page')).toBeUndefined();
  });

  test('parts are applied in order, a later one waiting until the one before it is ready', () => {
    const { runFrames } = fakeWindow({ [STATE_KEY]: { twin_page: { model: 'M2', type: 'anatomy', view: 3 } } });
    resting = 'twin_page';
    const done = [];
    let modelOnStage = false;
    offs.push(
      registerInnerPage(
        'twin_page',
        'view',
        () => undefined,
        (v) => (done.push(`view ${v}`), true),
        2,
      ),
      registerInnerPage(
        'twin_page',
        'model',
        () => undefined,
        (v) => (done.push(`model ${v}`), true),
        0,
      ),
      registerInnerPage(
        'twin_page',
        'type',
        () => undefined,
        (v) => (modelOnStage ? (done.push(`type ${v}`), true) : false),
        1,
      ),
    );
    beginInnerRestore('twin_page');
    applyInnerRestore('twin_page');
    runFrames(3);
    expect(done).toEqual(['model M2']);
    modelOnStage = true;
    runFrames(1);
    expect(done).toEqual(['model M2', 'type anatomy', 'view 3']);
    expect(innerRestorePending('twin_page')).toBe(false);
  });

  test('parts of one order do not wait for each other (one Insights row still loading)', () => {
    const { runFrames } = fakeWindow({ [STATE_KEY]: { insights_page: { news: 2, podcast: 1 } } });
    resting = 'insights_page';
    const done = [];
    offs.push(
      registerInnerPage(
        'insights_page',
        'news',
        () => undefined,
        () => false,
      ),
      registerInnerPage(
        'insights_page',
        'podcast',
        () => undefined,
        (v) => (done.push(`podcast ${v}`), true),
      ),
    );
    beginInnerRestore('insights_page');
    applyInnerRestore('insights_page');
    runFrames(1);
    expect(done).toEqual(['podcast 1']);
    expect(innerRestorePending('insights_page')).toBe(true);
  });
});
