'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { isNull } from 'lodash-es';
import MobileNav from './MobileNav';
import { NAV_LIST } from './nav';
import PCNav from './PCNav';

// Rendered on the server and until the device type is known after mount, so crawlers that
// read the raw HTML still see the site's main navigation. Swapped for the real nav on mount.
function SSRNav() {
  return (
    <nav className="sr-only" aria-label="Main">
      <ul>
        {NAV_LIST.map((item) => (
          <li key={item.id}>
            <a href={item.href}>{item.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function ClientNav() {
  const isMobile = useIsMobile();
  if (isNull(isMobile)) return <SSRNav />;

  return isMobile ? <MobileNav /> : <PCNav />;
}
