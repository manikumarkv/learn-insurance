# Glossary fact-check A: Line-Specific and Core Concept rows

Checked on 30 September 2026. File: `data/insurance-glossary.csv`. Proposed changes: `glossary-a-corrections.csv`.

## Summary

- **Rows in scope:** 305 (250 Line-Specific, 55 Core Concept). I read every row.
- **US Notes:** all 62 non-empty notes checked. I verified the ones with numbers, laws, dates or state counts against sources, and checked the rest from general knowledge.
- **Definitions and examples:** I prioritised health/Medicare/ACA, life/annuity tax, auto, flood and crop. I spot-checked generic terms (risk, peril, premium, and so on) from general knowledge.
- **Issues found: 18 proposed changes on 17 rows**
  - High: 1
  - Medium: 5
  - Low: 12
- There are no invented or non-US-only terms. All 305 terms are real and in US use.
- Overall the section is in good shape. Most state and federal claims are correct. The problems are mostly rules that changed in 2025–2026.

## High

1. **short-term-health-insurance (US Notes).** The note says federal rules (2024) cap initial terms at 3 months. That is outdated. The 2024 rule (3 months initial, 4 months total) is still on the books. But on 7 Aug 2025 the Departments of Labor, HHS and Treasury said they would not prioritise enforcing it while they write a new rule, which was expected in summer 2026. Presenting the cap as the operative rule is misleading.

## Medium

2. **health-savings-account (Definition)** and 3. **high-deductible-health-plan (US Notes).** From 1 Jan 2026 the One Big Beautiful Bill Act makes ACA bronze and catastrophic plans HSA-compatible even if they fail the standard HDHP test (IRS Notice 2026-5). The rows still tie HSAs only to a traditional HDHP.
4. **flexible-spending-account (Definition).** "Unused money is usually lost at year-end" overstates the risk. Plans may allow a carryover (up to $680 for 2026) or a 2.5-month grace period.
5. **balance-billing (US Notes, currently empty).** The note leaves out the No Surprises Act (in effect since 2022). That law bans balance billing for most emergency care and some out-of-network care at in-network facilities. This matters on a consumer learning site.
6. **garage-liability (Definition).** The definition says garage liability includes customers' cars in the shop's care (garagekeepers). That is wrong. Garage liability excludes property in the insured's care, custody or control. Garagekeepers is a separate coverage.

## Low

7. garage-liability: add that ISO's Auto Dealers Coverage Form (CA 00 25) has largely replaced the Garage Coverage Form (CA 00 05).
8. medicare-part-d: add the actual cap ($2,000 in 2025, $2,100 in 2026).
9. out-of-pocket-maximum: add the 2026 figures ($10,600 self-only / $21,200 family).
10. catastrophic-plan: add that the hardship exemption was widened for 2026.
11. unemployment-insurance: workers also contribute in AK, NJ and PA, not only employers.
12. indexed-universal-life: cite AG 49-B (2023) alongside AG 49-A.
13. critical-illness-insurance: excepted-benefit status is conditional (independent, non-coordinated coverage).
14. medicare: add ESRD/ALS eligibility.
15. section-1035-exchange: exchanges only work in allowed directions (life to annuity is OK, annuity to life is not; LTC is allowed).
16. usl-h: it is federally *mandated* coverage bought from private insurers, not a federal program. This avoids confusion with FECA.
17. pasture-rangeland-forage: it is a subsidised crop insurance plan sold by private insurers, not a direct federal payment.
18. risk-management Usage Frequency: Low should be Medium.

## Verified as correct (no change needed)

- **bail-bond:** IL, KY, OR and WI ban commercial bail.
- **no-fault-insurance:** 12 states plus Puerto Rico ("about a dozen").
- **workers-compensation-insurance:** Texas opt-out. The monopolistic states are ND, OH, WA and WY.
- **short-term-disability-insurance:** the TDI states are CA, HI, NJ, NY and RI, plus Puerto Rico.
- **personal-auto-policy:** New Hampshire is the only state without mandatory auto insurance. Virginia ended its uninsured-motorist fee on 1 July 2024.
- **national-flood-insurance-program:** $250,000 residential building limit.
- **motor-carrier:** FMCSA minimum of $750,000 for general freight.
- **medicaid:** not all states expanded (41 including DC have).
- **captive-insurance-company:** 831(b) micro-captives are under IRS scrutiny (final listed-transaction regulations, Jan 2025).
- **Other notes:** Medigap A–N plus the MA/MN/WI exceptions, MEC under §7702A, §101(j), Treasury Circular 570, the Liability Risk Retention Act, and the OFAC ransomware advisory are all correct. So are FIA as insurance not a security, RILA and VA/VUL as SEC-registered, the California Earthquake Authority, and all states having breach notification laws. The ACA preventive-care and annual-limit rules, ISO CG 00 01 and HO 00 03, the FDIC $250,000 limit, and the metal-tier percentages are also correct.
- **Not independently verified:** the pet insurance note ("NAIC model adopted by several states"). The NAIC adoption chart could not be read. The claim is vague but consistent with known adoptions, so no change is proposed.

## Sources

- DOL/EBSA STLDI non-enforcement statement (7 Aug 2025): https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/affordable-care-act/for-employers-and-advisers/short-term-limited-duration-insurance/stldi-statement-08-07-2025
- Bloomberg Tax, STLDI rule timing: https://news.bloombergtax.com/health-law-and-business/agencies-target-summer-2026-for-short-term-health-plans-rule
- IRS Notice 2026-5 (HSA/OBBBA): https://www.irs.gov/pub/irs-drop/n-26-05.pdf
- 2026 FSA limits (Rev. Proc. 2025-32): https://hylant.com/insights/blog/irs-releases-health-fsa-limits-for-2026
- CMS No Surprises Act protections: https://www.cms.gov/nosurprises/consumer-protections/what-are-the-new-protections
- CMS Final CY2026 Part D Redesign Instructions: https://www.cms.gov/newsroom/fact-sheets/final-cy-2026-part-d-redesign-program-instructions
- 2026 ACA cost-sharing limits: https://hylant.com/insights/blog/hhs-revises-cost-sharing-limits-for-2026-plan-years
- CMS catastrophic plan access 2026: https://www.cms.gov/newsroom/fact-sheets/expanding-access-health-insurance-consumers-gain-access-catastrophic-health-insurance-plans-2026
- Garage liability / garagekeepers: https://www.propertycasualty360.com/fcs/2008/07/16/garage-liability-section-iii-archive-422-2064/ and https://www.propertycasualty360.com/fcs/2015/08/10/garage-policy/
- SSA Annual Statistical Supplement, UI and TDI: https://www.ssa.gov/policy/docs/statcomps/supplement/2016/9a.html and https://www.ssa.gov/policy/docs/statcomps/supplement/2013/tempdisability.pdf
- 2024 fixed indemnity/STLDI final rule: https://www.govinfo.gov/content/pkg/FR-2024-04-03/html/2024-06551.htm
- AG 49-B: https://investmentnews.com/?p=72930
- 26 U.S.C. §1035: https://www.law.cornell.edu/uscode/text/26/1035
- Bail bond bans: https://www.governing.com/archive/States-Struggle-to-Regulate-the-Bond-Industry.html
- Monopolistic WC states: https://www.irmi.com/term/insurance-definitions/monopolistic-state-funds
- No-fault states: https://www.creditkarma.com/insurance/i/no-fault-state
- Virginia DMV, UMV fee repeal: https://dmv.virginia.gov/news/new-laws-take-effect-today-july-1-2024
- NFIP limits: https://www.floodsmart.gov/get-insured/buy-a-policy
- FMCSA 49 CFR 387.9: https://www.customsmobile.com/regulations/49/387.9
- KFF Medicaid expansion status: https://www.kff.org/medicaid/issue-brief/status-of-state-medicaid-expansion-decisions/
- IRS micro-captive final regulations: https://govinfo.gov/content/pkg/FR-2025-01-14/pdf/2025-00393.pdf
