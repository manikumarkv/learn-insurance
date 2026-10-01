# Content priority

The term writer agent fills in each glossary term's content: story, visual, question pool, FAQs and SEO. This list sets the order. Terms used in Tokio Marine HCC (TMHCC) specialty lines come first, because the product owner works with those lines.

- **Priority list:** `data/content-priority.csv` (all 1,016 glossary terms, each listed once)
- **Missing terms:** `docs/content/missing-terms-tmhcc.csv` (111 term requests)
- **Source of the TMHCC types:** `docs/verification/tmhcc-gap-report.md` and `tmhcc-proposed-nodes.csv`

## How priority is assigned

I reduced the 92 TMHCC generic types to 58 type labels, for example "Medical stop-loss", "Event cancellation", "Trade credit", "Surety (contract & commercial bonds)" and "Directors & officers". For each type I chose the glossary terms a learner needs to understand it. I made each choice by reading the term's name, abbreviation, other names, definition and lines, not by keyword matching alone.

| Priority | Rule | Count |
|---|---|---|
| **P1** | Central to one or more TMHCC types: the type's own term and its core mechanics. Examples: specific and aggregate stop-loss, attachment point, obligee, bid bond, Side A/B/C, institute cargo clauses, actual production history. | **141** |
| **P2** | Supporting terms used across TMHCC lines, such as claims-made, retroactive date, sublimit, retention, excess, surplus lines, MGA, binding authority, bordereau, Lloyd's and fully earned premium (122 terms). P2 also includes every remaining High-usage general term (116 terms), because learners need those to understand anything. | **238** |
| **P3** | Everything else, mostly personal auto, homeowners, life, annuity and ACA health terms. | **637** |

**Order within a priority:** Usage Frequency first (High, then Medium, then Low), then Difficulty (Beginner first). Within P1, a term that serves more TMHCC types comes first. P3 uses the same sort. The `Order` column runs from 1 to 1,016 across all three priorities.

**TMHCC Types column:** lists the types a term serves, separated by semicolons. It is filled for P1 terms and for type-specific P2 support terms. It is blank for general High-usage terms, for general cross-line mechanics and for all P3 terms.

## How the writer pipeline uses it

1. **Missing terms first.** Before the writer enriches the P1 terms of a TMHCC type, it requests that type's missing terms from `missing-terms-tmhcc.csv` (for example "Non-Appearance Insurance" before the event cancellation terms). This lets the new pages link to each other.
2. **Then P1** in `Order` sequence.
3. **Then P2**, then **P3**.

Each term is written to the schema in `docs/content/term-schema.md`.

## Top 30 P1 terms

| # | Term | TMHCC types |
|---|---|---|
| 1 | General Liability Insurance | Contractors GL; Special event liability |
| 2 | Commercial General Liability | Contractors GL |
| 3 | Pre-Existing Condition | Travel medical |
| 4 | Umbrella Insurance | Contractors excess liability |
| 5 | Errors and Omissions Insurance | 9 professional liability / E&O types |
| 6 | Professional Liability Insurance | 7 professional liability types |
| 7 | Cyber Insurance | Business cyber; Tech E&O; Personal cyber |
| 8 | Additional Insured | Contractors GL |
| 9 | Third-Party Administrator | Medical stop-loss |
| 10 | Disability Insurance | High-limit, key person, buy-sell and athlete disability |
| 11 | Travel Insurance | 4 travel types |
| 12 | Accident Insurance | AD&D |
| 13 | Supplemental Insurance | Group medical gap |
| 14 | Trip Cancellation Insurance | Trip cancellation / interruption |
| 15 | Self-Funded Plan | Stop-loss, transplant and CGT carve-outs, Taft-Hartley |
| 16 | Employee Retirement Income Security Act | Stop-loss; Taft-Hartley; Fiduciary |
| 17 | Obligee | Surety; Game promotion bond; Oil & gas bonds |
| 18 | Principal | Surety; Game promotion bond; Oil & gas bonds |
| 19 | Surety Bond | Surety; Game promotion bond; Oil & gas bonds |
| 20 | Wrongful Act | D&O; EPL; Fiduciary |
| 21 | Crime Insurance | Commercial crime; Financial institution bond |
| 22 | Directors and Officers Liability | D&O; Financial institutions E&O / D&O |
| 23 | Employee Dishonesty | Commercial crime; Financial institution bond |
| 24 | High-Deductible Health Plan | Medicare MSA; Group medical gap |
| 25 | Social Engineering Fraud | Business cyber; Commercial crime |
| 26 | Accidental Death and Dismemberment | AD&D |
| 27 | Agreed Value | Aviation hull & liability |
| 28 | Benefit Period | High-limit disability |
| 29 | Breach Response Costs | Business cyber |
| 30 | Builders Risk | Renewable energy |

## Missing terms

**111 terms** are essential to TMHCC types but have no glossary entry. I checked each one against every existing Term, Abbreviation and Also Known As, ignoring case. They include:

- **Names of TMHCC types:** Political Risk Insurance, CEND, Non-Appearance Insurance, Prize Indemnity Insurance, Financial Institution Bond, Representations and Warranties Insurance, Energy Insurance, Public Officials Liability.
- **Core mechanics:** Lasering, Specific Deductible, Run-In/Run-Out Claims, Protracted Default, Credit Limit, Penal Sum, Control of Well, Delay in Start-Up, Sue and Labor Clause, Materiality Scrape, Discovery Form.

Several terms suggested as possibly missing already exist and are P1: Aggregate Stop-Loss, Specific Stop-Loss, Attachment Point, Obligee, Event Cancellation Insurance, Self-Funded Plan and General Indemnity Agreement.

Notes for the writer:

- "Architects and Engineers Professional Liability" is proposed without the abbreviation A&E, because "Asbestos and Environmental" already uses it.
- "Commercial Surety Bond" was not proposed, because it is already an Also Known As of License and Permit Bond. That name is too narrow for it and should be reviewed.
