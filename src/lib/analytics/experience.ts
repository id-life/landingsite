import { reportError } from '@/lib/report';
import { HERO_MODEL_URL } from '@/components/gl/heroAssetUrls';
import { EXPERIENCE_ERROR_KINDS } from './events';
import { advanceStage } from './stage';
import { track } from './track';

/**
 * Health of the 3D experience (DATA-06): one experience_ready per document with numeric timings, and one
 * experience_error per kind (asset_failed once per file). WebGL failures also go to Sentry, tagged area=webgl.
 */
type Kind = (typeof EXPERIENCE_ERROR_KINDS)[number];

/** warm: the hero model came from the HTTP cache (transferSize 0); cold: from the network. */
function heroCacheState(): 'warm' | 'cold' | 'unknown' {
  try {
    const entry = performance.getEntriesByType('resource').find((e) => e.name.includes(HERO_MODEL_URL)) as
      | PerformanceResourceTiming
      | undefined;
    if (!entry || !entry.decodedBodySize) return 'unknown';
    return entry.transferSize === 0 ? 'warm' : 'cold';
  } catch {
    return 'unknown';
  }
}

export function reportExperienceReady({ failOpen, mountedAt }: { failOpen: boolean; mountedAt: number }) {
  const loadMs = Math.round(performance.now());
  track(
    'experience_ready',
    {
      load_ms: loadMs,
      assets_ms: Math.max(0, Math.round(loadMs - mountedAt)),
      layout: window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop',
      cache_state: heroCacheState(),
      fail_open: failOpen ? 1 : 0,
    },
    { once: 'experience_ready' },
  );
  try {
    if (!performance.getEntriesByName('experience_ready').length) performance.mark('experience_ready');
  } catch {
    // User Timing unavailable: the event above still carries the timing.
  }
  advanceStage('ready');
  window.dispatchEvent(new Event('idl:experience_ready'));
}

const WEBGL_KINDS: Kind[] = ['webgl_unavailable', 'webgl_context_lost', 'webgl_render'];
const sentToSentry = new Set<string>();

export function reportExperienceError(kind: Kind, detail?: string, error?: unknown) {
  track('experience_error', detail ? { kind, detail } : { kind }, { once: `experience_error:${kind}` });
  if (WEBGL_KINDS.includes(kind) && !sentToSentry.has(kind)) {
    sentToSentry.add(kind);
    reportError(error ?? new Error(`WebGL: ${kind}`), { area: 'webgl', kind, canvas: detail });
  }
}

const failedAssets = new Set<string>();
export function reportAssetFailed(url: string) {
  if (!url || failedAssets.has(url)) return;
  failedAssets.add(url);
  const file = url.split('?')[0].split('/').pop() || url;
  track('experience_error', { kind: 'asset_failed', detail: file }, { once: `asset_failed:${url}` });
}

let probed: boolean | null = null;
/** Whether this browser can create a WebGL context; a failure is reported once (webgl_unavailable). */
export function probeWebGL() {
  if (probed !== null || typeof document === 'undefined') return probed ?? true;
  try {
    const canvas = document.createElement('canvas');
    probed = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    probed = false;
  }
  if (!probed) reportExperienceError('webgl_unavailable');
  return probed;
}

/**
 * Listen for context loss on a canvas created by React Three Fiber (pass to <Canvas onCreated>). A lost context
 * throws nothing, so without these listeners it went unrecorded.
 */
export function watchWebGLContext(canvasName: string) {
  return ({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
    const el = gl.domElement;
    el.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      reportExperienceError('webgl_context_lost', canvasName);
    });
    el.addEventListener('webglcontextrestored', () => reportExperienceError('webgl_context_restored', canvasName));
  };
}
