import './guard';
import { DraftRecord, defineContent } from '../schema';
import { z } from 'zod';

/** Validate a file of drafts like any other content. */
export const defineDrafts = (name: string, drafts: z.input<typeof DraftRecord>[]) =>
  defineContent(`content/drafts/${name}`, z.array(DraftRecord), drafts);
