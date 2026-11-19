import { ReloadButton } from '@/components/common/ErrorState';
import { cn } from '@/utils';

/**
 * A part of a page whose data failed to load (ENG-08): the owner's "Reload" button and nothing else (his rule: no
 * text he has not shown), instead of an empty state that reads as "there is nothing here". The button retries the
 * request. The failure itself is reported to Sentry by the QueryClient's error handler.
 */
export default function SectionLoadError({ onRetry, className }: { onRetry: () => void; className?: string }) {
  return (
    <div role="alert" className={cn('flex flex-col items-center py-6 text-center', className)}>
      <ReloadButton onClick={onRetry} />
    </div>
  );
}
