# Runbook: something is wrong in production

## How you find out

- **Sentry** (project `immortal-dragons/id-landingsite`): errors from production and preview builds, tagged with
  `environment`, `release` (the deployed commit) and `area` (query, mutation, webgl, animation, media, ...).
- **Uptime**: `.github/workflows/uptime.yml` checks `/`, `/news`, one article, `/podcast` and the content API every
  10 minutes and keeps one open GitHub issue labelled `uptime` while anything is down (closed on recovery). One
  Sentry uptime monitor (included in every plan) can watch `/` as well; more Sentry monitors cost money and need the
  owner's approval.
- **Analytics health**: `experience_ready` / `experience_error` in GA4 (DATA-06) show a broken 3D experience.

## Roll back

Who: anyone with the Vercel project's Owner or Member role.

1. Vercel dashboard > project > **Deployments**, find the last good production deployment (or Production > the
   current deployment > **Instant Rollback**).
2. **Instant Rollback** to it. The production domains point at the old build within seconds; nothing is rebuilt.
3. Vercel now **stops assigning new production deployments to the domains** automatically. Fix forward on a branch,
   merge, then on the fixed deployment choose **Promote** (or "Undo rollback") to resume normal assignment.

What a rollback does **not** undo:

- environment variables (they are read at build time: an old deployment keeps the values it was built with, but a
  variable changed since then stays changed for the next build);
- CMS and API data on `id-platform.id.life` (articles, podcast episodes, influence-network entries);
- Mailchimp audience changes and anything already sent to GA4 or Sentry;
- DNS and domain settings.

## After

Write down what happened, when it was noticed, and what fixed it (an issue in this repository is enough), and add a
test to the end-to-end suite that would have caught it.
