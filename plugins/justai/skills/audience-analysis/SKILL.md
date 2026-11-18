---
name: audience-analysis
description: Work out who a campaign should reach using the organization's real profile fields and events, size the audience, save it as a segment on request, and recommend how it enters a journey. Use when targeting is unclear, or a marketer asks who to target, how big an audience is, to size or compare segments, or to save a segment.
---

# Audience analysis

Use this skill when the marketer knows the campaign goal but not the right
target, or wants a specific audience sized or saved.

If the JustAI tools aren't available, ask the marketer to connect JustAI from
this plugin's Connectors settings (on Team and Enterprise plans an Owner adds
the connector first; in Claude Code, run `/mcp` and sign in). Never estimate a
count without it.

## Workflow

1. Anchor the analysis in a decision.
   - What campaign is this analysis for?
   - Are you choosing a primary audience, validating a segment, or comparing
     segments?

2. Establish the audience from real attributes.

   Call `list_segment_attributes` before proposing rules. Use only attributes it
   returns: `observed_values` for audience rules, `typed_observed_values` for
   journey entry rules. If the marketer asks for one that is absent, name it and
   explain that it must be added to customer profiles through an Identify call
   or import; do not substitute a nearby field.

   Translate the request into the smallest rule group that expresses it, then
   call `preview_segment`. Lead with the returned count and explain the rules in
   plain language. A preview writes nothing.

   For behavior, check events with `list_custom_events`. Follow the cursor to
   the end before saying an event does not exist, and use `get_custom_event` for
   its exact name and fields.

3. Check the audience can start a journey.

   A journey admits people in one of five ways:
   - a **profile field** changes, or reaches a value
   - an **event** arrives, optionally matching its fields
   - an **email subscription** changes (unsubscribed, resubscribed)
   - the person is **added to a fixed segment** (`segment_entered`)
   - a saved segment is **started on a schedule** at a set time
     (`segment_scheduled`)

   A journey with no entry rule can still be entered one person at a time
   through the JustAI API. A list kept outside JustAI needs a profile field or
   an import before a rule can find those people; an audience saved here does
   not. There is no tool to look up existing segments, so a segment entry uses
   the id `save_segment` returns or one the marketer provides.

   `save_segment` saves a rule-based audience whose membership updates as
   profiles change. Nobody is ever "added" to it, so `segment_entered` never
   fires for it and a journey entering on it would wait forever. Start a saved
   audience with `segment_scheduled`. Use `segment_entered` only with a fixed
   segment id the marketer gives you; this plugin cannot create one.

4. Summarize the audience in marketer language.
   - who they are, and the count returned by `preview_segment`
   - the entry rule that selects them
   - the personalization fields the copy can rely on
   - obvious risks: a segment too small to learn from, a field nobody has
     confirmed exists, an audience with no expressible entry rule

5. Recommend the target.
   - Primary segment, and an optional secondary one
   - Why this audience fits the campaign goal
   - Suggested message angle
   - Prefer selecting the audience at entry over complex branching inside the
     journey. If the target truly needs routing, say so; decision branches in
     the step catalog can route on profile fields and events.

6. Save only after confirmation.
   - After showing the preview count, stop and wait for an explicit instruction
     to save. Do not treat the original request as confirmation.
   - On the follow-up, call `save_segment` with the same rules, the exact name
     the marketer gave, and both `previewed_count` and `preview_token` from the
     preview.
   - If the count changed, show the new count and wait again. Never save an
     audience whose size has changed underneath the marketer.
   - Report the saved segment's id so a journey can start it on a schedule
     (`segment_scheduled`).

## Output format

```text
Decision:
Audience reviewed:
Primary target:
Secondary target:
Entry rule:
Recommended message angle:
Deployment note:
```

## Next actions

Offer the next best step:

- build a campaign brief for this audience (campaign-brief)
- save the previewed audience after confirming its count
- build a journey that starts from it (deploy-campaign)
- compare another segment
