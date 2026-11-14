/** Deployment this build is for: production | preview | development (Vercel) or local. Set in next.config.mjs. */
export const DEPLOY_ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV ?? 'local';

/** Third-party analytics (GTM, GA4, Clarity, Vercel Analytics) run only when this is true. */
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === '1';
