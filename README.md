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
