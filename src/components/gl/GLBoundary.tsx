'use client';

import { PropsWithChildren, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { probeWebGL, reportExperienceError } from '@/lib/analytics/experience';

/**
 * Error boundary of every WebGL canvas (DATA-06). It keeps the fallback the canvases always showed and now reports
 * the error: to Sentry (area=webgl, canvas) and as experience_error webgl_render. It also runs the one-time WebGL
 * capability probe, which reports webgl_unavailable (the fallback UX itself belongs to ENG-02).
 */
export default function GLBoundary({ canvas, children }: PropsWithChildren<{ canvas: string }>) {
  useEffect(() => void probeWebGL(), []);
  return (
    <ErrorBoundary
      fallback={<div>Sorry WebGL loading error!</div>}
      onError={(error) => reportExperienceError('webgl_render', canvas, error)}
    >
      {children}
    </ErrorBoundary>
  );
}
