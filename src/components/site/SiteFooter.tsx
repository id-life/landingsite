import Link from 'next/link';
import type { ReactNode } from 'react';
import BilingualText from '@/components/common/BilingualText';
import { cn } from '@/utils';
import { ABOUT_LINK, SITE_NAV } from './site-nav';

/**
 * The site's links at the foot of a page (NAV-04): the same items as the header (the seven sections, News, Podcast)
 * plus About, as plain links. A server component, so it is in the HTML of every content page.
 */
export function SiteFooterNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Site" className={cn('font-display text-sm/5 font-bold uppercase', className)}>
      <ul className="flex flex-wrap gap-x-6 gap-y-3">
        {[...SITE_NAV, ABOUT_LINK].map((item) => (
          <li key={item.id}>
            <Link
              prefetch={false}
              href={item.href}
              className="inline-flex items-center transition-colors duration-300 tap hover:text-accent"
            >
              <span>
                <BilingualText text={item.title} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The one page footer of the content routes: the route's own footer content (contact, subscribe), then the site links. */
export default function SiteFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <footer className={className}>
      {children}
      <SiteFooterNav className="pb-10 pt-8 mobile:pt-6" />
    </footer>
  );
}
