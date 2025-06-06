'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SparklesCore } from './sparkles';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import gsap from 'gsap';

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: 'hover' | 'drag';
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
  isVideo?: boolean;
}

export const Compare = ({
  firstImage = '',
  secondImage = '',
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = 'hover',
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
  isVideo = false,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const firstVideoRef = useRef<HTMLVideoElement>(null);
  const secondVideoRef = useRef<HTMLVideoElement>(null);
  const [isFirstVideoReady, setIsFirstVideoReady] = useState(false);
  const [isSecondVideoReady, setIsSecondVideoReady] = useState(false);
  const [isLoading, setIsLoading] = useState(isVideo);
  const [loadProgress, setLoadProgress] = useState(0);

  const fillRef = useRef<HTMLDivElement>(null);
  const inverseTextRef = useRef<HTMLDivElement>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const [isMouseOver, setIsMouseOver] = useState(false);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVideo) {
      setIsLoading(true);
      setLoadProgress(0);
      setIsFirstVideoReady(false);
      setIsSecondVideoReady(false);

      const loadVideos = async () => {
        if (firstVideoRef.current && secondVideoRef.current) {
          // 重置视频状态
          firstVideoRef.current.pause();
          firstVideoRef.current.currentTime = 0;
          secondVideoRef.current.pause();
          secondVideoRef.current.currentTime = 0;

          // 设置新的视频源
          firstVideoRef.current.src = firstImage;
          secondVideoRef.current.src = secondImage;

          // 等待两个视频都加载完成
          await Promise.all([
            new Promise<void>((resolve) => {
              if (firstVideoRef.current) {
                const handleCanPlay = () => {
                  firstVideoRef.current?.removeEventListener('canplaythrough', handleCanPlay);
                  setIsFirstVideoReady(true);
                  resolve();
                };
                firstVideoRef.current.addEventListener('canplaythrough', handleCanPlay);
              }
            }),
            new Promise<void>((resolve) => {
              if (secondVideoRef.current) {
                const handleCanPlay = () => {
                  secondVideoRef.current?.removeEventListener('canplaythrough', handleCanPlay);
                  setIsSecondVideoReady(true);
                  resolve();
                };
                secondVideoRef.current.addEventListener('canplaythrough', handleCanPlay);
              }
            }),
          ]);

          // 确保两个视频都准备好后，同时开始播放
          try {
            // 先暂停两个视频
            firstVideoRef.current.pause();
            secondVideoRef.current.pause();

            // 重置时间
            firstVideoRef.current.currentTime = 0;
            secondVideoRef.current.currentTime = 0;

            // 使用 requestAnimationFrame 确保在下一帧同时开始播放
            requestAnimationFrame(() => {
              Promise.all([firstVideoRef.current?.play(), secondVideoRef.current?.play()])
                .then(() => {
                  // 设置加载进度为100%
                  setLoadProgress(100);
                  if (fillRef.current) {
                    gsap.to(fillRef.current, {
                      width: '100%',
                      duration: 0.5,
                      ease: 'none',
                    });
                  }
                  if (inverseTextRef.current) {
                    gsap.to(inverseTextRef.current, {
                      clipPath: 'inset(0 0% 0 0)',
                      duration: 0.5,
                      ease: 'none',
                    });
                  }

                  // 延迟隐藏加载指示器
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 100);
                })
                .catch((error) => {
                  console.error('视频播放失败:', error);
                  setIsLoading(false);
                });
            });
          } catch (error) {
            console.error('视频播放失败:', error);
            setIsLoading(false);
          }
        }
      };

      loadVideos();
    }
  }, [firstImage, secondImage, isVideo]);

  // 添加视频同步检查
  useEffect(() => {
    if (isVideo && !isLoading && firstVideoRef.current && secondVideoRef.current) {
      const checkSync = () => {
        if (firstVideoRef.current && secondVideoRef.current) {
          const timeDiff = Math.abs(firstVideoRef.current.currentTime - secondVideoRef.current.currentTime);
          if (timeDiff > 0.1) {
            // 如果时间差大于0.1秒
            // 同步视频时间
            const targetTime = Math.min(firstVideoRef.current.currentTime, secondVideoRef.current.currentTime);
            firstVideoRef.current.currentTime = targetTime;
            secondVideoRef.current.currentTime = targetTime;
          }
        }
      };

      const interval = setInterval(checkSync, 100);
      return () => clearInterval(interval);
    }
  }, [isVideo, isLoading]);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16); // ~60fps
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  function mouseEnterHandler() {
    setIsMouseOver(true);
    stopAutoplay();
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    if (slideMode === 'hover') {
      setSliderXPercent(initialSliderPercentage);
    }
    if (slideMode === 'drag') {
      setIsDragging(false);
    }
    startAutoplay();
  }

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === 'drag') {
        setIsDragging(true);
      }
    },
    [slideMode],
  );

  const handleEnd = useCallback(() => {
    if (slideMode === 'drag') {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === 'hover' || (slideMode === 'drag' && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => handleStart(e.clientX), [handleStart]);
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => handleMove(e.clientX), [handleMove]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleStart(e.touches[0].clientX);
      }
    },
    [handleStart, autoplay],
  );

  const handleTouchEnd = useCallback(() => {
    if (!autoplay) {
      handleEnd();
    }
  }, [handleEnd, autoplay]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove, autoplay],
  );

  return (
    <div
      ref={sliderRef}
      className={cn('h-[400px] w-[400px] overflow-hidden', className)}
      style={{
        position: 'relative',
        cursor: slideMode === 'drag' ? 'grab' : 'col-resize',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="relative h-12 w-44">
            <div className="loading-text absolute flex h-full w-full items-center justify-center text-[2rem]/[2.5rem] font-semibold text-red-600">
              Loading...
            </div>
            <div
              ref={inverseTextRef}
              className="absolute z-30 flex h-full w-full items-center justify-center text-[2rem]/[2.5rem] font-semibold text-white"
              style={{ clipPath: 'inset(0 100% 0 0)' }}
            >
              Loading...
            </div>
            <div ref={fillRef} className="absolute z-20 h-full w-0 bg-red-600"></div>
          </div>
        </div>
      )}

      {!isLoading && (
        <AnimatePresence initial={false}>
          <motion.div
            className="absolute top-0 z-30 m-auto h-full w-[2px] bg-gradient-to-b from-transparent from-[15%] via-[#c11111] to-transparent to-[95%]"
            style={{
              left: `${sliderXPercent}%`,
              top: '0',
              zIndex: 40,
            }}
            transition={{ duration: 0 }}
          >
            <div className="absolute left-0 top-[43%] z-20 h-full w-36 -translate-y-1/2 bg-gradient-to-r from-[#c11111] via-transparent to-transparent opacity-50 [mask-image:radial-gradient(100px_at_left,white,transparent)]" />
            <div className="absolute left-0 top-[43%] z-10 h-1/2 w-10 -translate-y-1/2 bg-gradient-to-r from-[#c11111] via-transparent to-transparent opacity-100 [mask-image:radial-gradient(50px_at_left,white,transparent)]" />
            <div className="absolute -right-10 top-[43%] h-3/4 w-10 -translate-y-1/2 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
              <MemoizedSparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="h-full w-full"
                particleColor="#c11111"
              />
            </div>
            {showHandlebar && (
              <div className="absolute -right-2.5 top-[43%] z-30 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md bg-white shadow-[0px_-1px_0px_0px_#FFFFFF40]">
                <IconDotsVertical className="h-5 w-5 text-black" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="pointer-events-none relative z-20 h-full w-full overflow-hidden">
        <AnimatePresence initial={false}>
          {firstImage ? (
            <motion.div
              className={cn(
                'absolute inset-0 z-20 h-full w-full shrink-0 select-none overflow-hidden rounded-2xl',
                firstImageClassName,
              )}
              style={{
                clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
              }}
              transition={{ duration: 0 }}
            >
              {isVideo ? (
                <video
                  ref={firstVideoRef}
                  className={cn('absolute inset-0 z-20 h-full w-full shrink-0 select-none rounded-2xl', firstImageClassName)}
                  draggable={false}
                  autoPlay={false}
                  muted
                  loop
                  playsInline
                  webkit-playsinline="true"
                  x5-playsinline="true"
                  x-webkit-airplay="allow"
                />
              ) : (
                <img
                  alt="first image"
                  src={firstImage}
                  className={cn('absolute inset-0 z-20 h-full w-full shrink-0 select-none rounded-2xl', firstImageClassName)}
                  draggable={false}
                />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {secondImage ? (
          <motion.div
            className={cn('absolute left-0 top-0 z-[19] h-full w-full select-none rounded-2xl', secondImageClassname)}
            style={{
              clipPath: `inset(0 0 0 ${sliderXPercent}%)`,
            }}
            transition={{ duration: 0 }}
          >
            {isVideo ? (
              <video
                ref={secondVideoRef}
                className={cn('absolute inset-0 h-full w-full shrink-0 select-none rounded-2xl', secondImageClassname)}
                draggable={false}
                autoPlay={false}
                muted
                loop
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                x-webkit-airplay="allow"
              />
            ) : (
              <img
                alt="second image"
                src={secondImage}
                className={cn('absolute inset-0 h-full w-full shrink-0 select-none rounded-2xl', secondImageClassname)}
                draggable={false}
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
