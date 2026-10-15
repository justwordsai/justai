---
name: campaign-brief
description: Turn a campaign idea into a signed-off brief in one guided flow, building a marketer-readable document step by step (hypothesis, audience, KPIs, messaging, sequence, per-touchpoint copy). Use when a marketer has a new, vague, or half-formed campaign idea, asks to plan or brief a campaign, or is missing audience, goal, or copy decisions. Not for building or editing a journey from a settled plan (use deploy-campaign).
---

# Campaign Brief

One skill. One flow. Idea → brief → ready for launch.

The brief is the work product. Start a real markdown document in the first step and keep adding to it. At the end the marketer signs off on the brief and the campaign is handed to launch.

## Core rules

- Build the brief progressively. One section per step. Do not sprint ahead.
- Every choice the marketer makes should come with **multi-choice defaults plus freeform**. Accept "pick one" or "none of these, here's mine".
- Ask the marketer each fork, cohort, threshold, KPI, cadence, and sign-off question. Use a structured question tool if one is available; otherwise list 2 to 4 numbered options plus "something else". Group related questions (e.g. all of step 2's audience questions) into one turn.
- Show real data, not placeholders. When user-platform, analytics, or asset sources are connected, consult them before asking the marketer to supply numbers or fields.
- Match the marketer's vocabulary throughout. The brief, the conversation, and every surface the marketer sees should read as strategy (audience, angle, hook, cadence, KPI), not implementation. Never expose file names, code, or deployment mechanics to the marketer. **Attribute / profile field names are part of the marketer's vocabulary and should stay**: explicitly connecting copy to data (e.g., "reference `last_lesson_title` for B1", "fall back when `preferred_language` is missing") is what makes a brief personalization-ready. Keep field-level detail; strip implementation-level detail.
- The brief ends in a sign-off, not an activation. Launch is a separate, explicit step the marketer approves.

## Connected platform

If the JustAI tools aren't available, ask the marketer to connect JustAI from
this plugin's Connectors settings (on Team and Enterprise plans an Owner adds
the connector first; in Claude Code, run `/mcp` and sign in). The brief can
continue without it, but mark every size, field, and step type as unconfirmed.

JustAI holds the organization's audiences, events, journeys, email library,
images, and brand guidelines. Audience rules must come from attributes the
organization actually has: call `list_segment_attributes`, translate the brief
into supported rules, and use `preview_segment` for the current count. Preview
writes nothing; saving follows audience-analysis (explicit instruction after
the count is shown).

What the platform can tell you, and is worth reading before the brief commits to
a shape:

- `list_journey_step_types` — the steps a journey can actually be built from in
  this organization, and the fields each one takes. A brief that proposes a step
  type that is not here is a brief that cannot be built.
- `list_journeys` — what already exists, so a new campaign is not a duplicate of
  a live one.
- `list_segment_attributes` — the profile fields audience rules may use.
- `preview_segment` — the current audience count without saving anything.
- `list_emails` — the email library the sequence will draw on.
- `list_brand_guidelines` — the organization's written voice and claims rules.
- `list_custom_events` — the events an entry rule, wait, or exit can use.

Personalization fields are the marketer's to name, but confirm them against
`list_segment_attributes`. Record them exactly as they say them and flag any
missing field as needing profile instrumentation before launch.

## Workflow

### 1. Define the hypothesis

Start a new marketer-readable markdown brief in the conversation, or update the
document the user has provided. Collect:

- **Campaign name** (working title)
- **Hypothesis**: "Audience who receive Y will \_\_\_". Capture 1 to 3 predicted outcomes.
- **Objective**: the business outcome tied to the hypothesis

Then ask the fork question:

> **"What would you like me to firm up first, audience, content, or goal?"**

Record the entry point. The other two get filled in later.

### 2. Pull up the audience

1. Ask the marketer who this is for, in their words, and what distinguishes
   that group from everyone else. Offer 2 to 4 candidate segments plus
   freeform.
2. Ask which profile fields identify that group and which ones the copy will
   personalize on. These are the fields the journey's entry rule and the email
   copy will both reference, so getting the exact names now is what makes the
   brief buildable later.

Show the audience as a table:

| Segment | Size (est.) | Personalization fields | Risks |

- **Size** comes from `preview_segment` when the rules are expressible; otherwise it comes from the marketer or their analytics and carries whoever said it. Never estimate one.
- **Personalization fields** are the field names the marketer gave you, written exactly as they said them. Mark any that are unconfirmed — a field the platform turns out not to hold renders as a blank in a sent email.
- **Risks**: a segment too small to learn anything from, contactability the marketer cannot vouch for, and any personalization field still unconfirmed.

Do not invent numbers. Attribute a platform count to the exact previewed rules,
and never imply that preview saved the audience.

### 3. Offer to confirm the hypothesis with metrics

Ask:

> **"Want me to pull current metrics to size this opportunity?"**

If yes, use the analytics sources available in this session or numbers the marketer provides (the JustAI connection sizes audiences but does not return baseline conversion rates), and produce a sizing table directly comparable to the hypothesis:

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
- Tone (brand voice). Read `list_brand_guidelines` and `get_brand_guideline` first and propose the written voice; ask only for what the guidelines leave open.
- Offer or CTA
- Per-cohort flavor (if the audience in §2 fans out into personas, describe how tone and emphasis flex per cohort)
- Any brand, legal, or compliance constraints the marketer calls out

### 6. Shape the sequence

Ask three questions. Multi-choice plus freeform each.

- **How long?** (single send, 3 to 7 day window, longer nurture)
- **How many touchpoints?** (1, 2 to 4, 5+)
- **Which delivery step per touchpoint?** Offer only delivery step types returned by `list_journey_step_types`; treat every returned step as available. If a step carries an `availability` object, skip it when its status is "unavailable", and present a "draft_only" one as not launchable yet, using its `says`. When the catalog offers only `send_email`, the sequence is email-only.

When the catalog offers them, also propose:

- **Experiment** steps that split people across weighted branches to compare variants (a branch with no send works as a control).
- **Content optimizer** or **sequence optimizer** steps to test several emails or orders and let JustAI pick per person by the chosen goal (for example clicks). Capture how many candidates each touchpoint needs.
- **Decision** branches that route people on profile fields or events, and **wait until** steps that pause until an event or field change.

Produce the cadence table:

| Step | Channel | Timing | Angle | Purpose |

Also surface:

- **Exit conditions**: what causes a user to drop out of the sequence (success conversion, opt-out, hard-cap on sends).
- **Send-time anchor**: fixed clock time vs. user-local time vs. time-since-trigger. Note any constraints on how finely the scheduler can honor the anchor.

If a marketer's requested shape conflicts with what the catalog can honor (e.g., fine-grained local send times, branching each person on whether they opened or clicked an earlier email, cross-user coordination), say so plainly and propose the closest shape that can ship now. Decision branches read profile fields, the entry event, and custom events, not email engagement; an optimizer can learn from clicks across people instead. Then let the marketer decide: simplify, split into multiple campaigns, or flag as a future enhancement.

### 7. Author each touchpoint, one at a time

Go row by row through the cadence table. Do not batch.

Author the final email fields that will be saved in the email library. A journey step sends a message minted from a library email with `use_email_in_message`; the message freezes the email as it reads then, and nothing is generated at send time.

For each touchpoint, produce:

1. **Angle & Intent**: one line each. Matches this row's Angle in the §6 cadence table and adds the touchpoint-specific framing.
2. **Approved copy**: final subject, preheader, body, and CTA in a matrix. Use only personalization fields the marketer confirmed:

   | Cohort                           | Subject  | Preheader | Body     |
   | -------------------------------- | -------- | --------- | -------- |
   | A (e.g. new-never-started)       | <sample> | <sample>  | <sample> |
   | B (e.g. existing-streak-breaker) | <sample> | <sample>  | <sample> |

3. **Library status**: use `list_emails` and `get_email` to find an existing email to reuse, or mark the touchpoint as a new email to create. The message is minted from it when the journey is built.

4. **Asset notes**: use `list_images` for hero and brand images and name the image by its library filename; never invent an image URL. Use `list_saved_blocks` for reusable footers or headers. If nothing matches, flag the gap.

5. **CTA**: short action-first copy, shared across the cohort matrix unless explicitly varied. Note how the click target resolves per user (e.g., deep-link to resume last lesson, or fall back to onboarding start if the user has no history).

Confirm each touchpoint with the marketer before moving to the next. If the marketer asks to batch the remaining touchpoints, honor the request. The one-at-a-time rule is a default, not a mandate.

### 8. Show the brief and get confirmation

Render the full brief as one markdown document: hypothesis, audience, KPIs, messaging, sequence, per-touchpoint content. Ask:

> **"Ready to hand this off for launch, or edit anything first?"**

Do not proceed without explicit sign-off.

### 9. Hand off for launch

Once the marketer signs off, the brief is complete. Offer to hand it to `deploy-campaign`, which creates the emails, builds the journey (created off), validates it, and checks readiness. Turning it on stays the marketer's decision, made in JustAI.

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

**Angle:** <from the §4 sequence table>
**Intent:** <what this touchpoint does>
**Length:** <short / medium / long>

#### Approved copy
| Cohort | Subject | Preheader | Body |
| ------ | ------- | --------- | ---- |
| ...    | ...     | ...       | ...  |

#### CTA

- Button copy: <text>
- Click target: <how it resolves per user>

#### Asset notes

<images, hero, footer, or gap flag>

#### Library status
<existing library email to reuse, or new email to create>

### Touchpoint 2: <channel>, <timing>

...
```

## Examples

Two worked example briefs live under [`examples/`](examples). Load the matching one while authoring step 7 (content) to anchor format and tone.

- **[`examples/simple-win-back/`](examples/simple-win-back/brief.md)**: minimal case. One email, one persona, one send. Use as the reference when the marketer asks for a single-touch campaign.
- **[`examples/trial-welcome-series/`](examples/trial-welcome-series/brief.md)**: multi-touch case. 4 emails over 6 days with 3 persona variants. Use as the reference when the marketer wants persona fan-out or a fixed nurture sequence.

Do not copy the examples verbatim. Mirror the structure; rewrite the content for the marketer's actual campaign.

## Handoffs

- **Need competitor positioning before authoring?** → run `competitive-brief` first, resume at step 5.
- **Need deeper audience exploration before committing?** → run `audience-analysis` as a side quest, come back with a chosen segment.
- **Build the journey from the signed-off brief** → `deploy-campaign`.
- **Copy QA against brand guidelines** → `content-review`.

## Anti-patterns

- Do not describe runtime copy generation. A journey sends frozen messages minted from library emails.
- Do not activate the campaign at the end of the flow. The marketer's sign-off on the brief is a handoff, not a launch.
- Do not skip step 7's "one touchpoint at a time" rule silently. Batching loses the fine-grained confirmations that make the prompts better. If the marketer explicitly asks to batch, honor it; but don't default to batching.
- Do not expose implementation surface to the marketer: file names, code, DSL terms, runtime capabilities, deployment mechanics. The marketer cares about angle, audience, and KPIs. Translation to runnable campaign happens behind the scenes.
