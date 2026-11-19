'use client';

import { fitTapArea, TAP_GOAL, type Box } from '@/utils/tap-area-fit';
import { useEffect, useRef } from 'react';

const CONTROLS = 'a[href], button, [role="button"], input, select, textarea, summary';

/**
 * Where a control takes taps: its box, joined with its own touch area when it has a fixed one (a ::before laid out
 * against the control itself), so a fitted area never reaches into a neighbour's touch area either. A neighbour whose
 * area is fitted too (this rule, or a row arrow's) counts by its box alone: it keeps to its half of the gap itself, and
 * counting its area would make the two shrink each other on every refit.
 */
function hitBox(control: HTMLElement, r: DOMRect, style: CSSStyleDeclaration): Box {
  if (control.style.getPropertyValue('--tap-left') || control.style.getPropertyValue('--touch-left')) return r;
  const before = getComputedStyle(control, '::before');
  if (before.content === 'none' || before.position !== 'absolute' || style.position === 'static') return r;
  const width = parseFloat(before.width);
  const height = parseFloat(before.height);
  if (!width || !height) return r;
  const shift = before.transform && before.transform !== 'none' ? new DOMMatrixReadOnly(before.transform) : null;
  const left = r.left + (parseFloat(before.left) || 0) + (shift?.e ?? 0);
  const top = r.top + (parseFloat(before.top) || 0) + (shift?.f ?? 0);
  return {
    left: Math.min(r.left, left),
    top: Math.min(r.top, top),
    right: Math.max(r.right, left + width),
    bottom: Math.max(r.bottom, top + height),
  };
}

/** Where the controls around `element` take taps (hitBox), within the touch goal of its box. */
function neighbours(element: HTMLElement, box: DOMRect): Box[] {
  const near = {
    left: box.left - TAP_GOAL,
    top: box.top - TAP_GOAL,
    right: box.right + TAP_GOAL,
    bottom: box.bottom + TAP_GOAL,
  };
  const out: Box[] = [];
  for (const other of document.querySelectorAll<HTMLElement>(CONTROLS)) {
    if (other === element || other.contains(element) || element.contains(other)) continue;
    const r = other.getBoundingClientRect();
    if (!r.width || !r.height || r.right < near.left || r.left > near.right || r.bottom < near.top || r.top > near.bottom)
      continue;
    const style = getComputedStyle(other);
    // Never painted or never hit (the measuring copies, a link only its words receive): not a neighbour.
    if (style.visibility === 'hidden' || style.pointerEvents === 'none') continue;
    out.push(hitBox(other, r, style));
  }
  return out;
}

function fit(element: HTMLElement) {
  const box = element.getBoundingClientRect();
  if (!box.width) return;
  const grow = fitTapArea(box, neighbours(element, box));
  for (const side of ['left', 'top', 'right', 'bottom'] as const) {
    element.style.setProperty(`--tap-${side}`, `${grow[side].toFixed(1)}px`);
  }
}

/**
 * Every fitted control on the page, fitted again at the start of each touch, before the browser picks what the touch
 * reaches: a neighbour can move without any resize (Spectrum's bands slide in when the section is entered), so the area
 * always matches the page as it stands when the finger lands. One listener for all of them.
 */
const fitted = new Set<HTMLElement>();
const onTouchStart = () => {
  for (const element of fitted) fit(element);
};

/**
 * Keeps a small control's touch area (tap-area, ::before) to the space that is nobody's (fitTapArea), measured from
 * the page on mount, one and three seconds later, when its parent changes size, on every window resize, and at the
 * start of every touch. Pair it with FITTED_TAP_AREA. Until it has measured, the area is the control's own box.
 */
export function useFittedTapArea<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const refit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fit(element));
    };
    refit();
    const late = [setTimeout(refit, 1000), setTimeout(refit, 3000)];
    const observer = new ResizeObserver(refit);
    if (element.parentElement) observer.observe(element.parentElement);
    window.addEventListener('resize', refit);
    if (!fitted.size) window.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });
    fitted.add(element);
    return () => {
      cancelAnimationFrame(frame);
      late.forEach(clearTimeout);
      observer.disconnect();
      window.removeEventListener('resize', refit);
      fitted.delete(element);
      if (!fitted.size) window.removeEventListener('touchstart', onTouchStart, { capture: true });
    };
  }, []);
  return ref;
}

/** The touch area from the fitted sides (useFittedTapArea), on touch screens only; nothing is drawn. */
export const FITTED_TAP_AREA =
  'coarse:before:!h-auto coarse:before:!w-auto coarse:before:![transform:none] coarse:before:![left:calc(-1*var(--tap-left,0px))] coarse:before:![right:calc(-1*var(--tap-right,0px))] coarse:before:![top:calc(-1*var(--tap-top,0px))] coarse:before:![bottom:calc(-1*var(--tap-bottom,0px))]';
