/**
 * Browser half of the optional Turnstile check (ENG-09). With NEXT_PUBLIC_TURNSTILE_SITE_KEY set (an Invisible-mode
 * widget created by the owner in Cloudflare), the first submit loads Cloudflare's script, runs the invisible challenge
 * and returns its token; without a key it returns '' and loads nothing. Never throws.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
};

let loading: Promise<Turnstile | null> | null = null;
function loadTurnstile() {
  loading ??= new Promise((resolve) => {
    const w = window as Window & { turnstile?: Turnstile };
    if (w.turnstile) return resolve(w.turnstile);
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve(w.turnstile ?? null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return loading;
}

export async function getTurnstileToken(timeoutMs = 5000): Promise<string> {
  if (!SITE_KEY || typeof window === 'undefined') return '';
  const turnstile = await loadTurnstile();
  if (!turnstile) return '';
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:0;right:0;';
    document.body.appendChild(el);
    const done = (token: string) => {
      clearTimeout(timer);
      el.remove();
      resolve(token);
    };
    const timer = setTimeout(() => done(''), timeoutMs);
    try {
      const id = turnstile.render(el, {
        sitekey: SITE_KEY,
        execution: 'execute',
        callback: (token: string) => done(token),
        'error-callback': () => done(''),
      });
      turnstile.execute(id);
    } catch {
      done('');
    }
  });
}
