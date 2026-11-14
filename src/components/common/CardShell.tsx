import type { KeyboardEvent, ReactNode } from 'react';

type CardShellProps = {
  /** Destination; without it the card is a button that calls onActivate (e.g. opens a video). */
  href?: string;
  external?: boolean;
  onActivate?: () => void;
  /** Accessible name when the card is a button. */
  label?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Outer element of a clickable card: a real <a> when it navigates (so crawlers, middle-click,
 * keyboard and screen readers all work), otherwise a keyboard-operable button.
 */
export default function CardShell({ href, external = false, onActivate, label, className, children }: CardShellProps) {
  if (href) {
    return (
      <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate?.();
    }
  };
  return (
    <div role="button" tabIndex={0} aria-label={label} onClick={onActivate} onKeyDown={onKeyDown} className={className}>
      {children}
    </div>
  );
}
