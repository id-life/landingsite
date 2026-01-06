import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom } from '@/atoms/engagement';
import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MOBILE_DOT_SHOW_ORDER } from '@/constants/engagement';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { useCallback, useRef } from 'react';

// 自动播放配置
const AUTO_PLAY_CONFIG = {
  scrollDuration: 800, // 滚动时长（毫秒）
  activateDelay: 500, // 滚动开始后多久激活新点（毫秒）
  interval: 2500, // 自动播放间隔（毫秒）
} as const;

export function useMobileEngagementAnim() {
  const autoScrollRef = useRef<gsap.core.Tween | null>(null);
  const dotShowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  const setActiveBookDot = useSetAtom(activeBookDotAtom);
  const setActiveMeetingDot = useSetAtom(activeMeetingDotAtom);
  const setActiveSponsorDot = useSetAtom(activeSponsorDotAtom);

  const { contextSafe } = useGSAP();

  useEventBus(
    MessageType.MOBILE_SCROLL_TO_ACTIVE_POINT,
    ({ type, index }: { type: 'meeting' | 'book' | 'sponsor'; index: number }) => {
      handleUserInteraction();
      scrollToActivePoint(type, index);
    },
  );

  const scrollToActivePoint = useCallback((type: 'meeting' | 'book' | 'sponsor', index: number) => {
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
      // Auto-center the element on screen
      const targetScrollLeft = eleEl.offsetLeft - containerEl.clientWidth / 2 + eleEl.offsetWidth / 2;
      containerEl.scrollTo({ behavior: 'smooth', left: Math.max(0, targetScrollLeft) });
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
      const { type, index } = point;

      // 清理之前的激活定时器
      if (activateTimeoutRef.current) {
        clearTimeout(activateTimeoutRef.current);
        activateTimeoutRef.current = null;
      }

      // 第一步：重置所有点（让当前点淡出）
      setActiveBookDot(null);
      setActiveMeetingDot(null);
      setActiveSponsorDot(null);

      // 第二步：开始滚动
      scrollToActivePoint(type, index);

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
      }, AUTO_PLAY_CONFIG.activateDelay);
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
      duration: 0.3,
    });
    enterTL.to(
      '.world-map-img',
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'none',
      },
      '<',
    );

    enterTL.to(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.02,
    });

    enterTL.add(() => {
      startAutoDotShow();
    }, '+=0.3');

    const cleanup = setupEventListeners();

    return cleanup || (() => {});
  }, [setActiveBookDot, setActiveMeetingDot, setActiveSponsorDot, setupEventListeners, startAutoDotShow, stopAutoShowDot]);

  return {
    enterAnimate,
  };
}
