/**
 * Design tokens (VIS-02): the one source of every colour, type role, font role and grid value on the site.
 *
 * - `src/styles/tokens.css` is GENERATED from this file (`node scripts/build-tokens.mjs`) and imported before
 *   `globals.css` by the root layout (and global-error); `test/tokens.test.mjs` fails when the two differ.
 * - `tailwind.config.ts` builds `theme.colors`, `fontSize`, `fontFamily` and the grid utilities from it, so a
 *   colour that is not here has no utility class.
 * - Code that cannot read CSS custom properties (three.js materials, GSAP theme tweens, canvas sketches) imports
 *   the values from here. No six-digit hex literal may appear anywhere else in src (suite static target).
 *
 * Guide for new code: docs/design-tokens.md. Motion tokens (durations, easings) are not defined here: they belong
 * to the motion token source (src/hooks/anim, MOT-08).
 */

/* ----------------------------------------------------------------------------------------------------------------
 * Colour
 * ------------------------------------------------------------------------------------------------------------- */

/**
 * House tokens: the Immortal Dragons interface palette, exactly as specified by VIS-02. New UI uses only these.
 * Contrast on surface #faf9f5: ink 16.0:1, ink-muted 5.1:1, accent 6.1:1. On panel #161512: panel-ink 15.3:1,
 * panel-ink-muted 7.6:1, panel-accent 4.7:1.
 */
const house = {
  surface: '#faf9f5',
  raised: '#ffffff',
  sunken: '#f0eee6',
  ink: '#1f1e1b',
  'ink-muted': '#6e6a60',
  hairline: '#e3e0d8',
  accent: '#c11111',
  'accent-hover': '#a30e0e',
  /** The contained dark panel and its text, hairline and accent. */
  panel: '#161512',
  'panel-ink': '#ece9e2',
  /** Not in the VIS-02 list: muted text on the dark sections (4.5:1 or more on #000000 and on panel). */
  'panel-ink-muted': '#a8a49b',
  'panel-hairline': '#2f2d28',
  'panel-accent': '#e05252',
} as const;

const base = {
  white: '#ffffff',
  black: '#000000',
} as const;

/**
 * Today's neutrals, kept at their exact values so the token change repaints nothing. They are named by lightness
 * (50 lightest, 970 darkest), are not part of the house palette, and are retired by the wave-2 redesign: the
 * nearest house token of each is in docs/design-tokens.md. New code must not reach for them.
 */
const tone = {
  'tone-50': '#f6f8fb',
  'tone-75': '#f3f4f6',
  'tone-100': '#f0f0f0',
  'tone-250': '#b8b8b8',
  'tone-300': '#cccccc',
  'tone-350': '#999999',
  'tone-380': '#979797',
  'tone-400': '#9c979d',
  'tone-500': '#7b7b7d',
  'tone-550': '#666666',
  'tone-600': '#747374',
  'tone-650': '#57595c',
  'tone-750': '#2e2f31',
  'tone-800': '#222222',
  'tone-950': '#121212',
  'tone-970': '#0f0f0f',
} as const;

/**
 * Categorical colours of data marks (Presence map categories, Spectrum and disease-management status, the
 * character-relation graph). Values unchanged; the 3-hue data palette checked at 3:1 on surface is wave 2.
 */
const data = {
  'data-yellow': '#ffe500',
  'data-orange': '#ff613a',
  'data-green': '#1edb8c',
  'data-ok': '#22c55e',
  'data-leaf': '#148d02',
  'data-pine': '#062c1c',
  'data-cyan': '#00ddff',
  'data-sky': '#43bbff',
  'data-navy': '#00329a',
  'data-purple': '#ce3aff',
  'data-rose': '#d9b8be',
  'data-draft': '#fde047',
} as const;

/** Section scenery: the backgrounds of the light and dark themes, the Digital Twin swatches and the 3D lights. */
const scene = {
  'scene-sky': '#e5ebf5',
  'scene-haze': '#cbd6ea',
  'scene-blood': '#1e0000',
  'twin-rose': '#d7bac4',
  'twin-steel': '#b0b6c1',
  'twin-blush': '#ffeaea',
  'twin-light': '#ffaeae',
  'fluid-ink': '#3300ff',
  'fluid-night': '#070410',
  'sparkle-blue': '#0d47a1',
  'loader-red': '#ff4d4f',
} as const;

/** Colours of rendered markdown (podcast timelines and transcripts): GitHub's light markdown palette. */
const markdown = {
  'md-fg': '#1f2328',
  'md-fg-muted': '#59636e',
  'md-fg-subtle': '#818b98',
  'md-canvas-subtle': '#f6f8fa',
  'md-border': '#d1d9e0',
  'md-accent': '#0969da',
  'md-accent-emphasis': '#0550ae',
  'md-attention': '#9a6700',
  'md-attention-subtle': '#fff8c5',
  'md-success': '#1a7f37',
  'md-success-emphasis': '#116329',
  'md-success-subtle': '#dafbe1',
  'md-danger': '#d1242f',
  'md-danger-emphasis': '#cf222e',
  'md-danger-deep': '#82071e',
  'md-danger-subtle': '#ffebe9',
  'md-done': '#8250df',
  'md-done-emphasis': '#6639ba',
  'md-severe': '#953800',
  'md-severe-subtle': '#ffd8b5',
  'md-string': '#0a3069',
  'md-attention-deep': '#3b2300',
} as const;

/**
 * The colours JavaScript can read (three.js, GSAP theme tweens, canvases). The markdown palette is CSS-only, so it is
 * not here and does not ship to the browser in JS. In CSS, SVG attributes and inline styles use var(--color-<name>).
 */
export const color = { ...house, ...base, ...tone, ...data, ...scene } as const;

/** `#rrggbb` plus an alpha in 0..1, as `#rrggbbaa` (what GSAP tweens between and three.js reads). */
const withAlpha = (hex: string, alpha: number): string =>
  `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;

/** `#rrggbb` as `r g b` channels, for `rgb(var(--x-rgb) / a)` in CSS. */
const rgbChannels = (hex: string): string => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16)).join(' ');

/** The 8 % accent wash (selection, active nav background). */
export const accentTint = `rgb(${rgbChannels(house.accent)} / 0.08)`;

/* ----------------------------------------------------------------------------------------------------------------
 * Section themes: the CSS variables the experience tweens between sections (src/utils/gsap-config.ts on the
 * laptop tree, src/constants/config.tsx on the phone tree). `--background` and `--foreground` are read through
 * the `background` and `foreground` colour utilities; the gradient and subscribe variables by globals.css.
 * ------------------------------------------------------------------------------------------------------------- */

const lightTheme = {
  '--gradient-from': color.white,
  '--gradient-via': color['scene-sky'],
  '--gradient-to': color['scene-haze'],
  '--background': color['tone-100'],
  '--foreground': color.black,
  '--subscribe-border': color.white,
  '--subscribe-bg': withAlpha(color.white, 0.2),
} as const;

const darkTheme = {
  '--gradient-from': color.black,
  '--background': color.black,
  '--subscribe-border': withAlpha(color['tone-650'], 0.5),
  '--subscribe-bg': withAlpha(color.black, 0.2),
} as const;

export const themes = {
  light: lightTheme,
  /** Presence. */
  black: { ...darkTheme, '--gradient-via': color.black, '--gradient-to': color.black, '--foreground': color.white },
  /** Portfolio. */
  blackRed: {
    ...darkTheme,
    '--gradient-via': color['scene-blood'],
    '--gradient-to': withAlpha(color.accent, 76 / 255),
    '--foreground': color['tone-100'],
  },
  /** Spectrum. */
  blackRed2: {
    ...darkTheme,
    '--gradient-via': withAlpha(color.accent, 17 / 255),
    '--gradient-to': withAlpha(color.accent, 76 / 255),
    '--foreground': color['tone-100'],
  },
} as const;

/* ----------------------------------------------------------------------------------------------------------------
 * Type
 * ------------------------------------------------------------------------------------------------------------- */

/**
 * The system CJK faces, in the order the platforms ship them (macOS/iOS, older macOS, Windows, Android/Linux).
 * Every text family ends with this list, so a Chinese character is never drawn by a Latin face's fallback.
 */
const CJK_SYSTEM_STACK = [
  'PingFang SC',
  'Hiragino Sans GB',
  'Microsoft YaHei',
  'Noto Sans SC',
  'Noto Sans CJK SC',
  'Source Han Sans SC',
] as const;

/**
 * Font roles. Components name a role (`font-display`, `font-text`, `font-title`, `font-button`, `font-menu`),
 * never a typeface. The faces behind the roles are chosen by FONT_PALETTE, the owner's open decision:
 *
 * - 'current' (default): today's faces. Xirod for the extended section titles, Migrena Grotesque for the
 *   SCROLL / START / BACK buttons, TT Lakes for the phone menu. These are commercial faces; their web licences are
 *   not on file.
 * - 'open': the Oxanium + Poppins palette (both SIL Open Font License 1.1, served by next/font/google). Every role
 *   that used a commercial face is set in Oxanium. Switching is this one line; the commercial files can then be
 *   deleted from src/styles/fonts (and their localFont declarations from fonts.ts).
 */
const FONT_PALETTE: 'current' | 'open' = 'current';

/** The next/font CSS variables of each face (src/styles/fonts.ts). */
const face = {
  oxanium: 'var(--font-oxanium)',
  poppins: 'var(--font-poppins)',
  xirod: 'var(--font-xirod)',
  migrena: 'var(--font-migrena)',
  ttLakes: 'var(--font-tt)',
  /** Source Han Sans CN, subset to the display strings (VIS-07, src/styles/display-strings.ts). */
  cjkDisplay: 'var(--font-source-han-sans-cn)',
} as const;

const latin = {
  current: { display: face.oxanium, text: face.poppins, title: face.xirod, button: face.migrena, menu: face.ttLakes },
  open: { display: face.oxanium, text: face.poppins, title: face.oxanium, button: face.oxanium, menu: face.oxanium },
}[FONT_PALETTE];

const cjk = CJK_SYSTEM_STACK.map((f) => `'${f}'`).join(', ');

/**
 * Each role as a CSS font-family list. Only the two brand roles put the Source Han subset second: they are for the
 * display strings (nav, section titles, slogans, Connect and Spectrum labels: src/styles/display-strings.ts), whose
 * every Chinese character is in the subset. Every other role goes straight to the system CJK list, because its text
 * (CMS titles, articles, transcripts) can hold any character and a run must never mix the subset with a system face.
 */
const fontRoles = {
  /** Oxanium: headings, labels, UI. */
  display: `${latin.display}, ${cjk}, sans-serif`,
  /** Poppins: running text. */
  text: `${latin.text}, ${cjk}, sans-serif`,
  /** Display strings in the display face (the .bilingual-font class). */
  brand: `${latin.display}, ${face.cjkDisplay}, ${cjk}, sans-serif`,
  /** Display strings in the text face (the .bilingual-font-poppins class). */
  'brand-text': `${latin.text}, ${face.cjkDisplay}, ${cjk}, sans-serif`,
  /** Extended section titles (Portfolio, Spectrum, Presence). */
  title: `${latin.title}, ${cjk}, sans-serif`,
  /** SCROLL, START, BACK. */
  button: `${latin.button}, ${cjk}, sans-serif`,
  /** The phone menu. */
  menu: `${latin.menu}, ${cjk}, sans-serif`,
} as const;

/**
 * The reading size (RWD-09, owned by the content pages): 16 px up to about 1440 px wide, then growing to 22 px by
 * 2560. The body, small-body and lead roles derive from it, so the news and podcast pages keep their sizes.
 */
const readBody = 'clamp(1rem, 0.44vw + 0.625rem, 1.375rem)';

/**
 * The nine type roles: [font-size, line-height]. Sizes are rem-bounded clamp()s, each maximum at most 2.5x its
 * minimum (RWD-01), so browser zoom and the visitor's default font size still scale the text. The floors (12 px
 * captions, 14 px labels, 16 px reading text) hold only where the root is 16 px: see docs/design-tokens.md for the
 * experience routes, whose root is still 0.8333vw above 768 px.
 */
export const typeRoles = {
  /** Dates, credits, legal, metadata. 12 px floor. */
  caption: [`calc(var(--read-body) * 0.75)`, '1.5'],
  /** Navigation, buttons, tags, form labels (often uppercase). 14 px floor. */
  label: ['clamp(0.875rem, 0.8125rem + 0.125vw, 1rem)', '1.3'],
  /** Secondary text: card summaries, list items. */
  'body-sm': [`calc(var(--read-body) * 0.875)`, '1.6'],
  /** Running text. 16 px floor. */
  body: ['var(--read-body)', '1.7'],
  /** Intro paragraphs and pull quotes. */
  lead: [`calc(var(--read-body) * 1.25)`, '1.4'],
  /** Card and sub-section titles. */
  'title-sm': ['clamp(1.25rem, 1rem + 0.5vw, 1.75rem)', '1.3'],
  /** Section sub-heads (h2). */
  title: ['clamp(1.75rem, 1.25rem + 1.25vw, 2.75rem)', '1.2'],
  /** Page and section titles (h1). */
  headline: ['clamp(2.25rem, 1.25rem + 2.75vw, 4.5rem)', '1.1'],
  /** Hero statements and the wordmark line. */
  display: ['clamp(2.75rem, 6vw, 6.875rem)', '1'],
} as const;

/* ----------------------------------------------------------------------------------------------------------------
 * Space and grid
 * ------------------------------------------------------------------------------------------------------------- */

/** The grid of every page: 12 columns, 1280 px max content width, fluid outer margins, 24 px gutters. */
export const grid = {
  columns: 12,
  maxWidth: '1280px',
  margin: 'clamp(16px, 4vw, 80px)',
  gutter: '24px',
  /** Reading measure for long-form text. */
  measure: '680px',
} as const;

/**
 * The 4 px spacing base: space(n) = n x 4 px. Tailwind's default spacing steps are this scale in rem (p-1 = 0.25rem),
 * so they are 4 px only where the root is 16 px.
 */
const SPACE_UNIT_PX = 4;

/**
 * The font roles, declared on <body>: they reference the next/font variables (--font-oxanium ...), which next/font
 * sets on <body> (src/app/layout.tsx). A custom property resolves its var() where it is declared, so declared on
 * :root they would resolve to nothing and every role would fall back to the browser default.
 */
export function bodyVariables(): [string, string][] {
  return Object.entries(fontRoles).map(([k, v]) => [`--font-role-${k}`, v] as [string, string]);
}

/** Every :root custom property of tokens.css, in order (scripts/build-tokens.mjs writes them, the test compares). */
export function cssVariables(): [string, string][] {
  return [
    ...Object.entries({ ...color, ...markdown }).map(([k, v]) => [`--color-${k}`, v] as [string, string]),
    ['--color-accent-tint', accentTint],
    ['--read-body', readBody],
    ...Object.entries(typeRoles).flatMap(([k, [size, lh]]) => [
      [`--type-${k}`, size] as [string, string],
      [`--type-${k}-lh`, lh] as [string, string],
    ]),
    ['--grid-columns', String(grid.columns)],
    ['--grid-max', grid.maxWidth],
    ['--grid-margin', grid.margin],
    ['--grid-gutter', grid.gutter],
    ['--measure', grid.measure],
    ['--space', `${SPACE_UNIT_PX}px`],
    // The layout unit (RWD-01): today exactly the root rem (1rem = 0.8333vw on the experience and Spectrum tool routes
    // above 768 px, 16 px elsewhere). Layout that should keep tracking the window moves to calc(var(--u) * n); when the
    // root becomes a fixed 16 px, only --u is redefined on those routes and the layout does not move.
    ['--u', '1rem'],
    // The light theme is the default; the experience tweens these per section.
    ...Object.entries(themes.light),
    ['--gradient-via-percent', '50%'],
    ['--gradient-rotate', '90deg'],
  ];
}
