# Fact-check corrections: what was applied

Applied on 30 September 2026. The rule was to apply every correction with High or Medium confidence and hold every Low-confidence one. Before each change I checked that the row's current value matched the "Current" column. All of them matched.

## Counts

| File | Proposed | Applied | Held (Low confidence) | Skipped |
|---|---|---|---|---|
| `data/insurance-taxonomy.csv` / `.xlsx` | 33 | 32 | 1 | 0 |
| `data/insurance-glossary.csv` / `.xlsx` (from lists A, B and C) | 64 | 63 | 1 | 0 |

Confidence decides whether an item is applied, not Severity. So many items marked Low severity but High or Medium confidence were applied. Examples are the QLAC name, the root rename to "Home & Personal Property Insurance", and the glossary alias clean-ups.

## Held for manual review (Low confidence)

- **Taxonomy `life.term`, US Notes.** The proposal replaces "most common individual life product by policy count" with "one of the most widely bought… whole life and indexed UL now bring in more new premium". The source (LIMRA) measures premium, not policy count, so this needed a human decision. **Approved and applied on 2026-10-01.**
- **Glossary `premium-tax`, Usage Frequency.** The proposal changes High to Medium. This is a judgement call with no source. **Approved and applied on 2026-10-01.**

## Skipped

None. Every High and Medium item matched its current value.

## Decisions made while applying

- **Group life vs business life (taxonomy).** The report gave two options: rename `life.group_life`, or move key person, buy-sell, COLI and split-dollar to a new node. I renamed the parent to "Group & Business Life Insurance". The four move items were resolved with the "keep under renamed life.group_life" option, so their IDs did not change. The parent's description still reads as employer benefits only. You may want to widen it.
- **AD&D (taxonomy).** Moved from Disability to Supplemental Health, placed right after Accident Insurance. This is the only ID change.
- **Alias instructions (glossary).** Some Proposed values were instructions rather than text:
  - "Nuclear Verdict" (excess-verdict), "Stated Amount" (agreed-value), "Lessor" (lienholder), "Statement of Actuarial Opinion" (appointed-actuary) and "Reciprocal Jurisdiction Reinsurer" (certified-reinsurer) were removed. None of these has its own glossary row, so nothing was added to Related Terms.
  - The UK aliases were removed, because the glossary has no convention for marking UK usage:
    - binder: "Cover Note" removed, leaving no alias
    - application: "Proposal Form" removed, leaving "App"
    - free-look-period: "Cooling-Off Period" replaced with "Right to Examine; Free Look"
    - total-loss: "Write-Off" replaced with "Totaled"
- **Dashes.** Glossary number ranges use en dashes (for example 30–60, 10–20%, 1951–1959 and "Symbols 1–9 and 19") to match neighbouring rows. The taxonomy keeps hyphens, as it already did.
- **Knock-on edits for consistency.**
  - The `social.state_residual_markets.state_wind_pools` note now points to "Home & Personal Property Insurance".
  - In the taxonomy workbook's Summary sheet, the root name was updated and the approach note no longer says "ISO homeowners HO-1 to HO-8 forms".

## ID changes

Recorded in `docs/verification/id-changes.csv`:

| Old ID | New ID |
|---|---|
| `health.disability.add` | `health.supplemental.add` |

It has no descendants. The glossary has no references to taxonomy IDs, so nothing else needed updating.

Name changes that only updated Full Path (IDs unchanged):
- `property` (49 Full Paths changed in total, including this branch)
- `life.group_life`
- `property.homeowners.ho7`, now "Mobile / Manufactured Home Insurance"
- `life.annuities.deferred.qlac`, now "Qualifying…"

## Validation (all passed)

- **Taxonomy (551 rows):**
  - IDs are unique and every Parent ID exists.
  - Level = parent + 1, each ID = parent ID + slug, and Full Path is consistent.
  - Rows are in depth-first order.
  - The CSV matches the Tree sheet exactly, the Outline sheet matches (names, level columns, row grouping), and the Summary root names match.
- **Glossary (1,016 rows):**
  - IDs are unique and every Related Terms ID exists.
  - Category, lines, audiences, Difficulty, Usage Frequency and Where You'll See It use only the controlled values.
  - No definitions are empty.
  - The CSV matches the Terms sheet exactly.
- **Formulas:** after a LibreOffice recalculation there are 0 formula errors (38 formulas in the taxonomy workbook, 128 in the glossary workbook). The Summary totals come to 551 and the By Category total to 1,016.
