import { portfolio } from './portfolioData';

export default function PortfolioSEO() {
  return (
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
            {item.link && <a href={item.link}>{item.link}</a>}
          </li>
        ))}
      </ul>
    </section>
  );
}
