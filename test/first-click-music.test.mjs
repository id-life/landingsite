// 5a (the owner's answer): the music starts at the first click anywhere on the home page, once per page load, and
// never over another sound, never twice, never after the visitor has used the player. Where the browser allows sound
// without a click, his site also starts at load: once per page load, and never in a tab opened in the background.
import { describe, expect, test } from 'vitest';
import {
  firstClickStarts,
  isOnMedia,
  isSounding,
  MEDIA_TARGETS,
  otherSoundInPage,
  startAtLoad,
} from '@/hooks/audio/firstClick';

const fresh = { handled: false, playerUsed: false, musicPlaying: false, otherMediaPlaying: false, onMedia: false };

describe('the first click starts the music', () => {
  test('the first click of a page load, nothing else going on: it starts', () => {
    expect(firstClickStarts(fresh)).toBe(true);
  });
  test('a later click does not start it again (a pause by the visitor is kept)', () => {
    expect(firstClickStarts({ ...fresh, handled: true })).toBe(false);
  });
  test('the visitor has already used the player: the click changes nothing', () => {
    expect(firstClickStarts({ ...fresh, playerUsed: true })).toBe(false);
  });
  test('music already playing or about to: no second start', () => {
    expect(firstClickStarts({ ...fresh, musicPlaying: true })).toBe(false);
  });
  test('an episode or a video is sounding: the music does not start over it', () => {
    expect(firstClickStarts({ ...fresh, otherMediaPlaying: true })).toBe(false);
  });
  test('a click on a video or audio element: not taken for a first click', () => {
    expect(firstClickStarts({ ...fresh, onMedia: true })).toBe(false);
  });
});

describe('other sound in the page', () => {
  test('a playing element with its sound on counts; paused, muted or ended do not', () => {
    expect(isSounding([{ paused: false, muted: false }])).toBe(true);
    expect(isSounding([{ paused: true, muted: false }])).toBe(false);
    expect(isSounding([{ paused: false, muted: true }])).toBe(false);
    expect(isSounding([{ paused: false, muted: false, ended: true }])).toBe(false);
    expect(isSounding([])).toBe(false);
  });
  test('an open YouTube player counts as sound (it plays by itself); a page with nothing playing does not', () => {
    const doc = (media, iframe) => ({
      querySelectorAll: () => media,
      querySelector: (s) => (s.startsWith('iframe') ? iframe : null),
    });
    expect(otherSoundInPage(doc([], {}))).toBe(true);
    expect(otherSoundInPage(doc([{ paused: false, muted: false }], null))).toBe(true);
    expect(otherSoundInPage(doc([{ paused: false, muted: true }], null))).toBe(false);
    expect(otherSoundInPage(doc([], null))).toBe(false);
  });
  test('the media targets include links that open a video', () => {
    expect(MEDIA_TARGETS).toContain('a[href*="youtube.com/"]');
    expect(MEDIA_TARGETS).toContain('a[href*="youtu.be/"]');
  });
  test('a target inside a video or audio element, or a video link', () => {
    const inVideo = { closest: (s) => (s === MEDIA_TARGETS ? {} : null) };
    const elsewhere = { closest: () => null };
    expect(isOnMedia(inVideo)).toBe(true);
    expect(isOnMedia(elsewhere)).toBe(false);
    expect(isOnMedia(null)).toBe(false);
    expect(isOnMedia({})).toBe(false);
  });
});

describe('the try at load (where the browser allows sound without a click)', () => {
  const base = { firstOfPageLoad: true, alreadyStarting: false, hidden: false };
  test('the first track of the page load, the tab in view: try now', () => {
    expect(startAtLoad(base)).toBe('now');
  });
  test('a tab opened in the background: not before it is first shown', () => {
    expect(startAtLoad({ ...base, hidden: true })).toBe('when-shown');
  });
  test('once per page load: a player mounting again (back from another page) does not try', () => {
    expect(startAtLoad({ ...base, firstOfPageLoad: false })).toBe('never');
  });
  test('something else already starts it (play pressed early, a press on another page): no second start', () => {
    expect(startAtLoad({ ...base, alreadyStarting: true })).toBe('never');
  });
  test('the try itself obeys the first-click rule: after a click, a pause, or over another sound it does nothing', () => {
    const fresh = { handled: false, playerUsed: false, musicPlaying: false, otherMediaPlaying: false, onMedia: false };
    expect(firstClickStarts({ ...fresh, handled: true })).toBe(false);
    expect(firstClickStarts({ ...fresh, playerUsed: true })).toBe(false);
    expect(firstClickStarts({ ...fresh, otherMediaPlaying: true })).toBe(false);
  });
});
