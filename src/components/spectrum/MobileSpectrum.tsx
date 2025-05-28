'use client';
import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { spectrumGetSourceImgInfos, useSpectrumData } from '@/hooks/spectrum/useSpectrumData';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ParticleGL from '../gl/ParticleGL';
import MobileSpectrumItem from './MobileSpectrumItem';

SwiperType.use([FreeMode]);

function MobileSpectrum() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [imageIdx, setImageIdx] = useState(0);
  const spectrumData = useSpectrumData();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spectrumRefs = useRef<HTMLDivElement[]>([]);
  const [mobileImageIdx1, setMobileImageIdx1] = useState(0);
  const [mobileImageIdx2, setMobileImageIdx2] = useState(0);
  const swiperRef = useRef<SwiperType>();
  const [particleActive, setParticleActive] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    const index = swiper.activeIndex;
    setMobileImageIdx1(index + 1);
    setMobileImageIdx2(index + 2);
  };

  // 创建入场动画
  const createEnterAnimation = useCallback(() => {
    if (!wrapperRef.current) return;

    // 如果存在之前的动画，先清理
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.fromTo(wrapperRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });

    // 标题动画
    tl.fromTo('.spectrum-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    // Portfolio items 动画
    tl.fromTo('.spectrum-fund', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    return tl;
  }, []);

  // 创建退场动画
  const createExitAnimation = useCallback(() => {
    if (!wrapperRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.to(wrapperRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power2.inOut',
    });

    return tl;
  }, []);

  useEffect(() => {
    if (currentPage.id === NAV_LIST[2].id) {
      setParticleActive(true);
      setMobileImageIdx1(1);
      setMobileImageIdx2(2);
      createEnterAnimation();
    } else {
      setParticleActive(false);
      createExitAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const throttledSetImageIdx = useThrottle((index: number) => {
    setImageIdx(index);
  }, 200);

  useGSAP(
    () => {
      if (!spectrumRefs.current.length) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      let isMouseInFundArea = false;
      // add mouse event listeners for the entire fund area
      wrapper?.addEventListener('mouseenter', () => {
        isMouseInFundArea = true;
      });

      wrapper?.addEventListener('mouseleave', () => {
        isMouseInFundArea = false;
        throttledSetImageIdx(0);
      });

      spectrumRefs.current.forEach((div, idx) => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });
        const title = div.querySelector('.spectrum-title');
        const titleCn = div.querySelector('.spectrum-title-cn');
        // const selected = div?.querySelectorAll('.spectrum-selected-icon');
        const icon = div?.querySelectorAll('.spectrum-icon');
        if (title) tl.to(title, { fontSize: '1.875rem', lineHeight: '2.25rem' });
        if (titleCn) tl.to(titleCn, { fontSize: '1.5rem', lineHeight: '1.75rem' }, '<');
        if (icon) tl.to(icon, { width: '2.25rem', height: '2.25rem' }, '<');
        // if (selected) tl.to(selected, { opacity: 1 });

        div.addEventListener('mouseenter', () => {
          throttledSetImageIdx(idx + 1);
          tl.play();
        });
        div.addEventListener('mouseleave', () => {
          tl.reverse();
          // reset the image index only when the mouse actually leaves the entire fund area
          if (!isMouseInFundArea) {
            throttledSetImageIdx(0);
          }
        });
      });
    },
    { scope: wrapperRef, dependencies: [] },
  );

  return (
    <div
      ref={wrapperRef}
      id={NAV_LIST[2].id}
      className={cn('page-container-mobile text-white', {
        hidden: currentPage?.id !== NAV_LIST[2].id,
      })}
    >
      <ParticleGL
        imageIdx={mobileImageIdx1}
        activeAnim={particleActive}
        id="spectrum-particle-container-mobile-1"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />
      <ParticleGL
        imageIdx={mobileImageIdx2}
        activeAnim={particleActive}
        id="spectrum-particle-container-mobile-2"
        getSourceImgInfos={spectrumGetSourceImgInfos}
      />
      <div className="relative flex h-[100svh] flex-col items-center justify-center pb-16 pt-12">
        <div id="spectrum-particle-gl-mobile">
          <div
            id="spectrum-particle-container-mobile-1"
            className={cn('particle-container particle-container-mobile-1', { active: particleActive })}
          ></div>
          <div
            id="spectrum-particle-container-mobile-2"
            className={cn('particle-container particle-container-mobile-2', { active: particleActive })}
          ></div>
        </div>
        <div className="spectrum-title mb-5 font-xirod text-xl/7.5 font-bold uppercase">spectrum</div>
        <div className="spectrum-fund overflow-hidden px-18 mobile:mt-0 mobile:gap-0 mobile:px-0">
          <Swiper
            direction="vertical"
            slidesPerView={2}
            spaceBetween={0}
            className="h-[60svh]"
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            freeMode={{
              enabled: true,
              sticky: true, // 添加这个让它能对齐到最近的slide
              momentumBounce: true, // 添加反弹效果
              momentumRatio: 0.5, // 降低动量比率使滑动不会太滑
              momentumVelocityRatio: 0.5, // 降低速度比率
              minimumVelocity: 0.1, // 设置最小速度阈值
            }}
          >
            {spectrumData.map((item, index) => (
              <SwiperSlide key={item.title} className="h-[30svh]">
                <MobileSpectrumItem
                  className="px-7.5"
                  item={item}
                  ref={(element) => {
                    if (!element) return;
                    spectrumRefs.current[index] = element;
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default memo(MobileSpectrum);
