import { TryAgainButton } from '@/components/common/ErrorState';
import { cn } from '@/utils';

/**
 * A part of a page whose data failed to load (ENG-08): says so and offers a retry, instead of an empty state that
 * reads as "there is nothing here" ("No comment", "No longevity weekly data yet."). The failure itself is reported to
 * Sentry by the QueryClient's error handler.
 */
export default function SectionLoadError({ onRetry, className }: { onRetry: () => void; className?: string }) {
  return (
    <div role="alert" className={cn('flex flex-col items-center gap-3 py-6 text-center font-text', className)}>
      <p className="text-sm font-medium">加载失败。Could not load this content.</p>
      <TryAgainButton onClick={onRetry} />
    </div>
  );
}
