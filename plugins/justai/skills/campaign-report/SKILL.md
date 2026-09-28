---
name: campaign-report
description: Summarize an editable journey's configuration, readiness, and risks for stakeholder review.
---

# Campaign Report

Use this skill to turn the journey configuration the agent can actually inspect into a marketer-readable review. Do not imply that this surface provides delivery or attribution analytics.

## Workflow

1. Define the scope.
   - Which journey?
   - Is this a quick readiness summary or a detailed configuration review?

2. Gather the data that actually exists.
   - Use `list_journeys` if it needs to be found first.
   - Use `get_journey` for the entry rule, steps, exit rule, and current version.
   - Use `get_journey_readiness` and `get_journey_diagram` for the saved verdict and sequence.

3. Report what happened.
   - who enters and whether re-entry is allowed
   - sequence, timing, channels, and exit behavior
   - readiness problems and obvious content or configuration risks

4. Keep the claims honest.
   - This is a configuration review, not run-history, attribution, or business analytics.
   - Never invent sends, conversions, failures, or delivery outcomes.

5. Recommend next actions.
   - copy changes
   - audience or entry-rule changes
   - another readiness check after revision
   - human review in the Journey Builder

## Output format

```text
Executive summary:
Journey and version:
Observed pattern:
Risks or issues:
Recommended next action:
Confidence level:
```
