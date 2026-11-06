// Server-rendered text layer for pages whose visible content is drawn client-side (3D / ssr:false).
// Crawlers that don't run JavaScript read this; it is visually hidden (sr-only) but stays in the
// accessibility tree. Only pass copy that the page already shows — never new claims.

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
  intro?: SEOText[];
  sections?: SEOSection[];
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

export default function PageSEOContent({ title, intro, sections }: PageSEOContentProps) {
  return (
    <section className="sr-only" aria-label={title}>
      <h1>{title}</h1>
      <Paragraphs text={intro} />
      {sections?.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <Paragraphs text={section.text} />
          {section.items?.length ? (
            <ul>
              {section.items.map((item) => (
                <li key={`${item.title}-${item.href ?? ''}`}>
                  <h3>{item.href ? <a href={item.href}>{item.title}</a> : item.title}</h3>
                  <Paragraphs text={item.text} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </section>
  );
}
