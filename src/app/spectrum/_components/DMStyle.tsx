import { PHONE_TREE_QUERY } from '@/styles/device-classes';

// Page-level rules, as a plain <style> built from the device classes (RWD-02): the phone and desktop rules follow the
// tree queries (src/styles/device-classes.ts), the same queries that decide which experience is mounted.
// No characters React would escape (<, >, &, quotes) may appear in CSS.
const CSS = `
  html,
  body {
    height: 100%;
  }

  /* RWD-01: a fixed root (100 %: 16 px, or the setting the visitor chose) on every route and width. */
  :root {
    font-size: 100%;
  }

  /* No viewport-scaled layout unit here (RWD-01): the tool pages are drawn at the 16 px root at every width, like
     the content pages, so no text falls under 12 px on a tablet or a laptop. */

  @media ${PHONE_TREE_QUERY} {
    body {
      height: 100%;
      overflow: hidden;
    }
  }

  .base-background2 {
    opacity: 0;
  }

  .disease-management-content {
    opacity: 1;
  }
    `;

export default function DMStyle() {
  return <style>{CSS}</style>;
}
