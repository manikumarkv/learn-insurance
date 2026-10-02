# LearnInsurance

US insurance terms explained in plain English. See [docs/requirements.md](docs/requirements.md) for what we're building and [docs/product-plans/learn-insurance.md](docs/product-plans/learn-insurance.md) for the plan.

## Getting started

Needs Node 22+ and pnpm 10.

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

## Scripts

| Script           | What it does                                                  |
| ---------------- | ------------------------------------------------------------- |
| `pnpm dev`       | Start the dev server                                          |
| `pnpm build`     | Build the static site into `dist/`                            |
| `pnpm preview`   | Serve the built site                                          |
| `pnpm lint`      | ESLint, then a Prettier check                                 |
| `pnpm format`    | Format all files with Prettier                                |
| `pnpm typecheck` | Type-check `.ts`, `.tsx` and `.astro` files (`astro check`)   |
| `pnpm test`      | Unit tests (Vitest)                                           |
| `pnpm test:e2e`  | Browser tests (Playwright). Builds and serves the site first. |

First time running browser tests: `pnpm exec playwright install chromium`. To use a Chromium that's already installed, set `PLAYWRIGHT_CHROMIUM_PATH` to its path.

## CI

Every pull request runs `.github/workflows/ci.yml`: lint, typecheck, unit tests and build in one job, and browser tests in another. Both must pass before merging to `main`.

## Deploys

Vercel deploys the site through its GitHub app:

- Every pull request gets a preview URL, posted on the PR.
- Every merge to `main` goes to production.

Pages are static by default. A page that needs per-request data, such as sign-in or admin, adds `export const prerender = false` and runs as a Vercel function.

Environment variables are listed in `.env.example`. Copy it to `.env` for local work. Set the real values in Vercel under Project → Settings → Environment Variables. Never commit secrets.

## Branches

- `feature/<issue>-<short-name>` for features, e.g. `feature/11-ci-pipeline`
- `fix/<issue>-<short-name>` for bugs
- `chore/<short-name>` for maintenance

No direct commits to `main`; everything goes through a pull request.

## Stack

Astro with React islands, TypeScript (strict), Tailwind CSS, pnpm, Vitest, Playwright, ESLint and Prettier. The full stack, including what comes later (Keystatic, Clerk, Neon, Pagefind, PostHog, Vercel), is in [docs/requirements.md](docs/requirements.md#tech-stack).

## Folder structure

Code is grouped by feature. Tests live next to the code they test.

```
src/
  pages/        Routes. Each file is a URL (src/pages/terms/[id].astro → /terms/<id>).
  layouts/      Page shells: <head>, header, footer.
  components/   Shared UI used by more than one feature (Paper Design components go here).
  features/     One folder per feature (terms, search, learn, quiz, progress, admin),
                holding its components, logic and tests together.
  content/      Content files edited through Keystatic (terms, types, paths).
  lib/          Small shared helpers with no UI, e.g. slug.ts.
  styles/       Global CSS and Tailwind setup.
public/         Files served as-is (favicon, robots.txt).
tests/e2e/      Playwright browser tests.
data/           Source spreadsheets (glossary, taxonomy, content priority).
docs/           Requirements, plans, content rules, wireframes.
.claude/        Claude Code agents and project settings.
```

Rules of thumb:

- Something used by one feature lives in `src/features/<feature>/`. Move it to `src/components/` or `src/lib/` only when a second feature needs it.
- Unit tests sit next to the file: `slug.ts` and `slug.test.ts`.
- Secrets come from environment variables only. Only `PUBLIC_*` variables reach the browser.
