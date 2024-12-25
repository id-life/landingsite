import VisionDecorationBottomScrollSVG from '@/../public/svgs/vision/vision-decoration-2.svg?component';
import { navigateToAtom } from '@/atoms';
import { cn } from '@/utils';
import { useSetAtom } from 'jotai';
import { NAV_LIST } from '../nav/nav';

interface ScrollButtonProps {
  className?: string;
}

export default function ScrollButton({ className }: ScrollButtonProps) {
  const setNavigateTo = useSetAtom(navigateToAtom);
  return (
    <div className={cn('pointer-events-auto z-10 cursor-pointer', className)} onClick={() => setNavigateTo(NAV_LIST[1])}>
      <div className="relative h-10 w-[7.625rem]">
        {/* 第一层波纹 */}
        <div className="animate-ripple-1 absolute inset-0 origin-center rounded-full border-[0.7px] border-black" />
        {/* 第二层波纹 */}
        <div className="animate-ripple-2 absolute inset-0 origin-center rounded-full border-[0.7px] border-black" />
        {/* 第三层波纹 */}
        <div className="animate-ripple-3 absolute inset-0 origin-center rounded-full border-[0.7px] border-black" />
        {/* 中心按钮 */}
        <div className="flex-center absolute inset-0 gap-1.5 rounded-full bg-black">
          <VisionDecorationBottomScrollSVG className="h-7.5 w-6 fill-white" />
          <p className="font-migrena text-base/4 font-bold uppercase text-white">SCROLL</p>
        </div>
      </div>
    </div>
  );
}
