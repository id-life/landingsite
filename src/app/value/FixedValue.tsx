type ValueContentItem = {
  id: string;
  title: string;
  content: string;
};
const VALUE_CONTENT: ValueContentItem[] = [
  {
    id: 'page-value-1',
    title: 'Raising Awareness',
    content:
      'Promoting longevity, anti-aging, and biotech as essential for humanity&apos;s future by spreading information and garnering attention, talent, and resources',
  },
  {
    id: 'page-value-2',
    title: 'Global Advocacy',
    content:
      'By advocating and advertising, the goal is to shift global focus toward longevity research as a crucial moral endeavor',
  },
  {
    id: 'page-value-3',
    title: 'Moral Justification',
    content: 'Longevity research aims to reduce global suffering, fostering long-term societal benefits such as sustainability',
  },
  {
    id: 'page-value-4',
    title: 'Criticism Addressed',
    content: 'Criticisms of longevity research have been thoroughly analyzed and resolved, reinforcing the movement’s validity',
  },
];

export default function FixedValue() {
  return (
    <>
      {VALUE_CONTENT.map((item) => (
        <div key={item.id} id={item.id} className="page-value-item fixed bottom-40 right-20 z-10 opacity-0">
          <h3 className="text-xl/6 font-semibold">{item.title}</h3>
          <p className="mt-4 w-[29.125rem] text-base font-semibold">{item.content}</p>
        </div>
      ))}
      <div id="value-end-1" className="fixed left-10 top-1/4 z-10 w-[27.1875rem] opacity-0">
        <h2 className="text-3xl font-bold uppercase">Purpose - driven fund - To extend human healthy lifespan</h2>
        <p className="mt-10 text-xl/5 font-bold uppercase">
          We attract as much resources, capital, talent, attention, into longevity
        </p>
        <p className="mt-10 text-xl/5 font-bold uppercase">
          Combine the best from West and East - from capital, to researcher and founder
        </p>
        <p className="mt-7.5 text-xl/5 font-bold uppercase">
          Support the portfolio with business acumen, strategy, and commercialization
        </p>
        <p className="mt-7.5 text-xl/5 font-bold uppercase">Audacity / moonshots / bold bets</p>
      </div>
      <div id="value-end-2" className="fixed right-10 top-1/4 z-10 grid gap-6 opacity-0">
        <div className="submit-btn !py-2.5 px-3.5">Stem Cell Therapy</div>
        <div className="submit-btn !py-2.5 px-3.5">Global Scientific Collaboration</div>
        <div className="submit-btn !py-2.5 px-3.5">Whole Body Replacement</div>
        <div className="submit-btn !py-2.5 px-3.5">Gene Therapy</div>
        <div className="submit-btn !py-2.5 px-3.5">Programmable Biology</div>
        <div className="submit-btn !py-2.5 px-3.5">Regulatory Innovation</div>
        <div className="submit-btn !py-2.5 px-3.5">AI Drug Discovery</div>
        <div className="submit-btn !py-2.5 px-3.5">Decentralized Biopower</div>
      </div>
    </>
  );
}