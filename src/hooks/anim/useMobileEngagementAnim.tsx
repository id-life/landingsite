import { activeBookDotAtom, activeMeetingDotAtom, activeSponsorDotAtom, isMobileEngagementJumpAtom } from '@/atoms/engagement';
import { MOBILE_DOT_SHOW_ORDER } from '@/constants/engagement';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useRef } from 'react';

export function useMobileEngagementAnim() {
  const autoScrollRef = useRef<gsap.core.Tween | null>(null);
  const dotShowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  const setActiveBookDot = useSetAtom(activeBookDotAtom);
  const setActiveMeetingDot = useSetAtom(activeMeetingDotAtom);
  const setActiveSponsorDot = useSetAtom(activeSponsorDotAtom);
  const [isMobileEngagementJump, setIsMobileEngagementJump] = useAtom(isMobileEngagementJumpAtom);

  const { contextSafe } = useGSAP();

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

  // 用户交互处理函数
  const handleUserInteraction = useCallback(() => {
    userInteractedRef.current = true;

    // 停止自动滚动
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
    console.log('enterAnimate');
    userInteractedRef.current = false;

    const enterTL = gsap.timeline({
      duration: 0.3,
    });

    // 设置初始状态
    enterTL.set(
      ['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor', '.world-map-container'],
      {
        opacity: 0,
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

    if (!isMobileEngagementJump) enterTL.play();

    // 动画完成回调
    enterTL.eventCallback('onComplete', () => {
      if (isMobileEngagementJump) {
        setIsMobileEngagementJump(false);
        return;
      }
      startAutoDotShow();
    });

    // 使用 useGSAP 管理事件监听器
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

    const cleanup = setupEventListeners();

    return cleanup || (() => {});
  }, [contextSafe, isMobileEngagementJump, setIsMobileEngagementJump, handleUserInteraction, startAutoDotShow]);

  return {
    enterAnimate,
  };
}
