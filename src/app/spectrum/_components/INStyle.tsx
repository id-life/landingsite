import { COMPACT_HEIGHT_QUERY, DESKTOP_TREE_QUERY, desktopTreeAnd, PHONE_TREE_QUERY } from '@/styles/device-classes';
import '@/styles/components/character-relation.css';

// Page-level rules, as a plain <style> built from the device classes (RWD-02): the phone and desktop rules follow the
// tree queries (src/styles/device-classes.ts), the same queries that decide which experience is mounted.
// No characters React would escape (<, >, &, quotes) may appear in CSS.
const CSS = `
  /* The page fills the window through a chain of 100 % heights, so every box between the root and the page has to
     carry the height on: the main landmark too (without it the graph is drawn a few pixels high). */
  html,
  body,
  #main-content {
    height: 100%;
  }

  /* RWD-01: a fixed root (100 %: 16 px, or the setting the visitor chose) on every route and width. */
  :root {
    font-size: 100%;
  }

  /* The layout unit (RWD-01): the original drew these pages at a root of 0.8333vw (12 px at 1440, 16 at 1920), so
     on the desktop tree layout and text written in rem scale as they did from 1200 px up (the owner's rule on font
     sizes), with a fixed 12 px unit (the original's 1440 size) below 1200.
     Type in the roles is real rem and keeps its floors. */
  @media ${DESKTOP_TREE_QUERY} {
    :root {
      --u: 0.8333vw;
    }
  }

  /* Below 1200 px (the tablet tier) the unit holds the original's 1440 size: 12 px. */
  @media ${desktopTreeAnd('(max-width: 1199.98px)')} {
    :root {
      --u: 12px;
    }
  }

  /* A phone in landscape takes the laptop arrangement of the form (the original drew it with the laptop layout), at
     the same fixed 12 px unit as a small laptop window. */
  @media ${COMPACT_HEIGHT_QUERY} {
    :root {
      --u: 12px;
    }
  }

  @media ${PHONE_TREE_QUERY} {
    body {
      height: 100%;
      overflow: hidden;
    }
  }
    `;

export default function INStyle() {
  return <style>{CSS}</style>;
}
