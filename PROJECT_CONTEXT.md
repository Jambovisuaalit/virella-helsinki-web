# Virella Helsinki — Project Context

## Purpose

This repository is the new Virella Helsinki web application and is intentionally isolated from the current production website until preview QA is complete.

## Business identity

- Marketing name: Virella Helsinki
- Legal operator: Tmi Jami Harju
- Positioning: digital visibility and customer-acquisition partner for local service SMEs

## Technical baseline

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS
- ESLint
- npm
- Node.js 22+

## Branch strategy

- `main`: production-ready code only
- `develop`: integration branch and intended Vercel Preview source
- feature branches: merge into `develop` through pull requests when practical

## Deployment guardrails

1. Do not attach `virellahelsinki.com` during initial staging setup.
2. Do not modify the current production Vercel project as part of staging work.
3. Create a separate Vercel project for this repository.
4. Keep `SITE_INDEXABLE=false` for previews and staging.
5. Require successful typecheck, lint, and production build before production promotion.
6. Verify homepage, `/api/health`, HTTPS, metadata, redirects and forms before any domain cutover.

## Content state

The current homepage is a technical placeholder. Final marketing copy, information architecture and production SEO metadata are separate implementation phases.
