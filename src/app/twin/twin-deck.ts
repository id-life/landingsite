import { layoutUnitPx, u } from '@/utils/layout-unit';
import { gsap } from 'gsap';
import { forgetTwinPress } from '@/atoms/twin';
import { COMPACT_HEIGHT_QUERY } from '@/styles/device-classes';

/** Which deck the Digital Twin section is drawn for (RWD-02): the scrolled laptop deck or the paged phone deck. */
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
 * Where hidden title items wait, off the left edge. It was -80 layout units (513 px at a 769 px laptop window), less
 * than the width of the widest title image (720 px), so on narrow laptop windows the end of "title-clone-03" showed at
 * the left edge (the original's too).
 */
export const twinOffstage = () => `${-Math.max(80 * layoutUnitPx(), window.innerWidth + 80)}px`;
/** The same in CSS, for the resting class of a hidden title item. */
export const TWIN_OFFSTAGE_CLASS = 'left-[min(-80rem,calc(-100vw_-_80px))]';

/** Desktop: the skin switch's resting distance from the bottom, the original's 15 units. */
export const skinRestBottom = () => `${15 * layoutUnitPx()}px`;

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
  const left = deck === 'phone' ? { left: shown ? u(1.25) : u(-80) } : {};
  gsap.to('#ytb-demo', { autoAlpha: shown ? 1 : 0, ...left, overwrite: 'auto' });
}

/**
 * Phone: where the model column's centre rests in the opening arrangement. 32 units down a tall phone (the phone
 * deck's unit, larger on an upright tablet), at most 60 % of the window; and in an upright window never so high that
 * the column reaches DEMO above it: its top edge at least 0.75 units below DEMO's bottom (on 3:4 windows and at 375x667
 * and 360x740 the 60 % cap put the column over DEMO). On a phone in landscape the column stands beside DEMO, on the
 * right, and keeps the 60 % rule.
 */
export function twinModelRestTop() {
  const unit = layoutUnitPx();
  const capped = Math.min(32 * unit, innerHeight * 0.6);
  if (window.matchMedia(COMPACT_HEIGHT_QUERY).matches) return capped;
  const column = document.querySelector<HTMLElement>('#switch-model');
  const demo = document.querySelector<HTMLElement>('#ytb-demo');
  if (!column || !demo) return capped;
  // DEMO's place in its panel (the titles' wrapper) and the column's in the fixed layer are both counted from the top of
  // the window when the panel rests; read from the layout, not the screen, so a panel still sliding in reads the same.
  return Math.max(capped, demo.offsetTop + demo.offsetHeight + 0.75 * unit + column.offsetHeight / 2);
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
  gsap.to(items, { left: u(-80) });
  gsap.to('.twin-tag', { left: u(-80) });
  // 32 / 30 units down a tall phone (the phone deck's unit, larger on an upright tablet); on a phone in landscape
  // (390 px tall) that is below the window, so at most 60 %; the model column never over DEMO (twinModelRestTop).
  gsap.to('#switch-model', {
    top: () => `${twinModelRestTop()}px`,
    y: '-50%',
    overwrite: 'auto',
  });
  gsap.to('#switch-skin', {
    top: () => `${Math.min(30 * layoutUnitPx(), innerHeight * 0.57)}px`,
    y: '-50%',
    overwrite: 'auto',
  });
  gsap.to('#switch-anatomy-camera', { bottom: u(11), overwrite: 'auto' });
}
