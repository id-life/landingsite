# Design tokens: colours, type, fonts, grid

The one source is `src/styles/tokens.ts` (VIS-02). `src/styles/tokens.css` is generated from it
(`node scripts/build-tokens.mjs`; `npm test` fails if the two differ) and is imported before `globals.css` by the root layout.
`tailwind.config.ts` builds `theme.colors`, the type-role sizes, the font roles and the grid utilities from the same
file. Code that cannot read CSS variables (three.js, GSAP theme tweens, canvases) imports `color` from it.

Rules the tests enforce: no six-digit hex colour anywhere in `src` outside the two token files, and no Tailwind
palette utility (`text-red-600`, `bg-gray-800`): `theme.colors` replaces Tailwind's palette, so those render nothing.
After a merge that brings new colours, run `node scripts/codemod-color-tokens.mjs` (idempotent; it lists anything it
cannot map).

## Colours

| Group           | Tokens                                                                                                                                                                           | Use                                                                                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| House           | `surface` `raised` `sunken` `ink` `ink-muted` `hairline` `accent` `accent-hover` `accent-tint`, dark panel `panel` `panel-ink` `panel-ink-muted` `panel-hairline` `panel-accent` | All new UI. Muted text is `ink-muted` (5.1:1 on surface) or `panel-ink-muted` on dark, never opacity.                                                            |
| Base            | `white` `black` `transparent` `current`                                                                                                                                          |                                                                                                                                                                  |
| Section theme   | `background` `foreground` (CSS variables tweened per section; `tokens.ts` `themes`)                                                                                              | Text and fills that follow the section's light or dark theme.                                                                                                    |
| Legacy neutrals | `tone-50` ... `tone-970`                                                                                                                                                         | Today's greys at their exact values, so the token change repainted nothing. Do not use in new code; the wave-2 redesign maps them to house tokens (table below). |
| Data marks      | `data-*`                                                                                                                                                                         | Map and chart categories only.                                                                                                                                   |
| Scenery         | `scene-*`, `twin-*`, `fluid-*`, `sparkle-blue`, `loader-red`                                                                                                                     | Section backgrounds, Digital Twin swatches and 3D lights.                                                                                                        |
| Markdown        | `md-*` (CSS only)                                                                                                                                                                | Rendered podcast timelines and transcripts.                                                                                                                      |

All four near-brand reds (#C11111, #BB1212, #B41010, #FF1717) are now `accent` / `accent-hover`.

Nearest house token for each legacy neutral (for the redesign, not applied yet): `tone-50`/`tone-75`/`tone-100` ->
`sunken`; `tone-250`/`tone-300` -> `hairline`; `tone-350` ... `tone-650` -> `ink-muted`; `tone-750` ... `tone-970` ->
`panel` or `ink`.

## Font roles

Name a role, never a typeface: `font-display` (Oxanium: headings, labels, UI), `font-text` (Poppins: running text),
`font-title` (extended section titles), `font-button` (SCROLL / START / BACK), `font-menu` (phone menu), and the two
brand roles `font-brand` / `font-brand-text` (also the `.bilingual-font` / `.bilingual-font-poppins` classes).

Chinese (VIS-07): every role ends with the system CJK faces (PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto
Sans SC / CJK SC). Only the brand roles put the Source Han Sans CN subset first for Chinese, and only display strings
(the closed list in `src/constants/display-strings.ts`) may use them, because the subset holds just those characters
and a run must never mix two Chinese faces. Adding a display string: add it to that module, then
`UPDATE_CJK_SUBSET=1 npx vitest run test/cjk-display.test.mjs`. Mark the Chinese half of a bilingual label with
`<BilingualText text="mission 使命" />` (it sets `lang="zh-Hans"`).

`FONT_PALETTE` in `tokens.ts` is the owner's open choice: `'current'` (default: Xirod, Migrena Grotesque, TT Lakes
behind title, button, menu) or `'open'` (Oxanium for all three; Oxanium and Poppins are SIL OFL 1.1). Switching is that
one line.

## Type roles

Nine roles, each a Tailwind `text-<role>` utility with its line height: `caption`, `label`, `body-sm`, `body`, `lead`,
`title-sm`, `title`, `headline`, `display`. Sizes in px where the root is 16 px:

| Role     | 390 | 820  | 1180 | 1440 | 1920 | Line height |
| -------- | --- | ---- | ---- | ---- | ---- | ----------- |
| caption  | 12  | 12   | 12   | 12.3 | 13.8 | 1.5         |
| label    | 14  | 14   | 14.5 | 14.8 | 15.4 | 1.3         |
| body-sm  | 14  | 14   | 14   | 14.3 | 16.1 | 1.6         |
| body     | 16  | 16   | 16   | 16.3 | 18.4 | 1.7         |
| lead     | 20  | 20   | 20   | 20.4 | 23.1 | 1.4         |
| title-sm | 20  | 20.1 | 21.9 | 23.2 | 25.6 | 1.3         |
| title    | 28  | 30.3 | 34.8 | 38   | 44   | 1.2         |
| headline | 36  | 42.6 | 52.5 | 59.6 | 72   | 1.1         |
| display  | 44  | 49.2 | 70.8 | 86.4 | 110  | 1.0         |

`caption`, `body-sm`, `body` and `lead` derive from `--read-body` (RWD-09), so they equal the content pages'
`text-read-xs`, `text-read-sm`, `text-read` and `text-read-lg` (kept as aliases). Every fluid role tops out at no more
than 2.5x its floor, so zoom still enlarges text.

**The viewport-scaled rem.** The experience routes (`/` and the six sections) and the two Spectrum tool pages set the
root font size to `0.8333vw` above 768 px (`Style.tsx`, `DMStyle.tsx`, `INStyle.tsx`): 1rem is 6.8 px at 820, 12 px at
1440, 16 px at 1920. The roles are rem-bounded clamps, so on those routes they shrink with the window (a 12 px caption
becomes 5.1 px on an 820 px iPad). Rule: **use a type role on an experience section only in the same change that moves
that route to the fixed 16 px root (RWD-01)**. Until then, a section that must keep today's look keeps its rem sizes.
The content pages (`/news`, `/podcast`, `/about`) and phones (<= 768 px) already have a 16 px root: roles are safe
there today. `--u` (`1rem` today) is the layout unit for that switch: spacing that should keep tracking the window moves
to `calc(var(--u) * n)` first, then the root becomes 16 px and only `--u` is redefined on those routes.

## Space and grid

- 4 px base (`--space`). Tailwind's default spacing steps are that scale in rem (`p-1` = 0.25rem), so they are 4 px
  only on a 16 px root; the same rem rule applies.
- `.container`: 1280 px max content width, outer margins `clamp(16px, 4vw, 80px)`, centred.
- `.grid-12`: 12 columns, 24 px gutters. Place content with `col-span-*` / `col-start-*`.
- `max-w-measure` (680 px) for reading text; `max-w-grid` (1280 px).
- The grid is in px and vw, so it holds under the viewport-scaled rem. Content left edge: 16 px at 390, 32.8 at 820,
  47.2 at 1180, 80 at 1440 (57.6 px margin plus 22.4 px of centring), 320 at 1920. Every route's first text column and
  header logo should sit on that edge (VIS-02 acceptance 3); moving them is a layout change for the single tree
  (w1-tree, NAV-04), not done here.

## Motion

Durations, easings, staggers and distances are motion tokens, not described here: their source is
`src/motion/tokens.ts` (MOT-08; CSS `--dur-*` / `--ease-*`, Tailwind `duration-<token>` / `ease-token-<name>`), and
`docs/motion-inventory.md` is their guide.
