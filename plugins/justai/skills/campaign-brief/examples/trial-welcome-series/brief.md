# Campaign: Pro Trial Welcome Series — Budget Planner Entry Point

> Illustrative example for a fictional personal-finance app. This example
> shows the Budget Planner cohort only; sister journeys exist per entry point
> (Goal Tracker, Bill Scanner, Other).

## 1. Overview

### 1.1 Summary

Personalized 4-email welcome series for new Pro trial members whose entry point was the Budget Planner. Designed to lower trial cancellations by delivering immediate, personalized value based on experience level.

### 1.2 Hypothesis

Audience who receive targeted welcome content based on their entry point and experience level will:

1. Recognize tangible value within the first 48 hours of their trial
2. Develop sustainable usage habits around core features
3. Convert to paid subscriptions at a higher rate than passive control

### 1.3 Objective

Reduce trial cancellation rate by 10 percentage points within 2 months of launch.

### 1.4 Success Indicators

- Primary KPI: trial-to-paid conversion rate (8-day and 30-day)
- Secondary KPIs: email engagement rate (opens, CTR), feature adoption (3+ distinct features during trial)

## 2. Audience

### 2.1 Segmentation

Cohort: `pro_trial_started_via_budget_planner` (cohort id captured in the brief deployment notes)

Persona fan-out within the cohort:

| Persona      | Size (wk) | Reachability | Personalization fields                                   | Risks                      |
| ------------ | --------- | ------------ | -------------------------------------------------------- | -------------------------- |
| Beginner     | ~200      | Email: 100%  | first_name, experience_level, entry_point                | Lowest engagement baseline |
| Intermediate | ~500      | Email: 100%  | first_name, experience_level, entry_point                | —                          |
| Advanced     | ~300      | Email: 100%  | first_name, experience_level, entry_point, account_count | Most copy-sensitive cohort |

### 2.2 Opportunity sizing

| Current weekly trials | Current conversion | Hypothesized lift | Projected additional paid members |
| --------------------- | ------------------ | ----------------- | --------------------------------- |
| 1,000                 | 50% (500/wk)       | +5 pp (to 55%)    | ~50/week                          |

## 3. Messaging Strategy

- Core message: rapid value demonstration — your first budget is your first Pro win, here's how to build on it
- Tone: confident, educational, persona-adjusted (beginners get reassurance, advanced users get depth)
- Offer / CTA: progressive feature adoption (budget → bill reminders → monthly review → goal tools)
- Constraints: must exclude users who cancel mid-series; must not conflict with the existing free-trial nurture (suppression list); use the brand kit's primary color for button backgrounds

## 4. Sequence

| Step | Channel | Timing                 | Purpose                        | Deployable now? |
| ---- | ------- | ---------------------- | ------------------------------ | --------------- |
| 1    | Email   | Day 0, 1h after signup | Welcome + budget toolkit ready | Yes             |
| 2    | Email   | Day 2                  | Bill reminder setup            | Yes             |
| 3    | Email   | Day 4                  | First monthly review           | Yes             |
| 4    | Email   | Day 6                  | Complete Pro toolkit recap     | Yes             |

All fixed delays fit journey delay steps. Persona branching uses the supported decision step over `profile.experience_level`.

## 5. Content

### Touchpoint 1 — Email, Day 0

|            | Beginner                                              | Intermediate                                           | Advanced                                                  |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| Subject    | Welcome {{first_name}}, your budget toolkit is ready! | Welcome {{first_name}}, ready to plan your next month? | Welcome {{first_name}}, let's fine-tune your budget setup |
| Preheader  | Welcome to Pro!                                       | Welcome to Pro!                                        | Welcome to Pro!                                           |
| Body asset | `assets://welcome/budget-hero-beginner.png`           | `assets://welcome/budget-hero-beginner.png`            | `assets://welcome/budget-hero-advanced.png`               |

### Touchpoint 2 — Email, Day 2

|           | Beginner                                  | Intermediate                              | Advanced                                      |
| --------- | ----------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| Subject   | Set up bill reminders in 5 minutes        | Never miss a due date again               | Automate every recurring bill across accounts |
| Preheader | Your step-by-step guide to bill reminders | Your step-by-step guide to bill reminders | Connect all your accounts in one place        |

### Touchpoint 3 — Email, Day 4

|           | Beginner                   | Intermediate               | Advanced                                       |
| --------- | -------------------------- | -------------------------- | ---------------------------------------------- |
| Subject   | Time for your first review | Time for your first review | {{first_name}}, streamline your monthly review |
| Preheader | Let's do this              | Let's do this              | Reports included in your Pro membership        |

### Touchpoint 4 — Email, Day 6

|           | Beginner                   | Intermediate               | Advanced                                          |
| --------- | -------------------------- | -------------------------- | ------------------------------------------------- |
| Subject   | Your complete Pro toolkit  | Your complete Pro toolkit  | Hit your savings goals faster with Pro goal tools |
| Preheader | Everything included in Pro | Everything included in Pro | Goal tracking, forecasts, and shared budgets      |

## 6. Deployment

- Script name: `trial-welcome-budget-planner`
- Lifecycle state: draft
- Testing plan: hand off to `campaign-testing` to validate the stored journey, confirm readiness, and review every branch in its diagram before a human changes lifecycle state.
- Orchestration note: sister journeys `trial-welcome-goal-tracker`, `trial-welcome-bill-scanner`, and `trial-welcome-other` share this shape; audience selection routes each cohort to its journey.
