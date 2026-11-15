# Content style guide and glossary (CON-20)

Status: **draft for the owner's approval** (written 2026-11-15). Until it is approved, only corrections of spelling,
grammar and consistency are applied to live copy (listed under "Applied"); every change of wording is a draft in
`src/content/drafts/` (see `docs/content-approval.md`). One page on purpose.

## Voice

- Plain and factual. Say what the fund does and has done, with the date it was true. No superlatives or claims that
  no published source supports ("#1", "leading", "revolutionary") unless the source is named.
- One language per string. A line is English or Chinese, not both (CON-12); bilingual labels stay only where the
  design pairs them on purpose (the section nav) until the /zh locale exists (CON-03).
- Numbers come from the content layer, never typed into a page: the portfolio count is computed; the fund size is
  `src/content/fund.ts`.

## Case

- Sentence case for sentences, headings, buttons and links: "Investment themes", "Read more".
- Capitals only for one- or two-word labels and for display type set in capitals by design (Oxanium headings,
  slogans, the nav). Visual identity decisions on display type belong to VIS.
- Never capitals for an email address, a postal address or a body sentence: `contact@id.life`, "3 Biopolis Dr,
  #01-15, Singapore 138623".
- Company names as the company writes them: DOMAYN, EONARK, KindBio, Longevity.Technology, XPRIZE.

## Spelling and punctuation

- **US English** for the site's own copy (the owner's English profile already writes "prioritizes", "favors",
  "organization"). Proper names keep their own spelling: "Healthy Longevity Translational Research Programme".
  Code comments may use either.
- Possessive of the fund: **Immortal Dragons'** (never "Immortal Dragon's").
- Hyphenate compound adjectives before a noun: early-stage, AI-powered, AI-driven, small-molecule (therapy),
  whole-body (replacement), multi-target, pre-seed. No hyphen in "Series A".
- Standard terms: allogeneic (not allogenic), neuromodulation, xenotransplantation, 3D bioprinting, ex utero.
- "Longevity biotech" in prose; "longbio" only where quoting the owner's own term ("other longbio funds").
- No em dash in copy; use a comma, a colon or "to" for ranges ("pre-seed to Series A").
- Money: "US$40 million" in prose, "US$40M" only where space is tight; "approximately" when the source says "about".

## Dates and durations

|          | English                                        | Chinese       |
| -------- | ---------------------------------------------- | ------------- |
| Day      | 16 July 2025                                   | 2025年7月16日 |
| Month    | July 2025                                      | 2025年7月     |
| As-of    | as of July 2025 / as announced on 16 July 2025 | 截至2025年7月 |
| Duration | 3 months, 30 years                             | 3个月、30年   |

Machine-readable dates go in `<time dateTime="2025-07-16">`.

## Glossary (canonical names)

| English                                          | Chinese                         | Where used                  | Note                                                                           |
| ------------------------------------------------ | ------------------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| Immortal Dragons                                 | 不朽真龙                        | everywhere                  |                                                                                |
| Boyang Wang                                      | 朢舶洋                          | profile, JSON-LD, articles  | sole founder: owner ruling CON-11 #3                                           |
| Mission                                          | 使命                            | nav, hero section           |                                                                                |
| Portfolio                                        | 投资                            | nav, section                |                                                                                |
| Insights                                         | 洞见                            | nav, section                |                                                                                |
| Spectrum                                         | 谱系                            | nav, section                | CON-04 proposes Ecosystem                                                      |
| Presence                                         | 印迹                            | nav, route title            | owner decision 印迹 or 印记 (CON-16 acceptance); 印迹 is live in nav and title |
| Digital Twin                                     | 孪生 (nav), 数字孪生 (Spectrum) | nav, section, Spectrum      | two Chinese forms live; pick one                                               |
| Connect                                          | 联结                            | nav, section                | CON-04 proposes Contact                                                        |
| About                                            | 关于                            | header, phone menu, footers | new page (CON-01)                                                              |
| Replacement Strategy                             | 替换策略                        | themes                      |                                                                                |
| Neuro & Brain Rejuvenation                       | 神经与脑年轻化                  | themes                      |                                                                                |
| Cells and Gene Therapy                           | 细胞与基因疗法                  | themes                      |                                                                                |
| Reproduction Technology                          | 生殖技术                        | themes                      |                                                                                |
| Translation & Publishing                         | 翻译与出版                      | Spectrum group              |                                                                                |
| Evangelism                                       | 布道者 (live)                   | Spectrum group              | draft: 布道 (activity) or rename the group                                     |
| Peer Reviews                                     | 论文与综述                      | Spectrum group              | draft: "Papers"                                                                |
| Proudly Supporting                               | 本机构赞助支持                  | Spectrum group              |                                                                                |
| Influence Network                                | 长寿领域人物影响力与关系图      | Spectrum tool               |                                                                                |
| Disease Management                               | 可治疗与可控制疾病列表          | Spectrum tool               |                                                                                |
| Longevity Trend Radar                            |                                 | Spectrum tool               |                                                                                |
| Immortal Dragons Podcast                         | 不朽真龙                        | podcast                     |                                                                                |
| Long Talk Podcast                                | 龙门阵                          | podcast                     |                                                                                |
| Healthy Longevity and Medicine Conference        |                                 | grants                      | the Spectrum label says "Health": owner ruling CON-11 #8                       |
| ARDD (Aging Research and Drug Discovery Meeting) | 衰老研究与药物发现会议          | grants                      |                                                                                |
| Vitalist Bay Summit                              |                                 | grants, talks               |                                                                                |

## Subscribe promise

One sentence per locale that states what is sent, how often and in which language. Two different promises are
live today; the replacement is a draft waiting on the owner's answer (`src/content/drafts/subscribe.ts`).

## Checks

- `test/copy-style.test.mjs` (in `npm test`) fails on a banned variant anywhere in `src`, and lists the variants that
  wait on an owner ruling or an approved draft separately, so they cannot spread.
- `npx --yes cspell@10.4.0 --no-progress "src/**/*.{ts,tsx,md}"` spell-checks the source against `cspell.json`
  (project words: names, places, drugs, terms). CI wiring belongs to ENG-01.

## Applied (corrections that change no meaning, 2026-11-15)

- "Explore Immortal Dragon's variety ..." to "Immortal Dragons'" (Spectrum metadata, Spectrum JSON-LD, llms.txt).
- "presence --bridging East and West" to "presence, bridging East and West" (Presence metadata, JSON-LD, llms.txt;
  applied by w1-pages, kept in `src/content/pages.ts`).
- Connect "A New Dawn": "Our dedication is a world where ..." to "Our dedication is to a world where ...".
- News and podcast footer: the address and the email are no longer set in capitals; the email is a mailto link.
- The 不朽真龙介绍 article's website line: `https://id.life` to the canonical `https://www.id.life`.
- The broken class `mobile:w-[17.375rem w-[19.875rem]` on the last English slogan (its phone width now applies).
