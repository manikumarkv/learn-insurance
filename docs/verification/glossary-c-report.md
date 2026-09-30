# Glossary fact-check, part C

Scope: Finance & Actuarial (93), Regulation (91), Underwriting (78), Technology (62), Legal/Latin (49), Reinsurance (41). Total: 414 rows.

Checked 2026-09-30. Proposed fixes are in `glossary-c-corrections.csv`. No data files were changed.

## Summary

- I checked every row with a US Note, a number, a formula or a legal claim. That is about 120 rows, and I checked them against sources where it mattered.
- I spot-checked the other rows from general knowledge. Most of these are generic technology, underwriting and actuarial terms.
- Overall the section is in good shape. Formulas and worked examples are correct: loss ratio, combined ratio, expense ratio, operating ratio, earned and unearned premium, incurred losses, pure premium, rate × exposure, net amount at risk, surplus treaty lines and table ratings.
- Every term is a real term used in the US. None looks invented.
- Issues found: **High 3, Medium 4, Low 13.** That is 20 proposed changes across 19 rows.

## High (factually wrong)

1. **certified-reinsurer (Also Known As).** The row lists "Reciprocal Jurisdiction Reinsurer" as another name for a certified reinsurer. They are two separate categories under the NAIC Credit for Reinsurance Models #785 and #786:
   - Certified reinsurers post reduced collateral.
   - Reciprocal jurisdiction reinsurers, a category added in 2019, can post none.

   Fix: remove the alias and add a US Note explaining the difference.
2. **certified-reinsurer (US Notes).** This is the same row. The explanatory note above is proposed as a separate entry.
3. **no-surprises-act (Definition).** The row calls it "A 2022 federal law". It was signed on December 27, 2020, as part of the Consolidated Appropriations Act, 2021. Its main protections took effect on January 1, 2022.

## Medium (misleading or incomplete)

- **risk-based-capital (Example).** "Below 200% RBC triggers regulator action" is imprecise. 200% of Authorized Control Level is the *Company* Action Level, where the insurer must file a plan. Action by the regulator starts at lower levels. In addition, P&C and life companies between 200% and 300% face a trend test.
- **required-minimum-distribution (US Notes).** "Rising to 75 in 2033" is inaccurate. Under SECURE 2.0, age 75 applies to people born in 1960 or later, so the first RMDs at 75 fall in 2035.
- **reinsurance (US Notes).** The note implies all US reinsurance is regulated only through credit-for-reinsurance rules. Reinsurers based in the US are licensed and supervised directly by their home state. The indirect route applies mainly to non-US reinsurers.
- **uberrimae-fidei (US Notes).** The note presents the rule as uniform federal maritime law. The Fifth Circuit (*Albany Ins. Co. v. Anh Thi Kieu*, 1991) applies state law instead, so this is a circuit split.

## Low (minor wording, dating or frequency)

- **fair-plan:** "about 30 states" understates it. NAIC counts 33 states plus D.C.
- **glba (Example):** annual privacy notices have been conditional since the FAST Act in 2015.
- **terrorism-risk-insurance-act:** "through 2027" is correct today. However, a House bill (H.R. 7128) passed in June 2026 and a Senate bill is pending, so re-check this before publishing.
- **surplus-lines:** under NRRA the home state regulates the placement *and* taxes it, not just taxes it.
- **principle-based-reserving:** add that PBR had a transition period from 2017 and became mandatory for new business in 2020.
- **allocated-loss-adjustment-expense** and **unallocated-loss-adjustment-expense:** DCC and AO only roughly correspond to ALAE and ULAE. They are not exact synonyms.
- **appointed-actuary:** "Statement of Actuarial Opinion" is the document the actuary signs, not another name for the actuary.
- **declination:** in US usage this is an underwriting term. Refusing to pay a claim is a claim "denial".
- **risk-transfer-testing:** the 10-10 example should say the loss is measured against the premium.
- **slip:** the example should mention the Market Reform Contract (MRC) and electronic placing.
- **employer-mandate:** the 50-employee threshold includes full-time equivalents.
- **premium-tax:** a Usage Frequency of High looks overstated. Medium is proposed.

## Claims verified as correct (selected)

- **Health and benefits law:**
  - HIPAA 1996, ERISA 1974, ACA 2010 and McCarran-Ferguson 1945.
  - COBRA covers employers with 20 or more employees, allows 102% of premium and has state "mini-COBRA" laws.
  - ACA medical loss ratio of 80%/85%, a 1.5x tobacco surcharge, community-rating factors and a silver plan's roughly 70% actuarial value.
  - The individual mandate penalty is $0 from 2019. States with their own penalties are CA, MA, NJ, RI and D.C.
- **Other federal law and forms:**
  - The Miller Act threshold is $150,000.
  - Florida and Virginia use the FR-44.
  - The Colorado law is SB21-169.
- **State rules and bodies:**
  - California bans accident forgiveness under Prop 103 and has a mandatory 20% good driver discount.
  - Florida requires wind mitigation discounts.
  - California, Hawaii and Massachusetts restrict credit-based insurance scores.
  - Contributory negligence still applies in AL, MD, NC, VA and D.C.
  - Independent workers' comp rating bureaus operate in CA, NY and PA.
  - Monopolistic workers' comp funds: Ohio's BWC is one example. California's SCIF is a competitive state fund.
- **Coding standards:**
  - ISO construction classes 1–6 and Public Protection Classification 1–10.
  - Class code 8810; ICD-10 code E11.9; CPT code 99213; NAICS 722511; SIC 5812; ICD-10-CM and ICD-10-PCS.
- **Actuarial and reporting:**
  - Yellow Book and Blue Book annual statements, with 10 years of Schedule P.
  - The 2017 CSO table.
  - Statutory accounting expenses acquisition costs immediately.
- **Other claims:**
  - Florida's Commission on Hurricane Loss Projection Methodology.
  - FEMA's Risk Rating 2.0 (2021).
  - AML obligations under the Bank Secrecy Act for covered life insurers.
  - Free annual reports for CLUE and MIB under the FCRA.
  - Restrictions on aerial imagery (for example, Alabama Bulletin 2025-03 and guidance in CA, PA, MA and CT).

## Not fully confirmed

- **data-security-model-law:** "adopted by roughly half the states" matches public tallies (at least 19 states by 2024, with more since). However, I could not read the NAIC adoption map PDF. Check it against NAIC's current map before publishing.

## Sources

- NAIC, Reinsurance topic page: https://content.naic.org/insurance-topics/reinsurance
- NAIC, Risk-Based Capital: https://content.naic.org/insurance-topics/risk-based-capital
- NAIC, FAIR Plans: https://content.naic.org/insurance-topics/fair-access-to-insurance-requirements-plans
- NAIC, Surplus Lines: https://content.naic.org/insurance-topics/surplus-lines
- NAIC, Model 668 adoption map: https://content.naic.org/sites/default/files/legal-adoption-map-668-idsm.pdf
- AHA, No Surprises Act summary: https://www.aha.org/advisory/2021-01-14-detailed-summary-no-surprises-act
- Kitces, SECURE 2.0 RMD ages: https://www.kitces.com/blog/secure-act-2-omnibus-2022-hr-2954-rmd-75-529-roth-rollover-increase-qcd-student-loan-match/
- IRS, RMD FAQs: https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs
- IRS, Employer Shared Responsibility: https://www.irs.gov/affordable-care-act/employers/employer-shared-responsibility-provisions
- Hunton, GLBA annual notice exception (FAST Act): https://www.hunton.com/privacy-and-cybersecurity-law-blog/president-signs-law-providing-exception-to-annual-privacy-notice-requirement-under-the-gramm-leach-bliley-act
- CREFC, TRIA reauthorization status in 2026: https://resources.crefc.org/house-passes-tria-reauthorization-senate-tees-up-consideration/
- Winston & Strawn, uberrimae fidei circuit split: https://winston.com/en/blogs-and-podcasts/maritime-fedwatch/first-circuit-affirms-doctrine-of-uberrimae-fidei
- Milliman, PBR timeline: https://www.milliman.com/en/insight/current-state-principle-based-reserving-non-variable-annuities-vm-22
- FindLaw, California accident forgiveness: https://blogs.findlaw.com/common_law/2016/12/allstate-learns-a-600000-lesson-no-accident-forgiveness-in-california.html
- NASBP, Miller Act threshold: https://www.nasbp.org/wp-content/uploads/2025/04/Miller-Act-Indexing-Issue-Brief.pdf
- ResourcePro, Alabama aerial imagery bulletin: https://www.resourcepro.com/bulletin/alabama-sets-standards-for-insurers-use-of-drone-and-satellite-images-in-underwriting-and-claims/
