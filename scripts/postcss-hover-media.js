/**
 * PostCSS plugin (CON-15 A7): every :hover rule of the hand-written stylesheets sits inside @media (hover: hover), so a
 * touch screen never sticks in a hover state after a tap. Tailwind's own hover variants get the same through
 * future.hoverOnlyWhenSupported (tailwind.config.ts: (hover: hover) and (pointer: fine)); this covers the rest
 * (globals.css, the markdown styles, anything imported later), so no rule written by hand can miss it.
 *
 * A rule whose selector list mixes :hover with other selectors (`.a.active, .a:hover`) is split: the other selectors
 * keep the rule where it was, the :hover ones move into a copy inside the media query, right after it. A rule already
 * inside a media query that tests (hover: hover) is left alone. Nested rules (CSS nesting, which the browser reads
 * natively here) are handled the same way: the media query is nested in place.
 */
const HOVER = /:hover\b/;
const inHoverMedia = (node) => {
  for (let p = node.parent; p; p = p.parent)
    if (p.type === 'atrule' && p.name === 'media' && /hover\s*:\s*hover/.test(p.params)) return true;
  return false;
};

const hoverMedia = () => ({
  postcssPlugin: 'hover-media',
  Rule(rule, { AtRule }) {
    if (!HOVER.test(rule.selector) || inHoverMedia(rule)) return;
    const hover = rule.selectors.filter((s) => HOVER.test(s));
    const rest = rule.selectors.filter((s) => !HOVER.test(s));
    const moved = rule.clone({ selectors: hover });
    const media = new AtRule({ name: 'media', params: '(hover: hover)' });
    media.append(moved);
    rule.after(media);
    if (rest.length) rule.selectors = rest;
    else rule.remove();
  },
});
hoverMedia.postcss = true;

module.exports = hoverMedia;
