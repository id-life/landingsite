/**
 * What the player's control shows, read from its audio element: pause while the element is playing or about to
 * (play() was accepted and the file is loading), play otherwise: paused, ended, or a file that failed. Every path
 * that starts music (a press, the first click, the start at load or on first showing, the next track) sets the
 * control from this right after it asks the element to play, so the control never shows play while the music sounds.
 */
export function controlShowsPause(audio: { paused: boolean; ended: boolean; error: unknown }): boolean {
  return !audio.paused && !audio.ended && !audio.error;
}
