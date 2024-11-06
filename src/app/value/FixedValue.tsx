type ValueContentItem = {
  id: string;
  title: string;
  content: string;
};
const VALUE_CONTENT: ValueContentItem[] = [
  {
    id: 'page-value-1',
    title: 'A New Dawn',
    content:
      'Emerging Breakthroughs In Science And Medicine Will Make Radically Longer Healthier Lifespans For All We Are Dedicated To Making That World A Reality',
  },
  {
    id: 'page-value-2',
    title: 'Advocacy And Evangelism',
    content:
      'Help The World Understand The Paramount Importance Of Developing Life Extension Technologies Mobilizing Global Awareness Talent And Resources In The Process',
  },
  {
    id: 'page-value-3',
    title: 'A Moral Endeavor',
    content:
      'Longer Healthier Lives And Less Suffering From Dementia Heart Disease And Other Age Related Conditions Are Inherently Moral Goals Do All We Can To Usher In Such A World',
  },
  {
    id: 'page-value-4',
    title: 'A Virtuous Cycle',
    content:
      'The Longevity Revolution Will Start With Bold Early Investments Creating A Virtuous Cycle Where Each Breakthrough Accelerates Progress And Attracts Further Talent Believers And Resources To The Cause',
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
      <div id="value-end-1" className="fixed left-10 top-1/2 z-10 w-[27.1875rem] -translate-y-1/2 opacity-0 invisible">
        <h2 className="text-3xl font-bold uppercase">Promising Early-Stage Ventures</h2>
        <ul className="list-mark-red-disc mt-9 flex flex-col gap-7.5 text-xl/5 font-bold uppercase">
          <li>Partnering with Pre-Seed to Series A startups under $100m valuations, fueling growth from concept to impact.</li>
          <li>Prioritizing talent, bold visions, and maximum human benefit over incremental gains and cautious approaches.</li>
        </ul>
      </div>
      <ul
        id="value-end-2"
        className="list-mark-red-disc fixed right-10 top-1/2 z-10 flex w-105 -translate-y-1/2 flex-col gap-7.5 text-right text-xl/5 font-bold uppercase opacity-0 invisible"
      >
        <li>
          East/West Access: Deep roots in both East and West, unlocking markets, capital, research institutions, and more.
        </li>
        <li>
          Industry Expertise: Sole focus on longevity biotech, linking partners with experts, top talent, and essential support.
        </li>
        <li>
          Founder Focused: Strategic partners, prioritizing founders' visions and long-term societal impact over short-term
          gains.
        </li>
      </ul>
    </>
  );
}
