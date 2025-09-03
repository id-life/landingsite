import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom } from '@/atoms/engagement';
import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { getMobileDotShowInfo, MOBILE_DOT_SHOW_ORDER } from '@/constants/engagement';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { useCallback, useRef } from 'react';

export function useMobileEngagementAnim() {
  const autoScrollRef = useRef<gsap.core.Tween | null>(null);
  const dotShowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  const setActiveBookDot = useSetAtom(activeBookDotAtom);
  const setActiveMeetingDot = useSetAtom(activeMeetingDotAtom);
  const setActiveSponsorDot = useSetAtom(activeSponsorDotAtom);

  const { contextSafe } = useGSAP();

  useEventBus(
    MessageType.MOBILE_SCROLL_TO_ACTIVE_POINT,
    ({ type, index }: { type: 'meeting' | 'book' | 'sponsor'; index: number }) => {
      const offset = getMobileDotShowInfo(type, index)?.offset ?? 0;
      handleUserInteraction();
      scrollToActivePoint(type, index, offset);
    },
  );

  const scrollToActivePoint = useCallback((type: 'meeting' | 'book' | 'sponsor', index: number, offset: number = 0) => {
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
      const targetScrollLeft = eleEl.offsetLeft - offset;
      containerEl.scrollTo({ behavior: 'smooth', left: targetScrollLeft });
    }
  }, []);

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
      const { type, index, offset } = point;
      // 重置之前激活的点
      setActiveBookDot(null);
      setActiveMeetingDot(null);
      setActiveSponsorDot(null);

      // 激活新点
      if (type === 'book') {
        setActiveBookDot(index);
      } else if (type === 'meeting') {
        setActiveMeetingDot(index);
      } else if (type === 'sponsor') {
        setActiveSponsorDot(index);
      }
      scrollToActivePoint(type, index, offset);
    },
    [scrollToActivePoint, setActiveBookDot, setActiveMeetingDot, setActiveSponsorDot],
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
    if (userInteractedRef.current) return;
    if (dotShowIntervalRef.current) {
      clearInterval(dotShowIntervalRef.current);
      dotShowIntervalRef.current = null;
    }

    let currentIndex = 0;

    showPoint(currentIndex);
    currentIndex = (currentIndex + 1) % MOBILE_DOT_SHOW_ORDER.length;
    dotShowIntervalRef.current = setInterval(() => {
      showPoint(currentIndex);
      currentIndex = (currentIndex + 1) % MOBILE_DOT_SHOW_ORDER.length;
    }, 2000);
  }, [showPoint]);

  const enterAnimate = useCallback(() => {
    userInteractedRef.current = false;

    setActiveBookDot(null);
    setActiveMeetingDot(null);
    setActiveSponsorDot(null);

    stopAutoShowDot();

    const enterTL = gsap.timeline({
      duration: 0.3,
    });

    // 设置初始状态
    enterTL.set(
      ['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor', '.world-map-container'],
      {
        opacity: 0,
        duration: 0,
      },
    );

    // 在入场动画开始前设置初始滚动位置
    const mapContainerForScroll = document.querySelector('.world-map-container') as HTMLElement | null;
    if (mapContainerForScroll) {
      const initialScroll = mapContainerForScroll.scrollWidth * 0.12; // 初始向右滚动 12%
      mapContainerForScroll.scrollLeft = initialScroll;
    }

    // 入场动画序列
    enterTL.to('.world-map-container', {
      opacity: 1,
    });
    enterTL.to(
      '.world-map-img',
      {
        y: 0,
        opacity: 1,
        ease: 'none',
      },
      '<',
    );

    enterTL.to(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 1,
      scale: 1,
      ease: 'power2.out',
      stagger: 0.02,
    });

    enterTL.add(() => {
      startAutoDotShow();
    }, '+=0.3');

    enterTL.play();

    const cleanup = setupEventListeners();

    return cleanup || (() => {});
  }, [setActiveBookDot, setActiveMeetingDot, setActiveSponsorDot, setupEventListeners, startAutoDotShow, stopAutoShowDot]);

  return {
    enterAnimate,
  };
}
