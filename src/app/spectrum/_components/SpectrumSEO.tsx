import { spectrumBaseData } from './spectrumData';

export default function SpectrumSEO() {
  return (
    <section className="sr-only" aria-hidden="true">
      <h1>Immortal Dragons Spectrum - Longevity Initiatives</h1>
      <p>
        Explore Immortal Dragon&apos;s variety of longevity initiatives on insight sharing, sponsorships, literature translation
        and publication, research papers and reviews, podcast channel, digital twin and clinical intelligence.
      </p>
      {spectrumBaseData.map((section) => (
        <article key={section.title}>
          <h2>
            {section.title} ({section.titleCn})
          </h2>
          <ul>
            {section.links.map((link) => (
              <li key={link.label}>
                {link.link ? (
                  <a href={link.link} tabIndex={-1}>
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
