# Product Plan: LearnInsurance
_Date: 2026-10-01 · Status: Draft_
_Source: [docs/requirements.md](../requirements.md) (decisions from the brainstorm sessions). Related: [wireframes](../wireframes/README.md), [term schema](../content/term-schema.md), [content priority](../content/priority.md)._

## User Personas

### Priya (Policyholder)
- **Goals:** understand the words in her own policy, quote or claim letter.
- **Pain points:** jargon, long documents, no one to ask.
- **Tech literacy:** Medium. Usually arrives from Google on her phone.

### Ram (Insurance newcomer at work)
A developer, new underwriter or product owner at a specialty insurer such as Tokio Marine HCC.
- **Goals:** learn the domain vocabulary fast, in a structured order, and see his progress.
- **Pain points:** scattered sources, little time, terms that assume knowledge he doesn't have.
- **Tech literacy:** High. Desktop and mobile.

### Mani (Admin and content owner)
- **Goals:** keep content accurate, spot-check AI-written content, see gaps and missed searches.
- **Pain points:** too much content to review by hand.
- **Tech literacy:** High.

## User Flows

### Priya — Look up a term
1. Searches Google, or the site's home page, for a word such as "subrogation".
2. Lands on the term page: quick answer, visual, story.
3. Hovers or taps linked terms in the text to see their meaning, or opens related terms.
4. If the term isn't found, requests it; it appears later, written and reviewed automatically.

### Ram — Learn a path
1. Opens Learning paths and picks Insurance basics or a type (e.g. Medical stop-loss).
2. As a guest, works through learn cards and answers questions.
3. After 5 correct answers, is prompted to sign up with Clerk; his progress carries over.
4. Next session starts with a quick review of 3–5 earlier terms, then continues the path.
5. Takes module quizzes and the final quiz, and checks My progress.

### Mani — Manual review
1. Opens Admin and works through the review queue: stuck requests, AI-published terms, issue fixes, held data items.
2. Approves, unpublishes, or opens a term in Keystatic to edit it.
3. Checks the term request pipeline and missed searches, and requests missing terms.

## Scope

### In Scope
- Term pages (full and basic), Terms A–Z, insurance types tree and type pages, wiki-style term links.
- Search, term requests, issue reports, and the automatic writer → reviewer → publish pipeline.
- Learning paths, question pools, learn cards, quick review, quizzes, guest learning, My progress.
- Clerk accounts and settings; Neon for user data; PostHog analytics with consent.
- Admin screen for manual review; Keystatic for content editing.
- Disclaimer, privacy and terms pages, cookie consent, accessibility, mobile layouts, 404, SEO/AEO/GEO.
- Content filled in phases: P0 Foundation → missing TMHCC terms → P1 → P2 → P3; type pages.

### Out of Scope
- Comments on terms — decided against for now.
- Emails of any kind — the admin screen covers manual review.
- Certificates and badges — not needed for v1.
- Role-based learning paths and role tags — keep paths simple.
- Videos — maybe later for the most-used terms.
- Edge cases — deferred to a separate session; code marks them with `TODO(edge-cases)`.

## Milestones

| Milestone | Epics | Outcome |
|---|---|---|
| **M1: Public glossary** | 1, 2, 3, 4, 5 (+ Epic 10 Phase 0 content) | Read-only site live: all terms and types, search, SEO, legal pages |
| **M2: Learning** | 6, 7 | Accounts, learning paths, questions, quizzes, progress |
| **M3: Automation & admin** | 8, 9 | Term requests and fixes publish automatically; admin review screen |
| **Content (ongoing)** | 10 | Runs alongside from Epic 2 onward |

## Epics & Stories

### Epic 1: Project foundation
_Goal: a working, deployable app skeleton with standards and CI._

#### Story 1.1 — Scaffold the app
**As** Mani, **I want** an Astro + React + TypeScript app with Tailwind and the agreed tooling, **so that** all later work starts from a consistent base.
**Size:** M
**Depends on:** —

**Acceptance Criteria:**
- [ ] Astro with React islands, TypeScript strict mode, Tailwind, pnpm.
- [ ] ESLint and Prettier configured; `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build` scripts work.
- [ ] Vitest and Playwright set up with one passing example test each.
- [ ] Folder structure follows devrunway project-structure guidance and is described in the README.

#### Story 1.2 — CI on every pull request
**As** Mani, **I want** automated checks on every PR, **so that** broken code or content never reaches `main`.
**Size:** S
**Depends on:** 1.1

**Acceptance Criteria:**
- [ ] GitHub Actions runs lint, typecheck, unit tests, build and content validation on every PR.
- [ ] `main` requires the checks to pass before merging.
- [ ] Runs finish in under 10 minutes.

#### Story 1.3 — Vercel deploys
**As** Mani, **I want** a preview URL for every PR and production deploys from `main`, **so that** I can see changes before merging.
**Size:** S
**Depends on:** 1.1

**Acceptance Criteria:**
- [ ] Each PR gets a Vercel preview URL posted on the PR.
- [ ] Merges to `main` deploy to production.
- [ ] Environment variables are documented in `.env.example` with no secrets committed.

#### Story 1.4 — Paper Design tokens and base components
**As** Priya, **I want** a calm, readable, high-contrast interface, **so that** reading about insurance feels easy.
**Size:** M
**Depends on:** 1.1

**Acceptance Criteria:**
- [ ] Paper Design tokens (paper, ink, spacing, radius, borders, Lato type scale) available as CSS variables and Tailwind theme.
- [ ] Four themes (soft light, soft dark, high-contrast light and dark) follow system settings and a visible toggle, remembered per device.
- [ ] Button, Badge, Card, Input, Checkbox, Switch, Icon match Paper Design; no colours, shadows or animations.
- [ ] Every component is keyboard accessible with the Paper Design focus ring.

#### Story 1.5 — Site layout
**As** Priya, **I want** clear navigation and a consistent footer on every page, **so that** I always know where I am.
**Size:** S
**Depends on:** 1.4

**Acceptance Criteria:**
- [ ] Header with logo, Terms A–Z, Insurance types, Learning paths, search, theme toggle and account button.
- [ ] Mobile menu below 768px.
- [ ] Footer with the disclaimer and links to About, Privacy, Terms of use and Cookie settings.
- [ ] 404 page with search and "Request a term".

#### Story 1.6 — Project CLAUDE.md
**As** Mani, **I want** project rules written down for Claude, **so that** agents and coding sessions follow the same conventions.
**Size:** XS
**Depends on:** 1.1

**Acceptance Criteria:**
- [ ] `CLAUDE.md` points to requirements, schema, priority and wireframes.
- [ ] Documents the `TODO(edge-cases)` rule, the no-commit-to-main policy, and how to run the term agents.
- [ ] Lists the main commands.

### Epic 2: Content model & data import
_Goal: all terms and types live in Keystatic as validated files._

#### Story 2.1 — Keystatic setup
**As** Mani, **I want** to edit terms, types, learning paths and pages in Keystatic, **so that** content changes don't need code.
**Size:** M
**Depends on:** 1.1

**Acceptance Criteria:**
- [ ] Collections for Terms, Insurance types, Learning paths, and Pages singletons (Privacy, Terms of use, About, disclaimer).
- [ ] Term fields match `docs/content/term-schema.md`, including abbreviation, question pools and the visual template's conditional fields.
- [ ] Editor available at `/keystatic` in development.

#### Story 2.2 — Content validation
**As** Mani, **I want** content checked automatically, **so that** bad AI or human edits can't publish.
**Size:** M
**Depends on:** 2.1

**Acceptance Criteria:**
- [ ] Zod schema mirrors the term schema; `pnpm validate:content` runs in CI.
- [ ] Checks allowed values, word and character limits, related-term IDs, `[[id]]` link targets, and question pool size by usage (for `full` terms).
- [ ] Clear error messages naming the file and field.

#### Story 2.3 — Import script
**As** Mani, **I want** the CSV data turned into content files, **so that** all terms and types exist from day one.
**Size:** M
**Depends on:** 2.1

**Acceptance Criteria:**
- [ ] Creates 1,016 term files and 580 type files from `data/*.csv`, mapping line names and abbreviation fields.
- [ ] Marks each term `contentStatus: basic` (seed fields only) or `full`.
- [ ] Safe to re-run: never overwrites a `full` term.
- [ ] All imported files pass content validation.

#### Story 2.4 — Redirects
**As** Priya, **I want** old and short links to work, **so that** `/terms/acv` or a bookmarked old URL still reaches the term.
**Size:** S
**Depends on:** 2.3

**Acceptance Criteria:**
- [ ] Old IDs from `docs/verification/id-changes.csv` and `abbreviation-id-changes.csv` redirect (301).
- [ ] `/terms/<abbreviation>` redirects to the full term.
- [ ] TODO(edge-cases) noted for abbreviations shared by two terms.

#### Story 2.5 — Keystatic save mode
**As** Mani, **I want** Keystatic to save to local files in development and to GitHub in production, **so that** live edits become commits.
**Size:** S
**Depends on:** 2.1

**Acceptance Criteria:**
- [ ] `KEYSTATIC_STORAGE=local|github` switches mode.
- [ ] GitHub mode setup steps documented (GitHub App).

### Epic 3: Browse terms & types
_Goal: Priya can read any term or type on any device._

#### Story 3.1 — Term page (full)
**As** Priya, **I want** a clear term page, **so that** I understand the word quickly and in context.
**Size:** L
**Depends on:** 2.3, 1.4

**Acceptance Criteria:**
- [ ] Shows quick answer, definition, example, visual, flow strip, story, check-yourself questions, FAQs, related terms, US notes, tags, AI badge, disclaimer, last updated.
- [ ] Title follows abbreviation rules ("HMO (Health Maintenance Organization)" / "Actual Cash Value (ACV)").
- [ ] Matches the Paper Design mockup (PD2) on desktop and mobile.
- [ ] Static pages: no client JavaScript except interactive islands.

#### Story 3.2 — Term page (basic)
**As** Priya, **I want** a useful page even for terms not fully written yet, **so that** every term is searchable from launch.
**Size:** S
**Depends on:** 3.1

**Acceptance Criteria:**
- [ ] Shows definition, example, abbreviation, related terms, US notes.
- [ ] "Full explanation coming soon" note.
- [ ] Same URL and SEO fields as full pages.

#### Story 3.3 — Visual templates
**As** Priya, **I want** a simple diagram next to the text, **so that** I understand without reading much.
**Size:** M
**Depends on:** 1.4

**Acceptance Criteria:**
- [ ] before-after, timeline, who-pays, split and flow templates render from term data.
- [ ] Meaning carried by labels, solid vs hatched fills and borders, never colour.
- [ ] Accessible text alternative for each diagram; works at 390px width.

#### Story 3.4 — Terms A–Z
**As** Priya, **I want** to browse all terms, **so that** I can find words without knowing exactly what to search.
**Size:** M
**Depends on:** 2.3

**Acceptance Criteria:**
- [ ] Letter bar, filters for usage, difficulty, insurance type and abbreviations, sort by most used or A–Z.
- [ ] Pagination; filters reflected in the URL.

#### Story 3.5 — Insurance types tree
**As** Ram, **I want** to see how insurance types fit together, **so that** I understand where a product sits.
**Size:** M
**Depends on:** 2.3

**Acceptance Criteria:**
- [ ] Expandable tree of 580 types with counts; filter box; expand all.
- [ ] Side panel with description, example and link to the type page.
- [ ] Keyboard navigable (tree pattern).

#### Story 3.6 — Insurance type page
**As** Ram, **I want** a page per insurance type, **so that** I can learn what it covers and its key terms.
**Size:** M
**Depends on:** 3.5

**Acceptance Criteria:**
- [ ] Quick answer, visual, sub-types, key terms (most used first), FAQs, US notes, related types, learning path link.
- [ ] URL `/types/<slug>`.

#### Story 3.7 — Home page
**As** Priya, **I want** a home page that gets me to an answer fast, **so that** I don't have to hunt.
**Size:** M
**Depends on:** 3.1

**Acceptance Criteria:**
- [ ] Hero search, most-used terms, how a policy works, insurance types, learning paths.
- [ ] Matches the Paper Design mockup (PD1).

#### Story 3.8 — Term links and previews
**As** Priya, **I want** other insurance words in an explanation to be links with a quick preview, **so that** I can understand unfamiliar words without losing my place.
**Size:** M
**Depends on:** 3.1

**Acceptance Criteria:**
- [ ] Mentions of other terms (name, abbreviation, other names) link automatically at build time, following the schema's **Term links** rules.
- [ ] `[[id]]` and `[[!word]]` overrides work.
- [ ] Hover (desktop) or tap (mobile) shows the quick answer and "Open term"; keyboard and screen-reader accessible.
- [ ] Term links use a dotted underline; normal links a solid one.

### Epic 4: Search & SEO
_Goal: people find terms through site search and through Google and AI answers._

#### Story 4.1 — Search index
**As** Priya, **I want** search to find a term by any of its names, **so that** "ACV" or "actual cash value" both work.
**Size:** S
**Depends on:** 3.1

**Acceptance Criteria:**
- [ ] Pagefind indexes term name, abbreviation, other names and quick answer, and type names.
- [ ] Index built during `pnpm build`.

#### Story 4.2 — Search box and results
**As** Priya, **I want** fast search results, **so that** I reach the right term in one step.
**Size:** M
**Depends on:** 4.1

**Acceptance Criteria:**
- [ ] Search in the header and on a results page, with usage tags and matching types.
- [ ] Keyboard accessible; results announced to screen readers.
- [ ] Search events sent to analytics after consent (Epic 6).

#### Story 4.3 — Not-found state
**As** Priya, **I want** suggestions and a way to request a missing term, **so that** a failed search isn't a dead end.
**Size:** S
**Depends on:** 4.2

**Acceptance Criteria:**
- [ ] "Did you mean…" suggestions.
- [ ] "Request this term" button (submits once Epic 8 is done).
- [ ] Missed search recorded for analytics.

#### Story 4.4 — Page meta
**As** Mani, **I want** proper titles and descriptions on every page, **so that** search results look right.
**Size:** S
**Depends on:** 3.1

**Acceptance Criteria:**
- [ ] Meta title and description from content; canonical URL; Open Graph tags.

#### Story 4.5 — Structured data
**As** Mani, **I want** schema.org data on term and type pages, **so that** search engines and AI tools understand them.
**Size:** S
**Depends on:** 3.1

**Acceptance Criteria:**
- [ ] `DefinedTerm`, `FAQPage` and `BreadcrumbList` JSON-LD; valid in Google's Rich Results test.

#### Story 4.6 — Sitemap, robots and llms.txt
**As** Mani, **I want** crawl files and last-updated dates, **so that** new terms get indexed.
**Size:** S
**Depends on:** 3.1

**Acceptance Criteria:**
- [ ] `sitemap.xml`, `robots.txt` and `llms.txt` generated at build.
- [ ] Last-updated date shown on term and type pages.

#### Story 4.7 — Google Search Console
**As** Mani, **I want** the site verified in Search Console, **so that** I can track search performance.
**Size:** XS
**Depends on:** 4.6

**Acceptance Criteria:**
- [ ] Site verified; sitemap submitted (manual task for Mani).

### Epic 5: Legal & site basics
_Goal: the site is safe and polished enough to go public._

#### Story 5.1 — Privacy policy page
**As** Priya, **I want** to know what data is collected, **so that** I can trust the site.
**Size:** S
**Depends on:** 2.1

**Acceptance Criteria:**
- [ ] Draft covers Clerk, Neon, PostHog, Vercel; editable in Keystatic.
- [ ] Reviewed by Mani (or a lawyer) before launch.

#### Story 5.2 — Terms of use page
**As** Mani, **I want** terms of use, **so that** the site's limits are clear.
**Size:** S
**Depends on:** 2.1

**Acceptance Criteria:**
- [ ] Includes educational-only and no-advice wording; editable in Keystatic; reviewed before launch.

#### Story 5.3 — About page and disclaimer block
**As** Priya, **I want** to know who runs the site and that it isn't advice, **so that** I use it correctly.
**Size:** XS
**Depends on:** 1.5

**Acceptance Criteria:**
- [ ] About page; one shared disclaimer component used in the footer and on term and type pages.

#### Story 5.4 — Cookie consent
**As** Priya, **I want** to choose whether analytics cookies are used, **so that** my privacy is respected.
**Size:** S
**Depends on:** 1.5

**Acceptance Criteria:**
- [ ] Banner with "Only necessary" and "Accept"; choice remembered; changeable from the footer.
- [ ] No analytics loads before consent.

#### Story 5.5 — Accessibility pass
**As** Priya, **I want** the site usable with a keyboard and screen reader, **so that** everyone can learn.
**Size:** M
**Depends on:** Epic 3

**Acceptance Criteria:**
- [ ] WCAG 2.2 AA on key pages; axe checks in Playwright with zero serious issues.
- [ ] Manual keyboard and screen-reader pass on term page, search and learn card.

#### Story 5.6 — Performance budget
**As** Priya, **I want** pages to load fast on my phone, **so that** I get answers quickly.
**Size:** S
**Depends on:** 1.2

**Acceptance Criteria:**
- [ ] Lighthouse 90+ (performance, accessibility, SEO) on home, term and search pages, checked in CI.

#### Story 5.7 — M1 launch checklist
**As** Mani, **I want** a launch checklist, **so that** going live is safe and repeatable.
**Size:** XS
**Depends on:** M1 stories

**Acceptance Criteria:**
- [ ] Domain, production deploy, Search Console, smoke test, legal pages reviewed, fresh-facts check (10.7) done.

### Epic 6: Accounts, data & analytics
_Goal: Ram can sign in and his data has a safe home._

#### Story 6.1 — Sign up and sign in
**As** Ram, **I want** to sign in with Google or email, **so that** my progress is saved across devices.
**Size:** M
**Depends on:** 1.5

**Acceptance Criteria:**
- [ ] Clerk sign-in and sign-up; account menu in the header.
- [ ] Protected pages redirect to sign-in and back.

#### Story 6.2 — Neon database
**As** Ram, **I want** my answers and progress stored safely, **so that** I never lose them.
**Size:** M
**Depends on:** 6.1

**Acceptance Criteria:**
- [ ] Neon Postgres with migrations (ORM decision in Open Questions).
- [ ] Tables for question attempts, term progress, saved terms, term requests.
- [ ] Stores only the Clerk user ID; no other personal data.

#### Story 6.3 — Server API pattern
**As** Mani, **I want** one consistent way to write server endpoints, **so that** they are secure and predictable.
**Size:** S
**Depends on:** 6.2

**Acceptance Criteria:**
- [ ] Astro endpoints check sign-in, validate input with Zod, and return a standard error format.
- [ ] Example endpoint with tests.

#### Story 6.4 — Account settings
**As** Ram, **I want** to manage my account and delete it, **so that** I control my data.
**Size:** S
**Depends on:** 6.2

**Acceptance Criteria:**
- [ ] Profile from Clerk, analytics toggle.
- [ ] Delete account removes Clerk user and all Neon rows.

#### Story 6.5 — Admin role
**As** Mani, **I want** an admin role, **so that** only I can see admin pages and APIs.
**Size:** S
**Depends on:** 6.1

**Acceptance Criteria:**
- [ ] Clerk `admin` role; admin routes and APIs return 403 for others.

#### Story 6.6 — PostHog analytics
**As** Mani, **I want** to see what people search and learn, **so that** I can improve content.
**Size:** S
**Depends on:** 5.4

**Acceptance Criteria:**
- [ ] Page views and events: search, missed search, term view, answer, sign-up.
- [ ] Loads only after consent; no personal data in events.

### Epic 7: Learning paths, questions & progress
_Goal: Ram can learn a path step by step and see real progress._

#### Story 7.1 — Learning path content
**As** Mani, **I want** to define learning paths in Keystatic, **so that** I can add paths without code.
**Size:** S
**Depends on:** 2.1

**Acceptance Criteria:**
- [ ] A path has title, description and ordered modules, each an ordered list of term IDs.
- [ ] Validation checks every term ID exists.

#### Story 7.2 — Paths list and path detail
**As** Ram, **I want** to see the paths and what's in each, **so that** I can choose where to start.
**Size:** M
**Depends on:** 7.1

**Acceptance Criteria:**
- [ ] Paths page: Insurance basics first, then one path per insurance type.
- [ ] Path detail: modules, progress %, continue button.

#### Story 7.3 — Question engine
**As** Ram, **I want** varied questions, **so that** I test my understanding, not my memory of one question.
**Size:** M
**Depends on:** 6.3

**Acceptance Criteria:**
- [ ] Picks 3 random questions from a term's pool, skipping ones the user saw recently.
- [ ] Records each answer (signed-in: Neon; guest: device).
- [ ] Shows the explanation after answering.

#### Story 7.4 — Learn card
**As** Ram, **I want** to learn one term at a time with a visual and questions, **so that** learning feels manageable.
**Size:** M
**Depends on:** 7.3, 3.8

**Acceptance Criteria:**
- [ ] Text and visual side by side (stacked on mobile), then questions.
- [ ] Previous, skip, and check-answer-and-next.
- [ ] Term link previews open in place.

#### Story 7.5 — Progress
**As** Ram, **I want** progress based on correct answers, **so that** the % reflects what I actually know.
**Size:** S
**Depends on:** 7.3

**Acceptance Criteria:**
- [ ] A term counts as learned when answered correctly; % shown per path and module.

#### Story 7.6 — Quick review
**As** Ram, **I want** a short review of earlier terms, **so that** I remember them.
**Size:** M
**Depends on:** 7.3

**Acceptance Criteria:**
- [ ] 3–5 earlier terms at session start; missed terms come back sooner.
- [ ] "All caught up" state; skip option.

#### Story 7.7 — Module and final quizzes
**As** Ram, **I want** quizzes per module and path, **so that** I can check myself.
**Size:** M
**Depends on:** 7.3

**Acceptance Criteria:**
- [ ] Built from the module's term pools; score; pass mark 70%; retake; list of terms to review.

#### Story 7.8 — Guest learning
**As** Ram, **I want** to start learning without an account, **so that** I can try before signing up.
**Size:** M
**Depends on:** 7.3, 6.1

**Acceptance Criteria:**
- [ ] Progress saved on the device; banner explaining it.
- [ ] Sign-up prompt after 5 correct answers.
- [ ] Device progress moves into the account on sign-up.

#### Story 7.9 — My progress page
**As** Ram, **I want** one page with my progress, **so that** I see how far I've come.
**Size:** S
**Depends on:** 7.5

**Acceptance Criteria:**
- [ ] Terms answered correctly, paths with %, quizzes passed, saved terms, my term requests and their status.

### Epic 8: Term request & issue pipeline
_Goal: missing terms and errors get fixed with no manual step._

#### Story 8.1 — Request a term
**As** Priya, **I want** to request a missing term, **so that** it gets added.
**Size:** M
**Depends on:** 4.3, 6.3

**Acceptance Criteria:**
- [ ] Form creates a GitHub issue labelled `term-request` via a server endpoint (token never exposed to the browser).
- [ ] Request recorded in Neon; confirmation shown.
- [ ] TODO(edge-cases) for spam and rate limits.

#### Story 8.2 — Report an issue
**As** Priya, **I want** to report a mistake on a term, **so that** it gets fixed.
**Size:** S
**Depends on:** 8.1

**Acceptance Criteria:**
- [ ] Form with reason and details creates a `term-fix` issue linked to the term.

#### Story 8.3 — Writer and reviewer GitHub Action
**As** Mani, **I want** new requests and reports handled by the agents, **so that** I don't write content by hand.
**Size:** L
**Depends on:** 2.2

**Acceptance Criteria:**
- [ ] Action runs `term-writer`, then `term-reviewer`, with up to 2 revise rounds.
- [ ] Output passes content validation before any commit.
- [ ] Results commented on the issue.

#### Story 8.4 — Auto-publish
**As** Priya, **I want** an approved term to go live automatically, **so that** I can read it soon after asking.
**Size:** M
**Depends on:** 8.3

**Acceptance Criteria:**
- [ ] Approved: commit to `main` via PR auto-merge, deploy, close the issue with a link.
- [ ] Rejected: close with the reason. Stuck: label `needs-attention`.

#### Story 8.5 — Request status
**As** Priya, **I want** to see my request's status, **so that** I know when it's ready.
**Size:** S
**Depends on:** 8.4

**Acceptance Criteria:**
- [ ] Status (Requested → Writing → In review → Published / Rejected / Needs attention) stored in Neon and shown in My progress.

#### Story 8.6 — Batch fill
**As** Mani, **I want** the agents to fill existing terms in priority order, **so that** content grows steadily.
**Size:** M
**Depends on:** 8.3

**Acceptance Criteria:**
- [ ] Manually triggered Action fills N terms from `data/content-priority.csv` (P0 first), one PR per batch.

### Epic 9: Admin
_Goal: Mani reviews everything that needs a human look on one screen._

#### Story 9.1 — Admin layout and access
**As** Mani, **I want** an admin area only I can open, **so that** review tools stay private.
**Size:** S
**Depends on:** 6.5

**Acceptance Criteria:**
- [ ] `/admin` protected by the `admin` role; sidebar navigation matching the wireframe.

#### Story 9.2 — Review queue
**As** Mani, **I want** one queue of things needing a human look, **so that** nothing slips through.
**Size:** M
**Depends on:** 8.4

**Acceptance Criteria:**
- [ ] Shows needs-attention requests, AI-published terms not spot-checked, issue fixes, held data items.
- [ ] Actions: approve (mark checked), unpublish, edit in Keystatic.

#### Story 9.3 — Term requests pipeline view
**As** Mani, **I want** to see every request's status, **so that** I know the pipeline is healthy.
**Size:** S
**Depends on:** 8.5

**Acceptance Criteria:**
- [ ] Table of requests with status, last update and GitHub issue link; filter by status.

#### Story 9.4 — Missed searches
**As** Mani, **I want** to see searches with no results, **so that** I can request the missing terms.
**Size:** S
**Depends on:** 6.6, 8.1

**Acceptance Criteria:**
- [ ] Top missed searches this week from PostHog, with one-click "Request".

#### Story 9.5 — Keystatic in production
**As** Mani, **I want** to edit content on the live site, **so that** quick fixes don't need a code session.
**Size:** S
**Depends on:** 2.5, 6.5

**Acceptance Criteria:**
- [ ] Keystatic in GitHub mode, open to admins only.

### Epic 10: Content production
_Goal: fill terms in priority order. Runs alongside the other epics from Epic 2 onward. Until 8.6 exists, batches are run in a Claude session with the same agents and reviewed as PRs._

#### Story 10.1 — Phase 0: Foundation
**As** Priya, **I want** the everyday insurance words fully explained, **so that** I understand the basics first.
**Size:** L
**Depends on:** 2.2

**Acceptance Criteria:**
- [ ] All 194 P0 terms are `full` and pass validation and review.
- [ ] Insurance basics path built from them.

#### Story 10.2 — Missing TMHCC terms
**As** Ram, **I want** the specialty terms my job uses to exist, **so that** I can learn them.
**Size:** L
**Depends on:** 10.1

**Acceptance Criteria:**
- [ ] The 111 terms in `docs/content/missing-terms-tmhcc.csv` are written, reviewed and published.

#### Story 10.3 — Phase 1
**As** Ram, **I want** the core TMHCC-line terms fully explained, **so that** my learning paths are complete.
**Size:** L
**Depends on:** 10.2

**Acceptance Criteria:**
- [ ] All 127 P1 terms are `full`; first TMHCC-line paths built (stop-loss, contingency, credit & political risk, surety, cyber, D&O/EPL).

#### Story 10.4 — Phase 2
**As** Ram, **I want** supporting terms explained, **so that** P1 pages make full sense.
**Size:** M
**Depends on:** 10.3

**Acceptance Criteria:**
- [ ] All 95 P2 terms are `full`.

#### Story 10.5 — Phase 3
**As** Priya, **I want** personal-lines terms explained, **so that** my auto, home, life and health questions are covered.
**Size:** XL
**Depends on:** 10.4

**Acceptance Criteria:**
- [ ] All 600 P3 terms are `full`; personal-lines paths built.

#### Story 10.6 — Type pages
**As** Ram, **I want** rich insurance type pages, **so that** I understand each product.
**Size:** L
**Depends on:** 2.3

**Acceptance Criteria:**
- [ ] 13 top-level types first, then the rest: quick answer, visual, FAQs, SEO.

#### Story 10.7 — Fresh-facts check
**As** Mani, **I want** fast-changing facts re-checked before launch, **so that** nothing is out of date.
**Size:** XS
**Depends on:** —

**Acceptance Criteria:**
- [ ] TRIA, NFIP, ACA enrollment dates and short-term health plan rules re-verified with sources.

## Open Questions
| Question | Owner | Status |
|---|---|---|
| Database access library for Neon (Drizzle suggested; check the devrunway Neon layer) | Dev | Open |
| Privacy policy and terms of use: self-reviewed or lawyer-reviewed before launch? | Mani | Open |
| Domain name | Mani | Open |
| Edge cases (spam, rate limits, shared abbreviations, stuck agents) | Mani | Deferred to edge-case session |

## Next Step
→ Run `/devrunway:product-tasks learn-insurance` to create GitHub milestones and issues.
