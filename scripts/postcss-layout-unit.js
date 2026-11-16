/**
 * PostCSS plugin (RWD-01): every rem length in the compiled stylesheets becomes the layout unit,
 * `2.5rem` -> `calc(var(--u) * 2.5)`. Custom properties are left alone, so the type roles and the reading size
 * (--type-*, --read-body in tokens.css) stay in rem and keep their floors.
 *
 * Why: the desktop experience was drawn in rem with a root of 0.8333vw, so text, spacing and boxes all scaled with
 * the window, and text fell to 5-10 px on tablets and laptops. The root is now a fixed 100 % (16 px, the visitor's
 * setting). --u is 0.8333vw on the desktop experience and 1rem everywhere else (src/app/(home)/_components/Style.tsx),
 * so layout written in rem draws exactly as before while the type roles, in real rem, hold their 12/14/16 px floors.
 * Sections move their text from the scaled sizes to the roles one at a time (docs/design-tokens.md).
 *
 * Text follows the type unit --t (globals.css): in font-size and line-height, rem becomes `calc(var(--t) * n)`, with
 * no floor. --t is the layout unit itself wherever the owner's original sizes apply (the desktop experience from
 * 1200 px, the phone deck, the content pages), so a size class written as in the original draws exactly the
 * original's size; only in the tablet tiers (the desktop experience below 1200 px) is --t fixed at 12 px, the
 * original's size at 1440 px (the owner's rule on font sizes, 2026-11-16: "don't fix if not broken").
 *
 * Inline styles and GSAP values are not CSS: they use u() from src/utils/layout-unit.ts.
 */
const REM = /(-?(?:\d+\.?\d*|\.\d+))rem\b/g;

const layoutUnit = () => ({
  postcssPlugin: 'layout-unit',
  Declaration(decl) {
    if (decl.prop.startsWith('--') || !decl.value.includes('rem')) return;
    // PostCSS visits a declaration again after it changes; a converted value is done.
    if (decl.value.includes('var(--t)') || decl.value.includes('var(--u)')) return;
    let next;
    if (decl.prop === 'font-size' || decl.prop === 'line-height')
      next = decl.value.replace(REM, (_, n) => `calc(var(--t) * ${n})`);
    else next = decl.value.replace(REM, (_, n) => `calc(var(--u) * ${n})`);
    if (next !== decl.value) decl.value = next;
  },
});
layoutUnit.postcss = true;

module.exports = layoutUnit;
