# LearnInsurance requirements

A web app that explains US insurance terms in plain English. This file records what we decided and what is still open. Update it in the same PR as any change of direction.

- **Wireframes:** [docs/wireframes](wireframes/README.md)
- **Term content format:** [docs/content/term-schema.md](content/term-schema.md)
- **Learning research:** [docs/research/how-people-like-to-learn.md](research/how-people-like-to-learn.md)
- **Data fact-check:** [docs/verification/applied.md](verification/applied.md)

## Audience and scope

- **Who it's for:** people reading their own policy, developers new to insurance projects, new underwriters, product owners. All have little insurance depth.
- **Market:** US only.
- **Tone:** plain English first, precise second. Explain, never advise.

## Features

### Terms
- One page per term at `/terms/<id>` with: quick answer, plain-English definition, example, a visual (diagram template), where it happens in the policy flow, a person story (e.g. Tom), a "check yourself" question, FAQs, related terms, US notes.
- Tags: usage frequency (High / Medium / Low), difficulty, category, insurance types. **No "Most useful for" role tag.**
- AI-written terms show an "AI-generated · AI-reviewed" badge.
- Terms A–Z page with filters for usage, difficulty and insurance type.
- Seed data: `data/insurance-glossary.csv` (1,016 terms).

### Insurance types
- Expandable tree of all US insurance types (`data/insurance-taxonomy.csv`, 551 types).
- One page per type at `/types/<slug>` with quick answer, visual, sub-types, key terms (most used first), FAQs, US notes and a link to its learning path.

### Search and term requests
- Search across terms and types (Pagefind).
- When a term isn't found, the user can request it. The request creates a GitHub issue labelled `term-request`.
- **Fully automatic:** the `term-writer` agent validates and writes the term, the `term-reviewer` agent checks it (sends it back up to 2 times), then it is published and the issue closed. No manual step.
- Anything the agents can't resolve is labelled `needs-attention` and shown in the admin screen.

### Report an issue
- "Report an issue" on a term page creates a GitHub issue labelled `term-fix`.
- Same pipeline as term requests: writer fixes, reviewer checks, republished automatically.

### Learning
- Learning paths: **Insurance basics**, plus **one path per insurance type**. No role-based paths.
- Learn one term at a time: text and visual side by side, then a check-yourself question.
- Progress % counts terms answered **correctly**, not pages viewed.
- Quick review of 3–5 earlier terms at the start of each session; missed terms come back. "All caught up" when nothing is due.
- Module quizzes and a final quiz per path.
- **Guests can learn without an account.** Progress is kept on the device; after 5 correct answers, prompt to sign up.
- My progress page: terms answered correctly, paths, quizzes, saved terms, my term requests.

### Accounts
- Sign up / sign in with Clerk (Google or email).
- Account settings: profile, analytics cookie toggle, delete account.

### Admin (manual review)
Admin-only screen (Clerk role `admin`) with everything that needs a human look:
- **Needs my review queue:** requests the agents got stuck on, AI-published terms not yet spot-checked, issue-report fixes, and data items held from the fact-check.
- **Term requests pipeline:** each request's status (Requested → Writing → In review → Published / Rejected / Needs attention) with its GitHub issue.
- **Missed searches** from PostHog, with one-click "Request".
- Link to Keystatic to edit or remove content.

### Site
- **Disclaimer** in every footer and on term and type pages: educational only, not insurance, legal or financial advice.
- **Privacy policy** and **Terms of use** pages.
- **Cookie consent** banner (needed for PostHog).
- **Mobile-friendly** layouts.
- **404 page** with search and "Request a term".
- **SEO / AEO / GEO** on every term and type page: clean URLs, meta title and description, quick answer at the top, FAQ + `DefinedTerm` schema, sitemap, `llms.txt`, last-updated date.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Astro, with React for interactive parts (quiz, learn cards, search, admin) |
| Content | Keystatic (Git-based content files) |
| Styling | Tailwind CSS |
| Validation | Zod |
| Package manager | pnpm |
| Design system | **Paper Design** |
| Search | Pagefind |
| Hosting | Vercel |
| Auth | Clerk |
| Database | **Neon Postgres**: learning progress, quiz results, term requests and reports status |
| Analytics | PostHog + Google Search Console |
| Automation | GitHub Issues + GitHub Actions running Claude agents (`.claude/agents/term-writer.md`, `term-reviewer.md`) |
| Coding standards | devrunway Claude Code plugin, project scope (`.claude/settings.json`, `stack.json`). Policy: no direct commits to `main`. |
| Error monitoring | None for now (Vercel logs) |

## Not doing (for now)

- Comments on terms.
- Emails of any kind (reminders, "term ready", newsletters). The admin screen replaces them for manual review.
- Completion certificates or badges.
- Role-based learning paths or role tags.
- Videos (maybe later for the most-used terms).

## Edge cases

Deliberately postponed to a separate session. When code needs to handle one, leave a `TODO(edge-cases): …` comment describing it so they can be collected later (`grep -rn "TODO(edge-cases)"`).

## Open items

- Two fact-check items held for manual review (see `docs/verification/applied.md`).
- A few facts change often and should be re-checked before launch: TRIA reauthorization, NFIP authorization date, ACA open-enrollment dates, short-term health plan rules.
