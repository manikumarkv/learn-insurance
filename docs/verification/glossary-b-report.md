# Glossary fact-check (Part B): Policy Wording, Claims, Lifecycle, Distribution

Checked on 30 September 2026 against `data/insurance-glossary.csv`. The data file was not changed. Proposed fixes are in `glossary-b-corrections.csv`.

## Summary

- **Rows checked:** 297 (Policy Wording 158, Claims 59, Lifecycle 40, Distribution 40).
- **Checked against sources:** every row with a US Note (about 60 rows) and every row with a legal claim, date or number in its example.
- **Checked from knowledge only:** generic definitions such as Claim, Exclusion and Declarations Page. These were spot-checked against standard ISO and industry usage.
- **Issues found:** 26 in total.
  - High: 1
  - Medium: 5
  - Low: 20
- **Overall:** the section is in good shape. Every term is a real US term, and the arithmetic in the examples is correct (coinsurance penalty, EOB, percentage deductible, extended replacement cost, short-rate). Most problems are one outdated fact, some state-law notes that overstate or understate the rule, and some AKAs that are UK usage or are not true synonyms.

## High: factually wrong or outdated

1. **lloyds (US Notes).** The note says Lloyd's is "admitted only in Illinois, Kentucky and the US Virgin Islands." This is outdated. Lloyd's gave up those admitted licenses and stopped writing admitted renewals from 1 July 2021. It now writes US business only as a surplus lines insurer (in all states) and as a reinsurer.

## Medium: misleading or unsupported

1. **assignment-of-benefits (US Notes).** The note says Florida "restricted" AOBs in 2022. In fact SB 2-A (Dec 2022) *prohibits* AOBs under residential and commercial property policies issued on or after 1 Jan 2023. A separate 2023 law also voids auto-glass AOBs under policies issued or renewed from 1 July 2023.
2. **open-enrollment-period (Example / US Notes).** The example gives "Nov 1 to Jan 15." That is correct for 2027 coverage on HealthCare.gov today, but only because a federal court vacated the 2025 CMS rule's shorter window (Nov 1 to Dec 15) in June 2026. HHS has appealed, and oral argument is set for 30 Oct 2026. The page should say that the dates can change, and that state exchanges set different deadlines.
3. **public-adjuster (US Notes).** "Licensed and fee-capped by state" suggests every state caps fees. Only about a third of the states that license public adjusters have a statutory fee cap. Florida's is 20%, or 10% in the first year after a hurricane emergency.
4. **social-engineering-fraud (Also Known As).** "Funds Transfer Fraud" is listed as a synonym, but it is a different insuring agreement. It covers transfers a bank makes without the insured's knowledge. Social engineering covers transfers an employee was tricked into making. Courts have denied claims because of exactly this difference.
5. **backdating (US Notes).** "Most states limit backdating to 6 months" has no source behind it. Sources say *some* states set a 6-month maximum, and insurers otherwise set their own limits.

## Low: minor wording, completeness, AKA or frequency

- **non-renewal.** Add that some notice periods are longer than 30 to 60 days. For example, Florida requires 120 days for residential property.
- **anti-concurrent-causation-clause.** Add North Dakota (by statute) and West Virginia (by case law) alongside California and Washington.
- **rideshare-coverage.** "Most states" should be "nearly all states and D.C."
- **valued-policy.** "Several states" can be made precise: about 17 states, with scope that varies.
- **glass-coverage.** Clarify that the Florida, Kentucky and South Carolina zero-deductible rule applies when the driver carries comprehensive. Several other states require insurers only to *offer* glass coverage.
- **claims-adjuster.** About 35 states license independent adjusters. Licensing of staff adjusters varies by state.
- **form.** Approval of forms mainly applies to personal lines. Commercial lines often use file-and-use or have exemptions.
- **syndicate.** The example says Syndicate 2623 "writes marine risks." Beazley's 2623 is a multi-line syndicate, so use a generic example instead.
- **mid-term-adjustment.** "MTA" is UK usage (US usage is "endorsement" or "policy change"), so the frequency should be Low, not High.
- **recorded-statement.** Frequency should be Medium, not Low, because recorded statements are routine in US auto and liability claims.
- **AKA fixes.** Remove "Nuclear Verdict" (excess-verdict), "Indication" (quote), "Stated Amount" (agreed-value), "Lessor" (lienholder) and "Supplementary Payments" (defense-outside-limits). None of these are true synonyms, and several contradict other rows. Change "Symbols 1–9" to "Symbols 1–9 and 19" (covered-auto-symbols).
- **UK-only AKAs.** Mark these as UK usage or remove them: Cover Note (binder), Proposal Form (application), Cooling-Off Period (free-look-period), Write-Off (total-loss).

## Verified as correct (no change needed)

- **Hurricane deductibles:** 19 states plus D.C.
- **Uninsured motorist coverage:** required in about 20 states.
- **NFIP proof of loss:** due within 60 days, and can be extended.
- **Florida sinkhole rules:** insurers must cover catastrophic ground cover collapse and must offer sinkhole coverage.
- **Florida PIP:** still required. Repeal bills died in the 2026 session.
- **Split limits:** 15/30/5 is still a real state minimum (Pennsylvania). California rose to 30/60/15 in 2025.
- **Diminished value:** first-party claims are recognized mainly in Georgia (Mabry).
- **Total loss thresholds:** range from 60% (Oklahoma) to 100% (Texas, Colorado), and some states use the total loss formula.
- **ACA grace period:** 3 months for enrollees receiving the premium tax credit.
- **Medicare Annual Enrollment Period:** 15 Oct to 7 Dec.
- **Special enrollment period:** 60 days.
- **Suicide clause:** 1 year in Colorado and North Dakota.
- **Binders:** limited to 90 days in many states.
- **Certificate of insurance laws:** exist in about 20 or more states.
- **Other notes checked:** Cumis counsel, the ACA limit on rescission, Price-Anderson, NRRA home-state surplus lines tax, the NAIC MGA and Producer Licensing models, Gramm-Leach-Bliley, and ISO symbol 19.

## Sources

- Insurance Journal, "Lloyd's to Exit U.S. Admitted Market" (2020): https://www.insurancejournal.com/magazines/mag-features/2020/07/20/576049.htm
- Business Insurance, "Lloyd's to drop US admitted insurer licenses": https://www.businessinsurance.com/article/20200713/NEWS06/912335587/Lloyd%E2%80%99s-to-drop-US-admitted-insurer-licenses
- Clyde & Co, Florida SB 2-A reforms: https://www.clydeco.com/en/insights/2023/03/historic-florida-insurance-reforms-under-sb-2-a
- Fla. Stat. 627.7289 (auto-glass AOB): https://florida.public.law/statutes/fla._stat._627.7289
- Fla. Stat. 627.4133 (notice periods): https://www.flsenate.gov/Laws/Statutes/2025/627.4133
- Fla. Stat. 627.706 (sinkhole): https://flsenate.gov/Laws/Statutes/2025/627.706
- Georgetown Health Care Litigation Tracker, City of Columbus v. Kennedy: https://litigationtracker.law.georgetown.edu/litigation/city-of-columbus-et-al-v-kennedy-et-al-columbus-i/
- AHA summary of the 2025 Marketplace Integrity rule: https://www.aha.org/news/headline/2025-06-20-cms-releases-final-rule-marketplace-integrity-and-affordability
- HealthCare.gov grace period: https://www.healthcare.gov/apply-and-enroll/health-insurance-grace-period/
- Property Insurance Coverage Law blog, public adjuster fee caps: https://www.propertyinsurancecoveragelaw.com/blog/public-adjuster-fee-cap-controversy-and-insurance-company-lobbyists/
- Higginbotham, funds transfer fraud vs. social engineering: https://www.higginbotham.com/blog/funds-transfer-fraud-vs-social-engineering/
- Hinshaw & Culbertson, social engineering not covered under FTF/computer fraud: https://www.hinshawlaw.com/newsroom-updates-computer-fraud-and-funds-transfer-fraud-coverages-not-triggered-by-social-engineering-phishing-scam.html
- The Zebra, backdating life policies: https://www.thezebra.com/life-insurance/guide/backdate-policies/
- Barnes & Thornburg, anti-concurrent causation by state: https://btlaw.com/insights/blogs/anticoncurrent-causation-clauses-why-the-value-of-your-property-coverage-may-depend-on-your-state
- NAIC, commercial ride-sharing: https://content.naic.org/insurance-topics/commercial-ride-sharing
- IA Magazine, valued policy states: https://www.iamagazine.com/strategies/read/2018/01/09/what-you-need-to-know-about-valued-policy-states
- Policygenius, zero-deductible glass states: https://www.policygenius.com/auto-insurance/which-states-have-zero-deductible-for-auto-glass/
- NAIC adjuster licensing chart (PL-40): https://content.naic.org/sites/default/files/model-law-chart-pl-40-adjuster-licensing-requirements.pdf
- NAIC, hurricane deductibles: https://content.naic.org/insurance-topics/hurricane-deductibles
- FEMA/NFIP bulletin on proof of loss: https://agents.floodsmart.gov/sites/default/files/bulletins/W-01067/w-01067.pdf
- Insurance Journal, Florida PIP still law (May 2026): https://www.insurancejournal.com/news/southeast/2026/05/05/868507.htm
- Kemper, California minimum limits change: https://cloud.kemper.com/en/resources/insurance-insights/california-minimum-liability-limits-change-for-car-insurance
- MWL Law, diminution of value in all 50 states: https://www.mwl-law.com/wp-content/uploads/2018/02/DIMINUTION-OF-VALUE-IN-ALL-50-STATES-00219945x9EBBF.pdf
- Carinsurance.com, total loss thresholds: https://carinsurance.com/Articles/total-loss-thresholds.aspx
- Colorado C.R.S. 10-7-109 (suicide): https://law.justia.com/codes/colorado/2021/title-10/article-7/part-1/section-10-7-109
- Business Wire / AM Best, Beazley syndicates: https://www.businesswire.com/news/home/20210702005308/en/AM-Best-Affirms-Credit-Ratings-of-Beazleys-Lloyds-Syndicates-and-Beazley-plc-Subsidiaries
