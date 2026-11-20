// The Spectrum section's records: its five groups, the books translated and published, the data tools ("labs"),
// the papers, and (in ./grants.ts) the sponsored bodies. Presentation (icons, sizes, grids) stays in
// src/app/spectrum/_components/spectrumData.tsx, keyed by these slugs.
import { live } from './approval';
import { byOrigin } from './origin';
import type { Book, Copy, Lab, Paper } from './schema';

export const SPECTRUM_GROUPS: Copy[] = byOrigin('content/initiatives.ts#groups', [
  { id: 'translation-publishing', text: { en: 'Translation & Publishing', zh: '翻译与出版' }, approval: live() },
  { id: 'evangelism', text: { en: 'Evangelism', zh: '布道者' }, approval: live() },
  { id: 'digital-twin', text: { en: 'Digital Twin', zh: '数字孪生' }, approval: live() },
  { id: 'papers-reviews', text: { en: 'Papers & Reviews', zh: '论文与综述' }, approval: live() },
  { id: 'proudly-supporting', text: { en: 'Proudly Supporting', zh: '本机构赞助支持' }, approval: live() },
]);

export const BOOKS: Book[] = byOrigin('content/initiatives.ts#books', [
  { slug: 'bio-acc-manifesto', title: 'Bio/Acc Manifesto', url: 'https://bioacc.life/zh/', approval: live() },
  {
    slug: 'the-case-against-death',
    title: 'The case against death',
    url: 'https://book.douban.com/subject/38180553/',
    approval: live(),
  },
  {
    slug: 'the-network-state',
    title: 'The Network State',
    url: 'https://www.thenetworkstate-zh.com/foreword/',
    approval: live(),
  },
  {
    slug: 'better-with-age',
    title: 'Better With Age',
    url: 'https://book.douban.com/subject/37415399/?dt_dapp=1',
    approval: live(),
  },
  {
    slug: 'frontiers-of-longevity-science',
    title: 'Springer Nature, Frontiers of Longevity Science',
    url: 'https://link.springer.com/book/9783032327222',
    approval: live(),
  },
]);

export const LABS: Lab[] = byOrigin('content/initiatives.ts#labs', [
  { slug: 'influence-network', title: 'Influence Network', url: '/spectrum/influence-network', approval: live() },
  { slug: 'disease-management', title: 'Disease Management', url: '/spectrum/disease-management', approval: live() },
  {
    slug: 'longevity-trend-radar',
    title: 'Longevity Trend Radar',
    url: 'https://longevity-trend-radar.vercel.app',
    approval: live(),
  },
  // A section of the experience: a plain click moves there through the digital-twin hash route.
  { slug: 'digital-twin', title: 'Access Digital Twin', url: '/digitaltwin', routeKey: 'digital-twin', approval: live() },
]);

// `citations` is each paper's count at Crossref ("is-referenced-by-count"), read on 2026-11-17; OpenAlex and Semantic
// Scholar gave the same order that day. Refresh with: node scripts/paper-citations.mjs (it prints what changed).
export const PAPERS: Paper[] = byOrigin('content/initiatives.ts#papers', [
  {
    slug: 'mitochondrial-quality-control',
    title: 'Mitochondrial quality control as a central pharmacological target in aging',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41956139/',
    doi: '10.1016/j.phrs.2026.108188',
    citations: 6,
    approval: live(),
  },
  {
    slug: 'magnesium-bioenergetic-checkpoint',
    title: 'Magnesium as a Bioenergetic Checkpoint Linking Mitochondrial Function, Metabolic Disease, and Aging',
    url: 'https://onlinelibrary.wiley.com/doi/full/10.1111/acel.70578',
    doi: '10.1111/acel.70578',
    citations: 3,
    approval: live(),
  },
  {
    slug: 'glp-1-mitochondria-axis',
    title: 'The GLP-1–Mitochondria Axis in Metabolic Aging',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/acel.70676',
    doi: '10.1111/acel.70676',
    citations: 1,
    approval: live(),
  },
  {
    slug: 'ferroptosis-ovarian-senescence',
    title: 'Ferroptosis and ovarian senescence: integrating lipid metabolism, iron homeostasis, and established aging pathways',
    url: 'https://www.nature.com/articles/s41514-026-00508-0',
    doi: '10.1038/s41514-026-00508-0',
    citations: 0,
    approval: live(),
  },
  {
    slug: 'mtdna-heteroplasmy-clock',
    title: 'Clonal Mosaicism of Mitochondrial DNA Heteroplasmy as a Molecular Clock of Aging',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/acel.70718',
    doi: '10.1111/acel.70718',
    citations: 0,
    approval: live(),
  },
  {
    slug: 'spatial-multi-omics-translation',
    title: 'Reproducibility-driven clinical translation of spatial multi-omics in precision medicine',
    url: 'https://link.springer.com/article/10.1186/s12967-026-08988-0',
    doi: '10.1186/s12967-026-08988-0',
    citations: 0,
    approval: live(),
  },
]);

/**
 * The papers with the most cited first; papers with the same count keep the order they are listed in above.
 * (Array.prototype.sort is stable.)
 */
export const PAPERS_BY_CITATIONS: Paper[] = [...PAPERS].sort((a, b) => (b.citations ?? 0) - (a.citations ?? 0));

export const bySlug = <T extends { slug: string }>(list: T[], slug: string, where: string): T => {
  const found = list.find((entry) => entry.slug === slug);
  if (!found) throw new Error(`${where}: no record "${slug}"`);
  return found;
};
