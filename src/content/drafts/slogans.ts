// Hero slogan drafts (CON-05: a fixed set of three per locale, no near-duplicates; CON-20: the copy edit).
import { defineDrafts } from './define';

const CON20 = { ref: 'idlife-audit figure CON-copy-strings (15 strings as shipped), master-plan CON-20' };

export const SLOGAN_DRAFTS = defineDrafts('slogans.ts', [
  {
    id: 'slogan-set-en',
    item: 'CON-05',
    title: 'Hero: three English slogans, in this order',
    body: {
      en: [
        '- Immortal Dragons is a purpose-driven longevity fund',
        '- Igniting the longevity revolution',
        '- Bringing global awareness of longevity',
      ].join('\n'),
    },
    approval: {
      status: 'draft',
      sources: [{ ref: 'src/content/slogans.ts (the six live English slogans)' }, CON20],
      questions: [
        '"Igniting" and "Catalysing longevity revolution" say the same thing: keep one (this draft keeps "Igniting" and adds the missing article).',
        'Drop "Setting forth unlimited human healthy lifespan" and "Harnessing collective recognition of the significance of Longevity", or keep them in the rewrites below?',
      ],
    },
  },
  {
    id: 'slogan-set-zh',
    item: 'CON-05',
    title: 'Hero: three Chinese slogans for the /zh locale, in this order',
    body: { en: '(Chinese slogans)', zh: ['- 破解永生密码', '- 突破衰老科学边界', '- 加速长寿技术革命'].join('\n') },
    approval: {
      status: 'draft',
      sources: [{ ref: 'src/content/slogans.ts (the six live Chinese slogans)' }],
      questions: ['Which three Chinese slogans should the /zh hero show (CON-03 adds the locale in wave 2)?'],
    },
  },
  {
    id: 'slogan-setting-forth',
    item: 'CON-20',
    title: 'Hero slogan rewrite: "Setting forth unlimited human healthy lifespan"',
    body: { en: 'Toward unlimited healthy human lifespan' },
    approval: {
      status: 'draft',
      replaces: 'Setting forth unlimited human healthy lifespan',
      sources: [CON20],
      questions: ['"Setting forth" is not idiomatic and the adjectives are stacked. Approve or reword.'],
    },
  },
  {
    id: 'slogan-collective-recognition',
    item: 'CON-20',
    title: 'Hero slogan rewrite: "Harnessing collective recognition of the significance of Longevity"',
    body: { en: 'Building global recognition of why longevity matters' },
    approval: {
      status: 'draft',
      replaces: 'Harnessing collective recognition of the significance of Longevity',
      sources: [CON20],
      questions: ['An abstract noun chain with a capital L. Approve or reword.'],
    },
  },
]);
