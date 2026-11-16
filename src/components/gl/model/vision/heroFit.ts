import * as THREE from 'three';
import { SVGLoader, SVGResult } from 'three-stdlib';

/**
 * Fitting the hero wordmark (IMMORTAL DRAGONS) to the camera frustum. It used to be scaled by
 * min(1, viewport.width / 10), which ignores the wordmark's own width: below about a 1.37:1 screen
 * its ink filled 99.5-100 % of the width and was cut on tablets, 4:3 iPads and phones.
 *
 * Numbers that mirror the scene (keep in step with them):
 * - both trees: PerspectiveCamera at z 10 with a 40 degree vertical field of view (ThreeWrapper,
 *   MobileThreeWrapper);
 * - desktop: CenterLogo draws the wordmark as a plane LOGO_PLANE_HEIGHT high (width = height x the
 *   texture's aspect) in a group at z -5;
 * - phone: MobileCenterLogo draws /svgs/logo-en.svg at Svg scale 0.06 inside a Center of scale 0.7
 *   at z -5 (the CN lockup has the same width).
 */
export const HERO_CAMERA = { z: 10, fov: 40 } as const;
export const LOGO_GROUP_Z = -5;
export const LOGO_PLANE_HEIGHT = 3.1;
export const PHONE_LOGO = { url: '/svgs/logo-en.svg', scale: 0.06 * 0.7 } as const;

/** Share of the visible width the wordmark may take: at least 7 % clear on each side. */
const WIDTH_SHARE = 0.86;
const HEIGHT_SHARE = 0.45;

/**
 * Scale for the hero group that makes a planeWidth x planeHeight wordmark (at local z planeZ inside
 * the scaled group) span at most WIDTH_SHARE of the visible width and HEIGHT_SHARE of the visible
 * height; never above 1 (1920x1080 and wider screens are unchanged). The group's scale also brings
 * the wordmark closer to the camera (its world z is scale x planeZ), which the closed form includes:
 * s x W <= share x 2 x (cameraZ - s x planeZ) x tan(fov / 2) x aspect.
 */
export function fitHeroScale(aspect: number, planeWidth: number, planeHeight: number, planeZ: number = LOGO_GROUP_Z) {
  const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(HERO_CAMERA.fov / 2));
  const fit = (size: number, share: number, aspectFactor: number) => {
    const k = 2 * share * tanHalfFov * aspectFactor;
    const denominator = size + k * planeZ;
    return denominator > 0 ? (k * HERO_CAMERA.z) / denominator : Infinity;
  };
  return Math.min(1, fit(planeWidth, WIDTH_SHARE, aspect), fit(planeHeight, HEIGHT_SHARE, 1));
}

/**
 * The hero's ink around the wordmark, in units of the wordmark's on-screen width W, measured on the desktop deck at
 * rest with motion off (ring and dragon masks at 1180x820 to 2560x1440): the ring's top is 0.20 W above the wordmark's
 * centre, the dragon's head 0.29 W, and the tagline ends 0.245 W below it. The dragon starts 0.11 W left of centre.
 */
export const HERO_INK = { ringTop: 0.2, dragonTop: 0.29, bottom: 0.245, dragonLeft: 0.11 } as const;
/** Room kept free at the bottom of the window for the slogan carousel and the scroll button with its rings (desktop deck). */
export const HERO_BOTTOM_RESERVE = 124;
/** Space between the statement's last line and the ring or the dragon. */
const STATEMENT_GAP = 16;

/** On-screen width (px) of a planeWidth-wide wordmark at group scale s, for a window height h. */
function wordmarkPx(s: number, planeWidth: number, h: number, planeZ: number) {
  const tan = Math.tan(THREE.MathUtils.degToRad(HERO_CAMERA.fov / 2));
  return (s * planeWidth * h) / (2 * tan * (HERO_CAMERA.z - s * planeZ));
}

/**
 * The hero group's scale and vertical offset (world units at the wordmark's depth, positive up) that keep the ring
 * and the dragon clear of the home statement at rest (RWD-01): the statement's last line must end above the ring,
 * or above the dragon's head where the statement reaches across to it, and the tagline must end above the bottom
 * controls. The hero first moves down into the free room below; only if that is not enough does it shrink. Where the
 * natural fit is already clear (a wide window with room above the ring), it is returned unchanged.
 */
export function fitHeroToReserve(
  width: number,
  height: number,
  planeWidth: number,
  planeHeight: number,
  statement: { bottom: number; right: number } | null,
  planeZ: number = LOGO_GROUP_Z,
) {
  const natural = fitHeroScale(width / height, planeWidth, planeHeight, planeZ);
  if (!statement) return { scale: natural, offsetY: 0 };
  const tan = Math.tan(THREE.MathUtils.degToRad(HERO_CAMERA.fov / 2));
  const top = statement.bottom + STATEMENT_GAP;
  const bottom = height - HERO_BOTTOM_RESERVE;
  const solve = (w: number) => {
    const reach = statement.right > width / 2 - HERO_INK.dragonLeft * w ? HERO_INK.dragonTop : HERO_INK.ringTop;
    return { reach, maxW: (bottom - top) / (reach + HERO_INK.bottom) };
  };
  const naturalW = wordmarkPx(natural, planeWidth, height, planeZ);
  const { maxW } = solve(naturalW);
  const w = Math.min(naturalW, maxW);
  const { reach } = solve(w);
  const centre = Math.min(Math.max(height / 2, top + reach * w), bottom - HERO_INK.bottom * w);
  // Back from the width to a scale: w = s * planeWidth * h / (2 tan (z - s * planeZ)).
  const scale = w < naturalW ? (2 * tan * HERO_CAMERA.z * w) / (planeWidth * height + 2 * tan * planeZ * w) : natural;
  const worldPerPx = (2 * tan * (HERO_CAMERA.z - scale * planeZ)) / height;
  return { scale, offsetY: centre === height / 2 ? 0 : -(centre - height / 2) * worldPerPx };
}

/** Extent of the filled shapes of an SVG (what drei's Svg draws and Center centres), in SVG units. */
export function svgInkSize(svg: SVGResult) {
  const box = new THREE.Box2();
  for (const path of svg.paths) {
    for (const shape of SVGLoader.createShapes(path)) {
      for (const point of shape.getPoints()) box.expandByPoint(point);
    }
  }
  const size = box.getSize(new THREE.Vector2());
  return { width: size.x, height: size.y };
}
