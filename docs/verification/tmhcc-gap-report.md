# Tokio Marine HCC gap check

Checked on 1 October 2026. I compared the US product list on Tokio Marine HCC (TMHCC) against `data/insurance-taxonomy.csv` (551 rows). No data files were changed. The proposed new rows are in `tmhcc-proposed-nodes.csv`.

## How I did it

- I took every product from tmhcc.com/en-us/products and its sub-pages, and reduced each one to a generic insurance type. I dropped brand names (Avemco, Lasso, Atlas/WorldTrips, Artisan, FirstFire, Insta-Bond, MEDEFENSE) and merged duplicates that appear in more than one TMHCC category (for example EPL, personal cyber, maritime piracy and medical billing E&O).
- I matched each type against the taxonomy's Name, Also Known As and description. The script checked that every taxonomy ID cited below exists.
- **Status meanings:** COVERED = a matching node exists. PARTIAL = only a broader parent exists. MISSING = no reasonable node. MISPLACED = the node is under a clearly wrong parent.

## Summary

| Status | Count |
|---|---|
| COVERED | 60 |
| PARTIAL | 16 |
| MISSING | 15 |
| MISPLACED | 0 |
| Not an insurance type | 1 (travel risk management) |
| **Generic types checked** | **92** |

**Proposed new nodes: 28.** They cover all 15 missing types and 12 of the 16 partial ones. Four partial types need no new node because they are bundles or bespoke deals: restaurant recovery, critical injury, social services PL and structured guaranty.

The taxonomy covers TMHCC's mainstream lines well: D&O, EPL, fiduciary, crime, cyber, marine, aviation, crop, surety, trade credit, travel and transactional. The gaps are in four areas:

- **Health-plan risk carve-outs:** organ transplant, cell and gene therapy, stop-loss captives and Taft-Hartley plans.
- **Contingency / promotional risk:** over-redemption, weather promotions, contractual bonus and sweepstakes bonds.
- **Whole lines with no node:** Energy, Renewables and Public Entity.
- **Niche liability covers a learner will often meet:** sexual abuse and molestation, contractors professional, tenant discrimination and active assailant.

## Every TMHCC type → status

| # | TMHCC line | Generic type | TMHCC product(s) | Status | Taxonomy ID(s) | Notes |
|---|---|---|---|---|---|---|
| 1 | Accident & Health | Medical stop-loss | Medical Stop Loss | **COVERED** | `health.major_medical.group_health.stop_loss` |  |
| 2 | Accident & Health | Medical stop-loss captive | Captive Stop Loss | **PARTIAL** | `health.major_medical.group_health.stop_loss` ; `art.captives.group_captive` | Propose `...stop_loss.captive_stop_loss` |
| 3 | Accident & Health | Organ transplant carve-out | Organ Transplant | **MISSING** | (nearest: health.major_medical.group_health.stop_loss) | Propose `...stop_loss.organ_transplant` |
| 4 | Accident & Health | Cell & gene therapy carve-out | Cell and Gene Therapy | **MISSING** | (nearest: health.major_medical.group_health.stop_loss) | Propose `...stop_loss.cell_gene_therapy` |
| 5 | Accident & Health | Multiemployer (Taft-Hartley) plan and its stop-loss | Taft-Hartley | **PARTIAL** | `health.major_medical.group_health.stop_loss` | Stop-loss exists; the plan type does not. Propose `...group_health.taft_hartley` |
| 6 | Accident & Health | Medicare Medical Savings Account (MSA) | Lasso Healthcare | **COVERED** | `health.medicare_private.medicare_advantage.msa` | Brand. Lasso is a Medicare MSA carrier; TMHCC says it is being rebranded |
| 7 | Accident & Health | Group medical gap insurance | MedPlus | **PARTIAL** | `health.supplemental` | Propose `health.supplemental.medical_gap` |
| 8 | Aviation | Private aircraft hull & liability (owned) | Avemco Personal Aircraft – Owned; General Aviation | **COVERED** | `marine.aviation.general_aviation` ; `marine.aviation.aviation_hull` ; `marine.aviation.aviation_liability` | Brand |
| 9 | Aviation | Non-owned (renter) aircraft liability | Avemco Personal Aircraft – Non-Owned | **COVERED** | `marine.aviation.non_owned_aircraft` | Brand |
| 10 | Aviation | Airline / international aircraft hull & liability | International Aviation | **COVERED** | `marine.aviation.aviation_hull` ; `marine.aviation.aviation_liability` | Bundle |
| 11 | Aviation | Airport liability | Airports | **COVERED** | `marine.aviation.airport_liability` |  |
| 12 | Aviation | Specialty aircraft (warbirds, homebuilt, aerobatic, seaplanes) | Specialty Risks – Aviation | **COVERED** | `marine.aviation.general_aviation` | Bundle of non-standard GA risks; no new type needed |
| 13 | Casualty | Contractors general liability | Artisan General Liability; Artisan Remodelers Liability | **COVERED** | `casualty.general_liability` | Brand/bundle |
| 14 | Casualty | Contractors excess liability | Artisan Excess Liability | **COVERED** | `casualty.umbrella_excess` | Brand/bundle |
| 15 | Casualty / Prof. Liability | Contractors professional liability | Artisan Professional Liability; Contractors PL | **MISSING** | (nearest: specialty.professional_liability.architects_engineers) | Propose `specialty.professional_liability.contractors_pl` |
| 16 | Contingency | Film / commercial production | Commercial Production Protection | **COVERED** | `specialty.event.film_production` |  |
| 17 | Contingency | Wedding / private event cancellation | High Value Wedding Event Cancellation | **COVERED** | `specialty.event.wedding` |  |
| 18 | Contingency | Non-appearance | Non-Appearance | **COVERED** | `specialty.event.non_appearance` |  |
| 19 | Contingency | Event cancellation (incl. golf tournaments) | Event Cancellation; Golf Tournament Cancellation | **COVERED** | `specialty.event.event_cancellation` | Golf is a bundle |
| 20 | Contingency | Event weather | Event Weather | **COVERED** | `specialty.weather` ; `art.parametric.parametric_weather` |  |
| 21 | Contingency | Weather cost containment / income stabilization | Cost Containment; Income Stabilization | **COVERED** | `specialty.weather` | The parent's description covers it. A child node would be optional |
| 22 | Contingency | Weather promotion | Weather Promotions | **PARTIAL** | `specialty.weather` | Propose `specialty.weather.promotion_weather` |
| 23 | Contingency | Contractual bonus | Contractual Bonus | **PARTIAL** | `specialty.sports` | Propose `specialty.sports.contractual_bonus` |
| 24 | Contingency | Game promotion (sweepstakes) bond | Game of Chance Bonds | **MISSING** | (nearest: financial.surety.commercial_surety.license_permit) | Propose `financial.surety.commercial_surety.game_promotion` |
| 25 | Contingency | Over-redemption | Over Redemption | **PARTIAL** | `specialty.event.prize_indemnity` | Propose `specialty.event.over_redemption` |
| 26 | Contingency | Prize indemnity | Prize Indemnity | **COVERED** | `specialty.event.prize_indemnity` |  |
| 27 | Contingency | Amateur sports package | Amateur Sports | **PARTIAL** | `specialty.sports` | Propose `specialty.sports.amateur_sports` |
| 28 | Contingency | Special event liability | Special Event Liability | **COVERED** | `casualty.specialty_liability.special_events_liability` |  |
| 29 | Contingency | Tenant user liability (TULIP) | Tenant User Liability | **PARTIAL** | `casualty.specialty_liability.special_events_liability` | Propose `...special_events_liability.tulip` |
| 30 | Credit & Political Risk | Confiscation, expropriation, nationalization & deprivation | CEND | **COVERED** | `specialty.political_risk.confiscation` | CEND adds 'deprivation'. Could be added as an Also Known As |
| 31 | Credit & Political Risk | Contract frustration | Contract Frustration | **COVERED** | `specialty.political_risk.contract_frustration` |  |
| 32 | Credit & Political Risk | Political violence / perils | Political Perils | **COVERED** | `specialty.political_risk.political_violence` |  |
| 33 | Credit & Political Risk | Sovereign non-payment | Sovereign Non-payment | **PARTIAL** | `specialty.political_risk.contract_frustration` | Propose `specialty.political_risk.sovereign_non_payment` |
| 34 | Credit & Political Risk | Non-trade credit (lender / bank non-payment) | Non-trade Credit; Coverage for Financial Institutions | **MISSING** | (nearest: financial.credit.trade_credit) | Propose `financial.credit.non_trade_credit` |
| 35 | Credit & Political Risk | Whole turnover trade credit | Whole Turnover | **COVERED** | `financial.credit.trade_credit.whole_turnover` |  |
| 36 | Credit & Political Risk | Key account / named buyer trade credit | Top Account & Named Buyers | **COVERED** | `financial.credit.trade_credit.key_account` |  |
| 37 | Credit & Political Risk | Trade credit structures (XoL, top-up, single/multi-transaction, medium-term) | Excess of Loss; Top-up Credit; Single or Multi-transaction; Medium Term Credit | **COVERED** | `financial.credit.trade_credit` ; `financial.credit.trade_credit.export_credit` | Policy structures, not new types |
| 38 | Crisis Management | Active assailant | Active Assailant | **MISSING** | (none) | Propose `specialty.active_assailant` |
| 39 | Crisis Management | Kidnap & ransom | Kidnap & Ransom | **COVERED** | `specialty.kr` |  |
| 40 | Crisis Management / Marine | Maritime piracy | Maritime Piracy | **PARTIAL** | `specialty.kr` ; `marine.ocean_marine.hull.war_risks` | Propose `specialty.kr.maritime_piracy` |
| 41 | Crisis Management | Product contamination | Product Contamination | **COVERED** | `casualty.specialty_liability.product_recall` | Listed as an Also Known As |
| 42 | Crisis Management | Foodborne-illness business interruption | Restaurant Recovery | **PARTIAL** | `casualty.specialty_liability.product_recall` ; `commercial.business_income` | Contamination cover sold to restaurants; no new type needed |
| 43 | Crop | Crop-hail | Crop Hail | **COVERED** | `agriculture.crop_hail` |  |
| 44 | Crop | Multiple peril crop insurance | Multiple Peril Crop Insurance | **COVERED** | `agriculture.federal_crop` |  |
| 45 | Crop | Private crop products | Private Products | **COVERED** | `agriculture.named_peril_private` |  |
| 46 | Cyber & Tech / Turnkey | Business cyber (incl. healthcare, farm, SME bundles) | Cyber; Cyber for Healthcare; Cyber for Farms; Cyber Liability | **COVERED** | `specialty.cyber` | Industry bundles |
| 47 | Cyber & Tech | Technology E&O / professional cyber | Technology E&O; Professional Cyber Liability | **COVERED** | `specialty.professional_liability.tech_eo` ; `specialty.cyber` |  |
| 48 | Cyber & Tech / Turnkey | Personal cyber | Cyber for Individuals; Personal Cyber | **COVERED** | `specialty.cyber.personal_cyber` |  |
| 49 | Cyber & Tech / Prof. Liability | Medical billing / regulatory billing E&O | Regulatory Billing E&O; Misc E&O for Medical Billers | **MISSING** | (nearest: specialty.professional_liability.miscellaneous_pl) | Propose `specialty.professional_liability.medical_billing_eo` |
| 50 | Energy | Energy (oil & gas) package incl. control of well | Energy | **MISSING** | (none) | Propose `commercial.energy` and `commercial.energy.control_of_well` |
| 51 | Renewables | Renewable energy insurance | Renewables | **MISSING** | (none) | Propose `commercial.energy.renewable_energy` |
| 52 | Fiduciary & Crime | Fiduciary liability | Fiduciary Liability | **COVERED** | `specialty.management_liability.fiduciary` |  |
| 53 | Fiduciary & Crime | Financial institution bond | Financial Institutions Bond | **COVERED** | `financial.fidelity.financial_institution_bond` |  |
| 54 | Fiduciary & Crime | Commercial crime | Commercial Crime | **COVERED** | `financial.fidelity` |  |
| 55 | Financial & Professional | Directors & officers | Directors and Officers | **COVERED** | `specialty.management_liability.do` |  |
| 56 | Financial & Professional | Financial institutions E&O / D&O | Diversified Financial Products | **COVERED** | `specialty.professional_liability.financial_services_eo` ; `specialty.management_liability.do` | Bundle |
| 57 | Financial & Professional / Prof. / Turnkey | Employment practices liability | EPL; Franchise & Affinity Groups EPL; EPL for SMEs | **COVERED** | `specialty.management_liability.epl` | Bundles |
| 58 | Global Travel | Travel medical (single, group, premium) | Atlas / WorldTrips travel medical plans | **COVERED** | `specialty.travel.travel_medical` | Brand |
| 59 | Global Travel | Annual multi-trip | Annual multi-trip | **COVERED** | `specialty.travel.annual_travel` |  |
| 60 | Global Travel | Trip cancellation / interruption (incl. post-departure) | Trip protection; post-departure | **COVERED** | `specialty.travel.trip_cancellation` |  |
| 61 | Global Travel | International student medical | International student medical | **COVERED** | `specialty.travel.student_travel` |  |
| 62 | Global Travel | Travel risk management | Travel risk management | **N/A** | — | An assistance service, not an insurance type |
| 63 | Marine | Marine cargo | Marine Cargo | **COVERED** | `marine.ocean_marine.cargo` |  |
| 64 | Marine | Marine hull | Marine Hull | **COVERED** | `marine.ocean_marine.hull` |  |
| 65 | Prestige Disability | AD&D | AD&D | **COVERED** | `health.supplemental.add` |  |
| 66 | Prestige Disability | High-limit disability (lump-sum PTD / TTD) | Permanent Total Disability; Temporary Total Disability | **PARTIAL** | `health.disability.individual_di` ; `specialty.sports.athlete_disability` | Propose `health.disability.high_limit` |
| 67 | Prestige Disability | Key person disability (incl. contingent personal accident, board/critical asset covers) | Key Person Disability; Contingent Personal Accident; Critical Asset Protection; Board Talent Protection | **MISSING** | (nearest: life.group_life.key_person) | Propose `health.disability.key_person_disability`. The others are bundles |
| 68 | Prestige Disability | Buy-sell disability | Buy Sell Disability | **COVERED** | `health.disability.disability_buy_out` |  |
| 69 | Prestige Disability | Athlete disability | Sports Disability | **COVERED** | `specialty.sports.athlete_disability` |  |
| 70 | Prestige Disability | Scheduled critical injury benefit | Critical Injury | **PARTIAL** | `health.supplemental.accident` ; `specialty.sports.athlete_disability` | Add-on to athlete PTD; no new type needed |
| 71 | Professional Liability | Allied healthcare | Allied Healthcare | **COVERED** | `specialty.professional_liability.medical_malpractice.allied_health` |  |
| 72 | Professional Liability | Architects & engineers | Architects & Engineers | **COVERED** | `specialty.professional_liability.architects_engineers` |  |
| 73 | Professional Liability | Insurance agents E&O | Insurance Agents | **COVERED** | `specialty.professional_liability.insurance_agents_eo` |  |
| 74 | Professional Liability | Accountants E&O | Accountants E&O | **COVERED** | `specialty.professional_liability.accountants_pl` |  |
| 75 | Professional Liability | Miscellaneous PL (incl. scientists) | Miscellaneous Professional Liability; Scientists | **COVERED** | `specialty.professional_liability.miscellaneous_pl` |  |
| 76 | Professional Liability | Real estate E&O | Real Estate | **COVERED** | `specialty.professional_liability.real_estate_eo` |  |
| 77 | Professional Liability | Social services professional liability | Social Services | **PARTIAL** | `specialty.professional_liability.miscellaneous_pl` | Industry class of misc. PL; no new type needed |
| 78 | Professional Liability | Sexual abuse & molestation liability | Sexual Misconduct & Molestation | **MISSING** | (none) | Propose `casualty.specialty_liability.abuse_molestation` |
| 79 | Professional Liability | Tenant discrimination liability | Tenant Discrimination | **MISSING** | (none) | Propose `casualty.specialty_liability.tenant_discrimination` |
| 80 | Public Entity | Public entity P&C package (incl. water districts, township plans, volunteer fire) | Public entity P&C; Water Districts; Michigan Township Participating Plan; FirstFire | **MISSING** | (nearest: commercial.packages.industry_programs) | Propose `commercial.packages.public_entity`. Sub-programs are brands |
| 81 | Public Entity | Public officials liability | Public official liability (named on the public entity page) | **MISSING** | (nearest: specialty.management_liability.do) | Propose `specialty.management_liability.public_officials` |
| 82 | Structured Products | Mortgage (re)insurance | Mortgage (Re)Insurance | **COVERED** | `financial.mortgage.pmi` ; `reinsurance` |  |
| 83 | Structured Products | Residual value insurance | Residual Value Guaranty | **MISSING** | (none) | Propose `financial.residual_value` |
| 84 | Structured Products | Structured / financial guaranty (incl. tax credit insurance) | Structured Guaranty Insurance | **PARTIAL** | `financial.financial_guaranty` ; `specialty.transactional.tax_liability` | Bespoke deals; no new type needed |
| 85 | Structured Products | Title (re)insurance | Title (Re)Insurance | **COVERED** | `financial.title` |  |
| 86 | Surety | License & permit bonds | Commercial License, Permit & Misc Bonds | **COVERED** | `financial.surety.commercial_surety.license_permit` |  |
| 87 | Surety | Contract performance & payment bonds | Contract Performance & Payment Bonds | **COVERED** | `financial.surety.contract.performance` ; `financial.surety.contract.payment` |  |
| 88 | Surety | Court / judicial / probate / fiduciary bonds | Court, Judicial, Probate & Fiduciary Bonds | **COVERED** | `financial.surety.commercial_surety.court` |  |
| 89 | Surety | Customs bonds | Customs Bonds | **COVERED** | `financial.surety.commercial_surety.customs` |  |
| 90 | Surety | Oil & gas (energy) bonds | Energy Bonds | **PARTIAL** | `financial.surety.commercial_surety` | Propose `financial.surety.commercial_surety.energy_bonds` |
| 91 | Surety | Large commercial surety | Large National Commercial Surety | **COVERED** | `financial.surety.commercial_surety` | Market segment |
| 92 | Transactional Risk | Representations & warranties | Representations & Warranties | **COVERED** | `specialty.transactional.rw` |  |

## Proposed additions (28 rows, full detail in the CSV)

| Proposed ID | Parent ID | Name | Personal/Commercial |
|---|---|---|---|
| `health.major_medical.group_health.stop_loss.captive_stop_loss` | `health.major_medical.group_health.stop_loss` | Medical Stop-Loss Captive | Commercial |
| `health.major_medical.group_health.stop_loss.organ_transplant` | `health.major_medical.group_health.stop_loss` | Organ Transplant Carve-Out | Commercial |
| `health.major_medical.group_health.stop_loss.cell_gene_therapy` | `health.major_medical.group_health.stop_loss` | Cell & Gene Therapy Carve-Out | Commercial |
| `health.major_medical.group_health.taft_hartley` | `health.major_medical.group_health` | Multiemployer (Taft-Hartley) Health Plan | Commercial |
| `health.supplemental.medical_gap` | `health.supplemental` | Group Medical Gap Insurance | Commercial |
| `health.disability.high_limit` | `health.disability` | High-Limit Disability Insurance | Personal |
| `health.disability.key_person_disability` | `health.disability` | Key Person Disability | Commercial |
| `specialty.professional_liability.contractors_pl` | `specialty.professional_liability` | Contractors Professional Liability | Commercial |
| `specialty.professional_liability.medical_billing_eo` | `specialty.professional_liability` | Medical Billing E&O | Commercial |
| `specialty.event.over_redemption` | `specialty.event` | Over-Redemption Insurance | Commercial |
| `specialty.weather.promotion_weather` | `specialty.weather` | Weather Promotion Insurance | Commercial |
| `specialty.sports.contractual_bonus` | `specialty.sports` | Contractual Bonus Insurance | Commercial |
| `specialty.sports.amateur_sports` | `specialty.sports` | Amateur Sports Insurance | Commercial |
| `casualty.specialty_liability.special_events_liability.tulip` | `casualty.specialty_liability.special_events_liability` | Tenant User Liability (TULIP) | Both |
| `financial.surety.commercial_surety.game_promotion` | `financial.surety.commercial_surety` | Game Promotion (Sweepstakes) Bond | Commercial |
| `financial.surety.commercial_surety.energy_bonds` | `financial.surety.commercial_surety` | Oil & Gas Bonds | Commercial |
| `financial.credit.non_trade_credit` | `financial.credit` | Non-Trade Credit Insurance | Commercial |
| `specialty.political_risk.sovereign_non_payment` | `specialty.political_risk` | Sovereign Non-Payment | Commercial |
| `specialty.active_assailant` | `specialty` | Active Assailant Insurance | Commercial |
| `specialty.kr.maritime_piracy` | `specialty.kr` | Maritime Piracy (Marine K&R) | Commercial |
| `casualty.specialty_liability.abuse_molestation` | `casualty.specialty_liability` | Sexual Abuse & Molestation Liability | Commercial |
| `casualty.specialty_liability.tenant_discrimination` | `casualty.specialty_liability` | Tenant Discrimination Liability | Commercial |
| `commercial.energy` | `commercial` | Energy Insurance | Commercial |
| `commercial.energy.control_of_well` | `commercial.energy` | Control of Well | Commercial |
| `commercial.energy.renewable_energy` | `commercial.energy` | Renewable Energy Insurance | Commercial |
| `commercial.packages.public_entity` | `commercial.packages` | Public Entity Insurance | Commercial |
| `specialty.management_liability.public_officials` | `specialty.management_liability` | Public Officials Liability | Commercial |
| `financial.residual_value` | `financial` | Residual Value Insurance | Commercial |

Notes on the proposals:

- **Level and Full Path** were computed from each parent. `commercial.energy` is new, so its two children hang off it.
- **US Notes** are filled only where I found a source: CGT Access Model, Taft-Hartley/LMRA, high-limit disability, game-promotion bonds, BOEM bonding, OPA 90 OSFR, the Fair Housing Act, AGRiP pooling and OFAC. All other notes are left blank on purpose.
- **Key Person Disability** sits under `health.disability`, next to Disability Buy-Out and Business Overhead Expense. If the earlier "Business-Owned Life" restructure (taxonomy report, Medium) goes ahead, a sibling there would also work.
- **Abuse & molestation, tenant discrimination and active assailant** are placed where they fit the taxonomy best. TMHCC files the first two under "Professional Liability", but in the US market they are standalone liability covers, usually bought because the CGL excludes them.
- **Brand/bundle — no new type needed:** Restaurant Recovery, Golf Tournament Cancellation, Specialty Risks – Aviation, International Aviation, Artisan (all), Board Talent Protection, Critical Asset Protection, Critical Injury, Cyber for Healthcare/Farms, Franchise EPL, EPL for SMEs, Diversified Financial Products, Water Districts, Michigan Township Participating Plan, FirstFire, Large National Commercial Surety, Structured Guaranty, and the trade-credit structures (XoL, top-up, single/multi-transaction, medium-term).

## Misplaced

I found no node under a clearly wrong parent. Four borderline points are worth a look:

1. **`health.major_medical.group_health.stop_loss`** sits under "Major Medical (Comprehensive)", but its own US Note says stop-loss is regulated as insurance to the employer, *not* as health insurance. It is acceptable for learners. If the three proposed carve-out children are added, a separate "Employer Health Risk Financing" parent might read more cleanly.
2. **"Contingency" is split across two branches.** `specialty.sports` is named "Sports & Contingency", while event cancellation, which carries the AKA "Contingency", and prize indemnity sit under `specialty.event`. Consider renaming `specialty.sports` to "Sports Insurance", or moving the promotional covers under one contingency node.
3. **`specialty.weather`** lists "Weather derivatives" as an Also Known As. Derivatives are financial contracts, not insurance, so that label is misleading.
4. **`specialty.political_risk.contract_frustration`** uses "Non-honoring of sovereign obligations" as an Also Known As. The market treats sovereign *non-payment* (NHSFO) as a separate cover, which is why I propose a sibling node.

## Sources

- TMHCC product index and product pages (fetched 1 Oct 2026): https://www.tmhcc.com/en-us/products. Sub-pages used: accident-and-health/(organ-transplant, cell-and-gene-therapy, taft-hartley, captive-stop-loss, medplus, lasso-healthcare); contingency/(over-redemption, weather-promotions, contractual-bonus, game-of-chance-bonds, income-stabilization, cost-containment, amateur-sports, tenant-user-liability); crisis-management-insurance/(active-assailant, maritime-piracy, restaurant-recovery); energy/energy; renewables; public-entity/public-entity-p-c-coverages; structured-products/(residual-value-guaranty, structured-guaranty-insurance); surety-bonds/energy-bonds; professional-liability/(contractors-professional-liability, miscellaneous-e-and-o-for-medical-billers, sexual-misconduct-and-molestation-liability, tenant-discrimination); prestige-disability---high-limit-disability/(contingent-personal-accident, critical-injury, board-talent-protection, critical-asset-protection); aviation/specialty-risks---aviation; credit-and-political-risk/(non-trade-credit, sovereign-non-payment, coverage-for-financial-institutions)
- Lasso Healthcare as a Medicare MSA: https://www.ncdoi.com/_Iframes/Documents/MA%20Summary%20Of%20Benefits%202021/Lasso%20Healthcare%20MSA%20H1924-001,%20004.pdf
- CMS Cell and Gene Therapy Access Model (33 states + DC + PR): https://www.cms.gov/innovation-insight-cms-model-delivers-access-sickle-cell-gene-therapy-expansive-list-state ; https://www.aabb.org/news-resources/news/article/2025/07/16/33-states-to-participate-in-medicaid-s-cgt-access-model-for-scd
- Taft-Hartley / LMRA §302(c)(5): https://www.law.cornell.edu/supremecourt/text/453/322 ; https://www.magnacare.com/blog/taft-hartley-act-explained/
- High-limit disability (Lloyd's/surplus lines, CA export list): https://www.piu.org/?p=7740 ; https://insurancenewsnet.com/innarticle/the-high-limit-disability-niche
- Florida game promotion statute 849.094: https://florida.public.law/statutes/fla._stat._849.094 (NY and RI requirements are from the TMHCC game-of-chance page)
- BOEM bonding and supplemental financial assurance: https://boem.gov/oil-gas-energy/risk-management/risk-management-and-financial-assurance
- Oil spill financial responsibility (30 CFR 553, $35M): https://www.boem.gov/Oil-Spill-Financial-Responsibility-OSFR/ ; https://www.ecfr.gov/current/title-30/chapter-V/subchapter-B/part-553
- Public entity risk pools (AGRiP, at least 80%): https://www.nlc.org/wp-content/uploads/2020/10/Fact_Sheet-3.docx ; https://ucip.utah.gov/post/pooling-insight-overview
- Active assailant cover: https://www.marsh.com/en-us/services/terrorism-risk/insights/active-assailant-cover-preparing-for-a-post-pandemic-rise-in-mass-shootings.html ; https://cfc.com/en-ie/knowledge/resources/articles/2024/10/active-assailant-insurance-what-should-it-cover
- Residual value insurance: https://www.irmi.com/term/insurance-definitions/residual-value-insurance
- Fair Housing Act: https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview
