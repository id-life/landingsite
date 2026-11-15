// People named on the site. The founder's name and education are published in llms.txt, the JSON-LD and the
// 不朽真龙介绍 article; whether he is the sole founder awaits the owner's ruling (CON-11 #3).
import { live } from './approval';
import { Person, defineContent } from './schema';
import { z } from 'zod';

export const PEOPLE = defineContent('content/people.ts', z.array(Person), [
  {
    slug: 'boyang-wang',
    name: { en: 'Boyang Wang', zh: '朢舶洋' },
    role: { en: 'Founder', zh: '创始人' },
    alumniOf: ['National University of Singapore', 'Yale University'],
    approval: live('founders'),
  },
]);

export const personBySlug = (slug: string) => {
  const person = PEOPLE.find((entry) => entry.slug === slug);
  if (!person) throw new Error(`content/people.ts: no person "${slug}"`);
  return person;
};
