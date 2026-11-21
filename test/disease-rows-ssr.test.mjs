// CON-14 A6: the Disease Management page's server HTML holds every row name of both datasets (the page draws them),
// in one table per dataset; on a phone the rows past the first four are hidden by CSS until See More, by their place in
// the data; the See More button exists only for the phone (hidden above).
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';

vi.mock('@/../public/svgs/file.svg?component', () => ({ default: () => null }));

describe('disease rows in the server HTML', () => {
  test('every row name is rendered, phone extras hidden by CSS, See More phone-only', async () => {
    const { diseaseManagementStatusItems } = await import('@/constants/disease-management');
    const { default: Page } = await import('@/app/(content)/spectrum/disease-management/page');
    const html = renderToStaticMarkup(createElement(Page));
    const escape = (s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;');
    for (const item of diseaseManagementStatusItems) {
      for (const row of item.data)
        expect(html, String(Object.values(row)[0])).toContain(`>${escape(String(Object.values(row)[0]))}<`);
    }
    const tables = html.match(/<tbody[\s\S]*?<\/tbody>/g);
    expect(tables).toHaveLength(diseaseManagementStatusItems.length);
    tables.forEach((body, t) => {
      const rows = body.match(/<tr[^>]*>/g);
      expect(rows).toHaveLength(diseaseManagementStatusItems[t].data.length);
      rows.forEach((tr, i) => expect(/\bmobile:hidden\b/.test(tr), `table ${t} row ${i}`).toBe(i >= 4));
    });
    const buttons = html.match(/<button[^>]*>See More<\/button>/g);
    expect(buttons).toHaveLength(diseaseManagementStatusItems.filter((item) => item.data.length > 4).length);
    for (const b of buttons) expect(b).toMatch(/class="[^"]*\bhidden\b[^"]*\bmobile:flex\b/);
  });
});
