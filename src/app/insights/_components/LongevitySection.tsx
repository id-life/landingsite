'use client';

import RedbookSVG from '@/../public/svgs/redbook.svg?component';
import WechatSVG from '@/../public/svgs/wechat.svg?component';
import ZhihuSVG from '@/../public/svgs/zhihu.svg?component';
import { fetchLongevityWeeklyList } from '@/apis';
import { MobileNavigationArrowButton, PCNavigationArrowButton } from '@/app/insights/_components/NavigationArrowButton';
import MobilePaginationDots from '@/app/insights/_components/MobilePaginationDots';
import ViewAllButton from '@/app/insights/_components/ViewAllButton';
import { STORAGE_KEY } from '@/constants/storage';
import { useMobileItemsPerPage } from '@/hooks/useMobileItemsPerPage';
import { cn } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

type LongevityItem = {
  id: number;
  title: string;
  description: string;
  link: string | null;
};

type LongevitySectionProps = {
  isMobile?: boolean;
  compact?: boolean;
  isVisible?: boolean;
};

const COMPACT_ITEMS_PER_PAGE = 2;
const WECHAT_LINK =
  'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzcwNjE2OTY1Nw==&action=getalbum&album_id=4431348105913057287&subscene=27&scenenote=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzcwNjE2OTY1Nw%3D%3D%26mid%3D2247483730%26idx%3D1%26sn%3D217f54b92976778a7e6c978a4e805286%26chksm%3Df50e0bf9fb4abcb1443622811c53cf24713e7a94499971a3db6a43ae4b3447f15ffd0cb2e747%26scene%3D27%26ascene%3D0%26devicetype%3DiOS26.3.1%26version%3D18004330%26nettype%3DWIFI%26lang%3Den%26countrycode%3DCN%26fontScale%3D100%26exportkey%3Dn_ChQIAhIQx5hBjQ8GOG6mu%252BI1V%252BqW5hLeAQIE97dBBAEAAAAAAISzGW0zJ54AAAAOpnltbLcz9gKNyK89dVj0Ywaz9IIZRpnFE2mWp6TfHKwSUyl4DGAYVcDhwBQU0RdZRB2YFOHHFVi67QAS3pE%252BNffpWdz4n9x1faBtf8Ov29Nev9BaPPzWBuRuhWQJtQL1FrvuBac92gyUvTZM1ir6S7LTyoVA7Q6%252F3G2PeO3JC2YG2CXBLTEfFav0q5JoNrhrE5G9JhF5wQ2tn10aK7knf3sUDBCrXSx1Fza0xdy9KXphiZVD%252F%252FD9d2WD3w8xvMgYCaf%252B%252FxwZ4Q%253D%253D%26pass_ticket%3DLANnhQ74Aqic0XMcfJxe%252FZm3jBKNpG3m01gXc2HkZ4ToUVeNQvhn1egCauXUaO5r%26wx_header%3D3&nolastread=1#wechat_redirect';
const REDBOOK_LINK = 'https://xhslink.com/m/8j90ABQa9jS';
const ZHIHU_LINK = 'https://www.zhihu.com/column/c_2021919119344150153';

function LongevityCard({ item }: { item: LongevityItem }) {
  const handleClick = () => {
    if (!item.link) return;
    window.open(item.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div onClick={handleClick} className={cn('podcast-card-clip relative bg-white p-0.5', item.link && 'cursor-pointer')}>
      <div className="podcast-card-clip-inner bg-[#F6F8FB] p-4 mobile:p-3">
        <div className="flex items-center justify-between gap-3 mobile:gap-2">
          <h3 className="line-clamp-1 flex-1 font-poppins text-xl/8 font-bold mobile:line-clamp-2 mobile:text-xs/4.5">
            {item.title}
          </h3>
          <img
            src="/imgs/podcast/podcast-play-white.svg"
            className="invisible size-10 shrink-0 duration-300 hover:scale-110 mobile:size-8"
            alt="Open"
          />
        </div>
        <p className="line-clamp-1 text-base font-medium mobile:text-[10px]/4">{item.description}</p>
      </div>
    </div>
  );
}

export default function LongevitySection({ isMobile = false, compact = false, isVisible = true }: LongevitySectionProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isCompactBeginning, setIsCompactBeginning] = useState(true);
  const [isCompactEnd, setIsCompactEnd] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType>();
  const compactSwiperRef = useRef<SwiperType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useMobileItemsPerPage(containerRef, isMobile, 156, isVisible);
  const router = useRouter();
  const pageSize = Math.max(1, itemsPerPage);

  const { data: longevityWeeklyData = [], isLoading } = useQuery({
    queryKey: ['longevity_weekly_list'],
    queryFn: () => fetchLongevityWeeklyList(),
    select: (res) => (res.code === 200 ? res.data : []),
  });

  const longevityData = useMemo<LongevityItem[]>(() => {
    return [...longevityWeeklyData]
      .sort((a, b) => {
        const sequenceDiff = a.sequence - b.sequence;
        if (sequenceDiff !== 0) return sequenceDiff;

        const aTime = a.publishDate ? Date.parse(a.publishDate) : 0;
        const bTime = b.publishDate ? Date.parse(b.publishDate) : 0;
        return bTime - aTime;
      })
      .map((item) => ({
        id: item.id,
        title: item.title || ``,
        description: item.brief || '',
        link: item.url || '',
      }));
  }, [longevityWeeklyData]);

  const totalPages = isMobile ? Math.max(1, Math.ceil(longevityData.length / pageSize)) : 1;
  const totalCompactPages = Math.max(1, Math.ceil(longevityData.length / COMPACT_ITEMS_PER_PAGE));

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleCompactPrev = () => {
    compactSwiperRef.current?.slidePrev();
  };

  const handleCompactNext = () => {
    compactSwiperRef.current?.slideNext();
  };

  const handlePaginationClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setCurrentPage(index);
  };

  const handleViewAllClick = () => {
    if (isMobile) {
      sessionStorage.setItem(STORAGE_KEY.MOBILE_RETURN_PAGE, 'insights_page');
      router.push(WECHAT_LINK);
    } else {
      window.open(WECHAT_LINK, '_blank');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      const skeletonCount = compact ? 2 : isMobile ? 2 : 3;
      return (
        <div className={cn('flex gap-6', (isMobile || compact) && 'grid grid-cols-2 gap-3')}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="podcast-card-clip relative bg-white p-0.5">
              <div className="podcast-card-clip-inner space-y-3 bg-[#F6F8FB] p-4 mobile:p-3">
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-800/20 mobile:h-4" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-800/15 mobile:h-3" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!longevityData.length) {
      return (
        <div className="podcast-card-clip relative bg-white p-0.5">
          <div className="podcast-card-clip-inner bg-[#F6F8FB] p-4 text-sm text-black/50">No longevity weekly data yet.</div>
        </div>
      );
    }

    if (compact) {
      return (
        <Swiper
          className="h-full w-full"
          onSlideChange={(swiper) => {
            setIsCompactBeginning(swiper.isBeginning);
            setIsCompactEnd(swiper.isEnd);
          }}
          onBeforeInit={(swiper) => (compactSwiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={16}
        >
          {Array.from({ length: totalCompactPages }).map((_, pageIndex) => {
            const pageItems = longevityData.slice(pageIndex * COMPACT_ITEMS_PER_PAGE, (pageIndex + 1) * COMPACT_ITEMS_PER_PAGE);
            return (
              <SwiperSlide key={pageIndex}>
                <div className="grid grid-cols-2 gap-3">
                  {pageItems.map((item) => (
                    <LongevityCard key={item.id} item={item} />
                  ))}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      );
    }

    if (isMobile) {
      return (
        <Swiper
          className="h-full w-full"
          onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
          slidesPerView={1}
          spaceBetween={16}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageItems = longevityData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

            return (
              <SwiperSlide key={pageIndex}>
                <div className="flex flex-col gap-5">
                  {pageItems.map((item) => (
                    <LongevityCard key={item.id} item={item} />
                  ))}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      );
    }

    return (
      <Swiper
        className="h-full w-full"
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        slidesPerView={2}
        slidesPerGroup={1}
        spaceBetween={24}
      >
        {longevityData.map((item) => (
          <SwiperSlide key={item.id}>
            <LongevityCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <div ref={containerRef} className={cn('relative flex flex-col', isMobile && !compact && 'h-full')}>
      <div className={cn(isMobile && !compact && 'flex flex-1 flex-col justify-center overflow-hidden')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className={cn('font-oxanium text-[1.625rem]/9 font-semibold uppercase', isMobile && 'text-[26px] leading-9')}>
              长生周报
            </h2>
            <div className="flex items-center gap-1.5">
              <a
                href={WECHAT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 transition-opacity hover:opacity-80"
              >
                <WechatSVG className="size-6 fill-black" />
              </a>
              <a
                href={REDBOOK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 transition-opacity hover:opacity-80"
              >
                <RedbookSVG className="size-6 fill-black" />
              </a>
              <a
                href={ZHIHU_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 transition-opacity hover:opacity-80"
              >
                <ZhihuSVG className="size-6 fill-black" />
              </a>
            </div>
          </div>
          <ViewAllButton onClick={handleViewAllClick} isMobile={isMobile} />
        </div>

        <div className={cn('relative mt-3', !isMobile && 'pr-0')}>
          {!isMobile && !compact && (
            <PCNavigationArrowButton onClick={handlePrev} disabled={isBeginning} direction="prev" className="-left-5" />
          )}

          {compact && totalCompactPages > 1 && (
            <MobileNavigationArrowButton onClick={handleCompactPrev} disabled={isCompactBeginning} direction="prev" />
          )}

          {renderContent()}

          {!isMobile && !compact && (
            <PCNavigationArrowButton onClick={handleNext} disabled={isEnd} direction="next" className="-right-5" />
          )}

          {compact && totalCompactPages > 1 && (
            <MobileNavigationArrowButton onClick={handleCompactNext} disabled={isCompactEnd} direction="next" />
          )}
        </div>
      </div>

      {isMobile && !compact && (
        <MobilePaginationDots totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />
      )}
    </div>
  );
}
