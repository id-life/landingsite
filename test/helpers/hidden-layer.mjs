// The hidden layer of a page's raw HTML: every text that is in the page but not drawn, as runs "<technique>: <text>".
// "Not drawn", on the element or an ancestor: sr-only, the hidden attribute, inline display:none / visibility:hidden /
// zero height / 1px with opacity 0 or a clip path, Tailwind `hidden` (with no breakpoint override), `invisible`,
// `opacity-0`; plus <noscript> content, aria-label values (aria-only text), and the href of a link inside a hidden
// part ("<technique> link: <href>"). Scripts, styles and templates are not text. Text runs are whitespace-collapsed
// and entity-decoded. Used by test/hidden-layer.test.mjs; the owner's recorded copy was read with the same function.

const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

export const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, '&');

export const norm = (s) => s.replace(/\s+/g, ' ').trim();

function technique(attrs) {
  const cls = ` ${attrs.class ?? ''} `;
  const style = (attrs.style ?? '').replace(/\s+/g, '').toLowerCase();
  if (/ sr-only /.test(cls)) return 'sr-only';
  if ('hidden' in attrs) return 'hidden-attr';
  if (/display:none|visibility:hidden/.test(style)) return 'style-hidden';
  if (/height:0(px)?(;|$)/.test(style) && /overflow:hidden/.test(style)) return 'zero-height';
  if (/(width:1px|height:1px)/.test(style) && /(opacity:0(;|$)|clip-path)/.test(style)) return '1px-opacity0';
  if (/ (invisible|opacity-0) /.test(cls)) return 'tw-invisible';
  if (
    / hidden /.test(cls) &&
    !/\b[a-z0-9]+:(block|flex|grid|inline|inline-block|inline-flex|contents|table|table-row|table-cell)\b/.test(cls)
  ) {
    return 'tw-hidden';
  }
  return null;
}

const parseAttrs = (src) => {
  const a = {};
  for (const m of src.matchAll(/([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    a[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return a;
};

/** The hidden runs of a page, in document order. */
export function hiddenLayer(html) {
  const body = html
    .slice(Math.max(0, html.search(/<body\b/i)))
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<template\b[\s\S]*?<\/template>/gi, '');
  const out = [];
  const stack = [];
  const hiddenBy = () => {
    for (let k = stack.length - 1; k >= 0; k -= 1) if (stack[k].tech) return stack[k].tech;
    return null;
  };
  let i = 0;
  while (i < body.length) {
    const lt = body.indexOf('<', i);
    const t = norm(decode(body.slice(i, lt === -1 ? body.length : lt)));
    if (t && hiddenBy()) out.push(`${hiddenBy()}: ${t}`);
    if (lt === -1) break;
    if (body.startsWith('<!--', lt)) {
      const e = body.indexOf('-->', lt);
      i = e === -1 ? body.length : e + 3;
      continue;
    }
    const gt = body.indexOf('>', lt);
    if (gt === -1) break;
    const raw = body.slice(lt + 1, gt);
    i = gt + 1;
    if (raw.startsWith('/')) {
      const tag = raw.slice(1).trim().toLowerCase();
      for (let k = stack.length - 1; k >= 0; k -= 1) {
        if (stack[k].tag === tag) {
          stack.length = k;
          break;
        }
      }
      continue;
    }
    if (raw.startsWith('!')) continue;
    const m = raw.match(/^([a-zA-Z][a-zA-Z0-9-]*)([\s\S]*)$/);
    if (!m) continue;
    const tag = m[1].toLowerCase();
    const attrs = parseAttrs(m[2].replace(/\/$/, ''));
    if (attrs['aria-label']) out.push(`aria-label: ${norm(attrs['aria-label'])}`);
    if (tag === 'a' && attrs.href && hiddenBy()) out.push(`${hiddenBy()} link: ${attrs.href}`);
    const tech = tag === 'noscript' ? 'noscript' : technique(attrs);
    if (!VOID.has(tag) && !raw.endsWith('/')) stack.push({ tag, tech });
  }
  return out;
}

/** The text of a run, without its technique. */
export const runText = (run) => norm(run.replace(/^[a-z0-9-]+( link)?: /, ''));
