export const SITE_URL = 'https://www.id.life';

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
