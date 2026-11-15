// The Spectrum section's records: its five groups, the books translated and published, the data tools ("labs"),
// the papers, and (in ./grants.ts) the sponsored bodies. Presentation (icons, sizes, grids) stays in
// src/app/spectrum/_components/spectrumData.tsx, keyed by these slugs.
import { live } from './approval';
import type { Book, Copy, Lab, Paper } from './schema';

export const SPECTRUM_GROUPS: Copy[] = [
  { id: 'translation-publishing', text: { en: 'Translation & Publishing', zh: '翻译与出版' }, approval: live() },
  { id: 'evangelism', text: { en: 'Evangelism', zh: '布道者' }, approval: live() },
  { id: 'digital-twin', text: { en: 'Digital Twin', zh: '数字孪生' }, approval: live() },
  { id: 'peer-reviews', text: { en: 'Peer Reviews', zh: '论文与综述' }, approval: live() },
  { id: 'proudly-supporting', text: { en: 'Proudly Supporting', zh: '本机构赞助支持' }, approval: live() },
];

export const BOOKS: Book[] = [
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
];

export const LABS: Lab[] = [
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
];

export const PAPERS: Paper[] = [
  {
    slug: 'mitochondrial-quality-control',
    title: 'Mitochondrial quality control as a central pharmacological target in aging',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41956139/',
    approval: live(),
  },
  {
    slug: 'magnesium-bioenergetic-checkpoint',
    title: 'Magnesium as a Bioenergetic Checkpoint Linking Mitochondrial Function, Metabolic Disease, and Aging',
    url: 'https://onlinelibrary.wiley.com/doi/full/10.1111/acel.70578',
    approval: live(),
  },
  {
    slug: 'glp-1-mitochondria-axis',
    title: 'The GLP-1–Mitochondria Axis in Metabolic Aging',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/acel.70676',
    approval: live(),
  },
  {
    slug: 'ferroptosis-ovarian-senescence',
    title: 'Ferroptosis and ovarian senescence: integrating lipid metabolism, iron homeostasis, and established aging pathways',
    url: 'https://www.nature.com/articles/s41514-026-00508-0',
    approval: live(),
  },
  {
    slug: 'mtdna-heteroplasmy-clock',
    title: 'Clonal Mosaicism of Mitochondrial DNA Heteroplasmy as a Molecular Clock of Aging',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/acel.70718',
    approval: live(),
  },
  {
    slug: 'spatial-multi-omics-translation',
    title: 'Reproducibility-driven clinical translation of spatial multi-omics in precision medicine',
    url: 'https://link.springer.com/article/10.1186/s12967-026-08988-0',
    approval: live(),
  },
];

export const bySlug = <T extends { slug: string }>(list: T[], slug: string, where: string): T => {
  const found = list.find((entry) => entry.slug === slug);
  if (!found) throw new Error(`${where}: no record "${slug}"`);
  return found;
};
