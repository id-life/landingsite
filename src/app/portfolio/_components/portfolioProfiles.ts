import { ItemList, WithContext } from 'schema-dts';
import { portfolio } from './portfolioData';

// Longer company profiles for crawlers and AI assistants (hidden text on /portfolio, llms.txt and
// structured data). The visible cards keep their own titles and taglines from portfolioData, and
// this file is only imported by server-rendered code, so the text stays out of the browser bundle.
//
// Source: the operations team's table in the wiki page 官网 /portfolio 页 GEO 文字内容 (2026-11-19),
// used as written. Company names follow the spellings confirmed there: Immune Bridge,
// Kind Biotechnology, DOMAYN, Oisín. Do not edit the wording here without a source.

export type PortfolioProfile = {
  /** Standard company name; differs from the card title for a few companies. */
  name: string;
  en: string;
  zh: string;
};

/** Keyed by the card title in portfolioData. */
export const PORTFOLIO_PROFILES: Record<string, PortfolioProfile> = {
  'Healthspan Capital': {
    name: 'Healthspan Capital',
    en: 'Healthspan Capital is a venture capital fund investing in early-stage longevity biotech ("LongBio") and regenerative medicine startups that aim to extend healthy human lifespan. Its general partners are Nathan Cheng, Sebastian Brunemeier and Michael Chinen, and its advisory board includes aging researchers such as Matt Kaeberlein and Vera Gorbunova. Immortal Dragons founder Boyang Wang serves as a Senior Venture Fellow at the fund.',
    zh: 'Healthspan Capital 是一家风险投资基金，投资早期长寿生物科技（LongBio）和再生医学初创公司，目标是延长人类健康寿命。基金的普通合伙人为 Nathan Cheng、Sebastian Brunemeier 和 Michael Chinen，顾问委员会包括 Matt Kaeberlein、Vera Gorbunova 等衰老研究学者。不朽真龙创始人朢舶洋（Boyang Wang）在该基金担任 Senior Venture Fellow。',
  },
  'Frontier Bio': {
    name: 'Frontier Bio',
    en: "Frontier Bio is a San Francisco-based company engineering replacement blood vessels. Its living vascular graft combines a dissolvable scaffold with cells from a small sample of the patient's own fat, seeded and implanted in the same surgery; as the scaffold dissolves, the patient's cells build a living vessel. In a large-animal study the graft grew a living inner lining by day 14 with no clotting, and the work won Best Paper at VESS 2026.",
    zh: 'Frontier Bio 总部位于旧金山，研发用于替换的人造血管。它的活体血管移植物由可降解支架和取自患者少量脂肪的自体细胞组成，在同一台手术中完成接种和植入；支架降解后，患者自身细胞长成活的血管。在大型动物实验中，移植物到第 14 天长出了活的血管内壁且没有凝血，相关研究获 2026 年 VESS 年会最佳论文奖。',
  },
  'Unlimited Bio': {
    name: 'Unlimited Bio',
    en: 'Unlimited Bio develops gene therapies, including combination therapies, for muscle, circulation, hair and longevity. Its VEGF therapy is available now, its follistatin therapy is recruiting for a trial, and Klotho and BDNF therapies are in development. The therapies are experimental and not approved by the FDA, and are administered by independent clinics in Próspera ZEDE (Honduras), Mexico and the Bahamas.',
    zh: 'Unlimited Bio 开发针对肌肉、血液循环、毛发和长寿的基因疗法，包括多种基因疗法的组合。目前 VEGF 疗法已可提供，卵泡抑素（follistatin）疗法正在招募试验受试者，Klotho 和 BDNF 疗法在研发中。这些疗法属于实验性疗法，未获美国 FDA 批准，由洪都拉斯 Próspera 特区、墨西哥和巴哈马的独立诊所施用。',
  },
  'R3 Bio': {
    name: 'R3 Bio',
    en: 'R3 Bio is an early-stage biotechnology company operating in stealth mode. It has not publicly disclosed details of its technology or programs.',
    zh: 'R3 Bio 是一家处于隐身阶段（stealth mode）的早期生物科技公司，尚未公开披露技术和项目细节。',
  },
  'Immune Bridge': {
    name: 'Immune Bridge',
    en: 'Immune Bridge is a San Francisco-based biotech company building a cell therapy platform on umbilical cord blood stem cells, drawing on cord blood units already frozen in public banks. It combines an ML-powered screening system with proprietary stem cell expansion technology to manufacture hematopoietic stem cells, NK cells, T cells and other cell types at scale. In 2026 it began opening this screening and manufacturing platform to outside co-development partners.',
    zh: 'Immune Bridge 总部位于旧金山，以脐带血干细胞为原料打造细胞疗法平台，原料来自公共血库中已冷冻保存的脐带血。公司结合机器学习筛选系统和自有的干细胞扩增技术，规模化生产造血干细胞、NK 细胞、T 细胞等多种细胞。2026 年起，公司开始向外部合作方开放这套筛选和生产平台，共同开发疗法。',
  },
  'Cyclarity Therapeutics': {
    name: 'Cyclarity Therapeutics',
    en: 'Cyclarity Therapeutics, based in Novato, California, develops engineered cyclodextrin drugs that capture and remove oxidized cholesterol such as 7-ketocholesterol from cells, to treat atherosclerosis and other chronic diseases of aging. Its lead drug UDP-003 has completed Phase 1 testing in Australia. In November 2026 the US FDA cleared its IND application, and the company plans to start a Phase 1b trial in the United States in the first quarter of 2027.',
    zh: 'Cyclarity Therapeutics 总部位于美国加州诺瓦托（Novato），开发经过改造的环糊精药物，从细胞中捕获并清除 7-酮胆固醇等氧化胆固醇，用于治疗动脉粥样硬化和其他衰老相关慢性病。其主导药物 UDP-003 已在澳大利亚完成 1 期临床试验。2026 年 11 月，美国 FDA 批准了其新药临床试验申请（IND），公司计划于 2027 年第一季度在美国启动 1b 期试验。',
  },
  KindBio: {
    name: 'Kind Biotechnology',
    en: 'Kind Biotechnology (Kind Bio), based in Salem, New Hampshire, is working toward an on-demand supply of lab-grown organs for transplantation. Its Integrated Organ Network (ION) platform uses artificial genomic constructs to grow a set of peripheral organs together, so that they depend on and support one another. The aim is ethical, scalable production of xenotransplant organs.',
    zh: 'Kind Biotechnology（Kind Bio）总部位于美国新罕布什尔州塞勒姆，目标是按需供应实验室培育的移植器官。其整合器官网络（Integrated Organ Network，ION）平台利用人工基因组构建体，让一组外周器官一起生长、相互依存、相互支持。公司希望以合乎伦理、可规模化的方式生产异种移植器官。',
  },
  'Mito Health': {
    name: 'Mito Health',
    en: 'Mito Health offers consumer blood testing with transparent pricing, paired with clinician-reviewed health guidance. Members receive personalized action plans covering supplements, exercise, nutrition and sleep, AI health coaching to act on their results, and in-chat access to clinicians.',
    zh: 'Mito Health 提供价格透明的消费级血液检测，并配有经临床医生审核的健康建议。会员可获得涵盖营养补充剂、运动、饮食和睡眠的个性化行动方案、帮助落实检测结果的 AI 健康指导，以及在对话中联系临床医生的支持。',
  },
  'Kangaroo Biomedical': {
    name: 'Kangaroo Biomedical',
    en: 'Kangaroo Biomedical (Kangaroo Bio) is a San Francisco-based company developing artificial womb technology to support fetal development outside the body. The technology is intended as a platform for neonatal care and therapeutic research.',
    zh: 'Kangaroo Biomedical（Kangaroo Bio）总部位于旧金山，研发在体外支持胎儿发育的人造子宫技术，应用方向包括新生儿护理和治疗研究。',
  },
  'Renewal Bio': {
    name: 'Renewal Bio',
    en: "Renewal Bio is an Israeli biotech company that has licensed stem cell and embryo-model technology from Jacob Hanna's lab at the Weizmann Institute of Science. It aims to grow embryo models from stem cells as a source of cells and tissues for transplantation and other therapies. The underlying research includes a 2023 Nature paper describing complete human day-14 post-implantation embryo models made from naive embryonic stem cells.",
    zh: 'Renewal Bio 是一家以色列生物科技公司，从魏茨曼科学研究所 Jacob Hanna 实验室获得了干细胞和胚胎模型技术授权。公司希望用干细胞培育胚胎模型，作为移植及其他疗法所需细胞和组织的来源。相关基础研究包括 2023 年发表于《Nature》的论文，该研究用初始态胚胎干细胞构建出完整的第 14 天着床后人类胚胎模型。',
  },
  DOMAYN: {
    name: 'DOMAYN',
    en: "DOMAYN is the consumer brand of Vibe Science Pte. Ltd., a neurotechnology company. Its first product, the Mask, uses light and sound tuned to the brain's own rhythms to help users fall asleep, relax or focus, usually within five to fifteen minutes. The Mask is available by invitation; a February 2026 in-lab study with 93 participants showed early signals, which the company notes are not proof of efficacy.",
    zh: 'DOMAYN 是神经科技公司 Vibe Science Pte. Ltd. 旗下的消费品牌。首款产品 Mask 发出与大脑自身节律相匹配的光和声音，帮助使用者入睡、放松或集中注意力，通常只需 5 到 15 分钟。Mask 目前采用邀请制发售；公司 2026 年 2 月做过一项 93 人参与的实验室研究，得到初步信号，公司注明这还不能证明疗效。',
  },
  'Oisin Biotechnologies': {
    name: 'Oisín Biotechnologies',
    en: "Oisín Biotechnologies, headquartered in Seattle with an R&D laboratory in San Diego, develops redosable genetic medicines that target the biology of aging. Its therapies use the Fusogenix Proteo-Lipid Vehicle (PLV), a non-viral delivery technology that fuses with cell membranes to carry DNA and RNA to tissues beyond the liver; the platform's core mechanism was published in Cell in 2024. Its pipeline includes targeted fat removal and muscle-building therapies.",
    zh: 'Oisín Biotechnologies 总部位于西雅图，研发实验室设在圣地亚哥，开发针对衰老生物学、可重复给药的基因药物。其疗法基于 Fusogenix 蛋白脂质载体（PLV）这一非病毒递送技术，能与细胞膜直接融合，把 DNA 和 RNA 递送到肝脏以外的组织；平台的核心机制于 2024 年发表在《Cell》上。在研管线包括靶向消脂和增肌疗法。',
  },
  'Etheros Pharmaceuticals': {
    name: 'Etheros Pharmaceuticals',
    en: 'Etheros Pharmaceuticals, with its lab in Nashville, Tennessee, develops small-molecule drugs that mimic the antioxidant enzymes superoxide dismutase and catalase, protecting neural tissue from oxidative and inflammatory injury. Its compounds are water-soluble fullerene derivatives; the lead compound has been neuroprotective in multiple double-blind, placebo-controlled animal studies and extended median lifespan in wild-type mice when dosed from middle age. The company is advancing it toward human clinical trials.',
    zh: 'Etheros Pharmaceuticals 的实验室位于美国田纳西州纳什维尔，开发模拟超氧化物歧化酶和过氧化氢酶这两种抗氧化酶的小分子药物，保护神经组织免受氧化和炎症损伤。其化合物是水溶性富勒烯衍生物；主导化合物在多项双盲、安慰剂对照的动物研究中显示出神经保护作用，并在从中年开始给药时延长了野生型小鼠的中位寿命。公司正推进该化合物进入人体临床试验。',
  },
  'Longevity.Technology': {
    name: 'Longevity.Technology',
    en: 'Longevity.Technology is a UK-based media and data platform covering the science, technology and business of the longevity sector. It publishes news, runs a podcast and the Founders Longevity Forum events, and provides investment data services for investors, founders and pharma executives. It is operated by First Longevity Ltd, registered in England.',
    zh: 'Longevity.Technology 是一家英国长寿产业媒体与数据平台，报道长寿领域的科学、技术和商业动态。平台发布新闻、制作播客、举办 Founders Longevity Forum 系列活动，并为投资人、创业者和药企高管提供投资数据服务。平台由在英格兰注册的 First Longevity Ltd 运营。',
  },
  Vitalia: {
    name: 'Vitalia',
    en: "Vitalia is a longevity-focused city project in Próspera, a special economic zone (ZEDE) on the island of Roatán, Honduras, set up to accelerate longevity biotech. It began as a pop-up city and ran Vitalia Forever from January to March 2025 to seed a permanent hub where founders, engineers and scientists can use Próspera's legal framework to bring products to market faster.",
    zh: 'Vitalia 是位于洪都拉斯罗阿坦岛 Próspera 特别经济区（ZEDE）的长寿主题城市项目，目标是加速长寿生物科技发展。它从快闪城市起步，2025 年 1 月至 3 月举办了 Vitalia Forever，为常设基地打基础，让创业者、工程师和科学家借助 Próspera 的法律框架更快把产品推向市场。',
  },
  EONARK: {
    name: 'EONARK',
    en: 'EONARK (无尽方舟), founded in May 2026, is an AI-driven longevity drug discovery company. Its H2P (Human-to-Pet) cross-species model aligns gene expression data from humans and pets to find aging targets conserved across species; the company is validating drugs in dogs and cats first while also building a human drug pipeline. Its founding team has backgrounds in AI, computational biology, gene editing and aging biology, with training at universities including Oxford and UC Berkeley.',
    zh: '无尽方舟（EONARK）成立于 2026 年 5 月，是一家用 AI 研发长寿药物的公司。其 H2P（Human-to-Pet）跨物种模型对齐人和宠物的基因表达数据，筛选跨物种保守的衰老靶点；公司先在猫狗身上验证药物，同时推进人类药物管线。创始团队出自牛津大学、加州大学伯克利分校等院校，背景涵盖人工智能、计算生物、基因编辑和衰老生物学。',
  },
};

/** Each card with its standard name and profile, in card order. */
export const portfolioEntries = () =>
  portfolio.map((item) => {
    const profile: PortfolioProfile | undefined = PORTFOLIO_PROFILES[item.title];
    return { ...item, name: profile?.name ?? item.title, profile };
  });

/**
 * Markdown list lines for text renderings: "- [Name](link): tagline", and with `detailed` the
 * English profile after it (llms.txt). The homepage profile uses the short form.
 */
export const portfolioMarkdownLines = ({ detailed = false }: { detailed?: boolean } = {}) =>
  portfolioEntries().map(({ name, description, link, profile }) => {
    const line = `- ${link ? `[${name}](${link})` : name}: ${description}`;
    return detailed && profile ? `${line}. ${profile.en}` : line;
  });

/** The Chinese profiles as Markdown list lines. */
export const portfolioChineseMarkdownLines = () =>
  portfolioEntries().flatMap(({ name, profile }) => (profile ? [`- ${name}：${profile.zh}`] : []));

export const getPortfolioJsonLd = (): WithContext<ItemList> => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'IMMORTAL DRAGONS Portfolio',
  url: 'https://id.life/portfolio',
  numberOfItems: portfolio.length,
  itemListElement: portfolioEntries().map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Organization',
      name: item.name,
      ...(item.name !== item.title && { alternateName: item.title }),
      description: item.profile?.en ?? item.description,
      logo: `https://id.life${item.logoUrl}`,
      ...(item.link && { url: item.link }),
    },
  })),
});
