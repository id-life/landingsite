import type { ReactNode } from 'react';

/**
 * The one page footer of the content routes: the route's own footer content (contact, subscribe). The site-link list
 * NAV-04 added under it is gone: the original pages showed no such list (the owner's rule: no label a page did not show).
 */
export default function SiteFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return <footer className={className}>{children}</footer>;
}
