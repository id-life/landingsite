'use client';

import { useEffect, useRef } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { GA_EVENT_NAMES } from '@/constants/ga';

type TriggerType = 'visible' | 'hidden' | 'heartbeat';

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
  private lastEventSentTime: number;
  private heartbeatIntervalId: ReturnType<typeof setInterval> | null;
  private pendingTimeout: ReturnType<typeof setTimeout> | null;
  private pendingTrigger: TriggerType | null;
  private readonly THROTTLE_MS = 5000; // 5 seconds
  private readonly HEARTBEAT_INTERVAL_MS = 60000; // 1 minute

  constructor() {
    this.sessionStartTime = Date.now();
    this.invisibleStartTime = document.visibilityState === 'hidden' ? Date.now() : null;
    this.totalInvisibleTime = 0;
    this.visibilityChanges = document.visibilityState === 'hidden' ? 1 : 0;
    this.lastEventSentTime = 0;
    this.heartbeatIntervalId = null;
    this.pendingTimeout = null;
    this.pendingTrigger = null;

    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Set up heartbeat to send events every minute when page is visible
    this.heartbeatIntervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.sendEventThrottled('heartbeat');
      }
    }, this.HEARTBEAT_INTERVAL_MS);
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

  private sendEvent(trigger: TriggerType) {
    this.lastEventSentTime = Date.now();
    const data = this.calculateData();

    const eventData = {
      invisible_time_ms: data.invisibleTimeMs,
      session_time_ms: data.sessionTimeMs,
      invisibility_pct: data.invisibilityPct,
      visibility_changes: data.visibilityChanges,
      trigger,
    };

    sendGAEvent('event', GA_EVENT_NAMES.SESSION_INVISIBLE_TIME, eventData);
  }

  private sendEventThrottled(trigger: TriggerType) {
    const now = Date.now();
    const timeSinceLastSend = now - this.lastEventSentTime;

    if (timeSinceLastSend >= this.THROTTLE_MS) {
      // Outside throttle window - send immediately
      this.sendEvent(trigger);
    } else {
      // Within throttle window - track latest trigger and schedule for later
      this.pendingTrigger = trigger;
      if (this.pendingTimeout === null) {
        // Only schedule once; the latest trigger will be emitted when timeout fires
        const delay = this.THROTTLE_MS - timeSinceLastSend;
        this.pendingTimeout = setTimeout(() => {
          this.pendingTimeout = null;
          const t = this.pendingTrigger!;
          this.pendingTrigger = null;
          this.sendEvent(t);
        }, delay);
      }
    }
  }

  private handleVisibilityChange = () => {
    const now = Date.now();

    this.visibilityChanges += 1;
    const trigger: TriggerType = document.visibilityState === 'hidden' ? 'hidden' : 'visible';

    if (document.visibilityState === 'hidden') {
      // Page became hidden - start tracking invisible time
      this.invisibleStartTime = now;
    } else if (document.visibilityState === 'visible') {
      // Page became visible - accumulate invisible time
      if (this.invisibleStartTime !== null) {
        this.totalInvisibleTime += now - this.invisibleStartTime;
        this.invisibleStartTime = null;
      }
    }

    // Send event (throttled with trailing)
    this.sendEventThrottled(trigger);
  };

  public dispose() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.heartbeatIntervalId !== null) {
      clearInterval(this.heartbeatIntervalId);
    }
    if (this.pendingTimeout !== null) {
      clearTimeout(this.pendingTimeout);
    }
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
