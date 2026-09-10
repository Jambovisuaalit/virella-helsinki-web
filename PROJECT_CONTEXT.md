# PROJECT_CONTEXT.md

## Project

Virella Helsinki

Repository: `Jambovisuaalit/virella-helsinki-web`

This repository is the canonical source of truth for the new Virella Helsinki web application.

## Business identity

- Marketing name: Virella Helsinki
- Legal operator: Tmi Jami Harju
- Positioning: Markkinointi valmiina palveluna.
- Core audience: Finnish entrepreneurs, SMEs, B2B service companies, expert businesses, LVI and other practical service sectors without an internal marketing team

## Technical baseline

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS
- ESLint
- npm
- Node.js 22+
- Vercel target platform

## Current deployment architecture

Canonical GitHub repo:

`Jambovisuaalit/virella-helsinki-web`

Target branch model:

- `develop` → Vercel Preview
- `main` → Vercel Production Branch
- `feature/*` → merge into `develop`

Custom production domain:

`virellahelsinki.com`

STATUS:

**DO NOT CONNECT OR MODIFY THE CUSTOM DOMAIN WITHOUT EXPLICIT APPROVAL.**

Preview indexing:

`noindex, nofollow`

Production indexing must not be changed to `index, follow` without explicit approval.

## Current Vercel state

A separate Vercel project named `virella-helsinki-web` exists in team `info-32533854's projects`.

Known current state at the time of this context update:

- Vercel project is separate from the existing Virella production website
- default Vercel domain responds over HTTPS
- homepage responds `200 OK`
- `/api/health` responds `200 OK`
- deployed placeholder contains `noindex, nofollow`
- custom domain `virellahelsinki.com` is not attached to the new project
- Vercel Git integration is currently linked to `vido-social/virella-helsinki-web`, not the canonical repository
- the existing Vercel deployment was created from `main` and is marked as a production target

Required deployment correction before normal development flow is considered complete:

1. Connect Vercel project to `Jambovisuaalit/virella-helsinki-web`.
2. Set `main` as Production Branch.
3. Confirm a push to `develop` creates a Preview Deployment.
4. Confirm Preview remains `noindex, nofollow`.
5. Confirm `/api/health` returns `200 OK` on Preview.
6. Keep the custom production domain detached.

Until those checks pass, do not report `develop → Preview` as complete.

## Deployment guardrails

1. Do not attach `virellahelsinki.com` during staging setup.
2. Do not modify the current production Vercel project as part of staging work.
3. Keep the new Virella rebuild in a separate Vercel project.
4. Keep previews and staging non-indexable.
5. Require successful typecheck, lint and production build before production promotion.
6. Verify homepage, `/api/health`, HTTPS, metadata, redirects and forms before any domain cutover.
7. Do not delete or disconnect the old production deployment before the replacement has passed full QA and explicit cutover approval has been given.

## Current development goal

Build the new Virella Helsinki website incrementally in `develop`.

Do not recreate the complete site in one commit.

Use the approved Business DNA, centralized product configuration, mobile-first UI and Next.js App Router architecture defined in `AGENTS.md`.

The current homepage is a technical placeholder. Final marketing copy, information architecture and production SEO metadata are separate implementation phases.

## Priority

1. Foundation and shared design system
2. Global navigation/footer
3. Homepage
4. Services overview
5. Instagram page
6. LinkedIn page
7. Landing Page + SEO
8. LVI landing page
9. Checkout
10. Questionnaire
11. SEO
12. Analytics
13. Full QA
14. Production migration only after explicit approval

## Working rule

Before implementing any feature, read both:

- `AGENTS.md`
- `PROJECT_CONTEXT.md`

`AGENTS.md` defines persistent engineering, UX, design and business rules.

`PROJECT_CONTEXT.md` defines the current project state, deployment status, active priorities and blockers.
