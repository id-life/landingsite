import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, tourOpenedDotAtom } from '@/atoms/engagement';
import { PHONE } from '@/motion/original';
import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { getMobileDotShowInfo, MOBILE_DOT_SHOW_ORDER } from '@/constants/engagement';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { cardKey, fittedStop, measureCards, type CardKind } from './cardFit';
import { DURATION, EASE } from '@/motion/tokens';
import { isReducedMotion } from '@/motion/preference';
import { isMotionPaused } from '@/motion/runtime';

// 自动播放配置
const AUTO_PLAY_CONFIG = {
  scrollDuration: 800, // 滚动时长（毫秒）
  activateDelay: 500, // 滚动开始后多久激活新点（毫秒）
  interval: 2500, // 自动播放间隔（毫秒）
} as const;

/**
 * True once the phone's Presence has run its entrance (which closes every card and starts the tour) and until it is
 * left: a card put back from the history entry (NAV-02) is opened only then, so the entrance cannot close it again.
 */
let presenceEntered = false;
const enteredChanged = new Set<() => void>();
const setPresenceEntered = (value: boolean) => {
  presenceEntered = value;
  enteredChanged.forEach((onChange) => onChange());
};
export const phonePresenceEntered = () => presenceEntered;
/** Calls back when the phone's Presence entrance has run or the section is left; returns the unsubscribe function. */
export const onPhonePresenceEntered = (onChange: () => void) => {
  enteredChanged.add(onChange);
  return () => {
    enteredChanged.delete(onChange);
  };
};

/** The card a pan was last asked for (the tour, a kept card, a link from Spectrum): that pan already fits it. */
let panFor: string | null = null;

export function useMobileEngagementAnim() {
  const autoScrollRef = useRef<gsap.core.Tween | null>(null);
  const dotShowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  const setActiveBookDot = useSetAtom(activeBookDotAtom);
  const setActiveMeetingDot = useSetAtom(activeMeetingDotAtom);
  const setActiveSponsorDot = useSetAtom(activeSponsorDotAtom);
  const setTourOpenedDot = useSetAtom(tourOpenedDotAtom);
  const activeMeetingDot = useAtomValue(activeMeetingDotAtom);
  const activeBookDot = useAtomValue(activeBookDotAtom);
  const activeSponsorDot = useAtomValue(activeSponsorDotAtom);

  const { contextSafe } = useGSAP();

  useEventBus(
    MessageType.MOBILE_SCROLL_TO_ACTIVE_POINT,
    ({ type, index }: { type: 'meeting' | 'book' | 'sponsor'; index: number }) => {
      handleUserInteraction();
      const dotInfo = getMobileDotShowInfo(type, index);
      scrollToActivePoint(type, index, dotInfo?.offsetX ?? 0);
    },
  );

  const scrollToActivePoint = useCallback((type: 'meeting' | 'book' | 'sponsor', index: number, offsetX: number = 0) => {
    const scrollContainer = document.querySelector('.world-map-container');
    const activeEle =
      type === 'meeting'
        ? document.querySelector(`.world-map-dot-${index}`)
        : type === 'book'
          ? document.querySelector(`.world-map-dot-book-${index}`)
          : document.querySelector(`.world-map-dot-sponsor-${index}`);
    if (scrollContainer && activeEle) {
      const containerEl = scrollContainer as HTMLDivElement;
      const eleEl = activeEle as HTMLDivElement;
      // Auto-center the element on screen, with custom offset
      const targetScrollLeft = eleEl.offsetLeft - containerEl.clientWidth / 2 + eleEl.offsetWidth / 2 + offsetX;
      // One pan: where the point is centred today, moved only as far as its card and place name need to be whole
      // (cardFit, from the cards measured at the section's entry).
      panFor = cardKey(type, index);
      containerEl.scrollTo({ behavior: 'smooth', left: fittedStop(type, index, eleEl, containerEl, targetScrollLeft) });
    }
  }, []);

  // A card opened by a tap on its point (no pan asked for): the strip stays where it is unless the card or its place
  // name is not whole there, and then moves once, by as little as that takes.
  useEffect(() => {
    const open: [CardKind, number] | null =
      activeMeetingDot !== null
        ? ['meeting', activeMeetingDot]
        : activeBookDot !== null
          ? ['book', activeBookDot]
          : activeSponsorDot !== null
            ? ['sponsor', activeSponsorDot]
            : null;
    if (!open) return;
    const key = cardKey(...open);
    if (panFor === key) {
      panFor = null;
      return;
    }
    if (!userInteractedRef.current) return;
    const scroller = document.querySelector<HTMLElement>('.world-map-container');
    const prefix = open[0] === 'meeting' ? '' : `${open[0]}-`;
    const dot = document.querySelector<HTMLElement>(`.world-map-dot-${prefix}${open[1]}`);
    if (!scroller || !dot) return;
    const stop = fittedStop(open[0], open[1], dot, scroller, scroller.scrollLeft);
    if (Math.abs(stop - scroller.scrollLeft) >= 0.5) scroller.scrollTo({ behavior: 'smooth', left: stop });
  }, [activeMeetingDot, activeBookDot, activeSponsorDot]);

  const stopAutoShowDot = useCallback(() => {
    if (autoScrollRef.current) {
      autoScrollRef.current.kill();
      autoScrollRef.current = null;
    }
    // 停止自动展示点
    if (dotShowIntervalRef.current) {
      clearInterval(dotShowIntervalRef.current);
      dotShowIntervalRef.current = null;
    }
    // 清理延迟激活的定时器
    if (activateTimeoutRef.current) {
      clearTimeout(activateTimeoutRef.current);
      activateTimeoutRef.current = null;
    }
  }, []);

  // 用户交互处理函数
  const handleUserInteraction = useCallback(() => {
    userInteractedRef.current = true;
    stopAutoShowDot();
  }, [stopAutoShowDot]);

  const showPoint = useCallback(
    (currentIndex: number) => {
      if (userInteractedRef.current) {
        if (dotShowIntervalRef.current) {
          clearInterval(dotShowIntervalRef.current);
          dotShowIntervalRef.current = null;
        }
        return;
      }

      const point = MOBILE_DOT_SHOW_ORDER[currentIndex];
      const { type, index, offsetX = 0 } = point;

      // 清理之前的激活定时器
      if (activateTimeoutRef.current) {
        clearTimeout(activateTimeoutRef.current);
        activateTimeoutRef.current = null;
      }

      // 第一步：重置所有点（让当前点淡出）
      setActiveBookDot(null);
      setActiveMeetingDot(null);
      setActiveSponsorDot(null);
      setTourOpenedDot(null);

      // 第二步：开始滚动
      scrollToActivePoint(type, index, offsetX);

      // 第三步：延迟后激活新点
      activateTimeoutRef.current = setTimeout(() => {
        if (userInteractedRef.current) return;

        if (type === 'book') {
          setActiveBookDot(index);
        } else if (type === 'meeting') {
          setActiveMeetingDot(index);
        } else if (type === 'sponsor') {
          setActiveSponsorDot(index);
        }
        // The tour opened this card itself: a tap on its point keeps it open (useEngagementClickPoint).
        setTourOpenedDot({ type, index });
      }, AUTO_PLAY_CONFIG.activateDelay);
    },
    [scrollToActivePoint, setActiveBookDot, setActiveMeetingDot, setActiveSponsorDot, setTourOpenedDot],
  );

  const setupEventListeners = contextSafe(() => {
    // The whole strip, the map and the card layer above it: a touch on an open card stops the tour too, so the card the
    // visitor is using stays open (the cards lie outside the scroller, whose touches alone stopped it before).
    const mapContainer = document.querySelector('.world-map-container')?.parentElement ?? null;
    if (mapContainer) {
      const events = ['click', 'touchstart', 'wheel', 'mousedown'] as const;
      const options = { passive: true };

      events.forEach((event) => {
        mapContainer.addEventListener(
          event,
          handleUserInteraction,
          event === 'touchstart' || event === 'wheel' ? options : undefined,
        );
      });

      // 返回清理函数
      return () => {
        events.forEach((event) => {
          mapContainer.removeEventListener(event, handleUserInteraction);
        });
      };
    }
    return () => {};
  });

  // 自动展示点
  const startAutoDotShow = useCallback(() => {
    // Reduced motion (MOT-02): the map's cards do not open one after another by themselves.
    if (userInteractedRef.current || isReducedMotion()) return;
    if (dotShowIntervalRef.current) {
      clearInterval(dotShowIntervalRef.current);
      dotShowIntervalRef.current = null;
    }

    let currentIndex = 0;

    showPoint(currentIndex);
    currentIndex = (currentIndex + 1) % MOBILE_DOT_SHOW_ORDER.length;
    dotShowIntervalRef.current = setInterval(() => {
      // MOT-03: no step while the experience is paused (each step pans the map and opens a card with Motion
      // animations, whose frame loop does not go through the paused one: 9 to 10 frames a second on an untouched
      // page). The tour goes on from the same card after the wake.
      if (isMotionPaused()) return;
      showPoint(currentIndex);
      currentIndex = (currentIndex + 1) % MOBILE_DOT_SHOW_ORDER.length;
    }, AUTO_PLAY_CONFIG.interval);
  }, [showPoint]);

  const enterAnimate = useCallback(() => {
    userInteractedRef.current = false;

    setActiveBookDot(null);
    setActiveMeetingDot(null);
    setActiveSponsorDot(null);

    stopAutoShowDot();

    // 获取所有需要动画的元素
    const container = document.querySelector('.world-map-container') as HTMLElement | null;
    const mapImg = document.querySelector('.world-map-img') as HTMLElement | null;
    const regions = document.querySelectorAll('.world-map-region');
    const dots = document.querySelectorAll('.world-map-dot');
    const bookDots = document.querySelectorAll('.world-map-dot-book');
    const sponsorDots = document.querySelectorAll('.world-map-dot-sponsor');

    // 设置初始状态（使用 style 而不是 GSAP set）
    if (container) {
      container.style.opacity = '0';
      // 设置初始滚动位置 - 居中显示欧亚大陆
      const initialScroll = container.scrollWidth * 0.35;
      container.scrollLeft = initialScroll;
    }
    if (mapImg) {
      mapImg.style.opacity = '0';
    }
    [regions, dots, bookDots, sponsorDots].forEach((nodeList) => {
      nodeList.forEach((el) => {
        (el as HTMLElement).style.opacity = '0';
      });
    });

    // 入场动画序列
    const enterTL = gsap.timeline();

    enterTL.to('.world-map-container', {
      opacity: 1,
      duration: DURATION.base,
    });
    enterTL.to(
      '.world-map-img',
      {
        y: 0,
        opacity: 1,
        duration: DURATION.base,
        ease: EASE.linear,
      },
      '<',
    );

    enterTL.to(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 1,
      scale: 1,
      duration: DURATION.base,
      ease: PHONE.presencePointsEase,
      stagger: 0.02,
    });

    enterTL.add(() => {
      startAutoDotShow();
    }, '+=0.3');

    const cleanup = setupEventListeners();
    setPresenceEntered(true);
    // Every card's width, while the entrance runs (the tour starts after it): so each pan ends where its card is whole.
    void measureCards();

    // Leaving the section stops the tour and closes its card. The tour used to run on behind the hidden panel, so a
    // return (by Back, Forward or the menu) showed the card it had reached for a moment before the entrance closed it.
    return () => {
      setPresenceEntered(false);
      cleanup?.();
      enterTL.kill();
      stopAutoShowDot();
      setActiveBookDot(null);
      setActiveMeetingDot(null);
      setActiveSponsorDot(null);
      setTourOpenedDot(null);
    };
  }, [
    setActiveBookDot,
    setActiveMeetingDot,
    setActiveSponsorDot,
    setTourOpenedDot,
    setupEventListeners,
    startAutoDotShow,
    stopAutoShowDot,
  ]);

  return {
    enterAnimate,
  };
}
