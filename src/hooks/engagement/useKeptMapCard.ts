'use client';

import {
  activeBookDotAtom,
  activeBookDotClickOpenAtom,
  activeMeetingDotAtom,
  activeMeetingDotClickOpenAtom,
  activeSponsorDotAtom,
  activeSponsorDotClickOpenAtom,
  tourOpenedDotAtom,
} from '@/atoms/engagement';
import { jotaiStore } from '@/atoms/store';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { phonePresenceEntered } from '@/hooks/anim/useMobileEngagementAnim';
import { noteInnerPage, registerInnerPage, type InnerValue } from '@/motion/innerPages';
import { useEffect } from 'react';
import { type EngagementClickPointType, useEngagementClickPoint } from './useEngagementClickPoint';

const SECTION = 'engagement_page';
const TYPES: EngagementClickPointType[] = ['meeting', 'book', 'sponsor'];
const ACTIVE = { meeting: activeMeetingDotAtom, book: activeBookDotAtom, sponsor: activeSponsorDotAtom } as const;
const CLICK_OPEN = {
  meeting: activeMeetingDotClickOpenAtom,
  book: activeBookDotClickOpenAtom,
  sponsor: activeSponsorDotClickOpenAtom,
} as const;

/**
 * The map card the visitor opened is Presence's inner page (NAV-02): kept in the history entry and opened again, with
 * the strip panned to it on the phone, when Back, Forward or a reload brings the entry back. Cards that open by
 * themselves are not kept: a pointer passing over a point on the laptop (it closes when the pointer leaves) and the
 * phone's tour (it moves on every 2.5 s). An address with a card of its own (/presence#key) opens that card instead.
 */
export function useKeptMapCard(phone: boolean) {
  const { handleClickPoint } = useEngagementClickPoint(false);

  useEffect(() => {
    const read = (): InnerValue | undefined => {
      const tour = jotaiStore.get(tourOpenedDotAtom);
      for (const type of TYPES) {
        const index = jotaiStore.get(ACTIVE[type]);
        if (index === null) continue;
        const visitorOpened = phone ? !(tour && tour.type === type && tour.index === index) : jotaiStore.get(CLICK_OPEN[type]);
        return visitorOpened ? { type, index } : undefined;
      }
      return undefined;
    };
    const apply = (value: InnerValue) => {
      if (window.location.hash) return true;
      if (!value || typeof value !== 'object' || Array.isArray(value)) return true;
      const { type, index } = value as { type?: unknown; index?: unknown };
      if (!TYPES.includes(type as EngagementClickPointType) || typeof index !== 'number') return true;
      const kind = type as EngagementClickPointType;
      // The map's points drawn (the phone's strip is .world-map-container; the laptop's map has none).
      if (!document.querySelector('.world-map-dot')) return false;
      if (phone && !phonePresenceEntered()) return false;
      handleClickPoint(kind, index, true);
      if (phone) eventBus.next({ type: MessageType.MOBILE_SCROLL_TO_ACTIVE_POINT, payload: { type: kind, index } });
      else jotaiStore.set(CLICK_OPEN[kind], true);
      return true;
    };
    const unregister = registerInnerPage(SECTION, 'card', read, apply);
    const note = () => noteInnerPage(SECTION);
    const unsubscribe = [...Object.values(ACTIVE), ...Object.values(CLICK_OPEN), tourOpenedDotAtom].map((atom) =>
      jotaiStore.sub(atom, note),
    );
    return () => {
      unregister();
      unsubscribe.forEach((off) => off());
    };
  }, [phone, handleClickPoint]);
}
