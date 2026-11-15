import { ORG_ADDRESS, ORG_EMAIL } from '@/constants/entity';

/** The organisation's postal address on one line, as the site shows it ("3 Biopolis Dr, #01-15, Singapore 138623"). */
export const ORG_ADDRESS_TEXT = `${ORG_ADDRESS.streetAddress}, ${ORG_ADDRESS.addressLocality} ${ORG_ADDRESS.postalCode}`;

export const ORG_MAILTO = `mailto:${ORG_EMAIL}`;

export { ORG_EMAIL };
