/**
 * The site's music starts at the visitor's first click anywhere on the home page (the owner's answer 5a: his site has
 * always done this). One click per page load: once the music has started, a pause by the visitor is kept, and no later
 * click starts it again. Pressing the player itself (play, pause, a playlist row) is the visitor choosing, and the
 * first-click start is then never needed.
 *
 * Three things that are faults rather than his behaviour are left out: the music never starts over another sound the
 * page is playing (an episode or a video), never starts a second copy of itself, and never starts later, outside the
 * click, when that click could not start it.
 */
export type FirstClickState = {
  /** The first click of this page load has been seen already (whatever it did). */
  handled: boolean;
  /** The visitor has used the player (play, pause or a row) before this click. */
  playerUsed: boolean;
  /** The music is playing or about to (play pressed while its list loads). */
  musicPlaying: boolean;
  /** Another sound of the page is playing: an episode, a video with its sound on, or an open YouTube player. */
  otherMediaPlaying: boolean;
  /** The click landed on a video or audio element, or on a link that opens a video (a talk card). */
  onMedia: boolean;
};

export function firstClickStarts(state: FirstClickState): boolean {
  return !state.handled && !state.playerUsed && !state.musicPlaying && !state.otherMediaPlaying && !state.onMedia;
}

type MediaLike = { paused: boolean; muted: boolean; ended?: boolean };

/** A media element in the page that is making sound (the music player's own elements are not in the page). */
export function isSounding(media: Iterable<MediaLike>): boolean {
  for (const m of media) if (!m.paused && !m.muted && !m.ended) return true;
  return false;
}

/** Targets whose click opens or controls a video or a sound: the media element itself, or a link to a video. */
export const MEDIA_TARGETS = 'video, audio, a[href*="youtube.com/"], a[href*="youtu.be/"]';

/** The click target is a video or audio element, or a link that opens a video (Insights' talk cards open it in place). */
export function isOnMedia(target: EventTarget | null): boolean {
  const el = target as { closest?: (selector: string) => unknown } | null;
  return !!el && typeof el.closest === 'function' && !!el.closest(MEDIA_TARGETS);
}

/** Another sound in the page: a sounding video or audio element, or an open YouTube player (it plays by itself). */
export function otherSoundInPage(doc: ParentNode): boolean {
  return isSounding(doc.querySelectorAll<HTMLMediaElement>('video, audio')) || !!doc.querySelector('iframe[src*="youtube"]');
}

/**
 * The try at load, as on the owner's site (it starts where the browser allows sound without a click): once per page
 * load, with the first track; not when something else already starts it (a play pressed early, the visitor arriving
 * after a press on another page); in a tab opened in the background, not until the tab is first shown.
 */
export function startAtLoad(state: { firstOfPageLoad: boolean; alreadyStarting: boolean; hidden: boolean }) {
  if (!state.firstOfPageLoad || state.alreadyStarting) return 'never' as const;
  return state.hidden ? ('when-shown' as const) : ('now' as const);
}
