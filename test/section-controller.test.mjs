// MOT-01: the one section controller. Every section change records exactly one section view (DATA-05) and leaves
// the URL naming the section reached; transitions reverse on an opposite step and retarget on anything else. Runs
// the controller against a fake tree driver and a fake window (node environment), so it judges the controller's
// rules, not one tree's animation.
import { beforeEach, describe, expect, test, vi } from 'vitest';

function fakeWindow(path = '/') {
  const history = [];
  const location = { pathname: path, search: '?utm_source=x', hash: '', href: '' };
  const sync = () => (location.href = `https://example.test${location.pathname}${location.search}${location.hash}`);
  sync();
  const apply = (url) => {
    const u = new URL(url, 'https://example.test');
    location.pathname = u.pathname;
    location.search = u.search;
    location.hash = u.hash;
    sync();
  };
  globalThis.window = {
    location,
    history: {
      state: null,
      pushState: (_s, _t, url) => (history.push(['push', url]), apply(url)),
      replaceState: (_s, _t, url) => (history.push(['replace', url]), apply(url)),
    },
  };
  globalThis.document = { title: '', documentElement: { dataset: {} } };
  return { history, location };
}

/** A transition that completes or reverses when the test says so (like a paused GSAP tween). */
function fakeTransition() {
  const callbacks = {};
  const t = {
    played: false,
    reversed: false,
    killed: false,
    play: () => (t.played = true),
    reverse: () => (t.reversed = true),
    kill: () => (t.killed = true),
    eventCallback: (type, cb) => (callbacks[type] = cb),
    complete: () => callbacks.onComplete?.(),
    reverseComplete: () => callbacks.onReverseComplete?.(),
  };
  return t;
}

let ctl;
let views;
let driver;
let transitions;
let hist;

beforeEach(async () => {
  vi.resetModules();
  hist = fakeWindow('/').history;
  ctl = await import('@/motion/sectionController');
  const sv = await import('@/lib/analytics/section-view');
  views = [];
  sv.onSectionView((v) => views.push(v.title));
  transitions = [];
  let at = 0;
  driver = {
    tree: 'desktop',
    current: () => at,
    stepTarget: (dir) => (at + dir >= 0 && at + dir < 7 ? at + dir : null),
    move: (to, { source }) => {
      if (source === 'deeplink') {
        at = to;
        return null;
      }
      const transition = fakeTransition();
      transitions.push(transition);
      transition.to = to;
      return { transition, reversible: true };
    },
    settle: (index) => (at = index),
  };
  ctl.registerSectionDriver(driver);
});

describe('section controller', () => {
  test('a wheel step replaces the URL once it lands, with one section view', () => {
    expect(ctl.stepSection(1, 'wheel')).toBe(true);
    expect(ctl.isSectionMoving()).toBe(true);
    expect(window.location.pathname).toBe('/'); // not before the transition ends
    transitions[0].complete();
    expect(ctl.isSectionMoving()).toBe(false);
    expect(window.location.pathname).toBe('/portfolio');
    expect(window.location.search).toBe('?utm_source=x'); // campaign parameters survive
    expect(views).toEqual([document.title]);
    expect(hist.map(([kind]) => kind)).toEqual(['replace']);
    expect(document.title).toMatch(/portfolio/i);
  });

  test('a nav click pushes a history entry; Back records one view and changes no URL', () => {
    ctl.goToSection('insights_page', 'nav');
    transitions[0].complete();
    window.location.pathname = '/'; // the browser's Back
    ctl.goToSection('vision_page', 'history');
    transitions[1].complete();
    expect(views).toHaveLength(2);
    expect(hist.map(([kind]) => kind)).toEqual(['push']);
    expect(window.location.pathname).toBe('/');
  });

  test('an opposite step reverses the running transition and nothing is recorded', () => {
    ctl.stepSection(1, 'wheel');
    ctl.stepSection(-1, 'wheel');
    expect(transitions).toHaveLength(1);
    expect(transitions[0].reversed).toBe(true);
    transitions[0].reverseComplete();
    expect(ctl.getSectionState()).toMatchObject({ index: 0, phase: 'idle' });
    expect(window.location.pathname).toBe('/');
    expect(views).toHaveLength(0);
  });

  test('the same direction during a transition is absorbed (one gesture, one step)', () => {
    ctl.stepSection(1, 'wheel');
    ctl.stepSection(1, 'wheel');
    ctl.stepSection(1, 'key');
    expect(transitions).toHaveLength(1);
  });

  test('a nav click during a transition retargets it; the URL names the section reached', () => {
    ctl.stepSection(1, 'wheel');
    ctl.goToSection('connect_page', 'nav');
    expect(transitions[0].killed).toBe(true);
    transitions[0].complete(); // a late callback of the killed tween must not land anywhere
    expect(window.location.pathname).toBe('/');
    transitions[1].complete();
    expect(window.location.pathname).toBe('/connect');
    expect(views).toHaveLength(1);
  });

  test('a deep link moves without touching the URL or recording a view (the landing page_view is the stream’s)', () => {
    window.location.pathname = '/twin';
    ctl.goToSection('twin_page', 'deeplink');
    expect(ctl.getSectionState()).toMatchObject({ index: 5, phase: 'idle' });
    expect(views).toHaveLength(0);
  });

  test('nothing to step to leaves the input to the browser', () => {
    ctl.goToSection('connect_page', 'deeplink');
    expect(ctl.canStepSection(1)).toBe(false);
    expect(ctl.stepSection(1, 'wheel')).toBe(false);
  });

  test('the state is mirrored on <html> for tests and CSS', () => {
    ctl.stepSection(1, 'wheel');
    expect(document.documentElement.dataset).toMatchObject({ sectionPhase: 'moving', sectionTarget: 'portfolio_page' });
  });
});
