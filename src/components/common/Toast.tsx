import { cn } from '@/utils';

interface ToastProps {
  visible: boolean;
  message: string;
  className?: string;
}

export default function Toast({ visible, message, className }: ToastProps) {
  return (
    <div
      className={cn(
        'fixed bottom-22.5 left-1/2 z-50 -translate-x-1/2 rounded bg-[#062C1C] px-4 py-2 text-sm font-medium text-green',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        className,
      )}
    >
      {message}
    </div>
  );
}
