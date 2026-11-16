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
