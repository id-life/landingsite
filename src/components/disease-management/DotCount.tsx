import { PropsWithChildren, HTMLAttributes } from 'react';
import { cn } from '@/utils';

const DotCount = ({ children, className }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div className="flex items-center gap-1">
      <div className={cn('h-1.5 w-1.5', className)}></div>
      <div>{children}</div>
    </div>
  );
};

export default DotCount;
