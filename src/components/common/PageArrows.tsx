import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';
import { currentPageAtom, currentPageIndexAtom, navigateToAtom, valuePageIndexAtom } from '@/atoms';
import { cn } from '@/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { NAV_LIST } from '../nav/nav';

interface PageArrowsProps {
  className?: string;
}
const VALUE_PAGE_INDEX_LIST = new Array(5).fill(0);
export default function PageArrows({ className }: PageArrowsProps) {
  const currentPage = useAtomValue(currentPageAtom);
  const valuePageIndex = useAtomValue(valuePageIndexAtom);
  return (
    <div className={cn('pointer-events-auto z-10 flex cursor-pointer flex-col items-center gap-5', className)}>
      <div className="flex-center order-1 gap-3 mobile:order-2">
        <ArrowItem isUp />
        {currentPage.id !== NAV_LIST[2].id && <ArrowItem />}
      </div>
      {/* 五个细长方块进度条 */}
      {currentPage.id === NAV_LIST[2].id && (
        <div className="flex-center order-2 gap-3 mobile:order-1">
          {VALUE_PAGE_INDEX_LIST.map((_, index) => (
            <div
              key={`value-page-index-${index}`}
              className={cn(
                'h-1 w-15 rounded-full mobile:h-0.5 mobile:w-6',
                valuePageIndex === index ? 'bg-gray-800' : 'bg-[#B8B8B8]',
              )}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowItem({ isUp, onClick }: { isUp?: boolean; onClick?: () => void }) {
  const currentPage = useAtomValue(currentPageAtom);
  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const setNavigateTo = useSetAtom(navigateToAtom);

  return (
    <div
      className={cn(
        'flex-center h-10 w-10 cursor-pointer rounded-full bg-black/65 bg-opacity-65 backdrop-blur-sm',
        currentPage.id === NAV_LIST[1].id ? 'border border-white/25 bg-white/10' : 'bg-black/65',
      )}
      onClick={() => {
        onClick?.();
        setNavigateTo(NAV_LIST[currentPageIndex + (isUp ? -1 : 1)]);
      }}
    >
      <ArrowDownSVG className={cn('h-5 w-5 fill-white', { 'rotate-180': isUp })} />
    </div>
  );
}
