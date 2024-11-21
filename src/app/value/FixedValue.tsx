import { cn } from '@/utils';

type ValueContentItem = {
  id: string;
  title: string;
  content: string;
  className?: string;
};
const VALUE_CONTENT: ValueContentItem[] = [
  {
    id: 'page-value-1',
    title: 'A New Dawn',
    content:
      'Our dedication is a world where emerging breakthroughs in science and medicine enable flourishing lifespans for all.',
  },
  {
    id: 'page-value-2',
    title: 'As an Evangelist',
    content:
      'We help the world come to a better understanding of life extension technologies, galvanizing global consciousness, talents & resources in the process.',
    className: 'text-right',
  },
  {
    id: 'page-value-3',
    title: 'A Moral Endeavor',
    content:
      'We pursue longer, healthier lives and less suffering from age-related ailments, endeavoring all our might to bring this vision to reality.',
  },
  {
    id: 'page-value-4',
    title: 'A Virtuous Cycle',
    content:
      'We stand with bold early investments, where breakthroughs accelerate the cause, bringing further talents, supporters and resources.',
    className: 'text-right',
  },
];

export default function FixedValue() {
  return (
    <>
      {VALUE_CONTENT.map((item) => (
        <div
          key={item.id}
          id={item.id}
          className={cn(
            'page-value-item fixed bottom-40 right-20 z-10 opacity-0 mobile:bottom-[12.8vw] mobile:right-[6.4vw]',
            item?.className,
          )}
        >
          <h3 className="text-xl/6 font-semibold mobile:text-base/5">{item.title}</h3>
          <p className="mt-4 w-[29.125rem] text-base font-semibold mobile:mt-[1.28vw] mobile:w-[50vw] mobile:text-sm/4">
            {item.content}
          </p>
        </div>
      ))}
      <div
        id="value-end-1"
        className="invisible fixed left-10 z-10 w-[27.1875rem] -translate-y-1/2 font-oxanium opacity-0 mobile:left-0 mobile:top-20 mobile:w-full mobile:transform-none mobile:pl-5"
      >
        <h2 className="text-3xl font-bold uppercase mobile:text-xl/5">Promising Early-Stage Ventures</h2>
        <ul className="list-mark-red-disc mt-9 flex flex-col gap-7.5 text-xl/5 font-bold uppercase mobile:mt-5 mobile:gap-3 mobile:text-base/5">
          <li>Partnering with Pre-Seed to Series-A startups under $100m valuations.</li>
          <li>Prioritizing talents, bold visions and impactful human benefits.</li>
        </ul>
      </div>
      <ul
        id="value-end-2"
        className="list-mark-red-disc invisible fixed right-10 top-1/2 z-10 flex w-105 -translate-y-1/2 flex-col gap-7.5 text-right font-oxanium text-xl/5 font-bold uppercase opacity-0 mobile:bottom-0 mobile:right-0 mobile:top-auto mobile:w-full mobile:transform-none mobile:text-base/5"
      >
        <li>
          East/West Access: Deep roots in both East and West, a conduit that bridges market, capital, institutions and more.
        </li>
        <li>
          Industry Expertise: Sole focus on longevity biotech, linking partners with experts, top talent, and essential support.
        </li>
        <li>{"Founder Focused: Strategic partners, prioritizing founders' visions and long-term societal impact."}</li>
      </ul>
    </>
  );
}
