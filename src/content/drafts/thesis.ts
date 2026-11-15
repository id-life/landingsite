// /thesis (CON-07): assembled only from the published profile and the Connect criteria. The signed founder letter and
// the theme-by-theme reasoning must come from the owner; this draft is the frame they go into.
import { defineDrafts } from './define';

export const THESIS_DRAFTS = defineDrafts('thesis.ts', [
  {
    id: 'thesis-outline',
    item: 'CON-07',
    title: 'Thesis: page outline from published copy',
    body: {
      en: [
        'Investment themes: Replacement Strategy; Neuro & Brain Rejuvenation; Cells and Gene Therapy; Reproduction Technology.',
        'The Replacement Strategy rests on the fund\'s view that aging is the systemic wear of the body\'s "hardware": damage that is still reversible can be repaired, but irreversible damage can only be addressed by replacing tissues or organs with new ones. This area covers xenotransplantation, 3D bioprinting, tissue engineering and cryopreservation.',
        'How we decide: the fund treats scientific validity as the first threshold, requiring reproducible animal data and well-designed early-stage human studies. It prioritizes areas with clear regulatory pathways, sufficient technical validation and irreplaceable clinical need, rather than chasing trends. Because it views aging as a simultaneous imbalance across multiple pathways, organs and levels, it favors safe, multi-target combination interventions.',
        'Stage and size: pre-seed to Series A, companies valued under US$100 million; geographically agnostic. The fund also invests as an LP in other longbio funds.',
      ].join('\n'),
    },
    approval: {
      status: 'draft',
      sources: [
        { ref: 'src/content/profile.ts (themes, replacement-strategy, criteria)' },
        { ref: 'src/content/connect.ts (criteria: "Partnering with Pre-Seed to Series-A startups under $100m valuations.")' },
        { ref: 'src/content/fund.ts (geography, LP positions)' },
      ],
      questions: [
        'The signed, dated founder letter (600 to 1,000 words) on why replacement beats repair once damage is irreversible: it must be yours.',
        'Two sentences for each of the other three themes: nothing beyond their names is published.',
        'Which portfolio companies belong to which theme? The site does not say; this draft does not guess.',
        'CON-11 #7: are "longevity special economic zones" and "LP positions" themes or holdings?',
        'CON-11 #10: pre-seed or seed as the first stage.',
      ],
    },
  },
]);
