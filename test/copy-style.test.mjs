// CON-20: the copy follows docs/content-style.md. A banned variant anywhere in src fails; variants that wait on an
// owner ruling or an approved draft are listed with the files that still hold them, so they cannot spread. When the
// owner decides, move the variant from PENDING to BANNED (and fix the copy in the same commit).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// Drafts may quote the strings they replace; the style applies to what ships.
const files = walk('src')
  .filter((file) => /\.(tsx?|mjs|md|json)$/.test(file))
  .filter((file) => !relative('src', file).startsWith('content/drafts/'));
const corpus = files.map((file) => ({ file, text: readFileSync(file, 'utf8') }));
const hits = (pattern) => corpus.filter(({ text }) => pattern.test(text)).map(({ file }) => file);

const BANNED = {
  "Immortal Dragon's (possessive of the fund is Immortal Dragons')": /Immortal Dragon['’]s/,
  'apex-domain URL (canonical host is www.id.life)': /https?:\/\/id\.life\b/,
  // As text or a string (a comment that names the old literal is fine).
  'email in capitals': /['">]\s*CONTACT@ID\.LIFE/,
  'second contact address (removed with src/app/_about)': /dragons@id\.life/,
  'broken Tailwind class from the slogan list': /w-\[17\.375rem w-/,
};

const PENDING = {
  // CON-11 #8: "Health" or "Healthy" Longevity and Medicine Conference.
  'Health Longevity and Medicine': { pattern: /Health Longevity and Medicine/, files: ['src/content/grants.ts'] },
  // CON-15 tagline drafts (src/content/drafts/taglines.ts).
  Allogenic: { pattern: /\bAllogenic\b/, files: ['src/content/companies.ts'] },
  LongBio: { pattern: /\bLongBio\b/, files: ['src/content/companies.ts'] },
  // CON-05 / CON-20 slogan drafts: keep "Igniting" or "Catalysing"; US spelling once approved.
  Catalysing: { pattern: /\bCatalysing\b/, files: ['src/content/slogans.ts'] },
  // CON-20 copy-edit draft (Spectrum group label).
  '布道者 as a group label': { pattern: /text: \{ en: 'Evangelism', zh: '布道者' \}/, files: ['src/content/initiatives.ts'] },
};

describe('copy style', () => {
  for (const [name, pattern] of Object.entries(BANNED)) {
    test(`no ${name}`, () => {
      expect(hits(pattern)).toEqual([]);
    });
  }

  for (const [name, { pattern, files: allowed }] of Object.entries(PENDING)) {
    test(`"${name}" waits on the owner and appears only where it already was`, () => {
      expect(hits(pattern)).toEqual(allowed);
    });
  }

  test('one module holds the subscribe promises (src/content/subscribe.ts)', () => {
    expect(hits(/longevity circle for priority access|receive the latest insights & research/i)).toEqual([
      'src/content/subscribe.ts',
    ]);
  });
});
