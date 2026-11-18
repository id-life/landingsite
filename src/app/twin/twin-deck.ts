import { layoutUnitPx } from '@/utils/layout-unit';
import { gsap } from 'gsap';
import { forgetTwinPress } from '@/atoms/twin';

/** Which deck the Digital Twin section is drawn for (RWD-02): the scrolled desktop/tablet deck or the paged phone deck. */
export type TwinDeck = 'desktop' | 'phone';

/**
 * How the avatar is shown. 'canvas': the 3D avatar in the twin canvas (TwinThreeWrapper), which the deck shell mounts
 * once, outside the scrolled content. 'media': the clips and stills of src/app/twin/_components/Model.tsx, drawn by the
 * section itself. Today's behaviour per device class is the default (TWIN_AVATAR); the choice by capability is
 * RWD-10's (wave 2), which only needs to pass a different value.
 */
export type TwinAvatar = 'canvas' | 'media';
export const TWIN_AVATAR: Record<TwinDeck, TwinAvatar> = { desktop: 'canvas', phone: 'media' };

/**
 * Where hidden title items wait, off the left edge. It was -80 layout units (-546 px at 820), less than the width of
 * the widest title image (720 px), so on tablets the end of "title-clone-03" showed at the left edge.
 */
export const twinOffstage = () => `${-Math.max(80 * layoutUnitPx(), window.innerWidth + 80)}px`;
/** The same in CSS, for the resting class of a hidden title item. */
export const TWIN_OFFSTAGE_CLASS = 'left-[min(-80rem,calc(-100vw_-_80px))]';

/** Desktop: the skin switch's resting distance from the bottom: the original's 15 units from 1200 px, at least 190 px under
 * it, clear of the feature list (its text is the 1440 px size there). */
export const skinRestBottom = () => `${innerWidth >= 1200 ? 15 * layoutUnitPx() : Math.max(15 * layoutUnitPx(), 190)}px`;

/**
 * Stops every title move still pending from earlier presses. A title arrives with a delay after a press, so without this
 * a quick second press is followed by the first press's title arriving on top of the second's.
 */
export function stopTwinTitleMoves() {
  gsap.killTweensOf(gsap.utils.toArray('.twin-title-item'));
  gsap.killTweensOf('.twin-tag');
}

/**
 * DEMO shown or hidden. Hidden means invisible AND out of reach (autoAlpha sets visibility: hidden at 0), so the hidden
 * link takes no press and no focus where it used to be; on the phone it also waits off the left edge, as before.
 */
export function showTwinDemo(deck: TwinDeck, shown: boolean) {
  const left = deck === 'phone' ? { left: shown ? '1.25rem' : '-80rem' } : {};
  gsap.to('#ytb-demo', { autoAlpha: shown ? 1 : 0, ...left, overwrite: 'auto' });
}

/**
 * The section's opening arrangement, as on a fresh load: the headline (and on the desktop the feature list) and DEMO
 * shown, every title off stage, the switches at their resting places. Leaving the section returns to it, as on the
 * original.
 */
export function showTwinOpening(deck: TwinDeck) {
  forgetTwinPress();
  stopTwinTitleMoves();
  const items = gsap.utils.toArray('.twin-title-item');
  gsap.to('.twin-title', { opacity: 1, overwrite: 'auto' });
  showTwinDemo(deck, true);
  if (deck === 'desktop') {
    gsap.to(items, { left: twinOffstage() });
    gsap.to('#switch-skin', { bottom: skinRestBottom(), overwrite: 'auto' });
    return;
  }
  gsap.to(items, { left: '-80rem' });
  gsap.to('.twin-tag', { left: '-80rem' });
  // 32rem / 30rem down a tall phone; on a phone in landscape (390 px tall) that is below the window, so at most 60 %.
  gsap.to('#switch-model', { top: () => `${Math.min(512, innerHeight * 0.6)}px`, y: '-50%', overwrite: 'auto' });
  gsap.to('#switch-skin', { top: () => `${Math.min(480, innerHeight * 0.57)}px`, y: '-50%', overwrite: 'auto' });
  gsap.to('#switch-anatomy-camera', { bottom: '11rem', overwrite: 'auto' });
}
