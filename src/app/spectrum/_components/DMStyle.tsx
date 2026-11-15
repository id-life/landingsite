import { DESKTOP_TREE_QUERY, PHONE_TREE_QUERY } from '@/styles/device-classes';

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

  /* The layout unit: what the root used to be (0.8333vw above the phone tree), so layout in rem draws as before
     (scripts/postcss-layout-unit.js). Type in the roles is real rem and keeps its floors. */
  @media ${DESKTOP_TREE_QUERY} {
    :root {
      --u: 0.8333vw;
    }
  }

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
