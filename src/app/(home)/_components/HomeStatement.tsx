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
      <h1 className="text-[max(1.375rem,17px)]/[1.35] font-semibold mobile:text-base/6">{FUND.statement.text.en}</h1>
      <dl className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[max(1rem,13px)]/[1.45] font-medium mobile:mt-2 mobile:justify-center mobile:text-xs/5">
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
      <StatementDoors className="mt-3 mobile:mt-2" />
    </HomeStatementFrame>
  );
}
