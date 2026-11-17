// Approval states shared by every record (CON-10). See docs/content-approval.md.
import type { ShippableApproval } from './schema';

/** Production at the audit baseline: copy live here is carried over, not new. */
export const BASELINE = 'www.id.life @ 6a90671 (2026-11-14)';

/**
 * Facts the owner has been asked to rule on (wave-0 ledger, CON-11; legal name: ENG-10 and CON-02). A legacy record
 * that carries one keeps rendering where it already did, but no new placement shows it until the ruling is recorded
 * here (then drop the key from the record and note the decision date beside the value).
 */
export const PENDING_RULINGS = {
  launchMonth: 'CON-11 #1: fund launch 2025-07-16 (press release) or August 2025 (milestones article)',
  foundingYear: 'CON-11 #2: is 2024 the founding year of the company, separate from the Fund I launch?',
  founders: 'CON-11 #3: is Boyang Wang the sole founder?',
  r3Bio: 'CON-11 #4: what may be disclosed about R3 Bio ("Stealth mode biotech" vs whole-body replacement)?',
  sponsors: 'CON-11 #5: 20 or 21 sponsored bodies (BioHackerDAO; the two Alzheimer associations)?',
  portfolioCount: "CON-11 #6: 15 or 16 portfolio companies (EONARK missing from the article table); does '15+' stay?",
  themes: 'CON-11 #7: the four named themes or the six areas of the organisation description?',
  conferenceName: 'CON-11 #8: "Health" or "Healthy" Longevity and Medicine Conference?',
  oxfordForum: 'CON-11 #9: is the Oxford Future Innovation Forum a sponsored body?',
  legalName: 'ENG-10 / CON-02: confirm the legal entity name IMMORTAL DRAGONS PRIVATE LIMITED',
} as const;

export type RulingKey = keyof typeof PENDING_RULINGS;

/** A record live at the baseline. Pass a ruling key when the owner has been asked to confirm it. */
export const live = (ruling?: RulingKey): ShippableApproval =>
  ruling
    ? { status: 'legacy', liveAt: BASELINE, pendingRuling: PENDING_RULINGS[ruling] }
    : { status: 'legacy', liveAt: BASELINE };

/** True when a record may appear in a NEW placement (the About page, the home statement). */
export const isConfirmed = (record: { approval: ShippableApproval }) =>
  record.approval.status === 'approved' || !record.approval.pendingRuling;
