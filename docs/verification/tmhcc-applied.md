# TMHCC changes applied

Applied on 1 October 2026, after the product owner approved the proposals in `tmhcc-gap-report.md`. Only `data/insurance-taxonomy.csv`, `data/insurance-taxonomy.xlsx` and `id-changes.csv` were changed.

**Rows: 551 before, 580 after.** That is the 28 proposed nodes plus one new grouping node, Employer Health Risk Financing, added by tidy-up (a).

## Nodes added (28)

All 28 rows from `tmhcc-proposed-nodes.csv` were added with their text unchanged. Two of them sit under a different parent than proposed, because of tidy-ups (a) and (b):

- The three stop-loss carve-outs now sit under `health.employer_risk_financing.stop_loss`.
- Contractual Bonus is now `specialty.event.contractual_bonus`, not `specialty.sports.contractual_bonus`.

Their Level and Full Path were recalculated to match.

| Name | Parent |
|---|---|
| Multiemployer (Taft-Hartley) Health Plan | Employer Group Health (`health.major_medical.group_health`) |
| Medical Stop-Loss Captive | Medical Stop-Loss (`health.employer_risk_financing.stop_loss`) |
| Organ Transplant Carve-Out | Medical Stop-Loss (`health.employer_risk_financing.stop_loss`) |
| Cell & Gene Therapy Carve-Out | Medical Stop-Loss (`health.employer_risk_financing.stop_loss`) |
| Group Medical Gap Insurance | Supplemental Health (Voluntary Benefits) (`health.supplemental`) |
| High-Limit Disability Insurance | Disability Insurance (`health.disability`) |
| Key Person Disability | Disability Insurance (`health.disability`) |
| Tenant User Liability (TULIP) | Special Event Liability (`casualty.specialty_liability.special_events_liability`) |
| Sexual Abuse & Molestation Liability | Specialty Casualty Lines (`casualty.specialty_liability`) |
| Tenant Discrimination Liability | Specialty Casualty Lines (`casualty.specialty_liability`) |
| Public Entity Insurance | Business Package Policies (`commercial.packages`) |
| Energy Insurance | Commercial Lines (Business Property & Packages) (`commercial`) |
| Control of Well | Energy Insurance (`commercial.energy`) |
| Renewable Energy Insurance | Energy Insurance (`commercial.energy`) |
| Medical Billing E&O | Professional Liability (E&O) (`specialty.professional_liability`) |
| Contractors Professional Liability | Professional Liability (E&O) (`specialty.professional_liability`) |
| Public Officials Liability | Management Liability (`specialty.management_liability`) |
| Maritime Piracy (Marine K&R) | Kidnap, Ransom & Extortion (K&R) (`specialty.kr`) |
| Active Assailant Insurance | Specialty Insurance (`specialty`) |
| Sovereign Non-Payment | Political Risk Insurance (PRI) (`specialty.political_risk`) |
| Over-Redemption Insurance | Event, Entertainment & Contingency Insurance (`specialty.event`) |
| Contractual Bonus Insurance | Event, Entertainment & Contingency Insurance (`specialty.event`) |
| Amateur Sports Insurance | Sports Insurance (`specialty.sports`) |
| Weather Promotion Insurance | Weather Insurance (`specialty.weather`) |
| Non-Trade Credit Insurance | Credit Insurance (`financial.credit`) |
| Game Promotion (Sweepstakes) Bond | Commercial Surety (`financial.surety.commercial_surety`) |
| Oil & Gas Bonds | Commercial Surety (`financial.surety.commercial_surety`) |
| Residual Value Insurance | Financial Lines (`financial`) |

Each new node sits next to its closest sibling. For example, Taft-Hartley follows Level-Funded Plan, Contractors PL follows Architects & Engineers, Sovereign Non-Payment follows Contract Frustration, and Active Assailant follows K&R. Energy Insurance is the last branch under Commercial Lines.

## Tidy-ups

**(a) Medical stop-loss.** Following the report, I added a new Health branch, **Employer Health Risk Financing** (`health.employer_risk_financing`, Level 2). It sits right after Major Medical, and Medical Stop-Loss moved under it together with its three new carve-out children.

- **Why a branch under Health, not under Reinsurance or ART:** stop-loss protects an employer's own health plan, not an insurer, so it is not reinsurance. Learners will look for it next to employer health plans.
- **What the new node says:** its description and US Note state plainly that this cover protects the plan sponsor and is regulated as insurance to the employer, not as health insurance.
- **What stayed under Employer Group Health:** Self-Funded and Level-Funded plans, and the new Taft-Hartley plan, because they are plan types.

**(b) Contingency.** I chose the option with the least ID churn: no IDs changed, only two names and their descriptions.

- `specialty.event` is renamed **Event, Entertainment & Contingency Insurance**, with the Also Known As "Contingency insurance". Its description now also covers promotions and prize, rebate and bonus payouts. Event cancellation, non-appearance, prize indemnity, over-redemption and the new contractual bonus now sit together there.
- `specialty.sports` is renamed **Sports Insurance** and now holds only athlete disability, bloodstock and amateur sports.
- Weather Insurance stays its own branch, because moving it would change IDs.

**(c) Weather derivatives.** I removed the Also Known As "Weather derivatives" from `specialty.weather`, which leaves that field blank. The description now adds that a weather derivative is a traded financial contract, not insurance, while weather insurance covers the buyer's own loss.

**(d) Contract frustration.** I removed the Also Known As "Non-honoring of sovereign obligations" from `specialty.political_risk.contract_frustration`. That name is now only on the new Sovereign Non-Payment node. The description now says that contract frustration covers a government buyer cancelling or not performing a contract, and that a plain failure to pay a government debt is Sovereign Non-Payment.

## ID changes

There is one ID change, and it is appended to `id-changes.csv`:

| Old ID | New ID |
|---|---|
| `health.major_medical.group_health.stop_loss` | `health.employer_risk_financing.stop_loss` |

The node had no existing children, so no other existing ID changed. The glossary (`insurance-glossary.csv`) does not mention the old ID or any changed taxonomy ID.

## Workbook

- **Tree sheet:** rewritten from the CSV with the same formatting: Name indented by level, levels 1 and 2 shown in bold with their fills, and the autofilter extended to row 581.
- **Outline sheet:** rewritten with one column per level, the ID in the last column, and row grouping by level. The deepest level is still 5.
- **Summary sheet:** its formulas use whole-column ranges, so they needed no edits.
- **README sheet:** it gives no row counts, so it needed no edits.

## Validation

The validation script reported **all checks passed**.

- IDs are unique and in dotted form.
- Each child's ID is its parent's ID plus "." and a slug.
- Level is the parent's Level + 1, and Full Path is the parent's Full Path + " > " + Name.
- Rows are in depth-first order.
- All 28 proposed rows are present with their text unchanged.
- Every ID change is reflected in the data, and the glossary does not reference any changed ID.
- The CSV matches the Tree sheet cell for cell.
- The Outline sheet matches by name, ID and grouping level.
- After a LibreOffice recalculation, all 38 formulas have 0 errors. The Summary sheet's root total, Tree row check, level total and market total all equal 580.
- Rows per level: 13 / 91 / 314 / 152 / 10.

`docs/requirements.md` still says "551 types". It was out of scope for this change.
