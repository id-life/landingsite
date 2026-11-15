import { NextResponse, type NextRequest } from 'next/server';

/**
 * The Long Talk show used to live at /podcast?c=lt. It has its own path now, so /podcast can be a static page
 * cached at the edge: the old address answers 308 to /podcast/long-talk, without the `c` parameter (a
 * next.config redirect would carry the query over) and keeping any other parameter (utm_*).
 * The matcher limits this to that one URL; no other request runs middleware.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname !== '/podcast' || url.searchParams.get('c') !== 'lt') return NextResponse.next();
  url.pathname = '/podcast/long-talk';
  url.searchParams.delete('c');
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [{ source: '/podcast', has: [{ type: 'query', key: 'c', value: 'lt' }] }],
};
