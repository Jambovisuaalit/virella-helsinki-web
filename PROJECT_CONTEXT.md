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

## Development priority

1. Foundation and shared design system — DONE on `develop`
2. Global navigation/footer — NEXT
3. Homepage
4. Services overview
5. Instagram page — IMPLEMENTED, pending full QA
6. LinkedIn page — IMPLEMENTED, pending full QA
7. Landing Page + SEO — IMPLEMENTED, pending full QA
8. LVI landing page
9. Checkout
10. Questionnaire — STRUCTURE IMPLEMENTED; final order persistence waits for checkout/order backend
11. SEO
12. Analytics
13. Full QA
14. Production migration only after explicit approval

## Current acceptance notes

- Instagram and LinkedIn pages use the exact same shared `ServiceLandingPage` component as Landing Page + SEO.
- Instagram and LinkedIn customer-facing copy is Finnish; platform names and product terms such as Instagram, LinkedIn, Stories, Reels and SEO remain proper product/industry terms.
- Three questionnaire definitions map directly to centralized product IDs.
- The questionnaire route preserves `product` and optional `order` identifiers in hidden fields.
- Final server-side verification that an `order` belongs to the expected product cannot be marked complete until checkout/order persistence exists.

## Foundation status

The shared foundation includes centralized configuration for brand, business information, products, tax messaging, navigation and SEO, plus reusable UI primitives. Existing layout/header/footer consume the centralized configuration instead of duplicating core business facts.
