import { PHONE_TREE_QUERY } from '@/styles/device-classes';
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

  /* No viewport-scaled layout unit here (RWD-01): the tool pages are drawn at the 16 px root at every width, like
     the content pages, so no text falls under 12 px on a tablet or a laptop. */

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
