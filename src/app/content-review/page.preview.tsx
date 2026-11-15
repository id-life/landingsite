// The owner's review page for drafts (CON-10). Preview builds only: next.config.mjs adds the `preview.tsx` page
// extension only when the build is not for production, so production has no such route and no chunk of it.
// It is noindex and linked from nowhere. See docs/content-approval.md.
import type { Metadata } from 'next';
import AboutView from '@/app/about/_components/AboutView';
import NewsStyle from '@/app/news/_components/NewsStyle';
import { PENDING_RULINGS } from '@/content/approval';
import * as content from '@/content';
import { ABOUT_DRAFTS, DRAFT_GROUPS } from '@/content/drafts';
import type { DraftRecord } from '@/content/schema';

export const metadata: Metadata = {
  title: 'Content review (preview only)',
  robots: { index: false, follow: false },
};

/** Which shipped records each pending ruling holds back from new placements (any record in the content index). */
function heldBack(ruling: string) {
  const found: string[] = [];
  const seen = new Set<unknown>();
  const walk = (value: unknown, path: string) => {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    const record = value as { approval?: { pendingRuling?: string }; name?: unknown; slug?: string; id?: string };
    if (record.approval?.pendingRuling === ruling) {
      const name = typeof record.name === 'string' ? record.name : (record.slug ?? record.id);
      found.push(name ? `${path.split('.')[0]} ${name}` : path);
    }
    for (const [key, child] of Object.entries(value)) if (key !== 'approval') walk(child, path ? `${path}.${key}` : key);
  };
  walk(content, '');
  return found;
}

function Lines({ text, lang }: { text: string; lang?: string }) {
  const lines = text.split('\n');
  if (lines.some((line) => line.startsWith('- ')))
    return (
      <ul lang={lang} className="list-disc pl-5">
        {lines.map((line) => (
          <li key={line}>{line.replace(/^- /, '')}</li>
        ))}
      </ul>
    );
  return (
    <div lang={lang} className="flex flex-col gap-2">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

function Draft({ draft }: { draft: DraftRecord }) {
  const { approval } = draft;
  return (
    <li id={draft.id} className="border-t border-black/10 py-6">
      <p className="text-xs font-bold uppercase text-red-600">
        {draft.item} · draft · {draft.id}
      </p>
      <h3 className="mt-1 text-lg font-semibold">{draft.title}</h3>
      {approval.replaces && (
        <p className="mt-2 text-sm text-black/60">
          <span className="font-semibold">Replaces:</span> {approval.replaces}
        </p>
      )}
      <div className="mt-3 border-l-4 border-red-600/60 pl-4 text-base/7">
        <Lines text={draft.body.en} />
        {draft.body.zh && (
          <div className="mt-2">
            <Lines text={draft.body.zh} lang="zh-CN" />
          </div>
        )}
      </div>
      {approval.questions?.length ? (
        <div className="mt-3">
          <p className="text-sm font-semibold">Questions for the owner</p>
          <ul className="list-disc pl-5 text-sm/6">
            {approval.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-3">
        <p className="text-sm font-semibold">Sources</p>
        <ul className="list-disc pl-5 text-sm/6 text-black/70">
          {approval.sources.map((source) => (
            <li key={source.ref}>
              {source.ref}
              {source.note && <span className="text-black/50"> ({source.note})</span>}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function ContentReviewPage() {
  const total = DRAFT_GROUPS.reduce((sum, group) => sum + group.drafts.length, 0);
  return (
    <>
      <NewsStyle />
      <div className="mx-auto w-[80rem] py-10 mobile:w-auto mobile:px-5">
        <section className="rounded-3xl bg-white p-12 mobile:rounded-lg mobile:p-5">
          <h1 className="text-3xl font-semibold">Content review</h1>
          <p className="mt-3 max-w-[52rem] text-base/7">
            {total} drafts wait for the owner. Nothing on this page is in production: this route does not exist in a production
            build, and a production build fails if any page imports a draft. To approve a draft, follow docs/content-approval.md
            (move it out of src/content/drafts with approvedBy and approvedAt).
          </p>
          <h2 className="mt-10 text-xl font-semibold">Facts waiting on a ruling</h2>
          <p className="mt-2 text-sm text-black/60">
            They keep rendering where they were live at the baseline; new placements (About, the home statement) leave them out
            until the ruling is recorded.
          </p>
          <ul className="mt-3 list-disc pl-5 text-base/7">
            {Object.entries(PENDING_RULINGS).map(([key, ruling]) => (
              <li key={key}>
                {ruling}
                {heldBack(ruling).length > 0 && (
                  <span className="text-black/50"> · holds back: {heldBack(ruling).join(', ')}</span>
                )}
              </li>
            ))}
          </ul>
          <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <a href="#about-in-context" className="underline">
              About page with its drafts
            </a>
            {DRAFT_GROUPS.map((group) => (
              <a key={group.id} href={`#group-${group.id}`} className="underline">
                {group.title} ({group.drafts.length})
              </a>
            ))}
          </nav>
        </section>

        <section id="about-in-context" className="mt-10">
          <h2 className="text-xl font-semibold">The About page as it would read with its drafts approved</h2>
          <AboutView drafts={ABOUT_DRAFTS} />
        </section>

        {DRAFT_GROUPS.map((group) => (
          <section key={group.id} id={`group-${group.id}`} className="mt-10 rounded-3xl bg-white p-12 mobile:p-5">
            <h2 className="text-xl font-semibold">{group.title}</h2>
            <ul>
              {group.drafts.map((draft) => (
                <Draft key={draft.id} draft={draft} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
