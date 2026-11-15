// The hero slogans, in their published order. The English ones rotate in the hero (CON-12 stopped the language
// mixing); the Chinese ones wait for the /zh locale. Icons and widths are presentation (src/constants/config.tsx).
// Rewrites and the choice between the two near-duplicates are owner drafts (src/content/drafts/slogans.ts).
import { live } from './approval';
import { Slogan, defineContent } from './schema';
import { z } from 'zod';

export const SLOGANS = defineContent('content/slogans.ts', z.array(Slogan), [
  { id: 'purpose-driven-fund', locale: 'en', text: 'Immortal Dragons is a purpose-driven longevity fund', approval: live() },
  { id: 'crack-immortality-code', locale: 'zh', text: '破解永生密码', approval: live() },
  { id: 'igniting-revolution', locale: 'en', text: 'Igniting longevity revolution', approval: live() },
  { id: 'decode-eternal-life', locale: 'zh', text: '解码生命永恒密码', approval: live() },
  { id: 'catalysing-revolution', locale: 'en', text: 'Catalysing longevity revolution', approval: live() },
  { id: 'break-aging-frontiers', locale: 'zh', text: '突破衰老科学边界', approval: live() },
  { id: 'setting-forth-lifespan', locale: 'en', text: 'Setting forth unlimited human healthy lifespan', approval: live() },
  { id: 'reshape-lifespan-limit', locale: 'zh', text: '重塑人类寿命极限', approval: live() },
  { id: 'global-awareness', locale: 'en', text: 'Bringing global awareness of longevity', approval: live() },
  { id: 'connect-innovation-network', locale: 'zh', text: '连接全球创新网络', approval: live() },
  {
    id: 'collective-recognition',
    locale: 'en',
    text: 'Harnessing collective recognition of the significance of Longevity',
    approval: live(),
  },
  { id: 'accelerate-longevity-tech', locale: 'zh', text: '加速长寿技术革命', approval: live() },
]);
