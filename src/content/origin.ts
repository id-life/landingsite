// CON-10, approval by origin (the lead's ruling, 2026-11-20): the owner's own unchanged words are approved by origin.
// No approval here is written by hand. scripts/prove-origin.mjs compares each record's drawn text with what the
// owner's site has for it (the original's source tree and the pages it serves) and writes ./origin-proof.json: the
// origin it compared with, the date, and a fingerprint of every record whose every word was found there. A record is
// stamped approved here only while its fingerprint still matches that proof, so any later change to it (a word, a
// link, a figure) drops it back to `legacy` until the script proves it again. A record with any word that is not his
// is never stamped and the script lists it for him, unless those words are exactly what a named ruling of his set
// (the proof's second origin kind, with the ruling and its date). A record awaiting one of his rulings is never stamped.
import proof from './origin-proof.json';
import type { ShippableApproval } from './schema';

type Rec = { approval: ShippableApproval } & Record<string, unknown>;

const isRecord = (value: unknown): value is Rec =>
  !!value && typeof value === 'object' && !Array.isArray(value) && 'approval' in value;

/** The record's own data: every field but its approval and the records nested in it (they carry their own). */
function ownData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(ownData);
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) {
    const child = (value as Record<string, unknown>)[key];
    if (key === 'approval' || isRecord(child)) continue;
    out[key] = ownData(child);
  }
  return out;
}

// FNV-1a, two seeds: a change detector for the record's data, not a security measure.
const fnv = (text: string, seed: number) => {
  let hash = seed;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
};

/** Fingerprint of a record's own data. */
export function fingerprint(record: Rec): string {
  const text = JSON.stringify(ownData(record));
  return fnv(text, 2166136261) + fnv(text, 0x811c9dc5 ^ 0x5bd1e995);
}

/** Visits every record inside `value`, with a key naming it by its place (`NAME[slug]`, `NAME.field`). */
export function eachRecord(name: string, value: unknown, visit: (key: string, record: Rec) => void): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const id =
        item && typeof item === 'object' ? ((item as { slug?: string }).slug ?? (item as { id?: string }).id) : undefined;
      eachRecord(`${name}[${id ?? index}]`, item, visit);
    });
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (isRecord(value)) visit(name, value);
  for (const [key, child] of Object.entries(value)) if (key !== 'approval') eachRecord(`${name}.${key}`, child, visit);
}

const proven: Record<string, string> = proof.records;
// Records whose words the owner set himself by a ruling: the ruling is named, with its date, never a bare flag.
const ruled: Record<string, { fingerprint: string; ruling: string; rulingAt: string }> = proof.rulings;

/** Stamps the records in `value` that the origin proof covers, unchanged since it, as approved by origin. */
export function byOrigin<T>(name: string, value: T): T {
  eachRecord(name, value, (key, record) => {
    const { approval } = record;
    if (approval.status !== 'legacy' || approval.pendingRuling) return;
    const print = fingerprint(record);
    if (proven[key] === print) {
      record.approval = {
        status: 'approved',
        approvedBy: `by origin: ${proof.origin}`,
        approvedAt: proof.provedAt,
        sources: [{ ref: proof.origin, note: `the record's drawn text, word for word (scripts/prove-origin.mjs)` }],
      };
    } else if (ruled[key]?.fingerprint === print) {
      const { ruling, rulingAt } = ruled[key];
      record.approval = {
        status: 'approved',
        approvedBy: `by ${ruling}`,
        approvedAt: rulingAt,
        sources: [{ ref: ruling, note: `his words elsewhere, proven against ${proof.origin} on ${proof.provedAt}` }],
      };
    }
  });
  return value;
}
