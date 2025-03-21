import { useAtom } from 'jotai';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, toggleDotIndex } from '@/atoms/engagement';
import { useCallback } from 'react';

export type EngagementClickPointType = 'meeting' | 'book' | 'sponsor';

export function useEngagementClickPoint() {
  const [activeMeetingDot, setActiveMeetingDot] = useAtom(activeMeetingDotAtom);
  const [activeBookDot, setActiveBookDot] = useAtom(activeBookDotAtom);
  const [activeSponsorDot, setActiveSponsorDot] = useAtom(activeSponsorDotAtom);

  const handleClickPoint = useCallback(
    (type: EngagementClickPointType, index: number) => {
      if (type === 'meeting') {
        const newState = toggleDotIndex(index, activeMeetingDot);
        setActiveMeetingDot(newState);
        setActiveBookDot(null);
        setActiveSponsorDot(null);
      } else if (type === 'book') {
        const newState = toggleDotIndex(index, activeBookDot);
        setActiveBookDot(newState);
        setActiveMeetingDot(null);
        setActiveSponsorDot(null);
      } else if (type === 'sponsor') {
        const newState = toggleDotIndex(index, activeSponsorDot);
        setActiveSponsorDot(newState);
        setActiveMeetingDot(null);
        setActiveBookDot(null);
      }
    },
    [activeMeetingDot, setActiveMeetingDot],
  );

  return { handleClickPoint, activeMeetingDot, activeBookDot, activeSponsorDot };
}
