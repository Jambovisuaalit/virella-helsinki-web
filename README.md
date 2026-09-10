# Virella Helsinki

Canonical repository for the new Virella Helsinki web application.

## Branch workflow

- `develop` — active development and Vercel Preview target
- `main` — production branch

## Quality gate

Before promotion or merge:

```bash
npm run typecheck
npm run lint
npm run build
```

Read `AGENTS.md` and `PROJECT_CONTEXT.md` before making changes.
