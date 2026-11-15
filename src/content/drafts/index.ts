// Every draft waiting for the owner, grouped for the review page (src/app/content-review/page.preview.tsx).
// Only that page and this folder may import drafts (ESLint), and ./guard throws in a production build (CON-10).
import './guard';
import type { DraftRecord } from '../schema';
import { ABOUT_DRAFTS } from './about';
import { COMPANY_DRAFTS } from './companies';
import { COPY_EDIT_DRAFTS } from './copy-edits';
import { EPISODE_DRAFTS } from './episodes';
import { HOME_DRAFTS } from './home';
import { METADATA_DRAFTS } from './metadata';
import { SLOGAN_DRAFTS } from './slogans';
import { SUBSCRIBE_DRAFTS } from './subscribe';
import { TAGLINE_DRAFTS } from './taglines';
import { THESIS_DRAFTS } from './thesis';

export { ABOUT_DRAFTS, HOME_DRAFTS };

export const DRAFT_GROUPS: { id: string; title: string; drafts: DraftRecord[] }[] = [
  { id: 'about', title: 'About page (CON-01)', drafts: ABOUT_DRAFTS },
  { id: 'home', title: 'Home statement (CON-05)', drafts: HOME_DRAFTS },
  { id: 'slogans', title: 'Hero slogans (CON-05, CON-20)', drafts: SLOGAN_DRAFTS },
  { id: 'copy', title: 'Copy edits that change wording (CON-20)', drafts: COPY_EDIT_DRAFTS },
  { id: 'metadata', title: 'Page descriptions (SEO-06)', drafts: METADATA_DRAFTS },
  { id: 'subscribe', title: 'Subscribe promise (CON-20, CON-21)', drafts: SUBSCRIBE_DRAFTS },
  { id: 'taglines', title: 'Portfolio taglines (CON-15)', drafts: TAGLINE_DRAFTS },
  { id: 'thesis', title: 'Thesis page (CON-07)', drafts: THESIS_DRAFTS },
  { id: 'companies', title: 'Company pages: why we invested (CON-08)', drafts: COMPANY_DRAFTS },
  { id: 'episodes', title: 'Podcast episodes: English summaries (CON-10, CON-17)', drafts: EPISODE_DRAFTS },
];

export const ALL_DRAFTS = DRAFT_GROUPS.flatMap((group) => group.drafts);
