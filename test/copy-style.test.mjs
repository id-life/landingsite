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

// The owner's published text stays as he wrote it (his rule of 2026-11-16: no wording of his is changed for a style
// rule). His article gives the website as https://id.life, so that one file is exempt from the apex-domain rule.
const OWNER_TEXT = {
  // The owner's own Spectrum description, served word for word as his site serves it (2026-11-18).
  "Immortal Dragon's (possessive of the fund is Immortal Dragons')": ['src/content/pages.ts'],
  'apex-domain URL (canonical host is www.id.life)': ['src/content/articles/immortal-dragons-news-and-updates.md'],
};

const BANNED = {
  "Immortal Dragon's (possessive of the fund is Immortal Dragons')": /Immortal Dragon['’]s/,
  'apex-domain URL (canonical host is www.id.life)': /https?:\/\/id\.life\b/,
  // As text or a string (a comment that names the old literal is fine).
  'email in capitals': /['">]\s*CONTACT@ID\.LIFE/,
  'second contact address (removed with src/app/_about)': /dragons@id\.life/,
  'broken Tailwind class from the slogan list': /w-\[17\.375rem w-/,
  // The owner, 2026-11-18 (question 12h): "Healthy".
  '"Health" for "Healthy" Longevity and Medicine Conference': /\bHealth Longevity and Medicine\b/,
};

const PENDING = {
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
      expect(hits(pattern).filter((file) => !(OWNER_TEXT[name] ?? []).includes(file))).toEqual([]);
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
