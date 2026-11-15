// Shared by the particle sketches and scripts/precompute-particles.mjs (PERF-05): the sketches' default sampling
// parameters and the key a logo's precomputed points are filed under. Plain JS so the build script can import it.

/** Defaults of each sketch kind (DynamicParticleGL, StaticParticleGL), by phone or not (their IS_MOBILE). */
export const PARTICLE_DEFAULTS = {
  dynamic: (mobile) => ({ scaleNum: 1, loadPercentage: 0.0007, resolution: mobile ? 15 : 5 }),
  static: (mobile) => ({ scaleNum: 1, loadPercentage: mobile ? 0.01 : 0.02, resolution: mobile ? 15 : 5 }),
};

/**
 * Key of one logo's points: everything the sampling depends on, so a changed image parameter misses the manifest
 * (and the sketch falls back to the image) instead of showing stale points.
 * @param {'dynamic' | 'static'} kind
 * @param {boolean} mobile
 * @param {{ url: string; resize?: number[]; scaleNum?: number; loadPercentage?: number; resolution?: number; forceColor?: number[] }} config
 */
export function particleKey(kind, mobile, config) {
  const d = PARTICLE_DEFAULTS[kind](mobile);
  return [
    kind,
    mobile ? 'm' : 'd',
    config.url,
    (config.resize ?? []).join('x'),
    config.scaleNum ?? d.scaleNum,
    config.loadPercentage ?? d.loadPercentage,
    config.resolution ?? d.resolution,
    (config.forceColor ?? []).join(','),
  ].join('|');
}
