---
name: campaign-brief
description: Drive a campaign from idea to a ready-to-ship brief in one guided flow. Build a marketer-readable document step by step (hypothesis, audience, metrics, KPIs, messaging, sequence, per-touchpoint content) and hand it off for launch. Use this as the default entry point for any new or underspecified campaign.
---

# Campaign Brief

One skill. One flow. Idea → brief → ready for launch.

The brief is the work product. Start a real markdown document in the first step and keep adding to it. At the end the marketer signs off on the brief and the campaign is handed to launch.

## Core rules

- Build the brief progressively. One section per step. Do not sprint ahead.
- Every choice the marketer makes should come with **multi-choice defaults plus freeform**. Accept "pick one" or "none of these, here's mine".
- **Always use the `AskUserQuestion` tool for interview-style questions**: every fork, every cohort/threshold/KPI/cadence choice, every sign-off. The tool renders a native radio-button picker with an automatic "Other" freeform slot, which is the required UX for this skill. Do NOT inline A/B/C/D options as markdown text in the chat; that is a fallback only when `AskUserQuestion` is genuinely unavailable. Prefer 2 to 4 options per question; batch up to 4 related questions into a single call when they're logically grouped (e.g., all of step 2's audience-definition questions).
- Show real data, not placeholders. When user-platform, analytics, or asset sources are connected, consult them before asking the marketer to supply numbers or fields.
- Match the marketer's vocabulary throughout. The brief, the conversation, and every surface the marketer sees should read as strategy (audience, angle, hook, cadence, KPI), not implementation. Never expose file names, code, or deployment mechanics to the marketer. **Attribute / profile field names are part of the marketer's vocabulary and should stay**: explicitly connecting copy to data (e.g., "reference `last_lesson_title` for B1", "fall back when `preferred_language` is missing") is what makes a brief personalization-ready. Keep field-level detail; strip implementation-level detail.
- The brief ends in a sign-off, not an activation. Launch is a separate, explicit step the marketer approves.

## Connected platform

When the JustAI Platform MCP is connected, use `get_platform_context` first so
the brief reflects the current authoring namespaces and runtime limits. For
audience exploration, use `iterable_user_get` on representative user IDs to
pull real profile attributes and events. Keep platform details out of the
marketer-facing brief except for profile field names that directly support
personalization.

Reference the exact attribute field names returned by `iterable_user_get`
(under `attributes`) when filling §2's "Personalization fields" column and
§7 prompt instructions — those field names travel with the brief into rendering.

If the platform is not connected or user data is unavailable, say so and fall
back to structured segmentation with sizes flagged as TBD. Do not invent
numbers.

## Workflow

### 1. Define the hypothesis

Start a new marketer-readable markdown brief in the conversation, or update the
document the user has provided. Collect:

- **Campaign name** (working title)
- **Hypothesis**: "Audience who receive Y will ___". Capture 1 to 3 predicted outcomes.
- **Objective**: the business outcome tied to the hypothesis

Then ask the fork question:

> **"What would you like me to firm up first, audience, content, or goal?"**

Record the entry point. The other two get filled in later.

### 2. Pull up the audience

1. Use `iterable_user_get` on a handful of representative user IDs to pull
   real profile attributes and recent events. Returns `{ attributes, events }`.
2. To characterize segment distribution, call `iterable_user_get` on a sample
   of known IDs across segments. There is no bulk list tool at this time; if
   Iterable is not configured, structure the segmentation with the marketer
   and flag sizes as TBD.

Show the audience as a table:

| Segment | Size (est.) | Personalization fields | Risks |

- **Size** is estimated from the sample of profiles you inspected. There is no `/api/segments` count endpoint; report the sample size and flag it as an estimate.
- **Personalization fields** must use the exact attribute field names returned by `iterable_user_get` under `attributes`. Do not reference fields not present in actual user records.
- **Risks**: tiny segment sample (<30 users), missing `email` values for email campaigns, sparse event history limiting personalization.

If platform data is unavailable, structure the segmentation with the marketer and flag sizes as TBD. Do not invent numbers.

### 3. Offer to confirm the hypothesis with metrics

Ask:

> **"Want me to pull current metrics to size this opportunity?"**

If yes, query available analytics for the named segment and produce a sizing table directly comparable to the hypothesis:

| Current | Baseline conversion | Hypothesized lift | Projected impact |

Keep claims honest. If the data is thin, say so. If only directional evidence exists, frame it that way. If no data source is connected, offer directional-only sizing and move on. Do not stall the flow.

### 4. Confirm KPIs

Propose defaults based on the campaign shape:

- Conversion campaigns → primary: trial-to-paid (or equivalent). Secondary: click-through rate.
- Engagement campaigns → primary: feature adoption or session frequency. Secondary: open rate.
- Retention campaigns → primary: churn reduction. Secondary: time-to-churn.

Ask:

> **"These the right KPIs, or swap / add anything?"**

Always keep one primary and at least one secondary KPI. For high-frequency cadences (daily, multi-daily), also list opt-out / unsubscribe rate as a **monitored risk** even if the marketer doesn't pick it as a KPI. It's the primary failure mode of aggressive cadences.

### 5. Choose the message direction

Ask:

> **"What kind of message? Onboarding, win-back, activation, announcement, cross-sell, or something else?"**

Offer the common options as multi-choice. Then capture:

- Core message / hook (and whether the hook rotates across the sequence; many multi-touch campaigns benefit from a different angle per day)
- Tone (brand voice)
- Offer or CTA
- Per-cohort flavor (if the audience in §2 fans out into personas, describe how tone and emphasis flex per cohort)
- Any brand, legal, or compliance constraints the marketer calls out

### 6. Shape the sequence

Ask three questions. Multi-choice plus freeform each.

- **How long?** (single send, 3 to 7 day window, longer nurture)
- **How many touchpoints?** (1, 2 to 4, 5+)
- **Which channel per touchpoint?** (email, push, SMS, or mixed). Supported channels in the current runtime: **email**, **mobile push**, and **SMS** via Iterable or Customer.io. In-app messaging and web push are not supported.

Produce the cadence table:

| Step | Channel | Timing | Angle | Purpose |

Also surface:

- **Exit conditions**: what causes a user to drop out of the sequence (success conversion, opt-out, hard-cap on sends).
- **Send-time anchor**: fixed clock time vs. user-local time vs. time-since-trigger. Note any constraints on how finely the scheduler can honor the anchor.

If a marketer's requested shape conflicts with what the underlying system can honor (e.g., fine-grained local send times, mid-sequence branches based on opens/clicks, cross-user coordination), say so plainly and propose the closest shape that can ship now. Then let the marketer decide: simplify, split into multiple campaigns, or flag as a future enhancement.

### 7. Author each touchpoint, one at a time

Go row by row through the cadence table. Do not batch.

**Author content as `prompt + sample outputs`, not hand-written copy with merge tags.**

When content is AI-rendered at send time, the brief should capture (a) the exact prompt that will drive the AI and (b) representative sample outputs the marketer can calibrate against. Do NOT hand-author final subject/preheader/body with `{{merge_tags}}`. That text never actually ships; the AI re-renders every field per user.

For each touchpoint, produce:

1. **Angle & Intent**: one line each. Matches the day-angle from §3 and adds the touchpoint-specific framing.
2. **Generate prompt**: the full instruction set the AI will use to write this message. Explicit cohort rules (which profile fields to lean on per persona), tonal guardrails, length, and any structural requirements (subject limit, preheader limit, body word count). Write it as the marketer-approved source of truth.
3. **Sample outputs**: one representative render per cohort in a matrix:

   | Cohort | Subject | Preheader | Body |
   | --- | --- | --- | --- |
   | A (e.g. new-never-started) | <sample> | <sample> | <sample> |
   | B (e.g. existing-streak-breaker) | <sample> | <sample> | <sample> |

   Samples are the marketer's calibration target: if a sample reads wrong, edit the **prompt**, not the sample. Samples illustrate; prompts ship.

4. **Asset notes**: for image or brand assets, use the content tools (`list_content`, `get_content_item`) to check what's stored. If a matching asset exists, reference it in the brief. If not, flag the gap.

5. **CTA**: short action-first copy, shared across the cohort matrix unless explicitly varied. Note how the click target resolves per user (e.g., deep-link to resume last lesson, or fall back to onboarding start if the user has no history).

Confirm each touchpoint with the marketer before moving to the next. The confirmation question should target the prompt (source of truth), not the samples (illustrations). If the marketer asks to batch the remaining touchpoints, honor the request. The one-at-a-time rule is a default, not a mandate.

### 8. Show the brief and get confirmation

Render the full brief as one markdown document: hypothesis, audience, KPIs, messaging, sequence, per-touchpoint content. Ask:

> **"Ready to hand this off for launch, or edit anything first?"**

Do not proceed without explicit sign-off.

### 9. Hand off for launch

Once the marketer signs off, the brief is complete. The campaign enters the launch pipeline as a draft; the marketer will confirm final activation separately. Propose a follow-up pass with the testing skill to add pre-launch regression coverage before activation.

## Brief template (accumulate across steps)

```markdown
# Campaign: <name>

## 1. Overview
### 1.1 Summary
<what, why, entry point>

### 1.2 Hypothesis
Audience who receive <Y> will:
1. <outcome 1>
2. <outcome 2>
3. <outcome 3>

### 1.3 Objective
<primary business outcome>

### 1.4 Success Indicators
- Primary KPI: <metric>
- Secondary KPI(s): <metric(s)>
- Monitored risks: <e.g., unsubscribe rate for daily cadence>

## 2. Audience
### 2.1 Segmentation
| Segment | Size | Reachability | Personalization fields | Risks |

### 2.2 Opportunity sizing
| Current rate | Baseline | Hypothesized lift | Projected impact |

## 3. Messaging Strategy
- Core message / hook: <and how it rotates across the sequence, if applicable>
- Tone: <voice>
- Per-cohort flavor: <how tone flexes per persona>
- Offer / CTA: <cta>
- Constraints: <brand / legal / compliance>

## 4. Sequence
| Step | Channel | Timing | Angle | Purpose |

- Exit conditions: <success, opt-out, hard cap>
- Send-time anchor: <fixed / local / relative>

## 5. Content
### Touchpoint 1: <channel>, <timing>
**Angle:** <from §3>
**Intent:** <what this touchpoint does>
**Length:** <short / medium / long>

#### Generate prompt
<the instruction set the AI will use to write this message>

#### Sample outputs
| Cohort | Subject | Preheader | Body |
| --- | --- | --- | --- |
| ...    | ...     | ...       | ...  |

#### CTA
- Button copy: <text>
- Click target: <how it resolves per user>

#### Asset notes
<images, hero, footer, or gap flag>

### Touchpoint 2: <channel>, <timing>
...
```

## Examples

Two worked example briefs live under [`examples/`](examples). Load the matching one while authoring step 7 (content) to anchor format and tone.

- **[`examples/simple-win-back/`](examples/simple-win-back/brief.md)**: minimal case. One email, one persona, one send. Use as the reference when the marketer asks for a single-touch campaign.
- **[`examples/trial-welcome-series/`](examples/trial-welcome-series/brief.md)**: multi-touch case. 4 emails over 6 days, 3 personas handled via per-render prompt variation. Use as the reference when the marketer wants persona fan-out or a fixed nurture sequence. Note: this older example still uses the hand-written-copy-with-merge-tags format for §5; new briefs should use the prompt + samples format from step 7.

Do not copy the examples verbatim. Mirror the structure; rewrite the content for the marketer's actual campaign.

## Handoffs

- **Need competitor positioning before authoring?** → run `competitive-brief` first, resume at step 5.
- **Need deeper audience exploration before committing?** → run `audience-analysis` as a side quest, come back with a chosen segment.
- **Post-launch content QA** → `content-review`.
- **Regression coverage before activation** → `campaign-testing`.
- **Performance readout after the campaign runs** → `campaign-report`.

## Anti-patterns

- Do not skip the prompt + samples pattern in §5 when content is AI-rendered. Hand-authored merge-tag copy is misleading because it's not what ultimately ships to the user.
- Do not activate the campaign at the end of the flow. The marketer's sign-off on the brief is a handoff, not a launch.
- Do not skip step 7's "one touchpoint at a time" rule silently. Batching loses the fine-grained confirmations that make the prompts better. If the marketer explicitly asks to batch, honor it; but don't default to batching.
- Do not expose implementation surface to the marketer: file names, code, DSL terms, runtime capabilities, deployment mechanics. The marketer cares about angle, audience, and KPIs. Translation to runnable campaign happens behind the scenes.
