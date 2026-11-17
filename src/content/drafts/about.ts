// Drafts for /about (CON-01) that wait on the owner: facts under a ruling, the founder section and the timeline.
// Every line comes from a published source listed with it; nothing is added.
import { defineDrafts } from './define';

export const ABOUT_DRAFTS = defineDrafts('about.ts', [
  {
    id: 'about-key-facts-pending',
    item: 'CON-01',
    title: 'About: key facts that wait on a ruling',
    body: {
      en: [
        '- Founder: Boyang Wang (朢舶洋), educated at the National University of Singapore and Yale University',
        '- geographically agnostic',
        '- Investments (owner wording): 15+',
        '- Legal name: IMMORTAL DRAGONS PRIVATE LIMITED',
        '- Founded: 2024',
        '- Fund I launched: July 2025',
      ].join('\n'),
    },
    approval: {
      status: 'draft',
      sources: [
        { ref: 'src/content/profile.ts (llms.txt key facts: founder, education, 15+)' },
        { ref: 'src/constants/entity.ts (JSON-LD legalName, foundingDate 2024)' },
        { ref: 'src/content/press.ts: Yahoo Finance launch release, 2025-07-16' },
        { ref: 'src/content/articles/immortal-dragons-milestones-and-portfolio.md:5 ("2025 年 8 月：基金正式发布")' },
      ],
      questions: [
        'CON-11 #3: is Boyang Wang the sole founder?',
        "CON-11 #6: the portfolio lists 16 companies; keep '15+' anywhere, or use the computed count only?",
        'ENG-10 / CON-02: is IMMORTAL DRAGONS PRIVATE LIMITED the exact legal name?',
        'CON-11 #2: is 2024 the year the company was founded, separate from the Fund I launch?',
        'CON-11 #1: did Fund I launch in July 2025 (release dated 16 July) or August 2025 (milestones article)?',
      ],
    },
  },
  {
    id: 'about-intro-full',
    item: 'CON-01',
    title: 'About: the full two-paragraph introduction (the official English profile)',
    body: {
      en: [
        'Immortal Dragons (不朽真龙) is a US$40 million purpose-driven longevity and radical life extension fund headquartered in Singapore, founded by Boyang Wang (朢舶洋). The fund backs underfunded moonshot projects: breakthroughs whose economic returns are not yet clear and that are overlooked by mainstream capital, but that hold long-term value. Its main investment themes include organ replacement strategy, 3D bioprinting and artificial womb, among others.',
        'The fund has made 15+ investments, and is geographically agnostic. Beyond conventional capital investment, Immortal Dragons engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects, in order to support anti-aging research and advocate for longevity.',
      ].join('\n'),
    },
    approval: {
      status: 'draft',
      sources: [{ ref: 'src/content/profile.ts, profile text "intro" (live in /llms.txt since the baseline)' }],
      questions: [
        'Shown on /about in place of the two-sentence summary once the founder (#3), count (#6) and stage (#10) rulings are in.',
      ],
    },
  },
  {
    id: 'about-founder',
    item: 'CON-01',
    title: 'About: founder section',
    body: {
      en: [
        'Boyang Wang (朢舶洋) is the founder of Immortal Dragons. He studied at the National University of Singapore and Yale University.',
        '- Talks: investor fireside chat at Vitalist Bay; founder interview on Beyond Tomorrow; panel at the Founders Longevity Forum in Singapore; investor keynote at LW3 in Singapore; keynote at Longevity Biotech Exchange in Shenzhen.',
        '- Writing: "The Longevity Bubble", guest post on VC Wire (30 April 2026); "When the world\'s first solid-tumour CAR-T gets approved in China", Drug Discovery World (August 2026).',
        '- Interviews: Financial Times Tech Tonic (December 2025); New York Post (20 April 2026); Securities.io, "Is Longevity Sector a Bubble?" (2026).',
      ].join('\n'),
    },
    approval: {
      status: 'draft',
      sources: [
        { ref: 'src/content/articles/immortal-dragons-news-and-updates.md:26 (创始人: 曾就读于新加坡国立大学和耶鲁大学)' },
        { ref: 'src/content/profile.ts, profile text "advocacy" (talks)' },
        {
          ref: 'https://vcwire.tech/2026/04/30/the-longevity-bubble-guest-post-by-boyang-wang-founder-immortal-dragons/',
          note: 'id-platform /insights item 37, publishDate 2026-04-30',
        },
        {
          ref: 'https://www.ddw-online.com/when-the-worlds-first-solid-tumour-car-t-gets-approved-in-china-43636-202608/',
          note: 'id-platform /insights item 70; the 不朽真龙介绍 article (line 129) dates it August 2026',
        },
        { ref: 'https://www.ft.com/content/65dae18e-7732-43b8-ac75-7f8b6612b4bf', note: 'id-platform /insights item 4' },
        {
          ref: 'https://nypost.com/2026/04/20/health/40m-longevity-fund-thats-looking-to-make-death-optional/',
          note: 'id-platform /insights item 38',
        },
        {
          ref: 'https://www.securities.io/boyang-wang-founder-of-immortal-dragons-interview-series/',
          note: 'id-platform /insights item 32',
        },
      ],
      questions: [
        'A photo for the founder section (the 不朽真龙介绍 article uses /imgs/news/immortal-dragons-news-and-updates/image2.jpeg from LW3; may it be reused?).',
        'A 150 to 300 word bio in your words: only the education line above is published.',
        'A direct contact for the founder, or keep contact@id.life?',
        'Securities.io: the Insights feed dates the interview 26 March 2026, the milestones article puts it in April 2026. Which is right?',
      ],
    },
  },
  {
    id: 'about-timeline',
    item: 'CON-01',
    title: 'About: timeline (English rendering of the milestones article)',
    body: {
      en: [
        '- August 2025: Immortal Dragons announces a US$40 million first fund for life extension technologies. Longevity.Technology and VC Wire report it first; BioWorld covers it from a regulatory angle.',
        '- September 2025: invests in Frontier Bio, a US 3D biofabrication company (reported by SynBioBeta and Finsmes).',
        '- November 2025: discloses investments in Unlimited Bio (gene therapy) and Etheros Pharmaceuticals (small-molecule drugs).',
        "- January 2026: the founder's views appear in Bio-IT World's and Drug Discovery News's outlooks for 2026, on AI in drug discovery, global policy and data standards.",
        '- April 2026: the New York Post interviews the founder; he publishes "The Longevity Bubble" on VC Wire and speaks to Securities.io about valuations in longevity.',
        "- May to July 2026: the fund's views are cited in coverage of China's Order 818 on cell and gene therapy, xenotransplantation, organ replacement and cell-therapy pricing, by Chinese and English media.",
      ].join('\n'),
    },
    approval: {
      status: 'draft',
      sources: [{ ref: 'src/content/articles/immortal-dragons-milestones-and-portfolio.md:3-31 (重要事件)' }],
      questions: [
        'CON-11 #1: the first entry follows the article (August 2025); the Yahoo Finance release is dated 16 July 2025. Which month?',
        'Translation of a published Chinese article: approve the English wording.',
      ],
    },
  },
]);
