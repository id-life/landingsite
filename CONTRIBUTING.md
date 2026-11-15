# Contributing

1. Branch from `main`; one change per pull request.
2. Read [CLAUDE.md](CLAUDE.md) first (architecture, safe-testing rules), and keep it current when you change the
   architecture.
3. Before opening the pull request, meet the definition of done in CLAUDE.md: type check, lint and unit tests pass,
   the production build succeeds, the end-to-end suite shows no guard regression, and visible changes are checked on
   phone, tablet and laptop.
4. Never submit the live newsletter or Influence Network forms while testing, and never commit `.env`.
5. Commercial fonts, models and media need a licence entry in [docs/licences.md](docs/licences.md) before they are
   committed.
