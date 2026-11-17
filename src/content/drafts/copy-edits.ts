// CON-20 copy-edit drafts: the strings of figure CON-copy-strings whose fix changes wording, not just spelling,
// grammar or consistency. Mechanical corrections were applied directly (see docs/content-style.md, "Applied").
// Metadata descriptions are drafted in ./metadata.ts (SEO-06) and the portfolio taglines in ./taglines.ts.
import { defineDrafts } from './define';

const FIGURE = { ref: 'idlife-audit figure CON-copy-strings (15 strings as shipped, main @ 6a90671)' };

export const COPY_EDIT_DRAFTS = defineDrafts('copy-edits.ts', [
  {
    id: 'mission-statement',
    item: 'CON-05',
    title: 'Mission statement (Connect "A New Dawn"; also for /about)',
    body: {
      en: 'We work toward a world where emerging breakthroughs in science and medicine enable flourishing lifespans for all.',
      zh: '我们的使命是通过前沿科技与医学突破，为全人类开启璀璨生命新纪元',
    },
    approval: {
      status: 'draft',
      replaces:
        'Our dedication is to a world where emerging breakthroughs in science and medicine enable flourishing lifespans for all.',
      sources: [{ ref: 'src/content/connect.ts (a-new-dawn)' }, FIGURE],
      questions: [
        'The live line now reads "Our dedication is to a world where ..." (a grammar fix). Use this fuller rewrite as the mission statement on /about?',
      ],
    },
  },
  {
    id: 'value-moral-endeavor',
    item: 'CON-20',
    title: 'Connect value statement "A Moral Endeavor"',
    body: {
      en: 'We pursue longer, healthier lives and less suffering from age-related ailments, and we put all our effort into making this vision real.',
    },
    approval: {
      status: 'draft',
      replaces:
        'We pursue longer, healthier lives and less suffering from age-related ailments, endeavoring all our might to bring this vision to reality.',
      sources: [{ ref: 'src/content/connect.ts (a-moral-endeavor)' }, FIGURE],
      questions: ['"Endeavoring all our might" is not idiomatic. Approve or reword.'],
    },
  },
  {
    id: 'spectrum-group-evangelism',
    item: 'CON-20',
    title: 'Spectrum group label "Evangelism 布道者"',
    body: { en: 'Evangelism', zh: '布道' },
    approval: {
      status: 'draft',
      replaces: 'Evangelism 布道者',
      sources: [{ ref: 'src/content/initiatives.ts (group evangelism)' }, FIGURE],
      questions: [
        '布道者 means "evangelist" (a person) over three data tools. 布道 (the activity) matches "Evangelism"; or rename the group to the tools it holds (e.g. "Labs 工具", CON-04 site map).',
      ],
    },
  },
  {
    id: 'twin-scenario-titles',
    item: 'CON-20',
    title: 'Digital Twin drawer titles',
    body: {
      en: ['- Scenario 1: 30 years of unhealthy habits', '- Scenario 3: 3 months of intensive training'].join('\n'),
    },
    approval: {
      status: 'draft',
      replaces: 'Unhealthy habits me / Fitness Fitness Fitness',
      sources: [
        { ref: 'src/app/twin/_components/ReportM01.tsx:33, ReportM03.tsx:33' },
        { ref: 'master-plan CON-14 proposal ("Scenario 1: 30 years of unhealthy habits")' },
        FIGURE,
      ],
      questions: [
        'The spans come from each drawer\'s own badge (30 YEARS, 3 MONTHS) and its text (an unhealthy routine; a strict diet and gym plan). Scenario 2 keeps "A Healthier Life" (5 YEARS). Approve the titles.',
      ],
    },
  },
  {
    id: 'podcast-tabs-language',
    item: 'CON-20',
    title: 'Podcast episode page: one language for the interface',
    body: {
      en: ['- Timeline', '- Comments', '- No comments yet'].join('\n'),
      zh: ['- 时间轴', '- 评论', '- 暂无评论'].join('\n'),
    },
    approval: {
      status: 'draft',
      replaces: '时间轴 · 评论 · No comment',
      sources: [{ ref: 'src/app/podcast/[id]/_components/PodcastContentTab.tsx:15, NoComment.tsx:5' }, FIGURE],
      questions: [
        'Episode pages are Chinese content: show the Chinese interface strings there now, and the English ones on the English pages CON-17 adds?',
      ],
    },
  },
  {
    id: 'webgl-fallback',
    item: 'CON-20',
    title: 'No-WebGL fallback message',
    body: {
      en: 'This 3D view needs WebGL, which is turned off or unavailable in this browser. The fund profile is on the About page.',
    },
    approval: {
      status: 'draft',
      replaces: 'the raw no-WebGL fallback string of the 3D wrappers (removed by ENG-02; the poster now stands in)',
      sources: [{ ref: 'src/components/gl/ThreeWrapper.tsx:36, MobileThreeWrapper.tsx:36, VisionWrapper.tsx:50' }, FIGURE],
      questions: ['ENG-02 replaces these fallbacks with one designed SceneFallback in wave 1; use this line there?'],
    },
  },
]);
