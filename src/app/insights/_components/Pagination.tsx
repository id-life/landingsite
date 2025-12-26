'use client';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex-center gap-3 pt-10">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`h-1 w-10 transition-all duration-300 ${index === currentPage ? 'bg-foreground' : 'bg-gray-250'}`}
          aria-label={`Go to page ${index + 1}`}
        />
      ))}
    </div>
  );
}
