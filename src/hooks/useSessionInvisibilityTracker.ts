'use client';

import { useEffect, useRef } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { GA_EVENT_NAMES } from '@/constants/ga';

interface SessionInvisibleData {
  invisibleTimeMs: number;
  sessionTimeMs: number;
  invisibilityPct: number;
  visibilityChanges: number;
}

class SessionInvisibilityTracker {
  private sessionStartTime: number;
  private invisibleStartTime: number | null;
  private totalInvisibleTime: number;
  private visibilityChanges: number;
  private hasSentEvent: boolean;
  private removeUnloadListeners: () => void;

  constructor() {
    this.sessionStartTime = Date.now();
    this.invisibleStartTime = document.visibilityState === 'hidden' ? Date.now() : null;
    this.totalInvisibleTime = 0;
    this.visibilityChanges = 0;
    this.hasSentEvent = false;
    this.removeUnloadListeners = () => {
      window.removeEventListener('pagehide', this.handleUnload);
      window.removeEventListener('beforeunload', this.handleUnload);
    };

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    // Closing a tab can trigger visibilitychange(hidden), pagehide and
    // beforeunload. Attach both unload-capable events and guard in the handler
    // so we emit exactly one unload while guaranteeing at least one fires.
    window.addEventListener('pagehide', this.handleUnload);
    window.addEventListener('beforeunload', this.handleUnload);
  }

  private calculateData(): SessionInvisibleData {
    const now = Date.now();
    let invisibleTimeMs = this.totalInvisibleTime;

    // Add current invisible period if page is currently hidden
    if (this.invisibleStartTime !== null) {
      invisibleTimeMs += now - this.invisibleStartTime;
    }

    const sessionTimeMs = now - this.sessionStartTime;
    const invisibilityPct = sessionTimeMs > 0 ? Math.round((invisibleTimeMs / sessionTimeMs) * 100) : 0;

    return {
      invisibleTimeMs,
      sessionTimeMs,
      invisibilityPct,
      visibilityChanges: this.visibilityChanges,
    };
  }

  private sendEvent() {
    if (this.hasSentEvent) return;
    this.hasSentEvent = true;

    const data = this.calculateData();

    const eventData = {
      invisible_time_ms: data.invisibleTimeMs,
      session_time_ms: data.sessionTimeMs,
      invisibility_pct: data.invisibilityPct,
      visibility_changes: data.visibilityChanges,
    };

    console.debug('session_invisible_time eventData', eventData);

    sendGAEvent('event', GA_EVENT_NAMES.SESSION_INVISIBLE_TIME, eventData);
  }

  private handleVisibilityChange = () => {
    const now = Date.now();

    if (document.visibilityState === 'hidden') {
      // Page became hidden - start tracking invisible time
      this.invisibleStartTime = now;
      this.visibilityChanges += 1;
    } else if (document.visibilityState === 'visible') {
      // Page became visible - accumulate invisible time
      if (this.invisibleStartTime !== null) {
        this.totalInvisibleTime += now - this.invisibleStartTime;
        this.invisibleStartTime = null;
      }
    }
  };

  private handleUnload = () => {
    if (this.hasSentEvent) return;
    this.removeUnloadListeners();
    this.sendEvent();
  };

  public dispose() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.removeUnloadListeners();
  }
}

export function useSessionInvisibilityTracker() {
  const trackerRef = useRef<SessionInvisibilityTracker | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    trackerRef.current = new SessionInvisibilityTracker();

    return () => {
      trackerRef.current?.dispose();
    };
  }, []);
}
