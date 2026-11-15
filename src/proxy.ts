import { NextResponse, type NextRequest } from 'next/server';

/**
 * Permanent redirects that need the query string or a computed path (ENG-07), so a next.config redirect cannot
 * express them. Each keeps any other parameter (utm_*):
 * - /podcast?c=lt: the Long Talk show used to live there. It has its own path now, so /podcast can be a static page
 *   cached at the edge: the old address answers 308 to /podcast/long-talk, without the `c` parameter (a next.config
 *   redirect would carry the query over).
 * - /podcast?c=<anything else>: one URL per page, so 308 to /podcast without the parameter.
 * - /podcast/056: one URL per episode, so 308 to the id without leading zeros (/podcast/56).
 * The matcher limits this to those URLs; no other request runs the proxy (Next 16's name for middleware).
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === '/podcast' && url.searchParams.has('c')) {
    if (url.searchParams.get('c') === 'lt') url.pathname = '/podcast/long-talk';
    url.searchParams.delete('c');
    return NextResponse.redirect(url, 308);
  }
  const zeros = /^\/podcast\/0+(\d+)$/.exec(url.pathname);
  if (zeros) {
    url.pathname = `/podcast/${zeros[1]}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [{ source: '/podcast', has: [{ type: 'query', key: 'c' }] }, '/podcast/:id(0\\d+)'],
};
