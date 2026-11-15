import type { KeyboardEvent, ReactNode } from 'react';

type CardShellProps = {
  /** Destination; without it the card is a button that calls onActivate (e.g. opens a video). */
  href?: string;
  external?: boolean;
  onActivate?: () => void;
  /** Called when the link is followed (analytics); the browser still does the navigation. */
  onNavigate?: () => void;
  className?: string;
  children: ReactNode;
};

/**
 * Outer element of a clickable card: a real <a> when it navigates (so crawlers, middle-click,
 * keyboard and screen readers all work), otherwise a keyboard-operable button.
 */
export default function CardShell({ href, external = false, onActivate, onNavigate, className, children }: CardShellProps) {
  if (href) {
    return (
      <a
        href={href}
        className={className}
        onClick={onNavigate}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  // Nowhere to go and nothing to do (e.g. a feed item without a usable URL): not interactive at all.
  if (!onActivate) return <div className={className}>{children}</div>;
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate?.();
    }
  };
  return (
    // No aria-label: the accessible name comes from the card's visible text. A label holding only the title
    // failed WCAG 2.5.3 (label-content-name-mismatch) because the card also shows the date and source.
    <div role="button" tabIndex={0} onClick={onActivate} onKeyDown={onKeyDown} className={className}>
      {children}
    </div>
  );
}
