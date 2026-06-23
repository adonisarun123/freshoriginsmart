# CI/CD pipeline

How code gets checked and shipped for Fresh Origins.

## At a glance

```
push / PR to main
      │
      ├─ GitHub Actions (CI) ── quality gate ──┐
      │     • Lint                              │  status shown on the PR /
      │     • Typecheck (tsc)                   │  commit. Does NOT deploy.
      │     • Build (placeholder env)           │
      │     • npm audit + secret scan           │
      │                                         │
      └─ Vercel ── builds & deploys ────────────┘
            • every PR  → Preview URL
            • push main → Production (freshoriginsmart.com)
```

CI and Vercel run **independently and in parallel**. CI is the safety net that
catches lint/type/build breakage and leaked secrets; Vercel does the actual
deploy. (We chose to keep Vercel's git auto-deploy on, so no deploy tokens are
stored in GitHub.)

## Workflows

### `.github/workflows/ci.yml`

Runs on pushes to `main` and PRs targeting `main`. Two jobs:

**`quality`** — `npm ci`, then `npm run lint`, `npm run typecheck`, `npm run
build`. The build uses **placeholder** public env values only; the app's
`hasSupabaseEnv` / `hasSupabaseAdminEnv` guards let it build without real
Supabase keys, so no secrets are needed in CI.

**`security`** —
- `npm audit --audit-level=high` (non-blocking: reports advisories without
  failing the run, so a transitive issue can't block a release).
- A guard that fails if any real `.env` file is ever committed (only
  `.env.example` is allowed).
- `gitleaks` secret scan across history.

`concurrency` cancels superseded runs on the same branch to save minutes.

### `.github/dependabot.yml`

Weekly PRs (Mondays) for npm and GitHub Actions updates. Minor/patch npm bumps
are grouped into a single PR; Next.js **major** versions are ignored (those need
a deliberate migration). Those PRs run through the same CI gate before merge.

## Where secrets live

Real values are **only** in Vercel → Project → Settings → Environment Variables.
Nothing real is stored in the repo or in GitHub Actions secrets.

Required in Vercel for full functionality:

| Variable                          | Purpose                                  |
| --------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase project URL                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Public anon key (catalogue reads)        |
| `SUPABASE_SERVICE_ROLE_KEY`       | Server-only; cart/orders/admin           |
| `NEXT_PUBLIC_SITE_URL`            | Canonical site URL                       |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`     | Order WhatsApp number (intl, no `+`)     |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`   | (optional) GA4 analytics                 |

See `.env.example` for the full list.

## Recommended branch protection (set once on GitHub)

Settings → Branches → add a rule for `main`:
- ✅ Require a pull request before merging
- ✅ Require status checks to pass → select **`Lint · Typecheck · Build`** and
  **`Dependency audit · Secret scan`**
- ✅ Require branches to be up to date before merging

This makes the green CI check mandatory before anything reaches `main` (and thus
production).

## Reading a failure

- **Lint / Typecheck red** → run `npm run lint` / `npm run typecheck` locally;
  same output.
- **Build red** → run `npm run build` locally. If it only fails in CI, it's
  usually an env-at-build-time assumption — keep build-time code behind the
  `hasSupabaseEnv` guards.
- **Secret scan red** → a key was committed. Remove it, **rotate the key**, and
  push the cleanup.

## Triggering a deploy

Just push to `main` (or merge a PR). Vercel rebuilds automatically. A config
change like adding an image host to `next.config.mjs` requires this rebuild to
take effect.
