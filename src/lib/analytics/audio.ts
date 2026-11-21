import { track } from './track';

/**
 * Podcast listening, read from the media element itself (DATA-12), not from the buttons: whatever starts the episode
 * (the play button, the progress bar, a timestamp in the show notes, the site player's playlist, a hardware media key)
 * is counted the same way.
 *
 * - podcast_play: once per episode per page, after PLAY_AFTER_S seconds actually played (seeks do not count);
 * - podcast_progress: 25, 50 and 75 percent, once each, when playback reaches them;
 * - podcast_complete: once, when the episode ends.
 *
 * Only listeners on the element: no React state and no store atom is touched, so listening re-renders nothing, and
 * nothing here wakes the experience's idle pause.
 */
export const PLAY_AFTER_S = 30;
export const PROGRESS_MARKS = [25, 50, 75] as const;
/** A step of the playing time larger than this between two timeupdates is a seek, not listening. */
const MAX_STEP_S = 2;

export type AudioSource = 'episode_page' | 'site_player';
export type AudioTarget = {
  episode_id: string;
  /** Show id: the episode's category (podcast_id or podcast_lt). */
  show: string;
  source: AudioSource;
  /** Duration from the content, used while the element does not know its own. */
  duration?: number;
};

/** What one page has already reported for one episode. */
export type ListenState = { listened: number; played: boolean; marks: Set<number>; completed: boolean };
export const newListenState = (): ListenState => ({ listened: 0, played: false, marks: new Set(), completed: false });

type MediaLike = Pick<
  HTMLMediaElement,
  'currentTime' | 'duration' | 'paused' | 'seeking' | 'addEventListener' | 'removeEventListener'
>;

/** Listens to one element for one episode; returns the teardown. */
export function bindAudioAnalytics(audio: MediaLike, target: AudioTarget, state: ListenState) {
  const { episode_id, show, source } = target;
  let last = audio.currentTime;
  const duration = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (target.duration ?? 0));
  const resync = () => {
    last = audio.currentTime;
  };

  const onTime = () => {
    const now = audio.currentTime;
    const step = now - last;
    last = now;
    if (audio.paused || audio.seeking) return;
    if (step > 0 && step <= MAX_STEP_S) state.listened += step;
    const total = duration();
    if (!state.played && state.listened >= PLAY_AFTER_S) {
      state.played = true;
      track('podcast_play', { episode_id, show, source });
    }
    if (total > 0) {
      const percent = (now / total) * 100;
      for (const mark of PROGRESS_MARKS) {
        if (percent >= mark && !state.marks.has(mark)) {
          state.marks.add(mark);
          track('podcast_progress', { episode_id, show, source, percent: mark });
        }
      }
    }
  };
  const onEnded = () => {
    if (state.completed) return;
    state.completed = true;
    track('podcast_complete', { episode_id, show, source });
  };

  audio.addEventListener('timeupdate', onTime);
  audio.addEventListener('seeked', resync);
  audio.addEventListener('playing', resync);
  audio.addEventListener('ended', onEnded);
  return () => {
    audio.removeEventListener('timeupdate', onTime);
    audio.removeEventListener('seeked', resync);
    audio.removeEventListener('playing', resync);
    audio.removeEventListener('ended', onEnded);
  };
}
