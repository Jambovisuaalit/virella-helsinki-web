# Virella Helsinki

Canonical repository for the new Virella Helsinki web application.

## Branch workflow

- `develop` — active development and Vercel Preview target
- `main` — production branch

A push to `develop` is used to verify the Vercel Preview Git integration before production promotion.
A documentation-only push to `main` may be used to trigger a fresh production deployment for runtime E2E verification.

## Quality gate

Before promotion or merge:

```bash
npm run typecheck
npm run lint
npm run build
```

Read `AGENTS.md` and `PROJECT_CONTEXT.md` before making changes.
