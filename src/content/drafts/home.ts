// Drafts for the home statement (CON-05). The shipping statement uses only published, confirmed records
// (src/app/(home)/_components/HomeStatement.tsx); these are the parts that need the owner.
import { defineDrafts } from './define';

export const HOME_DRAFTS = defineDrafts('home.ts', [
  {
    id: 'home-statement-sentence',
    item: 'CON-05',
    title: 'Home: one sentence that says what the fund invests in',
    body: {
      en: 'Immortal Dragons is a Singapore longevity fund backing moonshot replacement, neuro, gene and reproductive technologies from pre-seed to Series A.',
      zh: '不朽真龙是总部位于新加坡的长寿基金，从种子前到 A 轮投资替换、神经、基因与生殖等登月型技术。',
    },
    approval: {
      status: 'draft',
      replaces: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore.',
      sources: [
        { ref: 'master-plan CON-05 proposal (draft sentence, en and zh)' },
        { ref: 'src/content/themes.ts (the four themes); src/content/fund.ts (stage)' },
      ],
      questions: ['Approve the sentence; it names the stage, which waits on CON-11 #10 (pre-seed or seed).'],
    },
  },
  {
    id: 'home-launch-fact',
    item: 'CON-05',
    title: 'Home: the dated launch fact',
    body: { en: 'Fund I launched July 2025' },
    approval: {
      status: 'draft',
      sources: [
        { ref: 'src/content/press.ts: Yahoo Finance release dated 2025-07-16' },
        { ref: 'src/content/articles/immortal-dragons-milestones-and-portfolio.md:5 (August 2025)' },
      ],
      questions: ['CON-11 #1: July 2025 or August 2025?'],
    },
  },
  {
    id: 'home-doors',
    item: 'CON-05',
    title: 'Home: one door per audience',
    body: {
      en: [
        '- For founders: pitch us (Connect)',
        '- For LPs and partners: about the fund (About)',
        '- Latest: news and talks (Insights)',
      ].join('\n'),
    },
    approval: {
      status: 'draft',
      sources: [{ ref: 'master-plan CON-05 proposal (three doors: For founders, For LPs and partners, Latest)' }],
      questions: [
        'There is no Pitch page yet (CON-06, wave 2): until then founders go to Connect and contact@id.life. Approve the labels.',
      ],
    },
  },
]);
