import { cn } from '@/utils';

interface MobilePaginationDotsProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (index: number) => void;
}

export default function MobilePaginationDots({ totalPages, currentPage, onPageChange }: MobilePaginationDotsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex-center gap-2 py-4">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={cn('h-0.5 w-6 transition-all duration-300', {
            'bg-foreground': index === currentPage,
            'bg-gray-250': index !== currentPage,
          })}
        />
      ))}
    </div>
  );
}
