// DATA-11 / DATA-09: the event catalog is the single source of truth. Its generated docs must be current, and the
// catalog itself must follow the naming rules.
import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { EVENTS, KEY_EVENTS } from '@/lib/analytics/events';
import { KEY_EVENT_NAMES } from '@/lib/analytics/track';
import { catalogJson, catalogMarkdown } from './helpers/analytics-catalog-docs';

const MD = new URL('../src/lib/analytics/EVENTS.md', import.meta.url);
const JSON_FILE = new URL('../src/lib/analytics/events.json', import.meta.url);

describe('analytics event catalog', () => {
  test('names are snake_case, at most 40 characters', () => {
    for (const name of Object.keys(EVENTS)) {
      expect(name).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(name.length).toBeLessThanOrEqual(40);
      for (const param of Object.keys(EVENTS[name].params)) {
        expect(param).toMatch(/^[a-z][a-z0-9_]*$/);
        expect(param.length).toBeLessThanOrEqual(40);
        expect(param).not.toBe('event_label');
      }
    }
  });

  test('exactly the four planned key events', () => {
    expect([...KEY_EVENTS].sort()).toEqual(
      ['contact_intent', 'newsletter_subscribe', 'portfolio_outbound_click', 'podcast_play'].sort(),
    );
    expect([...KEY_EVENT_NAMES].sort()).toEqual([...KEY_EVENTS].sort());
  });

  test('EVENTS.md and events.json are generated from the catalog', () => {
    const md = catalogMarkdown();
    const json = `${JSON.stringify(catalogJson(), null, 2)}\n`;
    if (process.env.UPDATE_ANALYTICS_DOCS === '1') {
      writeFileSync(MD, md);
      writeFileSync(JSON_FILE, json);
    }
    expect(readFileSync(MD, 'utf8')).toBe(md);
    expect(readFileSync(JSON_FILE, 'utf8')).toBe(json);
  });
});
