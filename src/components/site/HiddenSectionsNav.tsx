import { NAV_LIST } from '@/components/nav/nav';

/**
 * The original Spectrum tool pages serve this navigation, visually hidden, for screen readers and crawlers: their only
 * way from a tool page to the seven sections (the drawn header there shows the logo and ID.LIFE only). As the original
 * marks it up: a nav labelled "Main", sr-only, a list of the seven sections in their own words. Server-rendered.
 */
export default function HiddenSectionsNav() {
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
