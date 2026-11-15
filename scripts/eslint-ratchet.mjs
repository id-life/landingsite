#!/usr/bin/env node
// ESLint warning ratchet (ENG-01). Lints the repository with eslint.config.mjs and fails when any rule reports more
// warnings than eslint-warnings.json records, or when there is any error. Warnings may only go down: after fixing
// some, run with --record and commit the lower numbers.
//   node scripts/eslint-ratchet.mjs            # check
//   node scripts/eslint-ratchet.mjs --record   # write today's counts
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'eslint-warnings.json');
const record = process.argv.includes('--record');

const results = await new ESLint({ cwd: ROOT }).lintFiles(['.']);
const byRule = {};
let errors = 0;
for (const result of results) {
  for (const message of result.messages) {
    if (message.severity === 2) {
      errors += 1;
      console.log(
        `error ${result.filePath.replace(`${ROOT}/`, '')}:${message.line} ${message.ruleId ?? ''} ${message.message}`,
      );
    } else {
      const rule = message.ruleId ?? '(no rule)';
      byRule[rule] = (byRule[rule] ?? 0) + 1;
    }
  }
}
const total = Object.values(byRule).reduce((a, b) => a + b, 0);
const sorted = Object.fromEntries(Object.entries(byRule).sort(([a], [b]) => a.localeCompare(b)));

if (record) {
  writeFileSync(FILE, `${JSON.stringify({ total, byRule: sorted }, null, 2)}\n`);
  console.log(`recorded ${total} warnings over ${Object.keys(sorted).length} rules in eslint-warnings.json`);
  process.exit(errors ? 1 : 0);
}

const recorded = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { total: 0, byRule: {} };
const grew = Object.entries(sorted).filter(([rule, n]) => n > (recorded.byRule[rule] ?? 0));
for (const [rule, n] of grew) console.log(`FAIL ${rule}: ${n} warnings (recorded ${recorded.byRule[rule] ?? 0})`);
const shrank = Object.entries(recorded.byRule).filter(([rule, n]) => (sorted[rule] ?? 0) < n);
if (shrank.length)
  console.log(`fewer warnings than recorded for ${shrank.map(([r]) => r).join(', ')}: run with --record and commit`);
console.log(`${total} warnings (recorded ${recorded.total}), ${errors} errors`);
process.exit(errors || grew.length ? 1 : 0);
