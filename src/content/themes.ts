// The fund's four investment themes, as named in llms.txt, the JSON-LD (knowsAbout) and the 不朽真龙介绍 article.
// The organisation description still lists six areas (owner ruling pending, CON-11 #7); the plan's recommendation is
// the four themes, so new placements use these.
import { live } from './approval';
import { Theme, defineContent } from './schema';
import { z } from 'zod';

export const THEMES = defineContent('content/themes.ts', z.array(Theme), [
  { slug: 'replacement-strategy', order: 1, name: { en: 'Replacement Strategy', zh: '替换策略' }, approval: live() },
  {
    slug: 'neuro-brain-rejuvenation',
    order: 2,
    name: { en: 'Neuro & Brain Rejuvenation', zh: '神经与脑年轻化' },
    approval: live(),
  },
  { slug: 'cells-gene-therapy', order: 3, name: { en: 'Cells and Gene Therapy', zh: '细胞与基因疗法' }, approval: live() },
  { slug: 'reproduction-technology', order: 4, name: { en: 'Reproduction Technology', zh: '生殖技术' }, approval: live() },
]);
