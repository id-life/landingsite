// One markdown pipeline for every page that renders CMS or repository markdown (/news/[id], the two static
// news articles, podcast transcripts). Raw HTML in the source is parsed (rehype-raw) and then sanitised
// (rehype-sanitize): before this, script, iframe or meta-refresh markup in an article was emitted into the
// server-rendered HTML as is. Package imports only, so the unit tests load this module directly.
import type { Options } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

type Schema = typeof defaultSchema;
type RemarkPlugins = NonNullable<Options['remarkPlugins']>;
type RehypePlugins = NonNullable<Options['rehypePlugins']>;

/**
 * GitHub's defaults (headings, paragraphs, lists, links, images, tables, code, blockquote; links and
 * images only over http(s), mailto for links; no script, style, event handlers or inline styles), plus the
 * podcast timeline span and YouTube embeds.
 */
export const markdownSchema: Schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    span: [
      ...(defaultSchema.attributes?.span ?? []),
      ['className', 'custom-timeline'],
      'dataCustomType',
      'dataCustomParam',
      ['role', 'button'],
      'tabIndex',
    ],
    iframe: [
      ['src', /^https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\//],
      'title',
      'width',
      'height',
      'allow',
      'allowFullScreen',
      'frameBorder',
    ],
  },
};

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[] };

/** The sanitiser keeps an <iframe> whose src it refused as an empty frame; drop those frames entirely. */
function rehypeDropEmptyFrames() {
  const prune = (node: HastNode) => {
    if (!node.children) return;
    node.children = node.children.filter(
      (child) => !(child.type === 'element' && child.tagName === 'iframe' && !child.properties?.src),
    );
    node.children.forEach(prune);
  };
  return (tree: HastNode) => prune(tree);
}

/**
 * ENG-03: a table is a keyboard stop (tabindex 0). On phones the article tables scroll sideways in their own box, and a
 * scroll box that nothing in it can focus is out of a keyboard user's reach (axe scrollable-region-focusable). Nothing
 * is drawn until the table has the focus.
 */
function rehypeFocusableTables() {
  const walk = (node: HastNode) => {
    if (node.type === 'element' && node.tagName === 'table') node.properties = { ...node.properties, tabIndex: 0 };
    node.children?.forEach(walk);
  };
  return (tree: HastNode) => walk(tree);
}

export const markdownRemarkPlugins: RemarkPlugins = [remarkGfm];
export const markdownRehypePlugins: RehypePlugins = [
  rehypeRaw,
  [rehypeSanitize, markdownSchema],
  rehypeDropEmptyFrames,
  rehypeFocusableTables,
];

type MdNode = {
  type: string;
  value?: string;
  url?: string;
  title?: string | null;
  children?: MdNode[];
  data?: Record<string, unknown>;
};

const TOKEN = /@\[(\w+)]\(([^)]+)\)/;

/**
 * The element the transcript shows for @[type](param): a span whose text is the param, a button for assistive
 * technology and the keyboard (role button, a Tab stop; Enter and Space act as a click: PodcastContentTab).
 */
function timelineNode(type: string, param: string): MdNode {
  return {
    type: 'timeline',
    children: [{ type: 'text', value: param }],
    data: {
      hName: 'span',
      hProperties: {
        className: ['custom-timeline'],
        dataCustomType: type,
        dataCustomParam: param,
        role: 'button',
        tabIndex: 0,
      },
    },
  };
}

/** Splits @[type](param) tokens that stayed plain text (a param the parser did not take as a link). */
function splitText(value: string): MdNode[] {
  const out: MdNode[] = [];
  const token = new RegExp(TOKEN.source, 'g');
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = token.exec(value)) !== null) {
    const at = match.index;
    if (at > last) out.push({ type: 'text', value: value.slice(last, at) });
    out.push(timelineNode(match[1], match[2]));
    last = at + match[0].length;
  }
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

function transform(parent: MdNode) {
  const children = parent.children;
  if (!children) return;
  const out: MdNode[] = [];
  for (const child of children) {
    const previous = out[out.length - 1];
    // Markdown parses "@[timeline](01:07)" as the text "@" followed by a link to "01:07".
    if (
      child.type === 'link' &&
      previous?.type === 'text' &&
      previous.value?.endsWith('@') &&
      !child.title &&
      child.children?.length === 1 &&
      child.children[0].type === 'text' &&
      /^\w+$/.test(child.children[0].value ?? '') &&
      child.url
    ) {
      previous.value = previous.value.slice(0, -1);
      if (!previous.value) out.pop();
      out.push(timelineNode(child.children[0].value as string, child.url));
      continue;
    }
    if (child.type === 'text' && child.value && child.value.includes('@[')) {
      out.push(...splitText(child.value));
      continue;
    }
    transform(child);
    out.push(child);
  }
  parent.children = out;
}

/**
 * Turns @[timeline](mm:ss) in a podcast transcript into a clickable span, as a syntax-tree node. It replaced
 * a regex that built '<span data-custom-param="…">' strings from the transcript text, which let a crafted
 * param add attributes and markup.
 */
export function remarkTimeline() {
  return (tree: MdNode) => transform(tree);
}
