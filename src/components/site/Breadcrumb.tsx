import Link from 'next/link';
import { Fragment } from 'react';
import { cn } from '@/utils';

export type Crumb = { label: string; href?: string };

/**
 * The visible breadcrumb of the article and episode pages (NAV-04): a labelled <nav> with an ordered list, the current
 * page's crumb marked aria-current. The JSON-LD BreadcrumbList is built beside it (breadcrumbJsonLd in constants/entity).
 */
export default function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-xl/5 font-medium mobile:text-xs/5', className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          // The last crumb is the page itself unless it links somewhere (an episode's crumb ends at its show).
          const current = index === items.length - 1 && !item.href;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li aria-hidden="true" className="text-ink-muted">
                  &gt;
                </li>
              )}
              <li className={cn(current && index > 0 && 'text-ink-muted')} aria-current={current ? 'page' : undefined}>
                {item.href ? (
                  <Link prefetch={false} href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
