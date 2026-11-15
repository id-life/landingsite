import { CONTEXT_PARAMS, EVENTS, KEY_EVENTS } from '@/lib/analytics/events';

type Desc = { t: 'string' | 'number'; required: boolean; doc: string; values?: readonly string[]; unit?: string };

/** The catalog as JSON (src/lib/analytics/events.json): the input of the Playwright contract tests. */
export function catalogJson() {
  return {
    generatedFrom: 'src/lib/analytics/events.ts',
    contextParams: CONTEXT_PARAMS,
    keyEvents: KEY_EVENTS,
    events: Object.fromEntries(
      Object.entries(EVENTS).map(([name, e]) => [
        name,
        {
          when: e.when,
          key: (e as { key?: boolean }).key === true,
          params: Object.fromEntries(
            Object.entries(e.params as Record<string, Desc>).map(([p, d]) => [
              p,
              {
                type: d.t,
                required: d.required,
                doc: d.doc,
                ...(d.values ? { values: d.values } : {}),
                ...(d.unit ? { unit: d.unit } : {}),
              },
            ]),
          ),
        },
      ]),
    ),
  };
}

/** The catalog as Markdown (src/lib/analytics/EVENTS.md). */
export function catalogMarkdown() {
  const lines = [
    '# Analytics events',
    '',
    'Generated from `src/lib/analytics/events.ts` (`UPDATE_ANALYTICS_DOCS=1 npm test` rewrites this file; `npm test` fails',
    'while it is stale). Send events only with `track()` from `src/lib/analytics/track.ts`.',
    '',
    `Key events (mark them in GA4 Admin): ${KEY_EVENTS.map((k) => `\`${k}\``).join(', ')}.`,
    '',
    '## Context added to every event',
    '',
    '| parameter | meaning |',
    '|---|---|',
    ...Object.entries(CONTEXT_PARAMS).map(([k, v]) => `| \`${k}\` | ${v} |`),
    '',
    '## Events',
    '',
  ];
  for (const [name, e] of Object.entries(EVENTS)) {
    lines.push(`### \`${name}\`${(e as { key?: boolean }).key ? ' (key event)' : ''}`, '', e.when, '');
    const params = Object.entries(e.params as Record<string, Desc>);
    if (!params.length) {
      lines.push('No parameters.', '');
      continue;
    }
    lines.push('| parameter | type | required | meaning |', '|---|---|---|---|');
    for (const [p, d] of params) {
      const type = d.values ? d.values.map((v) => `\`${v}\``).join(' \\| ') : d.unit ? `${d.t} (${d.unit})` : d.t;
      lines.push(`| \`${p}\` | ${type} | ${d.required ? 'yes' : 'no'} | ${d.doc} |`);
    }
    lines.push('');
  }
  lines.push(
    '## Owner: GA4 Admin',
    '',
    'Register every parameter above as an event-scoped custom dimension (limit 50), `load_ms` and the other `ms`',
    'parameters as custom metrics in milliseconds, and mark the key events listed at the top.',
    '',
  );
  return lines.join('\n');
}
