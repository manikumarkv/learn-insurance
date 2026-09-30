# Term content schema

Every glossary term is one YAML file. The term writer agent creates it, the term reviewer agent checks it, and the site renders it.

- **Location:** `src/content/terms/<id>.yaml` (to be confirmed when the Astro + Keystatic app is scaffolded)
- **Market:** US only
- **Seed data:** `data/insurance-glossary.csv` (existing terms), `data/insurance-taxonomy.csv` (insurance types). The CSV's "Most Relevant For" column is not imported; the site doesn't show role tags.

## Fields

| Field | Required | Rules |
|---|---|---|
| `id` | yes | Lowercase slug, `a-z0-9-`. Also the URL: `/terms/<id>`. Unique. |
| `term` | yes | Display name, e.g. `Endorsement`. |
| `alsoKnownAs` | no | List of other names or acronym expansions. |
| `category` | yes | One of the **categories** below. |
| `lines` | yes | List of **line IDs** below. Use `[all]` when the term applies everywhere. |
| `usageFrequency` | yes | `High`, `Medium` or `Low`: how often the term shows up in US policies, quotes, claims and industry work. Not the same as difficulty. |
| `difficulty` | yes | `Beginner`, `Intermediate` or `Advanced`. |
| `quickAnswer` | yes | 40–60 words. Answers "What is X?" directly in the first sentence. Used for AEO. |
| `definition` | yes | Plain-English explanation, 2–4 short sentences. |
| `example` | yes | One concrete, everyday example. |
| `whereYoullSeeIt` | yes | List from **places** below. |
| `flowStages` | yes | List from **flow stages** below: where the term matters in a policy's life. |
| `story` | yes | Real-life story, see **Story**. |
| `visual` | yes | One diagram template, see **Visual**. |
| `checkYourself` | yes | One multiple-choice question, see **Check yourself**. |
| `faqs` | yes | 2–4 items of `{ question, answer }`. The first question is "What is <term> in insurance?". Answers ≤ 50 words. |
| `relatedTerms` | yes | 2–6 IDs of terms that already exist. |
| `usNotes` | no | Federal or state differences. Only facts you can back with a source. |
| `seo.metaTitle` | yes | ≤ 60 characters, e.g. `What Is an Endorsement? Insurance Definition & Example`. |
| `seo.metaDescription` | yes | 140–160 characters. |
| `sources` | yes | 2+ `{ title, url }` from credible sources (see **Sources**). Not shown on the page as-is; used for review. |
| `meta.source` | yes | `ai` for agent-written, `editorial` for human-written or seed data. |
| `meta.createdAt` / `meta.updatedAt` | yes | ISO date, e.g. `2026-09-30`. |
| `meta.requestIssue` | no | GitHub issue number that requested the term. |
| `meta.reviewedBy` | yes when `source: ai` | `term-reviewer`. |

### Categories

`Core Concept`, `Policy Wording`, `Lifecycle`, `Underwriting`, `Claims`, `Distribution`, `Finance & Actuarial`, `Regulation`, `Reinsurance`, `Legal/Latin`, `Technology`, `Line-Specific`

### Line IDs

These are the root IDs from `data/insurance-taxonomy.csv`, plus `all`:

`all`, `life`, `health`, `property`, `casualty`, `auto`, `commercial`, `marine`, `specialty`, `financial`, `agriculture`, `social`, `reinsurance`, `art`

The seed glossary CSV uses older names. Map them when importing:

| Glossary CSV | Line ID |
|---|---|
| All | `all` |
| Life | `life` |
| Health | `health` |
| Property | `property` |
| Casualty/Liability | `casualty` |
| Motor | `auto` |
| Commercial | `commercial` |
| Marine/Aviation/Transit | `marine` |
| Specialty | `specialty` |
| Financial Lines | `financial` |
| Agriculture | `agriculture` |
| Social/Government | `social` |
| Reinsurance | `reinsurance` |
| Alternative Risk Transfer | `art` |

### Places (`whereYoullSeeIt`)

`Policy document`, `Declarations page`, `Quote`, `Application form`, `Billing statement`, `Renewal notice`, `Insurance ID card`, `Claim documents`, `Explanation of benefits`, `Agent/broker communications`, `Policy administration system`, `Rating engine`, `Underwriting system`, `Claims system`, `Data exchange/integration specs`, `Product specification`, `Regulatory filings`, `Financial statements`, `Reinsurance contract`

### Flow stages

`Quote`, `Underwriting`, `Bind`, `Issue`, `Changes`, `Claim`, `Renewal`

## Story

A short story that follows one person through the policy's life and shows the term in action.

```yaml
story:
  person: Tom            # simple first name; never a real person or company
  steps:                 # 3–5 steps, in time order
    - stage: Bind        # a flow stage, or "Result"
      text: Tom buys auto insurance for $100/month with $50,000 liability coverage.
    - stage: Changes
      highlight: true    # exactly one step is highlighted: where the term happens
      text: On the 20th, Tom moves and adds collision coverage. His insurer makes both changes with an endorsement.
    - stage: Result
      text: His premium goes up to $120/month from the 20th.
```

Rules:
- Simple, round numbers. The math must add up.
- The highlighted step uses the term by name.
- Each step is one or two sentences.

## Visual

Pick one template and fill in its data. The site draws the diagram.

| Template | Use for | Data |
|---|---|---|
| `before-after` | Changes to a policy (endorsement, rider, reinstatement) | `before: {label, lines[]}`, `change`, `after: {label, lines[]}` |
| `timeline` | Time-based terms (waiting period, grace period, retroactive date) | `start`, `end`, `segments: [{label, share, paidBy: you\|insurer\|none}]` |
| `who-pays` | Money splits (deductible, coinsurance, limit, sublimit) | `total`, `parts: [{label, amount, paidBy: you\|insurer}]` |
| `split` | Two sides of one idea (first-party vs third-party, occurrence vs claims-made) | `left: {label, lines[]}`, `right: {label, lines[]}` |
| `flow` | Terms that are mostly a step in the lifecycle | `highlight: [flow stages]` |

```yaml
visual:
  template: who-pays
  caption: A $5,000 claim with a $1,000 deductible.
  data:
    total: 5000
    parts:
      - { label: Your deductible, amount: 1000, paidBy: you }
      - { label: Insurer pays, amount: 4000, paidBy: insurer }
```

Numbers in `who-pays` parts must add up to `total`. `timeline` shares must add up to 100.

## Check yourself

```yaml
checkYourself:
  question: Halfway through his policy, Tom adds his daughter as a driver. What is this change called?
  options: [A claim, An endorsement, A renewal, A binder]
  answer: 1              # zero-based index into options
  explanation: Adding a driver changes the policy while it is active, which is done with an endorsement.
```

Rules:
- A short scenario, not "What is the definition of X?".
- 3–4 options, all real insurance terms, exactly one correct.
- The correct answer isn't always in the same position.

## Writing style

- Plain English for a smart reader with no insurance background. Aim for grade 8 reading level.
- Sentences of 20 words or fewer. No unexplained jargon; if another term is needed, it must be in `relatedTerms`.
- US market only. Say when something varies by state.
- Explain, never advise. No "you should buy", "always", "never", or statements about a specific company's product.
- No real people, companies or brands in examples and stories.

## Sources

Prefer, in this order:
1. US government and regulators: NAIC, state departments of insurance, CMS, HealthCare.gov, IRS, FEMA/NFIP, USDA RMA, Treasury (TRIP).
2. Industry and education bodies: Insurance Information Institute (III), The Institutes, ISO/Verisk public material, NCCI.
3. Established references: university or law-school resources, major insurer glossaries (for wording only, not product claims).

Never use: forums, SEO content farms, AI-generated pages, or a single insurer's marketing as the only source.

## Full example

```yaml
id: endorsement
term: Endorsement
alsoKnownAs: [Policy change, Mid-term adjustment, Rider (life and health)]
category: Policy Wording
lines: [all]
usageFrequency: Medium
difficulty: Beginner
quickAnswer: >-
  An endorsement is an official written change to an insurance policy after it starts, such as a new address,
  an added driver or extra coverage. It becomes part of the policy and can raise or lower the premium.
definition: >-
  Your policy is a contract. When something changes, you don't buy a new policy. The insurer adds an
  endorsement, a written update that changes part of the contract.
example: Adding your teenage son as a driver on your car policy is done with an endorsement.
whereYoullSeeIt: [Policy document, Declarations page, Policy administration system]
flowStages: [Changes, Renewal]
story:
  person: Tom
  steps:
    - { stage: Bind, text: "Tom buys auto insurance for $100/month with $50,000 liability coverage." }
    - { stage: Changes, highlight: true, text: "On the 20th, Tom moves and adds collision coverage. His insurer makes both changes with an endorsement." }
    - { stage: Result, text: "His premium goes up to $120/month from the 20th." }
    - { stage: Renewal, text: "At renewal, the policy continues with the new address and coverage." }
visual:
  template: before-after
  caption: Same policy, updated. No new policy is bought.
  data:
    before: { label: "Policy · Jan 1", lines: ["$100/month", "Old address", "Liability only"] }
    change: Endorsement
    after: { label: "Policy · Jan 20", lines: ["$120/month", "New address", "Liability + collision"] }
checkYourself:
  question: Halfway through his policy, Tom adds his daughter as a driver. What is this change called?
  options: [A claim, An endorsement, A renewal, A binder]
  answer: 1
  explanation: Adding a driver changes the active policy, which is done with an endorsement.
faqs:
  - { question: What is an endorsement in insurance?, answer: "An official written change to your policy after it starts, like a new address or added coverage." }
  - { question: Does an endorsement change my premium?, answer: "It can. Adding coverage or risk usually raises the premium; removing it can lower it." }
relatedTerms: [rider, declarations-page, premium]
usNotes: Many standard endorsement forms are ISO forms. Insurers file their forms with each state's department of insurance.
seo:
  metaTitle: What Is an Endorsement? Insurance Definition & Example
  metaDescription: An endorsement is an official change to your insurance policy after it starts. See a plain-English definition, a real-life example and how it affects your premium.
sources:
  - { title: "<source title>", url: "<source url>" }
  - { title: "<source title>", url: "<source url>" }
meta:
  source: ai
  createdAt: 2026-09-30
  updatedAt: 2026-09-30
  reviewedBy: term-reviewer
```
