'use client';

import { atom, useAtomValue } from 'jotai';

/**
 * GPU quality tier of this device and the budget each tier gets (MOT-06). One probe per page, no network: the
 * capability probe in HeroPreloads records WebGL2, float render targets and the renderer string while the HTML is
 * parsed (window.__idlGpu); this module maps them, with Save-Data, device memory, cores and the pointer type, to:
 * - low:  a software renderer (SwiftShader, llvmpipe, ...), no float render target, Save-Data, <= 2 GB or <= 2 cores;
 * - high: a fine pointer (laptop or desktop) with WebGL2;
 * - mid:  everything else (phones and tablets).
 * Screen size is deliberately not an input: an iPad mini and an iPad Air with the same capabilities get the same tier.
 * drei's useDetectGPU was not used: it downloads benchmark tables from a CDN at runtime (a third-party request the
 * CSP does not allow, for a ranking these inputs already give).
 *
 * The budgets are documented with measured numbers in docs/device-tiers.md.
 */
export type GpuTier = 'low' | 'mid' | 'high';

export type TierBudget = {
  /** Highest device pixel ratio the 3D canvases render at (PerformanceMonitor may step it down to 1). */
  dprCap: number;
  /** MSAA samples of the hero's post-processing composer (the canvas itself has no antialiasing). */
  multisampling: number;
  /** MeshTransmissionMaterial samples of the glass dragon (one buffer size on every tier). */
  transmissionSamples: number;
  /** Simulation grid of the pointer fluid, or null for no fluid. */
  fluidSimRes: number | null;
  powerPreference: WebGLPowerPreference;
};

export const TIER_BUDGETS: Record<GpuTier, TierBudget> = {
  low: { dprCap: 1, multisampling: 0, transmissionSamples: 4, fluidSimRes: null, powerPreference: 'default' },
  mid: { dprCap: 1.5, multisampling: 0, transmissionSamples: 6, fluidSimRes: 64, powerPreference: 'default' },
  high: { dprCap: 2, multisampling: 4, transmissionSamples: 10, fluidSimRes: 128, powerPreference: 'high-performance' },
};

/** Render-target size of the glass dragon's transmission pass, the same on both trees (VIS-03). */
export const TRANSMISSION_RESOLUTION = 256;

type GpuSignals = { gl2: boolean; float: boolean; renderer: string };

function probeGpu(): GpuSignals {
  const early = (window as Window & { __idlGpu?: GpuSignals }).__idlGpu;
  if (early) return early;
  // A client-side navigation skipped the inline probe: probe here, once.
  const signals: GpuSignals = { gl2: false, float: false, renderer: '' };
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    const gl = gl2 ?? canvas.getContext('webgl');
    if (!gl) return signals;
    signals.gl2 = Boolean(gl2);
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    signals.renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '');
    signals.float = gl2
      ? Boolean(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))
      : Boolean(gl.getExtension('OES_texture_half_float') && gl.getExtension('EXT_color_buffer_half_float'));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    // No WebGL: the experience is in its static mode and never asks for a tier.
  }
  return signals;
}

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

export function classifyGpu(
  signals: GpuSignals,
  device: { saveData: boolean; memory?: number; cores?: number; finePointer: boolean },
): GpuTier {
  if (SOFTWARE.test(signals.renderer) || !signals.float || device.saveData) return 'low';
  if ((device.memory !== undefined && device.memory <= 2) || (device.cores !== undefined && device.cores <= 2)) return 'low';
  return device.finePointer && signals.gl2 ? 'high' : 'mid';
}

let detected: GpuTier | null = null;
let caveat: boolean | undefined;

/**
 * Tags for WebGL error reports (reportError, area=webgl): the tier and failIfMajorPerformanceCaveat. Passed with each
 * report rather than set globally, so the lazily loaded Sentry SDK (src/lib/sentry-client.ts) is never loaded early.
 */
export function gpuReportTags() {
  return detected ? { gpu_tier: detected, webgl_caveat: caveat } : {};
}

/** This device's tier: computed once; GA4's experience_ready carries it, WebGL error reports tag it. */
export function detectGpuTier(): GpuTier {
  if (detected) return detected;
  if (typeof window === 'undefined') return 'mid';
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  detected = classifyGpu(probeGpu(), {
    saveData: Boolean(nav.connection?.saveData),
    memory: nav.deviceMemory,
    cores: nav.hardwareConcurrency || undefined,
    finePointer: window.matchMedia('(pointer: fine)').matches,
  });
  // failIfMajorPerformanceCaveat is recorded, never acted on: sending software-rendered devices to the static mode
  // would remove the 3D from devices that run it today (a PERF and owner decision).
  try {
    const gl = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
    caveat = !gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    // Tag only.
  }
  return detected;
}

export const gpuTierAtom = atom<GpuTier>(() => detectGpuTier());

export function useGpuTier() {
  const tier = useAtomValue(gpuTierAtom);
  return { tier, budget: TIER_BUDGETS[tier] };
}
