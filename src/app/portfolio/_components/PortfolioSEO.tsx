import ArticleExcerpt from '@/components/seo/ArticleExcerpt';
import { portfolio } from './portfolioData';

// Hidden crawler text for the 3D portfolio page. Company sites are linked from the visible cards,
// so they are not repeated here as (hidden) outbound links.
export default function PortfolioSEO() {
  return (
    <>
      <section className="sr-only" aria-label="Portfolio Companies">
        <h1>Immortal Dragons Investment Portfolio</h1>
        <p>
          Purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies
          like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.
        </p>
        <ul>
          {portfolio.map((item) => (
            <li key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
      <ArticleExcerpt headings={['投资主题', '二、投资组合']} />
    </>
  );
}
