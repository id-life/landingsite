'use client';

import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useMobileInsightsAnim } from '@/hooks/anim/useMobileInsightsAnim';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { memo, useEffect, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import MobileInsightsNav from './_components/MobileInsightsNav';
import NewsSection from './_components/NewsSection';
import PodcastSection from './_components/PodcastSection';
import TalksSection from './_components/TalksSection';

function MobileInsights() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType>();
  const { enterAnimate, leaveAnimate } = useMobileInsightsAnim();

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleNavClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  // 页面进入/离开动画
  useEffect(() => {
    if (currentPage?.id === NAV_LIST[5].id) {
      enterAnimate();
    } else {
      leaveAnimate();
      swiperRef.current?.slideTo(0, 0);
      setActiveIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div
      id={NAV_LIST[5].id}
      className={cn('page-container-mobile mt-20 flex h-[calc(100svh-8.75rem)] flex-col', {
        hidden: currentPage?.id !== NAV_LIST[5].id,
      })}
    >
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        slidesPerView={1}
        className="mobile-insights-content h-full w-full flex-1"
      >
        <SwiperSlide className="overflow-y-auto px-5 pb-4">
          <NewsSection />
        </SwiperSlide>
        <SwiperSlide className="overflow-y-auto px-5 pb-4">
          <TalksSection />
        </SwiperSlide>
        <SwiperSlide className="overflow-y-auto px-5 pb-4">
          <PodcastSection />
        </SwiperSlide>
      </Swiper>
      <div className="mobile-insights-nav">
        <MobileInsightsNav activeIndex={activeIndex} onNavClick={handleNavClick} />
      </div>
    </div>
  );
}

export default memo(MobileInsights);
