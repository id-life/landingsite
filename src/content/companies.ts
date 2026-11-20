// The portfolio, in display order. Data only: the logo's size on a tile and the particle image are presentation,
// kept in src/app/portfolio/_components/portfolioData.tsx keyed by slug. Adding a company = one record here plus its
// two presentation entries there; /portfolio, llms.txt, the JSON-LD and the counts follow.
// Taglines are the published wording; the w0 copy pass drafted edits (src/content/drafts/taglines.ts).
// Retro Biosciences ("Cellular Partial Reprogramming") was commented out of the portfolio at the baseline; its logo
// and particle images are still in public/imgs.
import { live } from './approval';
import { byOrigin } from './origin';
import type { Company } from './schema';

export const COMPANIES: Company[] = byOrigin('content/companies.ts', [
  {
    slug: 'healthspan-capital',
    name: 'Healthspan Capital',
    tagline: { en: 'Active early stage LongBio fund' },
    url: 'https://www.healthspancapital.vc/',
    logo: '/imgs/investments/healthspan.webp',
    logoAlt: 'Healthspan Capital logo - Active early stage LongBio fund',
    approval: live(),
  },
  {
    slug: 'frontier-bio',
    name: 'Frontier Bio',
    tagline: { en: '3D Biofabrication' },
    url: 'https://www.frontierbio.com/',
    logo: '/imgs/investments/frontier-bio.webp',
    logoAlt: 'Frontier Bio logo - 3D Biofabrication',
    approval: live(),
  },
  {
    slug: 'unlimited-bio',
    name: 'Unlimited Bio',
    tagline: { en: 'Combinatorial Gene Therapy' },
    url: 'https://www.unlimited.bio/',
    logo: '/imgs/investments/unlimited.webp',
    logoAlt: 'Unlimited Bio logo - Combinatorial Gene Therapy',
    approval: live(),
  },
  {
    slug: 'r3-bio',
    name: 'R3 Bio',
    tagline: { en: 'Stealth mode biotech' },
    logo: '/imgs/investments/r3.webp',
    logoAlt: 'R3 Bio logo - Stealth mode biotech',
    approval: live(),
  },
  {
    slug: 'immune-bridge',
    name: 'Immune Bridge',
    tagline: { en: 'Allogenic Cell Therapies Platform' },
    url: 'https://www.immunebridge.com/',
    logo: '/imgs/investments/immune-bridge.webp',
    logoAlt: 'Immune Bridge logo - Allogenic Cell Therapies Platform',
    approval: live(),
  },
  {
    slug: 'cyclarity-therapeutics',
    name: 'Cyclarity Therapeutics',
    tagline: { en: 'Small molecules atherosclerosis solution' },
    url: 'https://cyclaritytx.com/',
    logo: '/imgs/investments/cyclarity.webp',
    logoAlt: 'Cyclarity Therapeutics logo - Small molecules atherosclerosis solution',
    approval: live(),
  },
  {
    slug: 'kindbio',
    name: 'KindBio',
    tagline: { en: 'Integrated Organ Network' },
    url: 'https://kindbiotechnology.com/',
    logo: '/imgs/investments/kindbio.webp',
    logoAlt: 'KindBio logo - Integrated Organ Network',
    approval: live(),
  },
  {
    slug: 'mito-health',
    name: 'Mito Health',
    tagline: { en: 'AI powered concierge doctor' },
    url: 'https://mitohealth.com/',
    logo: '/imgs/investments/mito.webp',
    logoAlt: 'Mito Health logo - AI powered concierge doctor',
    approval: live(),
  },
  {
    slug: 'kangaroo-biomedical',
    name: 'Kangaroo Biomedical',
    tagline: { en: 'Artificial Womb (AW) technology' },
    logo: '/imgs/investments/kangaroo-biomedical.webp',
    logoAlt: 'Kangaroo Biomedical logo - Artificial Womb technology',
    approval: live(),
  },
  {
    slug: 'renewal-bio',
    name: 'Renewal Bio',
    tagline: { en: 'Ex Utero Synthetic Embryos' },
    url: 'https://www.renewal.bio/',
    logo: '/imgs/investments/renewal-bio.webp',
    logoAlt: 'RenewalBio logo - Ex utero synthetic embryos',
    approval: live(),
  },
  {
    slug: 'domayn',
    name: 'DOMAYN',
    tagline: { en: 'Neural Modulation Device' },
    url: 'https://domayn.com/',
    logo: '/imgs/investments/domayn.webp',
    logoAlt: 'DOMAYN logo - Neural Modulation Device',
    approval: live(),
  },
  {
    slug: 'oisin-biotechnologies',
    name: 'Oisin Biotechnologies',
    tagline: { en: 'Gene Therapy and Delivery Platform' },
    url: 'https://www.oisinbio.com/',
    logo: '/imgs/investments/oisin.webp',
    logoAlt: 'Oisin Biotechnologies logo - Gene Therapy and Delivery Platform',
    approval: live(),
  },
  {
    slug: 'etheros-pharmaceuticals',
    name: 'Etheros Pharmaceuticals',
    tagline: { en: 'Small Molecule Therapy for ALS' },
    url: 'https://etherospharma.com/',
    logo: '/imgs/investments/etheros.webp',
    logoAlt: 'Etheros Pharmaceuticals logo - Small Molecule Therapy for ALS',
    approval: live(),
  },
  {
    slug: 'longevity-technology',
    name: 'Longevity.Technology',
    tagline: { en: 'The #1 destination for daily news and insights on the fast-growing longevity market' },
    url: 'https://longevity.technology/',
    logo: '/imgs/investments/longevity.webp',
    logoAlt: 'Longevity.Technology logo - Daily news and insights on longevity market',
    approval: live(),
  },
  {
    slug: 'vitalia',
    name: 'Vitalia',
    tagline: { en: 'Accelerated longevity startups Special economic zone' },
    // The site link is switched off at the baseline (https://vitalia.city/ is commented out).
    logo: '/imgs/investments/vitalia.webp',
    logoAlt: 'Vitalia logo - Accelerated longevity startups special economic zone',
    approval: live(),
  },
  {
    slug: 'eonark',
    name: 'EONARK',
    tagline: { en: 'AI-driven longevity drug discovery' },
    url: 'https://eonark.ai/',
    logo: '/imgs/investments/eonark.svg',
    logoAlt: 'EONARK logo - AI-driven longevity drug discovery',
    approval: live(),
  },
]);

/** The portfolio count, computed (never typed): the plan's recommendation for CON-11 #6. */
export const PORTFOLIO_COUNT = COMPANIES.length;
