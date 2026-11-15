import { layoutUnitPx } from '@/utils/layout-unit';

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
