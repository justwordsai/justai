---
name: campaign-report
description: Summarize what happened across recent campaign runs. Use for stakeholder updates, health checks, post-test summaries, or comparing how a script behaved across several executions.
---

# Campaign Report

Use this skill to turn run history into a marketer-readable report.

## Workflow

1. Define the scope.
   - Which script?
   - Which runs?
   - Is this a quick test summary or a broader health check?

2. Gather the data that actually exists.
   - Use `list_scripts` if the script needs to be found first.
   - Use `list_runs` for recent run summaries.
   - Use `get_run` for detailed inspection of the most important runs.

3. Report what happened.
   - completion, waiting, or failure patterns
   - sends versus skips
   - common subjects, titles, or message shapes
   - obvious timing or delivery issues

4. Keep the claims honest.
   - This is run-history analysis, not full attribution or business analytics.
   - If the evidence is thin, say so.
   - If only one or two runs exist, frame the report as directional.

5. Recommend next actions.
   - copy changes
   - audience changes
   - another test run
   - activation, pause, or revision

## Output format

```text
Executive summary:
Runs reviewed:
Observed pattern:
Risks or issues:
Recommended next action:
Confidence level:
```
