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
      {/* Type roles (RWD-01): lead for the statement, body-sm for the facts, label for the links; on phones body
          and caption, as before (16 and 12 px). On the desktop deck the leading and gaps are tight so the block
          stays in the band between the header and the top of the glass ring. */}
      <h1 className="text-lead font-semibold mobile:text-body mobile:leading-normal notMobile:leading-snug [@media(max-height:740px)]:mobile:text-body-sm">
        {FUND.statement.text.en}
      </h1>
      <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-0.5 text-body-sm font-medium mobile:mt-2 mobile:justify-center mobile:text-caption shortScreen:justify-start">
        {facts.map((fact) => (
          <div key={fact.label} className="flex gap-1.5">
            <dt className="opacity-60">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
        <div className="basis-full [@media(max-height:740px)]:mobile:hidden">
          <dt className="inline opacity-60">Investment themes </dt>
          <dd className="inline">{THEMES.map((theme) => theme.name.en).join(' · ')}</dd>
        </div>
      </dl>
      <StatementDoors className="mt-2 mobile:mt-2 [@media(max-height:740px)]:mobile:mt-1" />
    </HomeStatementFrame>
  );
}
