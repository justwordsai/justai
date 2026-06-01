---
name: audience-analysis
description: Use when targeting is unclear. Inspect available users and segments with the platform user tools, summarize who is reachable, and recommend the best audience before deployment.
---

# Audience Analysis

Use this skill when the user knows the campaign goal but not the right target.

## Workflow

1. Anchor the analysis in a decision.
   - What campaign is this analysis for?
   - Are you choosing a primary audience, validating a segment, or comparing
     segments?

2. Explore the user base with platform tools.
   - Use `iterable_user_get` to pull a representative user's real profile
     attributes and recent events when Iterable is configured. Pass a userId
     or email; returns `{ attributes, events }`.
   - To sample across a segment, call `iterable_user_get` on several known
     representative user IDs. There is no bulk list tool at this time; if
     Iterable is not configured, treat segment characterization as directional
     and rely on the marketer's knowledge.

3. Summarize the audience in marketer language.
   - segment size
   - notable traits
   - available personalization fields
   - reachability for email and push
   - obvious risks, such as a tiny segment or missing contact data

4. Recommend the target.
   - Primary segment
   - Optional secondary segment
   - Why this audience fits the campaign goal
   - Suggested message angle

5. Connect the result to deployment honestly.
   - `execute_script` runs one user at a time.
   - Audience selection should usually happen before deployment, not through
     complex in-script logic.
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
- deploy a script for the recommended target
- compare another segment
- inspect a few representative users in more detail
