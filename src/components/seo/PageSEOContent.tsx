// Server-rendered text layer for pages whose visible content is drawn client-side (3D / ssr:false).
// Crawlers that don't run JavaScript read this; it is visually hidden (sr-only) but stays in the
// accessibility tree. Only pass copy that the page already shows — never new claims.

import { isInternalHref } from '@/constants/site';

export type SEOText = string | { text: string; lang?: string };

export type SEOItem = {
  title: string;
  text?: SEOText[];
  href?: string;
};

export type SEOSection = {
  heading: string;
  text?: SEOText[];
  items?: SEOItem[];
};

type PageSEOContentProps = {
  title: string;
  /** h1 by default; 'h2' where the page renders its own visible h1 (the home statement). */
  titleAs?: 'h1' | 'h2';
  intro?: SEOText[];
  sections?: SEOSection[];
  /**
   * The sections repeat what the page itself shows to everyone, in the accessibility tree too (its links are real): hide
   * them from assistive technology so each item is announced once. Crawlers still read them; the title and the intro
   * stay announced (the title is the page's one h1).
   */
  sectionsShownOnPage?: boolean;
};

// Copy often stores "English\n中文" in one string; render each line as its own paragraph.
function Paragraphs({ text }: { text?: SEOText[] }) {
  if (!text?.length) return null;
  return (
    <>
      {text.flatMap((entry, i) => {
        const { text: value, lang } = typeof entry === 'string' ? { text: entry, lang: undefined } : entry;
        return value
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, j) => (
            <p key={`${i}-${j}`} lang={lang}>
              {line}
            </p>
          ));
      })}
    </>
  );
}

export default function PageSEOContent({
  title,
  titleAs: Title = 'h1',
  intro,
  sections,
  sectionsShownOnPage = false,
}: PageSEOContentProps) {
  return (
    <section className="sr-only" aria-label={title}>
      <Title>{title}</Title>
      <Paragraphs text={intro} />
      <div aria-hidden={sectionsShownOnPage || undefined}>
        {sections?.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <Paragraphs text={section.text} />
            {section.items?.length ? (
              <ul>
                {section.items.map((item) => (
                  <li key={`${item.title}-${item.href ?? ''}`}>
                    <h3>
                      {/* Hidden layer: only internal links, kept out of the keyboard tab order. External
                        targets render as text — hidden outbound links read as link spam. */}
                      {isInternalHref(item.href) ? (
                        <a href={item.href} tabIndex={-1}>
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <Paragraphs text={item.text} />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  );
}
