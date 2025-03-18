import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import {
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  innerPageTotalAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
  navigateToAtom,
} from '@/atoms';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}
export default function MobilePageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);

  const [innerPageTotal, setInnerPageTotal] = useAtom(innerPageTotalAtom);

  const pageIndexList = useMemo(() => {
    const getTotal = () => {
      if (![NAV_LIST[2].id, NAV_LIST[4].id].includes(currentPage.id)) return 0;
      return currentPage.id === NAV_LIST[2].id ? 4 : 5;
    };
    const total = getTotal();
    if (!total) return [];
    setInnerPageTotal(total);
    return new Array(total).fill(0);
  }, [currentPage.id, setInnerPageTotal]);

  const isLastPageAndInnerPage = useMemo(() => {
    // 最后一页 & 最后一小进度,不展示向下箭头
    return currentPage.id === NAV_LIST[4].id && innerPageIndex === innerPageTotal - 1;
  }, [currentPage.id, innerPageIndex, innerPageTotal]);

  console.log({ currentPage, innerPageIndex, innerPageTotal });

  return (
    <div className={cn('pointer-events-auto z-10 flex cursor-pointer flex-col items-center gap-5', className)}>
      <div className="flex-center order-1 gap-3 mobile:order-2">
        <ArrowItem isUp />
        {!isLastPageAndInnerPage && <ArrowItem />}
      </div>
      {/* value 页面 5个细长方块进度条 */}
      {pageIndexList?.length ? (
        <div className="flex-center order-2 gap-3 mobile:order-1">
          {pageIndexList.map((_, index) => (
            <div
              key={`value-page-index-${index}`}
              className={cn(
                'h-1 w-15 rounded-full mobile:h-0.5 mobile:w-6',
                innerPageIndex === index ? 'bg-gray-800' : 'bg-[#B8B8B8]',
              )}
            ></div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ArrowItem({ isUp }: { isUp?: boolean }) {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const setInnerPageNavigateTo = useSetAtom(innerPageNavigateToAtom);
  const setNavigateTo = useSetAtom(navigateToAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);
  const innerPageTotal = useAtomValue(innerPageTotalAtom);
  const { mobileNavChange } = useMobileNavigation();

  const handleClick = useThrottle(() => {
    if (innerPageIndex !== -1) {
      // 有小进度条
      // 第三页 ValueGL
      if (innerPageIndex === 0 && isUp) {
        // 小进度开头 往上翻
        mobileNavChange(NAV_LIST[currentPageIndex - 1]);
        return;
      } else if (innerPageIndex === innerPageTotal - 1 && !isUp) {
        // 小进度结尾 往下翻
        mobileNavChange(NAV_LIST[currentPageIndex + 1]);
        return;
      }
      setInnerPageNavigateTo(innerPageIndex + (isUp ? -1 : 1));
    } else mobileNavChange(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
    setNavigateTo(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
  }, 1000);

  return (
    <div
      className={cn(
        'flex-center h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm',
        [NAV_LIST[1].id, NAV_LIST[2].id].includes(currentPage.id) ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={handleClick}
    >
      <ArrowDownSVG className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </div>
  );
}
