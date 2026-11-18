import { fitStripStop, measureOpenCard } from './cardFit';
import { jotaiStore } from '@/atoms/store';
import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, tourOpenedDotAtom } from '@/atoms/engagement';
import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { getMobileDotShowInfo, MOBILE_DOT_SHOW_ORDER } from '@/constants/engagement';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
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

export function useMobileEngagementAnim() {
  const autoScrollRef = useRef<gsap.core.Tween | null>(null);
  const dotShowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  // Where the strip is panning to (today's stop, or the stop fitted to the open card).
  const intendedStopRef = useRef<number | null>(null);
  // The pending fit of the open card (fitOpenCardSoon), cancelled when the section is left.
  const fitFrameRef = useRef<number | null>(null);
  const setActiveBookDot = useSetAtom(activeBookDotAtom);
  const setActiveMeetingDot = useSetAtom(activeMeetingDotAtom);
  const setActiveSponsorDot = useSetAtom(activeSponsorDotAtom);
  const setTourOpenedDot = useSetAtom(tourOpenedDotAtom);
  const activeMeetingDot = useAtomValue(activeMeetingDotAtom);
  const activeBookDot = useAtomValue(activeBookDotAtom);
  const activeSponsorDot = useAtomValue(activeSponsorDotAtom);

  const { contextSafe } = useGSAP();

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
      // Where it will really stop: the browser keeps a scroll inside the strip (Shanghai, Chiang Mai and Singapore are
      // at its east end).
      intendedStopRef.current = Math.max(0, Math.min(containerEl.scrollWidth - containerEl.clientWidth, targetScrollLeft));
      containerEl.scrollTo({ behavior: 'smooth', left: Math.max(0, targetScrollLeft) });
    }
  }, []);

  // The card's own box, once it is open: the strip's stop moves only if the card or its place name is not whole there
  // (fitStripStop). Two frames after the card mounts, so it is laid out; the pan already under way is retargeted.
  const fitOpenCardSoon = useCallback(() => {
    if (fitFrameRef.current !== null) cancelAnimationFrame(fitFrameRef.current);
    fitFrameRef.current = requestAnimationFrame(() => {
      fitFrameRef.current = requestAnimationFrame(() => {
        fitFrameRef.current = null;
        // The card open now (a tap may have opened another, or kept the tour's, since this was asked for).
        const meeting = jotaiStore.get(activeMeetingDotAtom);
        const book = jotaiStore.get(activeBookDotAtom);
        const sponsor = jotaiStore.get(activeSponsorDotAtom);
        const [type, index] =
          meeting !== null
            ? ['meeting', meeting]
            : book !== null
              ? ['book', book]
              : sponsor !== null
                ? ['sponsor', sponsor]
                : [null, null];
        if (type === null || index === null) return;
        const scroller = document.querySelector<HTMLElement>('.world-map-container');
        const prefix = type === 'meeting' ? '' : `${type}-`;
        const dot = document.querySelector<HTMLElement>(`.world-map-dot-${prefix}${index}`);
        const card = document.querySelector<HTMLElement>(`.world-map-dot-${prefix}content-${index}`);
        const intended = intendedStopRef.current;
        if (!scroller || !dot || !card || intended === null) return;
        const measured = measureOpenCard(dot, card);
        if (!measured) return;
        const stop = fitStripStop({
          intended,
          viewport: scroller.clientWidth,
          name: measured.name,
          card: measured.card,
          maxScroll: scroller.scrollWidth - scroller.clientWidth,
        });
        if (Math.abs(stop - intended) < 0.5) return;
        intendedStopRef.current = stop;
        scroller.scrollTo({ behavior: 'smooth', left: stop });
      });
    });
  }, []);
  useEffect(
    () => () => {
      if (fitFrameRef.current !== null) cancelAnimationFrame(fitFrameRef.current);
    },
    [],
  );

  // A card opened by a tap on its point (the tour is stopped by the touch): the strip stays where it is unless the card
  // or its place name is not whole there. A card opened with a pan already asked for (the tour, a link from Spectrum)
  // is fitted by that pan.
  useEffect(() => {
    if (!userInteractedRef.current || fitFrameRef.current !== null) return;
    const open: ['meeting' | 'book' | 'sponsor', number] | null =
      activeMeetingDot !== null
        ? ['meeting', activeMeetingDot]
        : activeBookDot !== null
          ? ['book', activeBookDot]
          : activeSponsorDot !== null
            ? ['sponsor', activeSponsorDot]
            : null;
    if (!open) return;
    const scroller = document.querySelector<HTMLElement>('.world-map-container');
    if (!scroller) return;
    intendedStopRef.current = scroller.scrollLeft;
    fitOpenCardSoon();
  }, [activeMeetingDot, activeBookDot, activeSponsorDot, fitOpenCardSoon]);

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
        fitOpenCardSoon();
      }, AUTO_PLAY_CONFIG.activateDelay);
    },
    [scrollToActivePoint, fitOpenCardSoon, setActiveBookDot, setActiveMeetingDot, setActiveSponsorDot, setTourOpenedDot],
  );

  // A tap on a point (WorldMap) asks for its pan; declared after the functions it uses.
  useEventBus(
    MessageType.MOBILE_SCROLL_TO_ACTIVE_POINT,
    ({ type, index }: { type: 'meeting' | 'book' | 'sponsor'; index: number }) => {
      handleUserInteraction();
      const dotInfo = getMobileDotShowInfo(type, index);
      scrollToActivePoint(type, index, dotInfo?.offsetX ?? 0);
      // A tap opens the card at once: fit it once it is laid out.
      fitOpenCardSoon();
    },
  );

  const setupEventListeners = contextSafe(() => {
    const mapContainer = document.querySelector('.world-map-container');
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
      ease: EASE.out,
      stagger: 0.02,
    });

    enterTL.add(() => {
      startAutoDotShow();
    }, '+=0.3');

    const cleanup = setupEventListeners();
    setPresenceEntered(true);

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
      if (fitFrameRef.current !== null) cancelAnimationFrame(fitFrameRef.current);
      fitFrameRef.current = null;
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
