// No imports: this module is loaded as-is by the unit tests.

/** Drops what a browser drops before parsing a URL: tabs and newlines anywhere, C0 controls and spaces at the ends. */
function normalise(value: string) {
  const s = value.replace(/[\t\n\r]/g, '');
  let start = 0;
  let end = s.length;
  while (start < end && s.charCodeAt(start) <= 0x20) start += 1;
  while (end > start && s.charCodeAt(end - 1) <= 0x20) end -= 1;
  return s.slice(start, end);
}

/**
 * The href to use for a URL that came from the CMS or the API, or undefined when it must not be followed.
 * Accepts https:, http: and site-relative paths ('/news/1'). Rejects everything else: javascript:, data:,
 * vbscript:, blob:, protocol-relative '//host' and '/\host' (both leave the site), and anything unparsable.
 * Every API value that ends up in an href, window.open or location must go through this.
 */
export function safeHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const href = normalise(value);
  if (!href) return undefined;
  if (href.startsWith('/')) return /^\/[/\\]/.test(href) ? undefined : href;
  try {
    const { protocol } = new URL(href);
    return protocol === 'https:' || protocol === 'http:' ? href : undefined;
  } catch {
    return undefined;
  }
}
