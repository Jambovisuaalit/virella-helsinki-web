# Virella Helsinki — Agent Operating Rules

Before making any change, read `AGENTS.md` and `PROJECT_CONTEXT.md`.

## 1. Repository

Work only in the canonical repository:

`Jambovisuaalit/virella-helsinki-web`

- `develop` = active development and Vercel Preview
- `main` = production branch
- Do not use `vido-social/virella-helsinki-web` as the active source of truth.

## 2. Guardrails

- Do not break or modify the current production environment without explicit approval.
- Do not connect, move, or modify `virellahelsinki.com` without explicit approval.
- Preview deployments must remain `noindex, nofollow`.
- Business facts, prices, tax text, and product data must come from centralized config files.
- Never hardcode product prices in random UI components.
- Never commit secrets, API keys, tokens, or `.env` values.

## 3. Implementation

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Mobile-first UI
- Prefer Server Components.
- Use `"use client"` only when state, browser APIs, event-driven interaction, or a client-only library requires it.
- Inspect and reuse existing components before creating new abstractions.
- Keep changes small and controlled.

## 4. Verification before commit

Run and require PASS:

```bash
npm run typecheck
npm run lint
npm run build
```

Do not commit a broken build.

For the full permanent rules, `AGENTS.md` is authoritative. For current deployment state and active priorities, `PROJECT_CONTEXT.md` is authoritative.
