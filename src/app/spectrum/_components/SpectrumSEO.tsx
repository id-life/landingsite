import { absoluteUrl } from '@/constants/site';
import { spectrumBaseData } from './spectrumData';

/**
 * His Spectrum hidden list (his SpectrumSEO), word for word and attribute for attribute: his h1 and description
 * sentence, then each group with its items and their links (tabindex -1), the whole section sr-only and aria-hidden as
 * on his site. The group names and labels come from the content layer, where his answers changed two of them ("Papers &
 * Reviews", 2026-11-17; "Healthy Longevity", 12h). Restored after 5ad6cf0 replaced it (lead, 2026-11-21).
 *
 * The site's own pages are linked by full address here, as his list links them.
 *
 * `nested`: on the two tool pages, which inherit this list on his site, the page keeps its own one h1 (CON-14 A8), so
 * his h1 here is an h2 and his h2s are h3s: the words are his, the tag is the one difference.
 */
export default function SpectrumSEO({ nested = false }: { nested?: boolean }) {
  const Title = nested ? 'h2' : 'h1';
  const Group = nested ? 'h3' : 'h2';
  return (
    <section className="sr-only" aria-hidden="true">
      <Title>Immortal Dragons Spectrum - Longevity Initiatives</Title>
      <p>
        Explore Immortal Dragon&apos;s variety of longevity initiatives on insight sharing, sponsorships, literature translation
        and publication, research papers and reviews, podcast channel, digital twin and clinical intelligence.
      </p>
      {spectrumBaseData.map((section) => (
        <article key={section.title}>
          <Group>
            {section.title} ({section.titleCn})
          </Group>
          <ul>
            {section.links.map((link) => (
              <li key={link.label}>
                {link.link ? (
                  <a href={link.link.startsWith('/') ? absoluteUrl(link.link) : link.link} tabIndex={-1}>
                    {link.label}
                  </a>
                ) : (
                  <span>{link.label}</span>
                )}
                {link.isComingSoon && ' (Coming Soon)'}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
