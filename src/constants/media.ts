/**
 * Where the re-encoded transparent clips (the Digital Twin and the Presence map cards) are served from, or null.
 *
 * null (until the files are uploaded): every clip plays from its original address, and browsers that cannot play it
 * (iOS, in-app web views) show the still image, exactly as before.
 *
 * Set (for example `https://resources.id.life/v2`, through NEXT_PUBLIC_ALPHA_CLIPS_BASE or by writing it here): each
 * original `https://resources.id.life/<path>.webm` is served as `<base>/<path>.vp9a.webm` (VP9 with alpha, for
 * browsers that draw VP9 transparency) or `<base>/<path>.hevca.mp4` (HEVC with alpha, for Safari), chosen by what the
 * browser actually draws (src/lib/alpha-clips.ts), so iPhones play the moving clips too. Never set it before both files
 * of every clip in ALPHA_CLIP_PATHS (src/lib/alpha-clips.ts) are uploaded: nothing may point at an address that does not
 * exist.
 */
export const ALPHA_CLIPS_BASE: string | null = process.env.NEXT_PUBLIC_ALPHA_CLIPS_BASE || null;
