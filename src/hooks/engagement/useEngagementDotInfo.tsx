import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom } from '@/atoms/engagement';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS } from '@/constants/engagement';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

export type EngagementClickPointType = 'meeting' | 'book' | 'sponsor';

export type DotInfo = {
  isActive?: boolean;
  isDarker?: boolean;
  isOtherActive?: boolean;
};

// 获取点 id 对应的信息与透明度状态等
export function useEngagementDotInfo({ id, index, type }: { id: string; index: number; type: EngagementClickPointType }) {
  const activeMeetingDot = useAtomValue(activeMeetingDotAtom);
  const activeBookDot = useAtomValue(activeBookDotAtom);
  const activeSponsorDot = useAtomValue(activeSponsorDotAtom);

  const isActive = useMemo(() => {
    if (type === 'meeting') return activeMeetingDot === index;
    if (type === 'book') return activeBookDot === index;
    if (type === 'sponsor') return activeSponsorDot === index;
    return false;
  }, [activeMeetingDot, activeBookDot, activeSponsorDot, index, type]);

  const dotInfo: DotInfo = useMemo(() => {
    const res: DotInfo = { isActive, isDarker: false, isOtherActive: false };
    if (isActive) return res; // 如果当前点是 active 状态，则直接返回
    if (activeMeetingDot !== null) {
      const dot = WORLD_MAP_DOTS[activeMeetingDot];
      const ids = dot?.activeOtherDarkerDotIDs;
      if (ids?.length) res.isDarker = ids.includes(id);
      res.isOtherActive = (activeMeetingDot !== null && !isActive) || activeBookDot !== null || activeSponsorDot !== null;
      return res;
    }
    if (activeBookDot !== null) {
      const ids = MAP_BOOK_DOTS[activeBookDot]?.activeOtherDarkerDotIDs;
      if (ids?.length) res.isDarker = ids.includes(id);
      res.isOtherActive = (activeBookDot !== null && !isActive) || activeMeetingDot !== null || activeSponsorDot !== null;
      return res;
    }
    if (activeSponsorDot !== null) {
      const ids = MAP_SPONSOR_DOTS[activeSponsorDot]?.activeOtherDarkerDotIDs;
      if (ids?.length) res.isDarker = ids.includes(id);
      res.isOtherActive = (activeSponsorDot !== null && !isActive) || activeMeetingDot !== null || activeBookDot !== null;
      return res;
    }
    return res;
  }, [isActive, activeMeetingDot, activeBookDot, activeSponsorDot, id]);

  return dotInfo;
}
