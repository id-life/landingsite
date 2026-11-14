/**
 * Section stepping for the desktop experience. Wheel input is handled per section in
 * useScrollSmootherAction; keyboard and touch input arrive here as one normalised "step" event so
 * every input moves through the sections the same way. (Before, only the wheel stepped: arrow keys
 * crept 40 px through transitions thousands of pixels long and touch on a tablet scrolled freely
 * through half-finished states.)
 */
export type StepDirection = 'up' | 'down';

export type SectionStepDetail = {
  dir: StepDirection;
  source: 'keyboard' | 'touch';
  /** Set by the section that acts on the step (or swallows it during a transition). */
  handled: boolean;
};

export const SECTION_STEP_EVENT = 'idlife:section-step';

/** Dispatch a step; returns true when a section handled it. */
export function dispatchSectionStep(dir: StepDirection, source: SectionStepDetail['source']) {
  const detail: SectionStepDetail = { dir, source, handled: false };
  window.dispatchEvent(new CustomEvent<SectionStepDetail>(SECTION_STEP_EVENT, { detail }));
  return detail.handled;
}
