# Content approval (CON-10)

Agents may draft copy; nothing unapproved ships. This is enforced in code, not by convention.

## Three states

Every record in `src/content/` carries an `approval` (schema: `src/content/schema.ts`).

| State                      | Meaning                                                                                                         | Where it lives             | Can production render it?                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `legacy`                   | Live on www.id.life at the audit baseline (main @ 6a90671, 2026-11-14) and carried over verbatim. Not new copy. | `src/content/*.ts`         | Yes, where it already rendered and in derived outputs (llms.txt, JSON-LD).                                   |
| `legacy` + `pendingRuling` | As above, but the owner has been asked to confirm the fact (`PENDING_RULINGS` in `src/content/approval.ts`).    | `src/content/*.ts`         | Only where it already rendered. New placements (the About page, the home statement) skip it (`isConfirmed`). |
| `approved`                 | The owner approved it: `approvedBy` and `approvedAt` are required.                                              | `src/content/*.ts`         | Yes.                                                                                                         |
| `draft`                    | Written by an agent from published sources, each claim with its `sources`; may carry `questions` for the owner. | `src/content/drafts/` only | **Never.**                                                                                                   |

## How it is enforced

1. **Schema.** Records in `src/content/*.ts` are parsed with `ShippableApproval` when their module loads; a `draft`
   approval, or `approved` without `approvedBy` and `approvedAt`, throws and fails `next build`.
2. **Drafts cannot be imported by the site.** `src/content/drafts/index.ts` throws when it is evaluated in a
   production build (`NEXT_PUBLIC_DEPLOY_ENV === 'production'`), and ESLint forbids importing `@/content/drafts`
   anywhere except the review page and `src/content/drafts/` itself.
3. **The review page does not exist in production.** It is `src/app/content-review/page.preview.tsx`; `next.config.mjs`
   adds the `preview.tsx` page extension only when the build is not for production, so production has no such route
   and no chunk of it.
4. **Tests.** `test/content-approval.test.mjs` proves each rule (a draft in a shippable collection fails; the drafts
   module throws under a production deploy env; no file outside the allowed two imports drafts; the About page and the
   home statement render no record with a pending ruling). `scripts/check-no-drafts.mjs` greps a production build's
   output for every draft string.

## Reviewing drafts

On any non-production build (local, UAT, Vercel preview) open `/content-review`. It lists every draft beside its
sources and questions, grouped by deliverable, and renders the draft versions of the About page and the home
statement. It is `noindex` and linked from nowhere.

## Approving a draft

1. Move the record from `src/content/drafts/<file>.ts` into the matching `src/content/<file>.ts` (or replace the
   legacy record it `replaces`).
2. Set `approval: { status: 'approved', approvedBy: '<name>', approvedAt: 'YYYY-MM-DD' }`. Keep `sources`.
3. For a ruling, also delete the key from `PENDING_RULINGS` and remove it from the records that carry it; write the
   decision and its date in a comment beside the value.
4. `npm test` and `npm run build`. The parity tests tell you which other copies must change in the same commit.

Approvals are recorded in git history: the commit that flips a record to `approved` is the audit trail.
