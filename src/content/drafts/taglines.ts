// The 16 portfolio tagline drafts from the wave-0 copy pass (CON-15), using only each tagline's current wording.
import { defineDrafts } from './define';

const W0 = { ref: 'wave-0 w0-ux report, CON-15 (owner ask 4: approve the 16 tagline drafts and R3 Bio wording)' };
const tagline = (slug: string, current: string, draft: string, question?: string) => ({
  id: `tagline-${slug}`,
  item: 'CON-15',
  title: `Tagline: ${slug}`,
  body: { en: draft },
  approval: {
    status: 'draft' as const,
    replaces: current,
    sources: [W0, { ref: `src/content/companies.ts (${slug})` }],
    ...(question && { questions: [question] }),
  },
});

export const TAGLINE_DRAFTS = defineDrafts('taglines.ts', [
  tagline('healthspan-capital', 'Active early stage LongBio fund', 'Active early-stage longevity biotech fund'),
  tagline('frontier-bio', '3D Biofabrication', '3D biofabrication'),
  tagline('unlimited-bio', 'Combinatorial Gene Therapy', 'Combinatorial gene therapy'),
  tagline(
    'r3-bio',
    'Stealth mode biotech',
    'Stealth-mode biotech',
    'CON-11 #4: the 不朽真龙介绍 article (line 61) describes R3 Bio as 全身替换 (whole-body replacement) and cites MIT Technology Review. What may the tagline say?',
  ),
  tagline('immune-bridge', 'Allogenic Cell Therapies Platform', 'Allogeneic cell therapy platform'),
  tagline('cyclarity-therapeutics', 'Small molecules atherosclerosis solution', 'Small-molecule therapy for atherosclerosis'),
  tagline('kindbio', 'Integrated Organ Network', 'Integrated organ network'),
  tagline('mito-health', 'AI powered concierge doctor', 'AI-powered concierge doctor'),
  tagline('kangaroo-biomedical', 'Artificial Womb (AW) technology', 'Artificial womb technology'),
  tagline('renewal-bio', 'Ex Utero Synthetic Embryos', 'Ex utero synthetic embryos'),
  tagline('domayn', 'Neural Modulation Device', 'Neuromodulation device'),
  tagline('oisin-biotechnologies', 'Gene Therapy and Delivery Platform', 'Gene therapy and delivery platform'),
  tagline('etheros-pharmaceuticals', 'Small Molecule Therapy for ALS', 'Small-molecule therapy for ALS'),
  tagline(
    'longevity-technology',
    'The #1 destination for daily news and insights on the fast-growing longevity market',
    'Daily news and insights on the longevity market',
  ),
  tagline(
    'vitalia',
    'Accelerated longevity startups Special economic zone',
    'Special economic zone accelerating longevity startups',
  ),
]);
