---
name: audience-analysis
description: Use when targeting is unclear. Work out with the marketer who the campaign should reach, check the audience can be expressed as a journey entry rule, and recommend a target before the journey is built.
---

# Audience Analysis

Use this skill when the user knows the campaign goal but not the right target.

## Workflow

1. Anchor the analysis in a decision.
   - What campaign is this analysis for?
   - Are you choosing a primary audience, validating a segment, or comparing
     segments?

2. Establish the audience from real attributes.

   Call `list_segment_attributes` before proposing rules. Use only attributes it
   returns. If the marketer asks for one that is absent, name it and explain that
   it must be added to customer profiles through an Identify event or import;
   do not substitute a nearby field.

   Translate the request into the smallest rule group that expresses it, then
   call `preview_segment`. Lead with the returned count and explain the rules in
   plain language. A preview writes nothing.

3. Check the audience can actually start a journey.

   A journey admits people one of three ways, so an audience has to reduce to
   one of them: a **profile field** reaching a value, an **event** arriving, or
   an **email subscription** changing. Call `list_journey_step_types` to confirm
   what this organization can express.

   If the audience only exists as a list held somewhere else, say so plainly:
   that is a segment the marketer maintains, not an entry rule, and it needs a
   profile field set on those people before a journey can find them.

4. Summarize the audience in marketer language.
   - who they are, and the count returned by `preview_segment`
   - the entry rule that selects them, in the platform's own vocabulary
   - the personalization fields the copy can rely on
   - obvious risks: a segment too small to learn from, a field nobody has
     confirmed exists, an audience with no expressible entry rule

5. Recommend the target.
   - Primary segment
   - Optional secondary segment
   - Why this audience fits the campaign goal
   - Suggested message angle

6. Save only after confirmation.
   - After showing the preview count, stop and wait for an explicit instruction
     to save. Do not treat the original request as confirmation.
   - On the follow-up, call `save_segment` with the same rules, the exact name the
     marketer gave, and both `previewed_count` and `preview_token` from the preview.
   - If the count changed, show the new count and wait again. Never save an
     audience whose size has changed underneath the marketer.
   - Audience selection should usually happen before the journey is built, not
     through complex branching inside it.
   - If the target needs dynamic routing or branching, say so explicitly.

## Output format

```text
Decision:
Audience reviewed:
Primary target:
Secondary target:
Reachability:
Recommended message angle:
Deployment note:
```

## Next actions

Offer the next best step:

- build a campaign brief for this audience
- save the previewed audience after confirming its count
- deploy a journey for the recommended target
- compare another segment
- ask the marketer for representative examples or exported evidence
