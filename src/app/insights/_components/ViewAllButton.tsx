import ViewAllBorderSVG from '@/../public/svgs/podcast/view-all-border.svg?component';
import RightSVG from '@/../public/svgs/podcast/right.svg?component';
import { cn } from '@/utils';

interface ViewAllButtonProps {
  onClick: () => void;
  isMobile?: boolean;
}

export default function ViewAllButton({ onClick, isMobile = false }: ViewAllButtonProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-base/5 font-semibold',
        isMobile && 'px-2 py-1.5 text-sm',
      )}
    >
      <ViewAllBorderSVG className="absolute left-0 top-0 h-full w-full fill-red-600" />
      <p className="text-red-600">VIEW ALL</p>
      <RightSVG className={cn('w-5 fill-red-600', isMobile && 'w-3.5')} />
    </div>
  );
}
