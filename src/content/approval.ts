// Approval states shared by every record (CON-10). See docs/content-approval.md.
import type { ShippableApproval } from './schema';

/** Production at the audit baseline: copy live here is carried over, not new. */
export const BASELINE = 'www.id.life @ 6a90671 (2026-11-14)';

/**
 * The owner answered the CON-11 facts on 2026-11-18 (launch and founding date: never stated; Boyang Wang alone; R3 Bio
 * "Stealth mode biotech"; 21 sponsored bodies; 16 companies; the focus text unchanged; "Healthy"; the Oxford forum is
 * a sponsored event; no investment stage). Facts the owner has been asked to rule on (wave-0 ledger, CON-11; legal name: ENG-10 and CON-02). A legacy record
 * that carries one keeps rendering where it already did, but no new placement shows it until the ruling is recorded
 * here (then drop the key from the record and note the decision date beside the value).
 */
export const PENDING_RULINGS = {
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
