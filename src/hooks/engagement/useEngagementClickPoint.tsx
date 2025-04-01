import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, toggleDotIndex } from '@/atoms/engagement';
import { useAtom } from 'jotai';
import { useThrottle } from '../useThrottle';

export type EngagementClickPointType = 'meeting' | 'book' | 'sponsor';

export function useEngagementClickPoint() {
  const [activeMeetingDot, setActiveMeetingDot] = useAtom(activeMeetingDotAtom);
  const [activeBookDot, setActiveBookDot] = useAtom(activeBookDotAtom);
  const [activeSponsorDot, setActiveSponsorDot] = useAtom(activeSponsorDotAtom);

  const handleClickPoint = (type: EngagementClickPointType, index: number, openState?: boolean) => {
    if (type === 'meeting') {
      const newState = openState === undefined ? toggleDotIndex(index, activeMeetingDot) : openState ? index : null;
      setActiveMeetingDot(newState);
      setActiveBookDot(null);
      setActiveSponsorDot(null);
    } else if (type === 'book') {
      const newState = openState === undefined ? toggleDotIndex(index, activeBookDot) : openState ? index : null;
      setActiveBookDot(newState);
      setActiveMeetingDot(null);
      setActiveSponsorDot(null);
    } else if (type === 'sponsor') {
      const newState = openState === undefined ? toggleDotIndex(index, activeSponsorDot) : openState ? index : null;
      setActiveSponsorDot(newState);
      setActiveMeetingDot(null);
      setActiveBookDot(null);
    }
  };

  const handleMouseEnter = useThrottle((e: React.MouseEvent, index: number, type: EngagementClickPointType) => {
    e.stopPropagation();
    if (type === 'meeting') {
      setActiveMeetingDot(index);
      setActiveBookDot(null);
      setActiveSponsorDot(null);
    } else if (type === 'book') {
      setActiveBookDot(index);
      setActiveMeetingDot(null);
      setActiveSponsorDot(null);
    } else if (type === 'sponsor') {
      setActiveSponsorDot(index);
      setActiveMeetingDot(null);
      setActiveBookDot(null);
    }
  }, 400);

  const handleMouseLeave = useThrottle((e: React.MouseEvent, index: number, type: EngagementClickPointType) => {
    e.stopPropagation();
    // 检查鼠标是否移动到内容区域
    const relatedTarget = e.relatedTarget as Element;

    // 检查相关目标是否是内容区域的一部分
    if (relatedTarget && typeof relatedTarget.closest === 'function') {
      if (type === 'meeting' && relatedTarget?.closest('.world-map-dot-meeting-content')) {
        return; // 如果移动到了meeting内容区域，不关闭
      }
      if (type === 'book' && relatedTarget?.closest('.world-map-dot-book-content')) {
        return; // 如果移动到了book内容区域，不关闭
      }
      if (type === 'sponsor' && relatedTarget?.closest('.world-map-dot-sponsor-content')) {
        return; // 如果移动到了sponsor内容区域，不关闭
      }
    }

    // 当鼠标离开且不是进入内容区域时才关闭内容
    if (type === 'meeting' && activeMeetingDot === index) {
      setActiveMeetingDot(null);
    } else if (type === 'book' && activeBookDot === index) {
      setActiveBookDot(null);
    } else if (type === 'sponsor' && activeSponsorDot === index) {
      setActiveSponsorDot(null);
    }
  }, 400);

  return {
    handleClickPoint,
    handleMouseEnter,
    handleMouseLeave,
    activeMeetingDot,
    activeBookDot,
    activeSponsorDot,
  };
}
