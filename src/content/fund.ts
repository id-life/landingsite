// The fund's facts: the one place a figure, an address or a name about Immortal Dragons is typed (CON-16).
// llms.txt, the JSON-LD in src/constants/entity.ts, the About page and the home statement read them from here.
// Values are the owner's published wording (llms.txt profile, the 不朽真龙介绍 article, the JSON-LD at the baseline).
// Facts awaiting a ruling carry it in their approval (see ./approval.ts): when the owner rules, record the
// decision here with its date and remove the ruling key.
import { live } from './approval';
import { byOrigin } from './origin';
import type { FundFacts } from './schema';

export const FUND: FundFacts = byOrigin('content/fund.ts', {
  name: { en: 'Immortal Dragons', zh: '不朽真龙' },
  legalName: {
    label: { en: 'Legal name' },
    value: { en: 'IMMORTAL DRAGONS PRIVATE LIMITED' },
    approval: live('legalName'),
  },
  email: 'contact@id.life',
  website: 'https://www.id.life',
  address: {
    streetAddress: '3 Biopolis Dr, #01-15',
    addressLocality: 'Singapore',
    postalCode: '138623',
    addressCountry: 'SG',
    area: 'Biopolis',
  },
  founder: 'boyang-wang',
  fundSize: {
    label: { en: 'Fund I size', zh: '一期基金规模' },
    value: { en: 'approximately US$40 million', zh: '约4000万美元' },
    // The figure as announced in the launch release (Yahoo Finance, 2025-07-16; src/content/press.ts).
    asOf: '2025-07-16',
    approval: live(),
  },
  lpPositions: {
    label: { en: 'LP positions' },
    value: { en: 'Also invests as an LP in other longbio funds' },
    approval: live(),
  },
  statedInvestments: {
    label: { en: 'Investments', zh: '投资数量' },
    value: { en: '15+', zh: '15余项' },
    approval: live(),
  },
  description: {
    text: {
      en: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore. Its investment themes include replacement strategy, 3D bioprinting, gene therapy, artificial womb, longevity special economic zones, and LP positions in other long-bio funds. Beyond conventional capital investment, Immortal Dragons also engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects.',
    },
    approval: live(),
  },
  statement: {
    text: { en: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore.' },
    approval: live(),
  },
  approval: live(),
});

/** "3 Biopolis Dr, #01-15, Singapore 138623", as the site shows the address on one line. */
export const FUND_ADDRESS_LINE = `${FUND.address.streetAddress}, ${FUND.address.addressLocality} ${FUND.address.postalCode}`;
