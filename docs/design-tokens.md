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

**The fixed root and the layout unit (RWD-01).** Every route has a fixed root of 100 % (16 px, or the visitor's
setting). The desktop experience was drawn in rem under a 0.8333vw root; that rem is now `--u`: 0.8333vw on the desktop
experience (`Style.tsx`), 1rem everywhere else (tokens.css). `scripts/postcss-layout-unit.js` rewrites every rem length
in the compiled CSS: in `font-size` to `max(calc(var(--t) * n), 0.75rem)`, in `line-height` to `calc(var(--t) * n)`,
elsewhere to `calc(var(--u) * n)`, where `--t` = `max(var(--u), 0.75rem)` (globals.css). So layout written in rem scales
with the window as before, text never resolves under 12 px, and from 1440 px up (where `--u` >= 12 px) nothing moved
except 9-10.5 px text rising to 12 px. Below 1440 px text keeps its 1440 size while boxes keep scaling: a section's
tablet layout (RWD-02) absorbs that. Custom properties are not rewritten, so the nine roles stay real rem. Values CSS
never sees (GSAP tweens, inline styles) use `u(n)` from `src/utils/layout-unit.ts`. The Spectrum tool pages have no
viewport unit: they draw at 16 px at every width.

## Space and grid

- 4 px base (`--space`). Tailwind's default spacing steps are that scale in rem (`p-1` = 0.25rem), so they are 4 px
  only on a 16 px root; the same rem rule applies.
- `.container`: 1280 px max content width, outer margins `clamp(16px, 4vw, 80px)`, centred.
- `.grid-12`: 12 columns, 24 px gutters. Place content with `col-span-*` / `col-start-*`.
- `max-w-measure` (680 px) for reading text; `max-w-grid` (1280 px).
- The grid is in px and vw, so it is independent of `--u`. Content left edge: 16 px at 390, 32.8 at 820,
  47.2 at 1180, 80 at 1440 (57.6 px margin plus 22.4 px of centring), 320 at 1920. Every route's first text column and
  header logo should sit on that edge (VIS-02 acceptance 3); moving them is a layout change for the single tree
  (w1-tree, NAV-04), not done here.

## Motion

Durations, easings, staggers and distances are motion tokens, not described here: their source is
`src/motion/tokens.ts` (MOT-08; CSS `--dur-*` / `--ease-*`, Tailwind `duration-<token>` / `ease-token-<name>`), and
`docs/motion-inventory.md` is their guide.

## Fonts and the build

next/font names each font's class after a hash of its CSS, which for next/font/google includes the font files
downloaded from Google during the build. Google does not always serve the same bytes (two Oxanium latin files of
12,336 and 12,340 bytes were served minutes apart on 2026-11-15), and webpack's persistent cache keeps the client and
the server compiler's font results separately without treating the download as an input. When one compiler reuses
its cached result and the other downloads again, the server HTML names a class (for example `__variable_75844e`)
that the client stylesheet does not define, and every font role falls back. Restoring only `.next/cache`, as Vercel
does, is enough to cause it. `npm run build` therefore clears `.next/cache/webpack` first and fails afterwards if any
server bundle or prerendered page names a font class no client stylesheet defines (`scripts/next-font-guard.mjs`;
it reads the server output, because the deployment host has no prerendered `.html` where a local build has it). Self-hosting Oxanium and Poppins with
next/font/local (both SIL OFL 1.1) would remove the download, and with it the cause.

On a first paint, each role must resolve to its face: `font-display` and `.bilingual-font` to Oxanium,
`font-text` and `body` to Poppins, `font-title` to xirod, `font-button` to migrena, `font-menu` to ttLakes (with
`FONT_PALETTE = 'current'`). A computed `font-family` starting with `ui-sans-serif`, `-apple-system` or the parent's
face on those elements means the classes did not match.
