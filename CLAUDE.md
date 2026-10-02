# LearnInsurance

A web app that explains US insurance terms in plain English for people with little insurance knowledge: policy readers, developers new to insurance, new underwriters and product owners. Explain, never advise.

## Read first

| What                                               | Where                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Decisions and scope (single source of truth)       | `docs/requirements.md`                                                                 |
| Epics, stories and acceptance criteria             | `docs/product-plans/learn-insurance.md`                                                |
| Story → GitHub issue map                           | `docs/product-tasks/learn-insurance.md`                                                |
| Term file format (YAML schema, questions, visuals) | `docs/content/term-schema.md`                                                          |
| Content priority (P0–P3)                           | `docs/content/priority.md`, `data/content-priority.csv`                                |
| Wireframes                                         | `docs/wireframes/README.md`                                                            |
| MCP servers (planned)                              | `docs/mcp-servers.md`                                                                  |
| Seed data                                          | `data/insurance-glossary.csv` (1,016 terms), `data/insurance-taxonomy.csv` (580 types) |

When a decision changes, update `docs/requirements.md` in the same PR.

## Commands

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm lint         # ESLint + Prettier check
pnpm format       # Prettier write
pnpm typecheck    # astro check
pnpm test         # Vitest unit tests
pnpm test:e2e     # Playwright (builds and serves the site)
pnpm validate:content   # check src/content against the term schema
pnpm import:content     # (re)create basic terms and types from data/*.csv; never overwrites full terms
pnpm build
```

Run `lint`, `typecheck`, `test`, `validate:content` and `test:e2e` before every push. CI runs the same checks on every PR.

## Stack

Astro (static by default) with React islands, TypeScript strict, Tailwind 4, pnpm, Vitest, Playwright. Hosting on Vercel. Later: Keystatic (content), Pagefind (search), Clerk (auth), Neon Postgres, PostHog. TypeScript stays on 6.0 until typescript-eslint and `astro check` support 7.

## Rules

- **No commits to `main`.** Work on a branch and open a PR into `main`.
  - Branch names: `feature/<issue>-<short-name>`, `fix/<issue>-<short-name>`, `chore/<short-name>`.
  - PR descriptions say `Closes #<issue>`.
- **Edge cases are deferred.** Don't solve them now. Leave a comment where the code would need it:
  `// TODO(edge-cases): <what the case is and what should happen>`
  They are collected later with `grep -rn "TODO(edge-cases)"`.
- **Pages not built yet:** link to them anyway and leave `TODO(story x.y)` naming the story that builds them.
- **Secrets** come from environment variables only. List new ones in `.env.example` with no value. Only `PUBLIC_*` reaches the browser.
- **Islands:** add a `client:*` directive only where interaction is needed. Prefer `client:visible` / `client:idle`; use `client:only="react"` for components that read `localStorage` or `window`.
- **Tests** live next to the code (`foo.ts` + `foo.test.ts`); browser tests in `tests/e2e/`.
- **Folders:** see the README. Feature code goes in `src/features/<feature>/`; move it to `src/components/` or `src/lib/` only when a second feature needs it.

## Design: Paper Design

- Ink on paper only. No colours, no shadows (except the focus ring), no animation. Lato font.
- Use the tokens and components that exist:
  - Tailwind classes such as `bg-paper`, `text-ink`, `text-ink-muted`, `text-headline` … `text-label-sm`, `rounded-md`, `border-2` / `border-3`.
  - Components in `src/components/ui/`.
- Tailwind's default colours, shadows and animations are removed on purpose. Don't add them back.
- Status is shown with a word and an icon, never colour. Every control is keyboard accessible with the shared focus ring.
- See every component at `/design`.

## Content and the term agents

- Terms live in `src/content/terms/<id>.yaml` (the file name is the id) and follow `docs/content/term-schema.md` exactly. Edit content in Keystatic at `/keystatic` (dev server). Allowed values: `src/content/schema/values.ts`.
- AI-written terms have `meta.source: ai` and show the "AI-generated · AI-reviewed" badge.
- **`term-writer`** (`.claude/agents/term-writer.md`) writes or revises one term from a request.
  - Example: "write term subrogation", or "handle term request #123".
  - It returns a JSON summary: outcome, id, file, sources, missing terms.
- **`term-reviewer`** (`.claude/agents/term-reviewer.md`) checks a written term against the schema and sources.
  - Example: "review term subrogation".
  - It returns `APPROVE`, `REVISE` (with numbered fixes) or `REJECT`. It never edits content.
- **Flow:** the writer writes, then the reviewer reviews.
  - On `REVISE`, the writer revises. This can happen up to 2 times.
  - When it can't be resolved, the issue gets the `needs-attention` label.
  - The automated GitHub Actions pipeline is Epic 8.
- Writing style: plain English, short sentences, US only, no brand names, no advice ("you should buy…").

## MCP servers

`.mcp.json` registers `github-agents` (for the term pipeline; needs `GITHUB_PERSONAL_ACCESS_TOKEN`) and `neon`. Don't name a server `github`: that replaces a Claude session's own GitHub connection.
