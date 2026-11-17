# Motion inventory (MOT-08)

Every animation duration, ease and stagger comes from `src/motion/tokens.ts`. This file records the codemod that got
there and the rules that keep it so. Lint (`no-restricted-syntax` in `eslint.config.mjs`) rejects, outside
`src/motion`:

- a numeric `duration:` (use `DURATION.<token>`, or `beats(n)` inside a scrubbed timeline);
- a string `ease:` (use `EASE.<token>`);
- `duration`, `ease` or `stagger` among a `gsap.timeline()`'s own vars (GSAP ignores them there: use `defaults`).

## The tokens

| token               | value                              | used for                                                                         |
| ------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| `DURATION.instant`  | 0                                  | reduced motion, state that must not animate                                      |
| `DURATION.micro`    | 0.12 s                             | per-glyph and per-icon changes                                                   |
| `DURATION.fast`     | 0.2 s                              | hover and press feedback, small fades, the fixed UI reveal                       |
| `DURATION.base`     | 0.3 s                              | default for UI tweens (`gsap.defaults`)                                          |
| `DURATION.moderate` | 0.45 s                             | panels, dialogs, menus, footers                                                  |
| `DURATION.section`  | 0.8 s                              | one section of the experience to the next                                        |
| `DURATION.camera`   | 1 s                                | camera moves, first-visit intros, map zooms                                      |
| `PAGE_STEP`         | 0.25 s, out                        | the phone inner-page step (Portfolio, Spectrum)                                  |
| `EASE.out`          | cubic-bezier(0.22, 1, 0.36, 1)     | entrances, settles, most UI                                                      |
| `EASE.inOut`        | cubic-bezier(0.65, 0, 0.35, 1)     | movement from one place to another                                               |
| `EASE.in`           | cubic-bezier(0.64, 0, 0.78, 0)     | exits                                                                            |
| `EASE.linear`       | linear                             | progress bars, loops, scrubbed camera paths                                      |
| `STAGGER`           | glyph 0.02, item 0.04, block 0.1 s |                                                                                  |
| `DISTANCE`          | 8 / 16 / 24 / 48 px                | entrance travel                                                                  |
| `MAX_TILT`          | 8 degrees                          | entrance rotation on X or Y                                                      |
| `LOOP.ripple`       | 2 s                                | the SCROLL / START ripple loop                                                   |
| `beats(n)`          | n                                  | lengths inside a scrubbed timeline (shares of the section's scroll, not seconds) |

The same values reach CSS as `--dur-*` / `--ease-*` on `:root` (Tailwind `duration-<token>`, `ease-token-<name>`) and
motion as `MOTION.*` (`src/motion/presets.ts`). GSAP plays the eases under their token names (`gsap.registerEase` in
`src/motion/gsap.ts`), and every vars object can also take the `EASE.*` functions directly; content pages do that,
since they must not load GSAP plugins or the experience's GSAP setup.

## Mapping used by the codemod

Literal seconds were moved to the nearest token by role: 0.05 to micro; 0.2, 0.21 and 0.25 to fast; 0.3 to base; 0.4,
0.5 and 0.6 to moderate; 0.8 to section (phone section entrances); 1, 1.2 and 1.5 to camera; 2 (ripple loops) to
`LOOP.ripple`. Eases: power1-4.out, expo.out and easeOut to `out`; power2.inOut and easeInOut to `inOut`; power2.in and
power4.in to `in`; none and linear to `linear`. Lengths inside scrubbed timelines (Portfolio, Insights, Spectrum,
Engagement, Twin, Connect and the section theme timelines) became `beats()` with their old values, so the share of
scroll each tween takes is unchanged; those timelines set `defaults: { duration: beats(0.5) }` where they relied on
GSAP's old 0.5 s default.

Files changed by the codemod (116 duration literals in 41 files, 79 ease literals in 37 files at the start):
src/app/insights/Insights.tsx, src/app/portfolio/\_components/{Portfolio,MobilePortfolio}.tsx,
src/app/news/\_components/NewsNavDialog.tsx, src/app/podcast/\_components/PodcastNavDialog.tsx,
src/app/twin/{Twin.tsx,\_components/SwitchModel.tsx,\_components/mobile/SwitchModel.tsx}, src/constants/engagement.tsx,
src/constants/scroll-config.ts, src/utils/gsap-config.ts, src/components/engagement/{Engagement,WorldMap,WorldMapBookDot,
WorldMapSponsorDot,MobileWorldMapBookDot,MobileWorldMapSponsorDot,WorldMapDotComponents,VideoWithPoster}.tsx,
src/components/gl/{MobileConnectGL,MobileVisionGL,ProgressLoader,ConnectGL}.tsx,
src/components/gl/model/vision/{DragonModel,MobileDragonModel,CenterLogo}.tsx, src/components/layout/footer/{Footer,
SubscribeSheet,ContactPanel}.tsx, src/components/compare/{compare,sparkles}.tsx,
src/components/spectrum/{Spectrum,SpectrumItem,MobileSpectrum}.tsx, src/components/common/{ScrollButton,
StartButton,VerticalCarousel}.tsx, src/components/character-relation/CharacterRelation.tsx,
src/components/audio/AudioTitle.tsx, src/components/twin/Loader.tsx, src/components/dialog/MobileNavDialog.tsx,
src/hooks/anim/{useHomeAnimations,useMobileHomeAnimations,useMobileEngagementAnim,useMobileInsightsAnim,
usePortfolioItemAnimation}.tsx, src/hooks/connectGL/useConnectCrossAnimations.ts,
src/hooks/engagement/useEngagementJumpTo.tsx, src/hooks/useMobileThemeTransition.ts.

## Fixed along the way

- The laptop fixed UI reveal (`DragonModel`): `gsap.timeline({ duration: 0.21 })` was ignored and the two default
  0.5 s fades ran in sequence (1.21 s). They now fade together in `DURATION.fast`. The phone version
  (`useMobileHomeAnimations`) had duration, ease and stagger among the timeline's vars the same way.
- Entrance tilts: Portfolio and Spectrum rose with 45 / 15 degrees on X / Y; now at most `MAX_TILT` with 16-24 px of
  travel. The Connect panel entrance tilted -30 degrees on X; now `-MAX_TILT`.
- The phone inner-page step was built three ways (CSS 500 ms in MobilePortfolio, motion 200 ms in MobileSpectrum);
  both now play `PAGE_STEP`. (The phone Insights section has one page, so no Swiper step is involved.)
- The three phone menus (experience, /news, /podcast) share one choreography, `playMenuItems` in `src/motion/menu.ts`.
- `createPage2CrossAnim` and `createPage3CrossAnim` in `useConnectCrossAnimations` were never called; deleted.

## Not converted

- `src/components/gl/model/vision/intro.ts` keeps the hero intro's own named constants (`flyInSeconds`,
  `flyInEase: 'expo.out'`); they are the hero look's (w1-3d) and are not `duration:` / `ease:` literals.
- Tailwind `duration-300` style classes in components: the utilities now exist (`duration-base` and so on); converting
  class names is part of the single responsive tree (w1-tree), which rewrites those components anyway.
- `VerticalCarousel`'s `duration` / `transition` props keep their numeric defaults (props, not tween vars).
