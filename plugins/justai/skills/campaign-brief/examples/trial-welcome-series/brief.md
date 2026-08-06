# Campaign: Pro Trial Welcome Series — Calculator Entry Point

> Adapted from the BiggerPockets trial entry-point onboarding series. This
> example shows the Calculator cohort only; sister scripts exist per entry
> point (Market Finder, Deal Finder, Other).

## 1. Overview

### 1.1 Summary
Personalized 4-email welcome series for new Pro trial members whose entry point was the Calculator tool. Designed to combat the ~40% trial cancellation rate by delivering immediate, personalized value based on experience level.

### 1.2 Hypothesis
Audience who receive targeted welcome content based on their entry point and experience level will:
1. Recognize tangible value within the first 48 hours of their trial
2. Develop sustainable usage habits around core features
3. Convert to paid subscriptions at a higher rate than passive control

### 1.3 Objective
Reduce trial cancellation rate from 40% to 30% within 2 months of launch.

### 1.4 Success Indicators
- Primary KPI: trial-to-paid conversion rate (8-day and 30-day)
- Secondary KPIs: email engagement rate (opens, CTR), feature adoption (3+ distinct features during trial)

## 2. Audience

### 2.1 Segmentation

Cohort: `pro_trial_started_via_calculator` (Amplitude cohort id captured in the brief deployment notes)

Persona fan-out within the cohort:

| Persona | Size (wk) | Reachability | Personalization fields | Risks |
| --- | --- | --- | --- | --- |
| Uneducated Rookie | ~60 | Email: 100% | first_name, experience_level, entry_point | Lowest engagement baseline |
| Educated Rookie | ~140 | Email: 100% | first_name, experience_level, entry_point | — |
| Experienced Investor | ~100 | Email: 100% | first_name, experience_level, entry_point, portfolio_size | Most copy-sensitive cohort |

### 2.2 Opportunity sizing

| Current weekly trials | Current conversion | Hypothesized lift | Projected additional ARR |
| --- | --- | --- | --- |
| 300 | 52% (156/wk) | +5 pp (to 57%) | ~$243k/yr new, ~$445k over avg tenure |

## 3. Messaging Strategy

- Core message: rapid value demonstration — the calculator is your first Pro win, here's how to compound it
- Tone: confident, educational, persona-adjusted (rookies get reassurance, experienced get depth)
- Offer / CTA: progressive feature adoption (calculator → alerts → analysis → portfolio tools)
- Constraints: must exclude users who cancel mid-series; must not conflict with the existing free-trial nurture (suppression list); Pro Purple (#5E398E) for button backgrounds per brand kit

## 4. Sequence

| Step | Channel | Timing | Purpose | Deployable now? |
| --- | --- | --- | --- | --- |
| 1 | Email | Day 0, 1h after signup | Welcome + calculator toolkit ready | Yes |
| 2 | Email | Day 2 | Property alert setup | Yes |
| 3 | Email | Day 4 | Analyze real properties | Yes |
| 4 | Email | Day 6 | Complete Pro toolkit recap | Yes |

All fixed delays → fits the `.sleep(...)` primitive. No behavioral branching required in the script; persona branching via `.match(...)` on `profile.experience_level`.

## 5. Content

### Touchpoint 1 — Email, Day 0

|  | Uneducated Rookie | Educated Rookie | Experienced |
| --- | --- | --- | --- |
| Subject | Welcome {{first_name}}, your calculator toolkit is ready! | Welcome {{first_name}}, Ready to Analyze Your Next Deal? | Welcome {{first_name}}, Let's Optimize Your Advanced Deal Analysis |
| Preheader | Welcome to BiggerPockets Pro! | Welcome to BiggerPockets Pro! | Welcome to BiggerPockets Pro! |
| Body asset | `assets://welcome/calculator-hero-rookie.png` | `assets://welcome/calculator-hero-rookie.png` | `assets://welcome/calculator-hero-experienced.png` |

### Touchpoint 2 — Email, Day 2

|  | Uneducated Rookie | Educated Rookie | Experienced |
| --- | --- | --- | --- |
| Subject | Set Up Your Property Alert System in 5 Minutes | Set Up Your Deal Alert System in 5 Minutes | Scale Your Portfolio With Off-Market Deals |
| Preheader | Your step-by-step guide to automated property alerts | Your step-by-step guide to automated deal alerts | Access properties and direct owner contacts with Invelo |

### Touchpoint 3 — Email, Day 4

|  | Uneducated Rookie | Educated Rookie | Experienced |
| --- | --- | --- | --- |
| Subject | Time to Analyze Real Properties | Time to Analyze Real Deals | {{first_name}}, Streamline Your Investment Operations |
| Preheader | Let's Do This | Let's Do This | Access software included in your Pro membership |

### Touchpoint 4 — Email, Day 6

|  | Uneducated Rookie | Educated Rookie | Experienced |
| --- | --- | --- | --- |
| Subject | Your Complete Pro Investor Toolkit | Your Complete Pro Investor Toolkit | Protect your investments with our lawyer-reviewed lease agreement packages |
| Preheader | $5,000+ value | $5,000+ value | $4,950 value |

## 6. Deployment

- Script name: `trial-welcome-calculator`
- Lifecycle state: draft
- Testing plan: run `execute_script` against one representative user per persona (3 runs). Hand off to `campaign-testing` to save `index.test.js` covering the `.match(...)` persona branching, the per-touchpoint send status, and the suppression check before activation.
- Orchestration note: sister scripts `trial-welcome-market-finder`, `trial-welcome-deal-finder`, `trial-welcome-other` share this shape; audience selection routes each cohort to the matching script outside the `execution()` loop.
