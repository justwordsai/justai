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

| Segment | Size | Reachability | Personalization fields | Risks |
| --- | --- | --- | --- | --- |
| `dormant_silver_30d` | 12,400 | Email: 98% / Push: 42% | first_name, last_login_date, favorite_feature | Some users opted out of marketing email — exclude via suppression list |

### 2.2 Opportunity sizing

| Current 30d reactivation | Baseline email CTR | Hypothesized lift | Projected trial starts |
| --- | --- | --- | --- |
| 0.9% | 3% | +3 pp on reactivation | ~500/week |

## 3. Messaging Strategy

- Core message: "Your next deal is one click away — come back with Pro free for 2 weeks."
- Tone: warm, familiar, low-pressure
- Offer / CTA: Start 14-day Pro trial, no card required
- Constraints: must include unsubscribe footer; cannot imply Silver is deprecated

## 4. Sequence

| Step | Channel | Timing | Purpose | Deployable now? |
| --- | --- | --- | --- | --- |
| 1 | Email | Day 0 | Win-back offer | Yes |

## 5. Content

### Touchpoint 1 — Email, Day 0

|  | All Silver dormant |
| --- | --- |
| Subject | We miss you, {{first_name}} — your Pro trial is on us |
| Preheader | 14 days free. No credit card. |
| Body | Generated at runtime via `iterable.email.generate` using user profile for personalization. |
| Body asset | `assets://winback/silver-hero-v2.png` (from assets MCP) |
| Footer asset | `assets://shared/unsubscribe-footer.png` |

## 6. Deployment

- Script name: `silver-win-back`
- Lifecycle state: draft
- Testing plan: run `execute_script` for 3 representative users (one active-within-30d as negative, two dormant). Hand off to `campaign-testing` to save an `index.test.js` covering the profile-fetch path and the send-status shape before activation.
