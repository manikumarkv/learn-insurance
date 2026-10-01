# MCP servers

Every MCP server we discussed for LearnInsurance: the ones we could build, ready-made ones we can use instead, and where a plain script is simpler.

An MCP server gives Claude (our agents and our Claude Code sessions) a set of tools, for example "search the glossary". It is not part of the website that visitors use.

## How a server gets used

1. **Build** the server in `mcp/<name>/`, or pick a ready-made one.
2. **Register** it in `.mcp.json`. Claude Code only connects to servers listed there, on our laptops and in GitHub Actions. Tokens come from environment variables, never from the file itself.
3. **Allow** its tools in the `tools:` list of the agents that need them (`.claude/agents/*.md`).

A server is registered in the same PR that builds or adds it.

## Summary

| # | Server | What it does | Wave | Size | Recommendation |
|---|---|---|---|---|---|
| 1 | glossary | Search terms, find duplicates, find term mentions | 1 | M | Build, or start with the DuckDB MCP |
| 2 | taxonomy | Look up insurance types and their tree | 1 | S | Build, or start with the DuckDB MCP |
| 3 | content-validator | Check a term file against the schema and style rules | 1 | M | Script (`pnpm validate:terms`) |
| 4 | trusted-sources | Search and fetch only approved US sources | 1 | M–L | Setting: domain allowlist for web fetch |
| 5 | facts | Verified facts with source and expiry date | 2 | M | Data file + script |
| 6 | state-rules | State-by-state rules as data | 2 | M | Data file + script |
| 7 | question-bank | Question pools, duplicates, answer stats | 2 | M | Script |
| 8 | path-builder | Suggest and check learning paths | 2 | M | Script |
| 9 | requests | Term requests and their status, daily cap | 3 | M | GitHub MCP + Neon MCP |
| 10 | analytics | Missed searches, top terms, path drop-off | 3 | S–M | PostHog MCP |
| 11 | publish | Open content PRs, update issues | 3 | S | GitHub MCP |
| 12 | draft-model | Draft a term with an open model (experiment) | X | S | Build |

- **Wave 1:** what the agent dry run (story 8.0, #86) needs.
- **Wave 2:** better quality and reuse.
- **Wave 3:** ships with milestone M3.
- **X:** experiment.

Sizes are XS–XL, as in the product plan.

## Ready-made servers we can use

| Server | Covers | Maker | In `.mcp.json` |
|---|---|---|---|
| GitHub MCP | publish, request issues | GitHub (official) | Yes |
| Neon MCP | request and progress status | Neon (official) | Yes (needs authorization via `/mcp`) |
| PostHog MCP | analytics | PostHog (official) | Not yet |
| Vercel MCP | deploy status and logs | Vercel (official) | Not yet |
| Google Search Console MCP | search traffic | Community (review the code first) | Not yet |
| DuckDB MCP | glossary and taxonomy lookups with SQL on the CSV files | MotherDuck (official) | Not yet |
| Context7 MCP | up-to-date docs for Astro, Keystatic, Clerk, Tailwind | Upstash | Not yet |
| Playwright MCP | UI checks and screenshots | Microsoft (official) | Not yet |

Before adding one, check that it is still maintained and that its token gets only the access it needs.

## Simpler without an MCP server

| Need | Do this instead |
|---|---|
| trusted-sources | Allow only approved sites for the agents' built-in web search and fetch in `.claude/settings.json`, e.g. `WebFetch(domain:naic.org)`. |
| content-validator, question-bank | A Zod check script that agents run and CI runs too. Shares its schema with story 2.2. |
| path-builder | A build script that orders a path's terms from the types tree and `data/content-priority.csv`. |
| facts, state-rules | Data files (`data/facts.yaml`, `data/state-rules/<topic>.csv`) checked by the same script. |

A script can become an MCP server later if agents need to call it many times in one task.

## Server details

### 1. glossary (wave 1, M, read-only)
One place to search terms, check for duplicates before writing a new one, and find which words in a text are other terms (the same rules as wiki-style term links, story 3.8).
- **Used by:** term-writer, term-reviewer, Claude sessions, site build
- **Data:** `data/insurance-glossary.csv` now; `src/content/terms/` after the import (story 2.3)
- **Tools:**
  - `search_terms(query, limit)`: ranked matches on name, abbreviation and other names.
  - `get_term(id)`: the full entry.
  - `find_duplicates(term, abbreviation?, aliases?)`: clashing entries and why.
  - `resolve_abbreviation(abbr)`: term IDs for an abbreviation (more than one means it's shared, e.g. BI).
  - `find_mentions(text)`: other terms in a text, longest match, whole words.
  - `list_related(id)`: related terms with their quick answers.

### 2. taxonomy (wave 1, S, read-only)
Lookups into the 580-type insurance tree, so agents place terms correctly.
- **Used by:** term-writer, path-builder
- **Data:** `data/insurance-taxonomy.csv`, later `src/content/types/`
- **Tools:**
  - `search_types(query)`: matching types with full path.
  - `get_type(id)`: one type with description, example and US notes.
  - `get_subtree(id, depth)`: children down to a depth.
  - `get_path(id)`: ancestors up to the root line.
  - `terms_for_type(id)`: terms for that type, most used first.

### 3. content-validator (wave 1, M, read-only)
The same checks CI runs (story 2.2), so the reviewer spends its effort on facts and wording.
- **Used by:** term-writer, term-reviewer, CI
- **Rules from:** `docs/content/term-schema.md`
- **Tools:**
  - `validate_term(yaml)`: schema errors as `{field, message}`.
  - `check_story_math(term)`: story numbers and visual totals add up.
  - `check_questions(term)`: pool size matches usage (10 / 6 / 4), one correct answer each.
  - `check_style(text)`: long sentences, advice wording, brand names.
  - `check_links(text)`: `[[id]]` targets and related IDs exist.

### 4. trusted-sources (wave 1, M–L, read-only, API key)
Search and fetch limited to approved sources, returning clean text with title and date.
- **Used by:** term-writer, term-reviewer
- **Allowlist:** NAIC, state insurance departments, CMS, HealthCare.gov, Medicare.gov, IRS, FEMA/NFIP, USDA RMA, Treasury, DOL, III, NCCI
- **Tools:**
  - `search(query, domains?)`: results from allowlisted sites only.
  - `fetch(url)`: clean text, title and date. Refuses other sites.
  - `cite(url)`: a ready `{title, url}` entry for a term's sources.

### 5. facts (wave 2, M, read + restricted write)
Verified facts with a source and expiry date, reused across terms. Powers the fresh-facts check before launch (story 10.7).
- **Used by:** term-writer, term-reviewer, admin
- **Seed:** confirmed claims in `docs/verification/*-report.md`
- **Tools:**
  - `get_facts(topic)`: facts on a topic, e.g. "NFIP building limit".
  - `add_fact(claim, source_url, as_of, expires_on)`: reviewer or admin only.
  - `list_expiring(days)`: facts due for re-checking (TRIA, NFIP, ACA dates).
  - `mark_verified(id, source_url)`: refreshes a fact's date.

### 6. state-rules (wave 2, M, read-only)
State-by-state rules with a source per row, so "about 20 states" becomes an exact list.
- **Used by:** term-writer, term-reviewer
- **First topics:** no-fault states, UM required, hurricane deductibles, FAIR plans, monopolistic workers' comp, valued-policy laws, public adjuster fee caps
- **Tools:**
  - `list_topics()`: topics with row counts and last-checked date.
  - `get_rule(topic, state?)`: one state or all.
  - `states_where(topic, value)`: e.g. no-fault = yes.

### 7. question-bank (wave 2, M, read + flag)
Avoids near-duplicate questions and shows which ones confuse learners.
- **Used by:** term-writer, term-reviewer, admin
- **Data:** question pools in term files; answer stats from Neon (after Epic 7)
- **Tools:**
  - `get_pool(term_id)`: all questions for a term.
  - `check_similarity(questions[])`: near-duplicate pairs.
  - `question_stats(term_id)`: correct-answer rate per question.
  - `flag_question(term_id, index, reason)`: adds it to the admin review queue.

### 8. path-builder (wave 2, M, read-only)
Suggests learning paths (Epic 10) so foundations come first.
- **Used by:** content sessions
- **Depends on:** glossary, taxonomy
- **Tools:**
  - `suggest_path(type_id)`: ordered modules by dependencies, difficulty and usage.
  - `validate_path(path)`: unknown IDs, duplicates, terms before their prerequisites.
  - `coverage(type_id)`: how many of a type's terms are fully written.

### 9. requests (wave 3, M, read + write)
Term requests and issue reports with their status, read by both the pipeline and the admin screen. Enforces the daily cap (story 8.8).
- **Used by:** GitHub Actions pipeline, admin
- **Backing:** Neon (story 6.2) and GitHub issues
- **Tools:**
  - `create_request(term, context, kind)`: kind is `term-request` or `term-fix`.
  - `get_request(id)`, `list_requests(status?)`: status and history.
  - `update_status(id, status, note)`: Requested → Writing → In review → Published / Rejected / Needs attention.
  - `queue_stats()`: runs used today and how many are waiting.

### 10. analytics (wave 3, S–M, read-only, admin)
Usage signals for deciding what to write next. Never returns personal data.
- **Used by:** admin screen, content sessions
- **Backing:** PostHog (story 6.6), Neon
- **Tools:**
  - `missed_searches(days, limit)`: searches with no result, with counts.
  - `top_terms(days)`: most viewed terms.
  - `path_dropoff(path_id)`: where learners stop.

### 11. publish (wave 3, S, narrow write)
A thin wrapper over GitHub that can only touch content files and pipeline issues. Build it only if the GitHub MCP gives the pipeline more access than we want.
- **Used by:** pipeline (story 8.4)
- **Allowed paths:** `src/content/**`
- **Tools:**
  - `open_content_pr(files, title, issue)`: opens a PR with auto-merge after checks.
  - `get_pr_status(pr)`: checks and merge state.
  - `comment_issue(issue, text)`, `label_issue(issue, labels)`: pipeline updates.

### 12. draft-model (experiment, S, read-only)
Drafts a term with an open model (Ollama or OpenRouter) so the dry run (story 8.0) can compare quality and cost with Claude. Its drafts always go through the Claude reviewer.
- **Used by:** agent dry run (#86)
- **Config:** model name and endpoint in env vars
- **Tools:**
  - `draft_term(request, context)`: a YAML draft plus tokens used and cost.

## Rules for servers we build

- **Where:** `mcp/<name>/`, as pnpm workspace packages. One shared package for the schema and data loaders, so the site, CI and servers agree.
- **Stack:** TypeScript and the official MCP TypeScript SDK. Stdio for local and GitHub Actions use; Streamable HTTP for hosted ones.
- **Tools:** snake_case names, Zod-checked inputs, stable JSON outputs, descriptions written for the agent that reads them.
- **Safety:** read-only by default. Write tools say what they change. Secrets only from env vars, listed in `.env.example`, never logged.
- **Tests:** Vitest per tool, plus one test through an MCP client.
- **Done means:** README with tools and env vars, entry in `.mcp.json`, tools added to the agents that use them.
- glossary and taxonomy read the CSV files today. Give both a small loader so they switch to `src/content/` after story 2.3 without changing their tools.

## Who builds what (team of four)

| Person | First | Then |
|---|---|---|
| A | glossary | path-builder |
| B | content-validator (with story 2.2) | question-bank |
| C | trusted-sources | facts |
| D | taxonomy, state-rules | draft-model (for the dry run) |

Later, with M3: requests, analytics and publish. If we follow the recommendations above, most of these become setup work for ready-made servers or scripts, and only glossary, taxonomy and draft-model need building.

## Possible later: a public LearnInsurance MCP

A server hosted on our site that people connect to from their own Claude or ChatGPT to look up insurance terms. It would not go in our `.mcp.json`. Not planned yet.
