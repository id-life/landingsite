# Device support matrix

What www.id.life promises on which devices, and how each promise is checked (RWD-08). A change that breaks a tier-1
class is a release blocker; a tier-2 break is a bug to fix in the next release.

## Tier 1: must be flawless

Current Safari, Chrome, Edge and Firefox (latest two major versions).

| Class                       | Viewports (CSS px)                                        | Input                             | Notes                                                        |
| --------------------------- | --------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------ |
| iPhone, portrait            | 390x844, 393x852, 430x932                                 | touch                             | Safari toolbars expanded and collapsed; safe areas           |
| iPhone, landscape           | 844x390, 932x430                                          | touch                             | the phone experience, never the laptop layout at a 7 px root |
| Android phone (Pixel class) | 412x915                                                   | touch                             | Chrome                                                       |
| iPad mini, portrait         | 744x1133                                                  | touch                             |                                                              |
| iPad Air                    | 820x1180 and 1180x820                                     | touch (pencil, keyboard optional) |                                                              |
| iPad Pro 12.9               | 1024x1366 and 1366x1024                                   | touch                             |                                                              |
| Laptop                      | 1280x720, 1366x641 (short, browser chrome open), 1440x900 | mouse, trackpad, keyboard         |                                                              |
| Desktop                     | 1920x1080, 2560x1440                                      | mouse, keyboard                   |                                                              |

What "flawless" means, at every tier-1 size:

- no visible text under 12 px; navigation and UI labels 14 px or larger; reading text 16 px or larger on phones and
  tablets;
- nothing cut by the viewport, no horizontal page scroll, no text overlapping the fixed UI (header, arrows, player,
  footer);
- every control hit within 21 px of its centre on coarse pointers (a 44 px target), and reachable by keyboard with a
  visible focus ring;
- the section experience navigates by wheel, keyboard, touch and the menu, and rotating a device keeps the URL, the
  section and the loaded scenes;
- axe: no serious or critical violation, no colour-contrast failure.

## Tier 2: must be usable

| Class                 | Viewports (CSS px)                                       | Notes                                                                   |
| --------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| Small phones          | 320x568, 360x740                                         | content readable, every control reachable; decoration may be simplified |
| Foldables             | 344x882 (folded), 600x900 (unfolded, portrait)           |                                                                         |
| Ultrawide             | 3440x1440 (21:9)                                         | content stays within the 1280 px grid; no stretched type                |
| 200 % browser zoom    | 1440x900 at 200 % (720x450 CSS px, device pixel ratio 2) | text reflows, nothing clipped or overlapping                            |
| WeChat in-app browser | iOS and Android                                          | the site loads and navigates; video and sharing work                    |

"Usable" means: every page loads, all text can be read and every control used, no content is lost; layout may be
plainer than tier 1.

## How it is checked

The end-to-end suite lives outside this repository (`idlife-audit/tests` in the maintainers' scripts repository; see
CLAUDE.md, "Testing safely").

| Check                                                     | Where                                           | Classes covered today                                                   |
| --------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| Responsive sweep (no overflow, no error, content visible) | `sweep.laptop.spec.mjs`                         | 18 sizes x 4 routes, including 768x1024, 844x390 and 3440x1440          |
| Type floor and clipping at tier-1 sizes                   | `wave1-structure.all.spec.mjs` ("tier-1 sizes") | 744x1133, 1180x820, 1366x641, 1920x1080                                 |
| Device projects                                           | `playwright.config.mjs`                         | laptop 1440x900, phone 390x844, tablet 820x1180, WebKit iPhone and iPad |
| Touch hit areas                                           | `wave1-structure.all.spec.mjs` (21 px probe)    | 820x1180, 1180x820, 1024x1366, 844x390, phone                           |
| Accessibility                                             | `a11y.lp.spec.mjs`, axe                         | laptop, phone                                                           |

Still to add to the suite (it has a single writer; requests go to it): one Playwright project per tier-1 class
(744x1133, 1024x1366, 1366x1024 and 1180x820 touch; 844x390 phone landscape; 1366x641 and 1280x720 mouse; 1920x1080;
2560x1440), a layout-assertion spec run on all of them (minimum font size, viewport clipping, overlap with the fixed
UI, coarse-pointer hit areas), screenshot baselines of settled section states (canvases masked) at 390x844, 820x1180,
1180x820, 1440x900 and 1920x1080, and tier-2 projects for 320x568, 3440x1440 and 200 % zoom.

## Real-device pass (monthly, and before a release that changes layout or navigation)

On a physical iPhone and iPad (current iOS, Safari), and once in WeChat:

1. Load `/` on a cold cache over mobile data: the first screen paints, the loader clears, the hero animates.
2. Walk all seven sections by swipe, then by the menu; each lands on its section and the URL follows.
3. Safari toolbars: scroll so they collapse and expand; nothing jumps, nothing hides behind them.
4. Safe areas: in landscape, no control sits under the notch or the home indicator.
5. Rotate on Portfolio and on Connect: same URL, same section, no loader, the menu still works.
6. Open `/news`, an article, `/podcast` and an episode; play audio; reading text is comfortable without zoom.
7. Pinch-zoom an article to 200 %: text reflows.
8. WeChat: open a shared link, walk two sections, open an article, share it back.

Record the date, devices, OS versions and any defect in the release notes.
