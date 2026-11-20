/**
 * CON-15 A7 for the one stylesheet our build does not compile: vaul (the Digital Twin's report drawer) injects its CSS
 * as a <style> when its module loads, including `[data-vaul-handle]:active,[data-vaul-handle]:hover{opacity:1}`. Its
 * :hover half moves inside @media (hover: hover), as every other :hover rule of the site (scripts/postcss-hover-media.js),
 * so a tap never leaves it stuck. Imported right after vaul, so the style is already in the document. (The drawer draws
 * no handle today; the rule is rewritten anyway so no :hover rule of the pages sits outside the media query.)
 */
const RULE = '[data-vaul-handle]:active,[data-vaul-handle]:hover{opacity:1}';
const MOVED = '[data-vaul-handle]:active{opacity:1}@media (hover:hover){[data-vaul-handle]:hover{opacity:1}}';

if (typeof document !== 'undefined') {
  for (const style of document.querySelectorAll('style')) {
    if (style.textContent?.includes(RULE)) style.textContent = style.textContent.replace(RULE, MOVED);
  }
}

export {};
