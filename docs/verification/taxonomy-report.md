# Taxonomy fact-check

Checked on 30 September 2026. File: `data/insurance-taxonomy.csv`. Proposed changes are in `taxonomy-corrections.csv`. No data files were changed.

## Summary

- **Rows in scope:** 551. I read all of them.
- **US Notes:** I checked all 260 non-empty notes. About 45 notes with laws, dollar limits, dates or state counts were checked against sources, mostly the high-risk areas (health/ACA/Medicare, annuities, flood, crop, workers' comp, government programs). The rest were checked from general knowledge.
- **Descriptions and examples:** I checked every description and example that contains a number or a legal claim, including HO forms, NFIP limits, ACA metal levels and CSR bands, Medigap, the CAT crop fee, FDIC/SIPC/SGLI limits and PMI cancellation. Generic nodes (reinsurance, marine and specialty sub-types) were only spot-checked from general knowledge.
- **Existence and placement:** Every product is real and sold or used in the US. There are no invented or non-US products. Two placement problems were found (business-owned life under "Group Life", and AD&D under "Disability"), plus one form that does not exist as an ISO form ("HO-7").
- **Proposed changes:** 33 rows in total: **4 High, 15 Medium, 14 Low**.

Overall the taxonomy is accurate. Most issues are notes that were right in 2024 but have since been overtaken by 2025–2026 changes (SECURE 2.0 indexing, the ACA enhanced-subsidy expiry, the One Big Beautiful Bill Act, the STLDI non-enforcement statement).

## High (factually wrong or outdated)

1. **QLAC limit (`life.annuities.deferred.qlac`)**: The $200,000 figure is out of date. The IRS limit is **$210,000 for 2025 and 2026** (IRS Notice 2025-67).
2. **Lawyers' professional liability (`specialty.professional_liability.lawyers_pl`)**: **Idaho** has also required malpractice cover since 2018, so Oregon is not the only state. The note also says "most states require disclosure", but the ABA counts about 25 jurisdictions, which is about half.
3. **Homeowners forms (`property.homeowners` description)**: "Standard ISO forms are numbered HO-1 to HO-8" is wrong. ISO has **no HO-7 form**; mobile homes are written with endorsement MH 04 01 on an HO-2 or HO-3. HO-1 has also been withdrawn in nearly all states. The current ISO forms are HO-2, 3, 4, 5, 6 and 8.
4. **Liquor liability (`casualty.specialty_liability.liquor`)**: Dram shop laws create *liability*; they do not *require insurance*. Separate licensing laws in some states require the cover, for example Minnesota §340A.409.

## Medium (misleading, incomplete, misplaced or unsupported)

- **ACA individual market**: The note leaves out that the enhanced premium tax credits **expired at the end of 2025**, so the 400% FPL cliff is back in 2026. "Open enrollment runs each fall" is imprecise because HealthCare.gov runs Nov 1–Jan 15.
- **Short-term plans (STLDI)**: Replace "check current federal status" with the actual status. In August 2025 the federal agencies said they would not enforce the 2024 3-/4-month limits while they write a new rule.
- **HSA and catastrophic plans**: From 2026, **all bronze and catastrophic plans count as HSA-eligible**, and direct primary care arrangements are allowed (OBBBA; IRS Notice 2026-5). Neither row mentions this.
- **Medicaid**: The expansion count (40 + DC) is still correct. The note should add the OBBBA **work requirements and 6-month renewals for expansion adults starting by Dec 31, 2026**.
- **Term life "most common by policy count"**: No source supports this. LIMRA's 2025 data puts whole life and IUL well ahead of term on new premium. The proposed wording is softer.
- **IUL description**: "Doesn't lose value from market drops" is misleading. Policy charges still come out in 0% years, so cash value can fall.
- **"HO-7 Mobile Home Form" name**: Rename to "Mobile / Manufactured Home Insurance" and keep HO-7 as an Also Known As label.
- **Placement: business life under Group Life**: Key person, buy-sell, COLI and split-dollar (rows 44–47) are individual policies owned by businesses, not group cover. Rename the parent or move them to a new "Business-Owned Life Insurance" node.
- **Placement: AD&D under Disability**: AD&D is an accident/life product (the row itself says it is bundled with group life). Move it under Supplemental Health (next to Accident) or under Group Life.

## Low (minor updates and wording)

- QLAC name: the IRS term is "**Qualifying** Longevity Annuity Contract".
- Part D cap: add that it is **$2,100 in 2026**.
- Medicare Advantage: "roughly half" should be "more than half (54% in 2025)".
- Medigap Plan F: **Plan C** is closed to people new to Medicare by the same 2020 rule.
- FAIR plans: "30+ states" should be "about **33 states plus DC**" (III).
- Earthquake deductibles: the range is **5–25%** (CEA offers 5%).
- NFIP: add the current authorization deadline (**Dec 11, 2026**) and what happens if it lapses.
- Texas Mutual: it is a state-created **private mutual**, not a state fund, since 2001.
- Paid leave: Maryland's benefits are **delayed to 2028**; MN and DE started in 2026 and ME in May 2026.
- GUL: AG 38 covers older policies; since 2020, new policies use **VM-20**.
- ICHRA: the rule was finalized in 2019 and took effect from 2020.
- SCO/ECO: the premium subsidy rose to **80%** from the 2026 crop year.
- FIA: add a caveat about surrender charges.
- Root name "Personal Property Insurance": this clashes with the insurance meaning of "personal property" (belongings). Suggested name: "Home & Personal Property Insurance".

## Verified correct (selected)

These were checked against sources and found correct: CAT crop coverage (50%/55%, $655 fee), Micro Farm $350,000 cap, SCO starting at 86% in 2026, NFIP $250k/$100k, Medicaid expansion 41 incl. DC, UM required in about 20 states + DC, the Florida PIP/no-fault list (the 2026 repeal bills died), TRIA backstop through 2027, SGLI $500k via Prudential, FEGLI via MetLife, FHA MIP life-of-loan under 10% down, the micro-captive final regulations (Jan 2025), DFC political risk (reauthorized in the FY26 NDAA), accident forgiveness barred in California, the real estate E&O example states, DOL IB 95-1, the LTC Partnership (45 states), PSHB (2025), and the Miller Act $150,000 threshold (not changed by the Oct 2025 FAR inflation adjustment).

## Sources

- IRS Notice 2025-67 (2026 retirement limits): https://www.irs.gov/pub/irs-drop/n-25-67.pdf
- IRS Notice 2026-5 / OBBBA HSA guidance: https://www.irs.gov/node/153161 ; https://rsmus.com/insights/services/business-tax/irs-notice-2026-expanded-hdhp-definition-obbba-broadens-hsa.html
- DOL STLDI non-enforcement statement (Aug 7, 2025): https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/affordable-care-act/for-employers-and-advisers/short-term-limited-duration-insurance/stldi-statement-08-07-2025
- Enhanced PTC expiry / 2027 marketplace rules: https://rscapital.com/2026/01/12/will-aca-plan-enrollees-see-premium-relief-soon/ ; https://www.healthaffairs.org/do/10.1377/forefront.20260610.238555
- Medicare.gov Medigap (Plans C/F): https://www.medicare.gov/health-drug-plans/medigap/basics/how-medigap-works
- Part D 2026 cap: https://business.optum.com/en/support/hcp-resources/medicare-part-d-changes-2026.html
- MA enrollment 54% (KFF data): https://homehealthcarenews.com/2025/07/medicare-advantage-enrollment-reaches-54-in-2025-drives-rising-federal-spending/
- KFF Medicaid expansion tracker: https://www.kff.org/affordable-care-act/state-indicator/state-activity-around-expanding-medicaid-under-the-affordable-care-act/
- OBBBA health provisions summary: https://www.asahq.org/advocacy-and-asapac/fda-and-washington-alerts/washington-alerts/2025/07/hr1-the-one-big-beautiful-bill-act-major-health-related-provisions
- FEMA NFIP reauthorization: https://www.fema.gov/flood-insurance/rules-legislation/congressional-reauthorization
- CEA deductibles: https://www.earthquakeauthority.com/california-earthquake-insurance-policies/homeowners/coverages-and-deductibles
- ISO mobilehome / HO forms: https://www.propertycasualty360.com/fcs/2013/01/03/mobilehome-insurance ; https://www.irmi.com/term/insurance-definitions/homeowners-policy-basic-form-1
- FAIR plans (III figure): https://insurancebusinessmag.com/us/guides/what-are-fair-insurance-plans-172588.aspx
- Lawyer malpractice (Oregon/Idaho; ABA disclosure): https://mnbar.org/resources/publications/bench-bar/columns/2019/10/02/practicing-law-without-liability-insurance ; https://www.abajournal.com/magazine/article/disclosure_rules
- Minnesota liquor liability statute: https://www.revisor.mn.gov/statutes/2006/cite/340A.409
- Texas Mutual history: https://www.texasmutual.com/abouttxm/history-and-vision
- State paid leave status: https://www.newamerica.org/insights/explainer-paid-and-unpaid-leave-policies-in-the-united-states/
- RMA MGR-25-006 (OBBBA crop changes): https://www.rma.usda.gov/policy-procedure/bulletins-memos/managers-bulletin/mgr-25-006-one-big-beautiful-bill-act-amendment
- SCO/ECO 2026 (farmdoc): https://farmdocdaily.illinois.edu/2026/02/sco-and-eco-choices-in-2026.html
- CAT fee (RMA MGR-19-006): https://rma.usda.gov/policy-procedure/bulletins-memos/managers-bulletins/2019/mgr-19-006
- LIMRA 2025 life sales: https://www.limra.com/en/newsroom/news-releases/2026/limra-u.s.-individual-life-insurance-new-premium-tops-$17.5-billion-to-set-new-sales-record-in-2025/
- VM-20: https://actuary.org/content/life-principle-based-reserves-under-vm-20
- ICHRA final rule: https://www.federalregister.gov/documents/2019/06/20/2019-12571/health-reimbursement-arrangements-and-other-account-based-group-health-plans
- Other checks: IRS micro-captive regs https://www.irs.gov/businesses/corporations/listed-transactions ; VA SGLI https://www.va.gov/life-insurance/options-eligibility/sgli/ ; OPM FEGLI https://www.opm.gov/healthcare-insurance/life-insurance/death-claims/ ; DFC https://www.dfc.gov/media/press-releases/dfc-secures-expanded-authorities-fy26-ndaa-signed-law ; TRIA https://www.nar.realtor/topics/terrorism-risk-insurance-act-tria ; Florida PIP https://www.insurancejournal.com/news/southeast/2026/05/05/868507.htm ; DOL IB 95-1 https://www.dol.gov/newsroom/releases/ebsa/ebsa20240624
