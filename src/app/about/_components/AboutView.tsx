// The About page (CON-01): the fund profile that used to be sent only to crawlers, as visible, server-rendered text.
// Everything comes from the content layer. A fact the owner has been asked to rule on (isConfirmed() false) is left
// out; the review page passes the drafts that would complete the page (founder, timeline, pending facts) so the owner
// sees the whole page before approving it. Production never receives drafts (src/content/drafts/guard.ts).
import { ReactNode } from 'react';
import { PORTFOLIO_COUNT } from '@/content/companies';
import { FUND, FUND_ADDRESS_LINE } from '@/content/fund';
import { isConfirmed } from '@/content/approval';
import { FUND_PRESS } from '@/content/press';
import { profileText } from '@/content/profile';
import { THEMES } from '@/content/themes';
import type { DraftRecord, ShippableApproval } from '@/content/schema';
import { cn } from '@/utils';

export const ABOUT_TITLE = 'About Immortal Dragons';

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

type Row = { label: string; value: ReactNode; approval: ShippableApproval };

/** The key facts, in the order llms.txt lists them; rows awaiting a ruling are dropped. */
function keyFactRows(): Row[] {
  const live = FUND.approval;
  const launchRelease = FUND_PRESS.find((item) => item.date === FUND.fundSize.asOf);
  const rows: Row[] = [
    { label: 'Name', value: `${FUND.name.en} (${FUND.name.zh})`, approval: live },
    {
      label: 'Headquarters',
      value: (
        <>
          {FUND.address.area}, {FUND.address.addressLocality}
          <span className="block font-normal text-black/60">{FUND_ADDRESS_LINE}</span>
        </>
      ),
      approval: live,
    },
    {
      label: FUND.fundSize.label.en,
      value: (
        <>
          {FUND.fundSize.value.en}
          {FUND.fundSize.asOf && (
            <span className="block font-normal text-black/60">
              as announced on <time dateTime={FUND.fundSize.asOf}>{formatDate(FUND.fundSize.asOf)}</time>
              {launchRelease && (
                <>
                  {' '}
                  (
                  <a href={launchRelease.url} className="underline underline-offset-2 hover:text-red-600">
                    {launchRelease.source}
                  </a>
                  )
                </>
              )}
            </span>
          )}
        </>
      ),
      approval: FUND.fundSize.approval,
    },
    {
      label: FUND.statedInvestments.label.en,
      // The count is computed from the portfolio records (the plan's recommendation for CON-11 #6), never typed.
      value: (
        <a href="/portfolio" className="underline underline-offset-2 hover:text-red-600">
          {PORTFOLIO_COUNT} companies in the portfolio
        </a>
      ),
      approval: live,
    },
    { label: FUND.stage.label.en, value: `${FUND.stage.value.en}, ${FUND.geography.value.en}`, approval: FUND.stage.approval },
    { label: 'Investment themes', value: THEMES.map((theme) => theme.name.en).join(', '), approval: live },
    { label: FUND.lpPositions.label.en, value: FUND.lpPositions.value.en, approval: FUND.lpPositions.approval },
    { label: FUND.legalName.label.en, value: FUND.legalName.value.en, approval: FUND.legalName.approval },
    { label: FUND.foundingYear.label.en, value: FUND.foundingYear.value.en, approval: FUND.foundingYear.approval },
    {
      label: 'Website',
      value: (
        <a href={FUND.website} className="underline underline-offset-2 hover:text-red-600">
          {FUND.website.replace(/^https:\/\//, '')}
        </a>
      ),
      approval: live,
    },
    {
      label: 'Contact',
      value: (
        <a href={`mailto:${FUND.email}`} className="underline underline-offset-2 hover:text-red-600">
          {FUND.email}
        </a>
      ),
      approval: live,
    },
  ];
  return rows.filter((row) => isConfirmed({ approval: row.approval }));
}

const READ_MORE = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/news/immortal-dragons-news-and-updates', label: '不朽真龙介绍 (profile, in Chinese)' },
  { href: '/news/immortal-dragons-milestones-and-portfolio', label: 'Immortal Dragons: Milestones and Portfolio (in Chinese)' },
  { href: '/insights', label: 'Insights' },
  { href: '/connect', label: 'Connect' },
];

function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section
      className={cn('mt-14 mobile:mt-10', className)}
      aria-labelledby={`about-${title.replace(/\W+/g, '-').toLowerCase()}`}
    >
      <h2
        id={`about-${title.replace(/\W+/g, '-').toLowerCase()}`}
        className="font-oxanium text-2xl/8 font-bold uppercase mobile:text-lg/6"
      >
        {title}
      </h2>
      <div className="mt-5 flex flex-col gap-4 text-base/7 mobile:text-[0.9375rem]/6">{children}</div>
    </section>
  );
}

/** A draft block, shown only on the review page: dashed red frame and a label. */
function DraftBlock({ draft }: { draft: DraftRecord }) {
  const lines = draft.body.en.split('\n');
  return (
    <div className="relative mt-10 border-2 border-dashed border-red-600/70 p-6 mobile:p-4" data-draft={draft.id}>
      <p className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold uppercase tracking-wide text-red-600">
        Draft, not in production: {draft.title}
      </p>
      {lines.some((line) => line.startsWith('- ')) ? (
        <ul className="list-disc pl-5 text-base/7">
          {lines.map((line) => (
            <li key={line}>{line.replace(/^- /, '')}</li>
          ))}
        </ul>
      ) : (
        lines.map((line) => (
          <p key={line} className="text-base/7">
            {line}
          </p>
        ))
      )}
    </div>
  );
}

export default function AboutView({ drafts = [] }: { drafts?: DraftRecord[] }) {
  const rows = keyFactRows();
  const draft = (id: string) => drafts.find((entry) => entry.id === id);
  const show = (id: string) => {
    const entry = draft(id);
    return entry ? <DraftBlock draft={entry} /> : null;
  };

  return (
    <article className="mt-10 rounded-3xl bg-white p-20 mobile:mt-3 mobile:rounded-lg mobile:p-5">
      <h1 className="font-oxanium text-[2.375rem]/[3rem] font-bold uppercase mobile:text-2xl/8">{ABOUT_TITLE}</h1>
      <p className="mt-6 max-w-[52rem] text-xl/8 font-medium mobile:text-base/7">{profileText('about-summary').en}</p>
      {show('about-intro-full')}

      <Section title="Key facts">
        <dl className="grid grid-cols-[14rem_1fr] border-t border-black/10 mobile:grid-cols-1">
          {rows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="border-b border-black/10 py-3 pr-6 text-sm/6 font-semibold uppercase text-black/50 mobile:border-0 mobile:pb-0">
                {row.label}
              </dt>
              <dd className="border-b border-black/10 py-3 font-semibold mobile:pt-1">{row.value}</dd>
            </div>
          ))}
        </dl>
        {show('about-key-facts-pending')}
      </Section>

      <Section title="Investment themes">
        <ol className="list-decimal pl-6 font-semibold">
          {THEMES.map((theme) => (
            <li key={theme.slug}>{theme.name.en}</li>
          ))}
        </ol>
        <p>{profileText('investment-areas').en}</p>
        <p>{profileText('replacement-strategy').en}</p>
        <p>{profileText('criteria').en}</p>
      </Section>

      {draft('about-founder') && <Section title="Founder">{show('about-founder')}</Section>}

      {draft('about-timeline') && <Section title="Timeline">{show('about-timeline')}</Section>}

      <Section title="Advocacy">
        <ul className="list-disc pl-6">
          {profileText('advocacy')
            .en.split('\n')
            .map((line) => (
              <li key={line}>{line}</li>
            ))}
        </ul>
      </Section>

      <Section title="Media coverage (selected)">
        <p>{profileText('media-coverage').en}</p>
        <ul className="list-disc pl-6">
          {FUND_PRESS.map((item) => (
            <li key={item.url}>
              <a href={item.url} className="underline underline-offset-2 hover:text-red-600">
                {item.title}
              </a>{' '}
              <span className="text-black/60">
                {item.source}
                {item.date && (
                  <>
                    , <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Read more">
        <ul className="flex flex-col gap-2">
          {READ_MORE.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="font-semibold underline underline-offset-2 hover:text-red-600">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </article>
  );
}
