# Abbreviations restructure

Date: 2026-10-01. Files changed: `data/insurance-glossary.csv`, `data/insurance-glossary.xlsx`. ID changes: `docs/verification/abbreviation-id-changes.csv`.

## What changed

- Two new columns at the end of the Terms sheet and CSV, after US Notes: **Abbreviation** (column N) and **Abbreviation Is Common Name** (column O, Yes/No). Columns A to M did not move, so the "By Category" formulas still point at the right columns.
- **Term** now always holds the full form, for example "Health Maintenance Organization" rather than "HMO".
- **Also Known As** now holds only real alternative names. The row's own abbreviation and its full form were removed from it.
- When a Term changed from an abbreviation to its full form, the ID became the slug of the new Term. Every reference in Related Terms was updated to match.
- The README sheet describes the two new columns, the updated Term, Also Known As and ID rules, and the new validation checks.

## Counts

| | Count |
|---|---|
| Rows | 1,016 (unchanged) |
| Rows with an Abbreviation | 211 |
| Abbreviation Is Common Name = Yes | 97 |
| Abbreviation Is Common Name = No | 114 |
| Terms renamed to their full form | 41 |
| ID changes (old IDs become redirects) | 40 |

There are 41 renamed Terms but only 40 ID changes. The reasons:
- MIB, ORSA and Agent E&O already had full-form IDs, so their IDs did not change.
- `fcra` and `glba` were changed even though their Terms were already full. Their IDs were acronyms, and changing them keeps every ID matching its full-form Term.

## Judgement calls

**Expanded to the full form.** These are names with an acronym in them, and the Abbreviation column holds the short form:
- ACORD becomes "Association for Cooperative Operations Research and Development". This is the official name (checked on the web), although the organisation is almost always called ACORD. Common Name = Yes.
- MIB becomes "Medical Information Bureau". The company now trades as MIB Group, so "MIB Group" is kept in Also Known As. The full name is still widely used in life underwriting. Common Name = Yes.
- CLUE Report becomes "Comprehensive Loss Underwriting Exchange Report" (abbreviation "CLUE Report").
- A-PLUS Report becomes "Automated Property Loss Underwriting System Report" (abbreviation "A-PLUS Report"). This keeps it consistent with CLUE. The expansion was checked against Verisk.
- Agent E&O becomes "Agent Errors and Omissions". "Agents Errors and Omissions" is kept in Also Known As as a variant wording.
- Technology E&O becomes "Technology Errors and Omissions" (abbreviation "Tech E&O").
- Third-Party EPLI becomes "Third-Party Employment Practices Liability Insurance".
- USL&H becomes "United States Longshore and Harbor Workers' Compensation". This was checked on the web. "Longshore and Harbor Workers' Compensation Act" stays in Also Known As.
- Hybrid Life/LTC becomes "Hybrid Life/Long-Term Care" (abbreviation "Hybrid Life/LTC", Common Name = No).
- These kept a suffix in the abbreviation: CPT Code, NAICS Code, SIC Code, POS Plan, FAIR Plan and PCS Catastrophe. The abbreviation includes the suffix, for example "NAICS Code" for "North American Industry Classification System Code".
- COPE becomes "Construction, Occupancy, Protection, Exposure".
- ICD-10 becomes "International Classification of Diseases, 10th Revision".

**Kept as written, with no abbreviation.** These are form numbers, product names or company names rather than real abbreviations:
- AM Best
- ACORD AL3 and ACORD Forms
- CMS-1500 and UB-04
- EDI 834, EDI 835 and EDI 837
- MCS-90 and SR-22
- HO-3, HO-4, HO-5, HO-6 and HO-8
- FDIC Insurance and ERISA Preemption. Expanding the acronym inside these names would read awkwardly.

**Abbreviation of a synonym, not of the Term.** These stay in Also Known As and the Abbreviation column is left blank:
- BAP (Commercial Auto)
- OTC (Comprehensive)
- SFHA (Flood Zone)
- SPIA (Immediate Annuity)
- PMI (Mortgage Insurance)
- APTC (Premium Tax Credit)
- PPC (Protection Class)
- LPT (Portfolio Transfer)
- STLDI (Short-Term Health)
- E&S (Surplus Lines, Non-Admitted Insurer)
- H&M (Hull)
- GWP (Written Premium)
- MCO (Medicaid Managed Care)
- MHPAEA (Mental Health Parity)
- IBNER (Bulk Reserve)
- MYGA (Fixed Annuity)
- TNC (Rideshare)
- TWIA (Windstorm Pool)
- GLWB, GMWB and GMIB (Guaranteed Living Benefit). These are product types.
- ALE (Loss of Use)
- MPCI (Crop Insurance)
- HO Policy (Homeowners)

**Two abbreviations on one row.** The main abbreviation went into the Abbreviation column and the other stayed in Also Known As:
- Excess of Loss: XOL, with XL in Also Known As
- Long-Term Care Insurance: LTC, with LTCI in Also Known As
- Replacement Cost: RC, with RCV ("Replacement Cost Value") in Also Known As
- Annual Renewable Term: ART, with YRT ("Yearly Renewable Term") in Also Known As
- Terrorism Risk Insurance Act: TRIA, with TRIPRA in Also Known As
- Commercial General Liability: CGL, with GL in Also Known As
- Accidental Death Benefit Rider: ADB, with "Double Indemnity" kept as a synonym
- Workers' Compensation Insurance: WC, with "Workers' Comp" kept

**Other notes:**
- Experience Modification Factor uses EMR (strictly "Experience Modification Rate"). Mod and X-Mod stay in Also Known As.
- Reservation of Rights uses "ROR". The old "ROR Letter" was removed from Also Known As.
- Exceedance Probability uses "EP". "EP Curve" is kept in Also Known As.
- Institute Cargo Clauses uses "ICC". Also Known As is now "ICC (A); ICC (B); ICC (C)".
- Age Nearest Birthday uses ANB. "Age Last Birthday (ALB)" is left in Also Known As as it was.
- Common Name = Yes was given where the acronym is what people mostly say. This covers health plan and account types, laws, regulators and data bodies, and industry jargon. Examples are FNOL, IBNR, LAE, ALAE, ULAE, MGA, P&C, E&O, D&O, EPLI, BOP, PIP, MVR, XOL, PML, IUL, VUL and RMD. Everyday consumer terms (ACV, UM, UIM, HDHP, PCP, LTD) were set to No. Most of these are judgement calls. A product owner can change any of them by editing only column O.

## Ambiguous abbreviations

These abbreviations appear on more than one row. Both rows were kept and nothing else was changed:
- **ART**: Alternative Risk Transfer; Annual Renewable Term
- **BI**: Bodily Injury Liability; Business Interruption Insurance
- **COI**: Certificate of Insurance; Cost of Insurance
- **RP**: Return Premium; Revenue Protection
- **GL** (partial): the Abbreviation for General Ledger, and also in Also Known As for Commercial General Liability

## Validation results

All checks pass with 0 errors:
- IDs are unique and in slug form.
- Every Related Terms ID exists, and no row refers to itself.
- Terms are unique.
- Abbreviation Is Common Name is only Yes, No or blank, and it is blank exactly when Abbreviation is blank.
- No Also Known As entry repeats the row's Term or Abbreviation.
- The CSV matches the Terms sheet cell for cell, including the header.
- Rows are sorted by Term, ignoring case.
- The autofilter covers A1:O1017 and the header is still frozen.
- The Category, Applies To Lines, Most Relevant For, Difficulty, Usage Frequency and Where You'll See It vocabulary checks still pass.

The workbook was recalculated in LibreOffice with 0 formula errors. The "By Category" totals are all 1,016. Those formulas count over fixed ranges (rows 2 to 1017), so they don't depend on the sort order. The row count did not change, so the ranges still cover every row.
