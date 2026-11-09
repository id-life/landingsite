export const SITE_URL = 'https://www.id.life';

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

/** True for a root-relative path or an absolute URL on this site. */
export const isInternalHref = (href?: string) =>
  Boolean(href && (href.startsWith('/') ? !href.startsWith('//') : href === SITE_URL || href.startsWith(`${SITE_URL}/`)));
