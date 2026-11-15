import { handleSubscribe } from './handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(request: Request) {
  return handleSubscribe(request);
}
