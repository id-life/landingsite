import { onCLS, onFCP, onINP, onLCP, onTTFB, type MetricWithAttribution } from 'web-vitals/attribution';
import { track } from './track';

/**
 * The single Core Web Vitals stream (PERF-08 / DATA-vitals) while Vercel Speed Insights is off: one web_vital event
 * per report with the delta, the rating, the navigation type and the element or interaction responsible
 * (web-vitals attribution build). No FID (retired by Chrome), no event_label, no non_interaction.
 * Values: CLS x 1000, everything else in milliseconds, rounded. Sum metric_delta by metric_id for totals.
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

function send(metric: MetricWithAttribution) {
  const scale = metric.name === 'CLS' ? 1000 : 1;
  track('web_vital', {
    metric_name: metric.name,
    metric_value: Math.round(metric.value * scale),
    metric_delta: Math.round(metric.delta * scale),
    metric_rating: metric.rating,
    metric_id: metric.id,
    navigation_type: metric.navigationType,
    debug_target: debugTarget(metric),
    ...(metric.name === 'INP'
      ? { interaction_type: metric.attribution.interactionType, load_state: metric.attribution.loadState }
      : {}),
  });
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
