// CON-05: who the fund is, in readable text on the first screen. Server-rendered in the home layout, so it is in the
// HTML before JavaScript and stays readable if WebGL fails or motion is reduced. Every word comes from the content
// layer; only confirmed records are shown (the launch date, the stage and the plan's draft sentence wait on the owner
// in src/content/drafts/home.ts).
import { isConfirmed } from '@/content/approval';
import { PORTFOLIO_COUNT } from '@/content/companies';
import { FUND } from '@/content/fund';
import { THEMES } from '@/content/themes';
import HomeStatementFrame, { StatementDoors } from './HomeStatementFrame';

export default function HomeStatement() {
  const facts = [
    isConfirmed(FUND.fundSize) && { label: FUND.fundSize.label.en, value: FUND.fundSize.value.en },
    { label: 'Portfolio', value: `${PORTFOLIO_COUNT} companies` },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <HomeStatementFrame>
      {/* Type roles (RWD-01): lead for the statement; body-sm for the facts and the themes (a list of names, not
          prose), or caption where the room is tight; label for the links. On phones body and caption, as before (16
          and 12 px). On the desktop deck the statement with its links, and the facts with the themes, are two parts
          that HomeStatementFrame places in the room the hero's art leaves: stacked at the top left, split between
          the top left and the top right, or the facts in the band under the art. The art never moves for them. */}
      <h1 className="text-lead font-semibold mobile:text-body mobile:leading-normal notMobile:leading-snug [@media(max-height:740px)]:mobile:text-body-sm">
        {FUND.statement.text.en}
      </h1>
      <StatementDoors className="mt-2 group-data-[hero-layout=wide]:order-last group-data-[hero-layout=wide]:mt-1.5 mobile:order-last mobile:mt-2 [@media(max-height:740px)]:mobile:mt-1" />
      <div
        data-hero-part="secondary"
        className="mt-2 flex flex-col gap-y-0.5 group-data-[hero-layout=wide]:mt-1 group-data-[hero-layout=below]:flex-row group-data-[hero-layout=below]:flex-wrap group-data-[hero-layout=split]:items-end group-data-[hero-layout=below]:items-center group-data-[hero-layout=below]:gap-x-8 group-data-[hero-layout=split]:text-right mobile:mt-2"
      >
        <dl className="flex flex-wrap gap-x-5 gap-y-0.5 text-body-sm font-medium group-data-[hero-layout=split]:justify-end group-data-[hero-tight=true]:text-caption mobile:justify-center mobile:text-caption shortScreen:justify-start">
          {facts.map((fact) => (
            <div key={fact.label} className="flex gap-1.5">
              <dt className="opacity-60">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <dl className="text-body-sm font-medium group-data-[hero-layout=below]:order-last group-data-[hero-layout=below]:basis-full group-data-[hero-tight=true]:text-caption mobile:text-caption [@media(max-height:740px)]:mobile:hidden">
          <dt className="inline opacity-60">Investment themes </dt>
          <dd className="inline">{THEMES.map((theme) => theme.name.en).join(' · ')}</dd>
        </dl>
      </div>
    </HomeStatementFrame>
  );
}
