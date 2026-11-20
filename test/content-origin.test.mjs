// CON-10, approval by origin (src/content/origin.ts): a record is approved only while src/content/origin-proof.json,
// written by scripts/prove-origin.mjs, holds its current fingerprint; a changed record, a record the proof does not
// cover and a record awaiting a ruling stay legacy. No approval is written by hand in src/content.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import proof from '@/content/origin-proof.json';
import { byOrigin, eachRecord, fingerprint } from '@/content/origin';
import { CONTENT_ENTRIES } from '@/content/validate';

const legacy = () => ({ status: 'legacy', liveAt: 'baseline' });
const record = (text) => ({ id: 'x', text: { en: text }, approval: legacy() });

describe('approval by origin', () => {
  test('the proof names its origin and date, and every record it covers is stamped with them', () => {
    expect(proof.origin.length).toBeGreaterThan(0);
    expect(proof.provedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const stamped = [];
    for (const [name, , data] of CONTENT_ENTRIES)
      eachRecord(name, data, (key, rec) => {
        if (key in proof.records) {
          expect(rec.approval).toMatchObject({
            status: 'approved',
            approvedBy: `by origin: ${proof.origin}`,
            approvedAt: proof.provedAt,
          });
          stamped.push(key);
        } else expect(rec.approval.status).toBe('legacy');
      });
    expect(stamped.length).toBe(Object.keys(proof.records).length);
  });

  test('a record changed since the proof, or not in it, stays legacy', async () => {
    const { COMPANIES } = await import('@/content/companies');
    const company = COMPANIES.find((c) => `content/companies.ts[${c.slug}]` in proof.records);
    const copy = (edit) => ({ ...structuredClone({ ...company, approval: undefined }), ...edit, approval: legacy() });
    expect(byOrigin('content/companies.ts', [copy({})])[0].approval.status).toBe('approved');
    expect(byOrigin('content/companies.ts', [copy({ name: `${company.name} edited` })])[0].approval.status).toBe('legacy');
    expect(byOrigin('content/companies.ts', [copy({ url: 'https://elsewhere.test/' })])[0].approval.status).toBe('legacy');
    expect(byOrigin('not-in-the-proof', [record('His words')])[0].approval.status).toBe('legacy');
  });

  test('a record awaiting a ruling is never stamped, even when its words are his', () => {
    const awaiting = { id: 'x', text: { en: 'w' }, approval: { ...legacy(), pendingRuling: 'ask' } };
    const key = Object.keys(proof.records)[0];
    const [name] = key.split(/[[.]/);
    expect(byOrigin(name, awaiting).approval.status).toBe('legacy');
  });

  test('the fingerprint covers every field but the approval, nested records excluded', () => {
    const a = { title: 'T', url: 'https://a.test/', approval: legacy() };
    expect(fingerprint({ ...a, url: 'https://b.test/' })).not.toBe(fingerprint(a));
    expect(fingerprint({ ...a, approval: { status: 'approved' } })).toBe(fingerprint(a));
    expect(fingerprint({ ...a, child: { x: 1, approval: legacy() } })).toBe(fingerprint(a));
  });

  test('no file in src/content writes an approval by hand', () => {
    const dir = 'src/content';
    for (const name of readdirSync(dir).filter((n) => n.endsWith('.ts') && n !== 'origin.ts' && n !== 'schema.ts')) {
      expect(readFileSync(join(dir, name), 'utf8'), name).not.toMatch(/status:\s*'approved'|approvedBy:|approvedAt:/);
    }
  });
});
