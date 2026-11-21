// RWD-10 A1: device decisions come from what the browser can do (media queries, capability probes), never from the
// user-agent string. The one reading allowed is analytics' bot check (a headless browser is not a visitor), which
// decides nothing about what the page shows.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const root = fileURLToPath(new URL('..', import.meta.url));
const sources = execFileSync('git', ['ls-files', 'src/*.ts', 'src/*.tsx', 'src/*.mjs', 'src/*.js'], {
  cwd: root,
  encoding: 'utf8',
})
  .trim()
  .split('\n');

const BOT_CHECK = ['src/lib/analytics/consent.ts', 'src/lib/analytics/head-script.ts'];
const READS_UA = /\bnavigator\.userAgent\b|\bn\.userAgent\b/;

describe('no user-agent sniffing (RWD-10)', () => {
  test('no source outside the analytics bot check reads navigator.userAgent', () => {
    const offenders = sources.filter(
      (file) => !BOT_CHECK.includes(file) && READS_UA.test(readFileSync(`${root}/${file}`, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });

  test('the bot check is the only reading left there, and it only looks for a headless browser', () => {
    for (const file of BOT_CHECK) {
      const lines = readFileSync(`${root}/${file}`, 'utf8')
        .split('\n')
        .filter((line) => READS_UA.test(line));
      expect(lines.length, file).toBe(1);
      expect(lines[0], file).toMatch(/\/Headless\/i\.test\(/);
    }
  });

  test('no react-device-detect import', () => {
    const offenders = sources.filter((file) =>
      /from ['"]react-device-detect['"]/.test(readFileSync(`${root}/${file}`, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });
});
