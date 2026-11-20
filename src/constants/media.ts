/**
 * Where the re-encoded transparent clips (the Digital Twin and the Presence map cards) are served from.
 *
 * Each original `https://resources.id.life/<path>.webm` is served as `<base>/<path>.vp9a.webm` (VP9 with alpha, for
 * browsers that draw VP9 transparency) or `<base>/<path>.hevca.mp4` (HEVC with alpha, for Safari), chosen by what the
 * browser actually draws (src/lib/alpha-clips.ts), so iPhones play the moving clips too; a browser that draws neither
 * shows the still image, as before. Both files of every clip in ALPHA_CLIP_PATHS (src/lib/alpha-clips.ts) are uploaded
 * under v2/ (2026-11-20; v2/ held nothing before). A constant, not a deployment variable, so no environment needs a
 * setting for it. A clip added later must be uploaded in both formats before it is listed; null switches every clip
 * back to its original address.
 */
export const ALPHA_CLIPS_BASE: string | null = 'https://resources.id.life/v2';
