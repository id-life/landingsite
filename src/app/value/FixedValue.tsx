import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { Fragment } from 'react';

type ValueContentItem = {
  id: string;
  title: string;
  content: string;
  mobileSVGElement: JSX.Element;
  className?: string;
};
const VALUE_CONTENT: ValueContentItem[] = [
  {
    id: 'page-value-1',
    title: 'A New Dawn',
    content:
      'Our dedication is a world where emerging breakthroughs in science and medicine enable flourishing lifespans for all.',
    mobileSVGElement: (
      <h2
        id="value-1-svg-mobile"
        className="pointer-events-none fixed inset-x-5 top-[6.25rem] z-10 flex flex-col gap-1 whitespace-pre-wrap font-oxanium font-semibold uppercase opacity-0"
      >
        <span className="text-[3.625rem]/[3.625rem] text-red-500">A purpose-driven</span>
        <span className="text-[3.125rem]/[3.125rem]">longevity fund</span>
      </h2>
    ),
  },
  {
    id: 'page-value-2',
    title: 'As an Evangelist',
    content:
      'We help the world come to a better understanding of life extension technologies, galvanizing global consciousness, talents & resources in the process.',
    className: 'text-right mobile:text-left',
    mobileSVGElement: (
      <h2
        id="value-2-svg-mobile"
        className="pointer-events-none fixed inset-x-5 top-1/2 z-10 flex -translate-y-1/3 flex-col gap-1 whitespace-pre-wrap font-oxanium text-[3.125rem]/[3.125rem] font-semibold uppercase opacity-0"
      >
        <span>Discovering</span>
        <span className="text-[3.625rem]/[3.625rem] text-red-500">Champions</span>
        <span className="whitespace-pre-wrap">{'in\nLongevity Biotech'}</span>
      </h2>
    ),
  },
  {
    id: 'page-value-3',
    title: 'A Moral Endeavor',
    content:
      'We pursue longer, healthier lives and less suffering from age-related ailments, endeavoring all our might to bring this vision to reality.',
    mobileSVGElement: (
      <h2
        id="value-3-svg-mobile"
        className="pointer-events-none fixed inset-x-5 top-[6.25rem] z-10 flex flex-col gap-1 whitespace-pre-wrap font-oxanium text-[3.125rem]/[3.125rem] font-semibold uppercase opacity-0"
      >
        <span>{'Longevity\nBiotech\nIs A'}</span>
        <span className="text-[3.625rem]/[3.625rem] text-red-500">{'Moral\nImperative'}</span>
      </h2>
    ),
  },
  {
    id: 'page-value-4',
    title: 'A Virtuous Cycle',
    content:
      'We stand with bold early investments, where breakthroughs accelerate the cause, bringing further talents, supporters and resources.',
    className: 'text-right mobile:text-left',
    mobileSVGElement: (
      <h2
        id="value-4-svg-mobile"
        className="pointer-events-none fixed inset-x-5 top-1/2 z-10 flex -translate-y-1/4 flex-col gap-1 whitespace-pre-wrap text-center font-oxanium text-[3.125rem]/[3.125rem] font-semibold uppercase opacity-0"
      >
        <span className="text-[3.625rem]/[3.625rem] text-red-500">{'A Virtuous\nCycle'}</span>
        <span>{'behind\nAudacity'}</span>
      </h2>
    ),
  },
];

export default function FixedValue() {
  const isMobile = useIsMobile();
  return (
    <>
      {VALUE_CONTENT.map((item) => (
        <Fragment key={item.id}>
          {isMobile && item.mobileSVGElement}
          <div
            id={item.id}
            className={cn(
              'page-value-item fixed bottom-40 right-20 z-10 opacity-0 mobile:inset-x-5 mobile:bottom-15',
              item?.className,
            )}
          >
            <h3 className="text-xl/6 font-semibold mobile:text-sm/3.5">{item.title}</h3>
            <p className="mt-4 w-[29.125rem] text-base font-semibold mobile:mt-2.5 mobile:w-full mobile:text-xs/4.5">
              {item.content}
            </p>
          </div>
        </Fragment>
      ))}
      <div
        id="value-end-1"
        className="invisible fixed left-10 top-1/2 z-10 w-[27.1875rem] -translate-y-1/2 font-oxanium opacity-0 mobile:inset-x-5 mobile:top-[6.25rem] mobile:w-full mobile:transform-none"
      >
        <h2 className="text-3xl font-bold uppercase mobile:text-sm/4">Promising Early-Stage Ventures</h2>
        <ul className="list-mark-red-disc mt-9 flex flex-col gap-7.5 text-xl/5 font-bold uppercase mobile:mt-3 mobile:gap-2.5 mobile:text-xs/3.5">
          <li>Partnering with Pre-Seed to Series-A startups under $100m valuations.</li>
          <li>Prioritizing talents, bold visions and impactful human benefits.</li>
        </ul>
      </div>
      <ul
        id="value-end-2"
        className="list-mark-red-disc invisible fixed right-10 top-1/2 z-10 flex w-105 -translate-y-1/2 flex-col gap-7.5 text-right font-oxanium text-xl/5 font-bold uppercase opacity-0 mobile:inset-x-5 mobile:bottom-5 mobile:top-auto mobile:w-auto mobile:transform-none mobile:gap-3.5 mobile:text-left mobile:text-xs/3.5"
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
