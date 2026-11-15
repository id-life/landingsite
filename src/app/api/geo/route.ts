import { NextRequest } from 'next/server';

// Node.js runtime (Next 16 deprecates the Edge Runtime; on Vercel it runs as a Fluid compute function).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The visitor's country for the consent module (DATA-01), from Vercel's x-vercel-ip-country header. Nothing is
 * stored; the answer is private and never cached. Outside production builds an idl_region cookie overrides it, so
 * tests can exercise the opt-in (e.g. DE) and opt-out (e.g. SG) paths. An empty answer counts as opt-in.
 */
export function GET(request: NextRequest) {
  const override = process.env.NEXT_PUBLIC_DEPLOY_ENV !== 'production' ? request.cookies.get('idl_region')?.value : undefined;
  const raw = override ?? request.headers.get('x-vercel-ip-country') ?? '';
  const country = /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : '';
  return new Response(JSON.stringify({ country }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' },
  });
}
