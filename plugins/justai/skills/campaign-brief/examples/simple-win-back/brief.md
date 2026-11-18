# Campaign: Silver Tier Win-Back

## 1. Overview

### 1.1 Summary

One-shot email to dormant Silver-tier members who have not logged in for 30+ days. Offers a two-week Pro trial with no credit card.

### 1.2 Hypothesis

Audience who receive this win-back offer will:

1. Re-open the product within 7 days
2. Convert to a paid Pro trial at a higher rate than the passive control
3. Reduce 90-day churn among reactivated users

### 1.3 Objective

Reactivate dormant Silver members and funnel them into the Pro trial.

### 1.4 Success Indicators

- Primary KPI: trial starts per delivered email (target: 4%)
- Secondary KPIs: click-through rate, 7-day login rate

## 2. Audience

### 2.1 Segmentation

| Segment              | Size   | Reachability | Personalization fields                        | Risks                                                                  |
| -------------------- | ------ | ------------ | --------------------------------------------- | ---------------------------------------------------------------------- |
| `dormant_silver_30d` | 12,400 | Email: 98%   | first_name, last_login_date, favorite_feature | Some users opted out of marketing email — exclude via suppression list |

### 2.2 Opportunity sizing

| Current 30d reactivation | Baseline email CTR | Hypothesized lift     | Projected trial starts |
| ------------------------ | ------------------ | --------------------- | ---------------------- |
| 0.9%                     | 3%                 | +3 pp on reactivation | ~500/week              |

## 3. Messaging Strategy

- Core message: "Your budget is right where you left it — come back with Pro free for 2 weeks."
- Tone: warm, familiar, low-pressure
- Offer / CTA: Start 14-day Pro trial, no card required
- Constraints: must include unsubscribe footer; cannot imply Silver is deprecated

## 4. Sequence

| Step | Channel | Timing | Angle                        | Purpose        |
| ---- | ------- | ------ | ---------------------------- | -------------- |
| 1    | Email   | Day 0  | Your budget is waiting, free | Win-back offer |

- Entry: a scheduled start that sends to everyone in the saved `dormant_silver_30d` segment at that time (a saved segment is rule-based, so people "joining" it doesn't trigger entry)
- Exit conditions: starts a Pro trial, or unsubscribes

## 5. Content

### Touchpoint 1 — Email, Day 0

|              | All Silver dormant                                                                         |
| ------------ | ------------------------------------------------------------------------------------------ |
| Subject      | We miss you, {{first_name}} — your Pro trial is on us                                      |
| Preheader    | 14 days free. No credit card.                                                              |
| Body         | New library email built from the standard layout. Personalize with profile fields the marketer confirmed. |
| Hero image   | `silver-hero-v2.png` from the image library                                                |
| Footer       | Saved "Unsubscribe footer" block                                                           |

## 6. Deployment

- Journey name: Silver win-back
- Library status: new email to create
- Handoff: `deploy-campaign` builds the journey (created off), validates it, and checks readiness. The marketer turns it on in JustAI.
