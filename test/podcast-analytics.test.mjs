// DATA-12: podcast listening is read from the audio element. Whatever starts playback (button, progress bar, a
// show-notes timestamp), one page sends one podcast_play after 30 s played, 25/50/75 once each, podcast_complete on
// ended. Runs against a stand-in element (an EventTarget with the media fields) and a spy for track().
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const sent = [];
vi.mock('@/lib/analytics/track', () => ({ track: (name, params) => sent.push([name, params]) }));
const { bindAudioAnalytics, newListenState, PLAY_AFTER_S } = await import('@/lib/analytics/audio');

/** A stand-in audio element: play/pause/seek, and timeupdate every 0.25 s of playback. */
function fakeAudio(duration = 100) {
  const el = new EventTarget();
  Object.assign(el, { currentTime: 0, duration, paused: true, seeking: false });
  const fire = (type) => el.dispatchEvent(new Event(type));
  return Object.assign(el, {
    play() {
      el.paused = false;
      fire('playing');
    },
    pause() {
      el.paused = true;
      fire('pause');
    },
    seek(t) {
      el.seeking = true;
      el.currentTime = t;
      fire('timeupdate');
      el.seeking = false;
      fire('seeked');
    },
    advance(seconds) {
      for (let i = 0; i < seconds * 4; i += 1) {
        if (el.paused) return;
        el.currentTime = Math.min(el.duration, el.currentTime + 0.25);
        fire('timeupdate');
        if (el.currentTime >= el.duration) {
          el.paused = true;
          fire('ended');
          return;
        }
      }
    },
  });
}
const target = { episode_id: '56', show: 'podcast_id', source: 'episode_page' };
const names = () => sent.map(([n, p]) => (n === 'podcast_progress' ? `${n}:${p.percent}` : n));

beforeEach(() => void sent.splice(0));

describe('podcast listening from the media element', () => {
  test('started by the button: one podcast_play after 30 s played, not before', () => {
    const a = fakeAudio(100);
    bindAudioAnalytics(a, target, newListenState());
    a.play();
    a.advance(PLAY_AFTER_S - 1);
    expect(names()).toEqual(['podcast_progress:25']);
    a.advance(2);
    expect(names()).toEqual(['podcast_progress:25', 'podcast_play']);
    expect(sent[1][1]).toEqual({ episode_id: '56', show: 'podcast_id', source: 'episode_page' });
  });

  test('started by the progress bar (a seek, then play): the seek is not listening', () => {
    const a = fakeAudio(200);
    bindAudioAnalytics(a, target, newListenState());
    a.seek(10);
    a.play();
    a.advance(20);
    expect(names()).toEqual([]);
    a.advance(11);
    expect(names()).toEqual(['podcast_play']);
  });

  test('a timestamp jump while playing neither counts as listening nor resends podcast_play', () => {
    const a = fakeAudio(1000);
    const state = newListenState();
    bindAudioAnalytics(a, target, state);
    a.play();
    a.advance(10);
    a.seek(500);
    a.advance(10);
    expect(state.listened).toBeCloseTo(20, 5);
    expect(names()).toEqual(['podcast_progress:25', 'podcast_progress:50']);
    a.advance(15);
    a.seek(100);
    a.advance(40);
    expect(names().filter((n) => n === 'podcast_play')).toHaveLength(1);
  });

  test('25, 50, 75 once each and podcast_complete once on ended, also after a replay', () => {
    const a = fakeAudio(120);
    const state = newListenState();
    bindAudioAnalytics(a, target, state);
    a.play();
    a.advance(130);
    a.seek(0);
    a.play();
    a.advance(130);
    expect(names()).toEqual([
      'podcast_play',
      'podcast_progress:25',
      'podcast_progress:50',
      'podcast_progress:75',
      'podcast_complete',
    ]);
  });

  test('the same episode on the same page (a new element, as the site player makes per track) sends nothing again', () => {
    const state = newListenState();
    const a = fakeAudio(100);
    const stop = bindAudioAnalytics(a, target, state);
    a.play();
    a.advance(40);
    stop();
    const b = fakeAudio(100);
    bindAudioAnalytics(b, target, state);
    b.play();
    b.advance(40);
    expect(names().filter((n) => n === 'podcast_play')).toHaveLength(1);
  });

  test('a short episode counts as played at half its length', () => {
    const a = fakeAudio(20);
    bindAudioAnalytics(a, target, newListenState());
    a.play();
    a.advance(11);
    expect(names()).toContain('podcast_play');
  });

  test('after the teardown nothing is listened to', () => {
    const a = fakeAudio(100);
    const stop = bindAudioAnalytics(a, target, newListenState());
    stop();
    a.play();
    a.advance(100);
    expect(sent).toEqual([]);
  });
});

describe('what the listening may not do', () => {
  const read = (p) => readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8');
  const sources = { hook: read('hooks/audio/useAudioAnalytics.ts'), binding: read('lib/analytics/audio.ts') };

  test('it reads neither the playing time nor the progress from the store (no render while an episode plays)', () => {
    for (const src of Object.values(sources)) {
      expect(src).not.toMatch(/currentTimeAtom|progressAtom|durationAtom|audioControlsAtom|useState/);
    }
  });

  test('it never wakes the idle pause', () => {
    for (const src of Object.values(sources)) expect(src).not.toMatch(/wakeMotion|motion\/runtime/);
  });

  test('it attaches nothing unless analytics is on', () => {
    expect(sources.hook).toMatch(/if \(!ANALYTICS_ENABLED/);
  });
});
