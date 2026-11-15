import { onCLS, onFCP, onINP, onLCP, onTTFB, type MetricWithAttribution } from 'web-vitals/attribution';
import { track } from './track';

/**
 * The single Core Web Vitals stream (PERF-08 / DATA-vitals) while Vercel Speed Insights is off: one web_vital event
 * per report with the delta, the rating, the navigation type and the element or interaction responsible
 * (web-vitals attribution build). No FID (retired by Chrome), no event_label, no non_interaction.
 * Values: CLS x 1000, everything else in milliseconds, rounded. Sum metric_delta by metric_id for totals. Each hit
 * carries the landing URL as page_location and the landing section as section_id, so a vital reported after a section
 * change is not filed under the section the visitor moved to.
 */
function debugTarget(metric: MetricWithAttribution) {
  switch (metric.name) {
    case 'LCP':
      return metric.attribution.target;
    case 'INP':
      return metric.attribution.interactionTarget;
    case 'CLS':
      return metric.attribution.largestShiftTarget;
    default:
      return undefined;
  }
}

function landingPath(href: string) {
  try {
    return new URL(href).pathname;
  } catch {
    return window.location.pathname;
  }
}

function send(metric: MetricWithAttribution) {
  const scale = metric.name === 'CLS' ? 1000 : 1;
  const target = debugTarget(metric);
  // The vitals belong to the document that was loaded, not to the section the URL shows when they are reported:
  // page_location and section_id both name the landing URL.
  const landing = window.__landing?.href ?? window.location.href;
  track(
    'web_vital',
    {
      page_location: landing,
      metric_name: metric.name,
      metric_value: Math.round(metric.value * scale),
      metric_delta: Math.round(metric.delta * scale),
      metric_rating: metric.rating,
      metric_id: metric.id,
      navigation_type: metric.navigationType,
      // LCP, INP and CLS always carry a target; '(none)' when there was nothing to attribute (e.g. no layout shift).
      debug_target: target ?? (['LCP', 'INP', 'CLS'].includes(metric.name) ? '(none)' : undefined),
      ...(metric.name === 'INP'
        ? { interaction_type: metric.attribution.interactionType, load_state: metric.attribution.loadState }
        : {}),
    },
    { at: landingPath(landing) },
  );
}

let started = false;
export function reportWebVitals() {
  if (started) return;
  started = true;
  onCLS(send);
  onFCP(send);
  onINP(send);
  onLCP(send);
  onTTFB(send);
}
