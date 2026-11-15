// SEO-06 metadata drafts: page descriptions under SEO-06's 70-character floor for which the page itself publishes no
// longer text to continue them with (src/content/pages.ts says which pages were continued from their own text).
import { defineDrafts } from './define';

export const METADATA_DRAFTS = defineDrafts('metadata.ts', [
  {
    id: 'description-influence-network',
    item: 'SEO-06',
    title: 'Meta description of /spectrum/influence-network',
    body: {
      en: 'An interactive map of people in the longevity field and how they are connected, where visitors can name who inspired them.',
      zh: '长寿领域人物影响力与关系图',
    },
    approval: {
      status: 'draft',
      replaces: '长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
      sources: [
        { ref: 'src/content/pages.ts (influence-network: the live description, 63 characters)' },
        {
          ref: 'src/components/character-relation/CharacterRelation.tsx and BePartOfIt.tsx (the graph of people and links; "BE PART OF IT", "Who inspired you?")',
        },
      ],
      questions: [
        'SEO-06 wants 70 to 170 characters and one language per description. Approve this English line (with the Chinese title kept for the Chinese reader), or reword it.',
        'Should the meta description be English only, Chinese only, or keep both languages as today?',
      ],
    },
  },
]);
