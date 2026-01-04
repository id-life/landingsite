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
        'fixed bottom-20 left-5 z-50 rounded bg-[#22C55E] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        className,
      )}
    >
      {message}
    </div>
  );
}
