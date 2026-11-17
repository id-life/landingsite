import { portfolio } from './portfolioData';

// Hidden crawler text for the 3D portfolio page: the companies and taglines the tiles show. Company sites are linked
// from the visible cards, so they are not repeated here as (hidden) outbound links. The route's description is in its
// metadata, not repeated here: it is not text the section shows (CON-01 hidden-text budget, /portfolio <= 1,100).
export default function PortfolioSEO() {
  return (
    <>
      <section className="sr-only" aria-label="Portfolio Companies">
        {/* The section's own heading (the owner's rule of 2026-11-18: hidden text is words the page shows). */}
        <h1>Portfolio</h1>
        <ul>
          {portfolio.map((item) => (
            <li key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
