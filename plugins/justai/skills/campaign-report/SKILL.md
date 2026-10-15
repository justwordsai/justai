---
name: campaign-report
description: Write a plain-language report on an existing JustAI journey for a marketer or stakeholder - how it is set up, how it is performing, what changed between the live version and its draft, whether it is ready, and what could go wrong. Use when someone asks how a journey or the overall program is doing, whether it is lifting conversions, to summarize, audit, or explain a journey, compare its draft with what is live, or check how its experiments or optimizers are doing. Not for building or editing (use deploy-campaign).
---

# Campaign report

Turn what the JustAI tools can actually read into a report a stakeholder can
act on. Read only; this skill changes nothing.

If the JustAI tools aren't available, ask the marketer to connect JustAI from
this plugin's Connectors settings (on Team and Enterprise plans an Owner adds
the connector first; in Claude Code, run `/mcp` and sign in). Do not report on
a journey you cannot read.

## Workflow

For a program-level question ("how is the overall program doing"), skip
journey selection and the configuration and readiness reads: go straight to
`get_program_analytics` and apply the significance and overlap rules in step 5.

1. Define the scope.
   - Which journey? Use `list_journeys` if it needs to be found.
   - A performance read, a quick readiness summary, a full configuration
     review, or a draft-vs-live comparison? Over what time window?

2. Read the configuration.
   - `get_journey`: state, entry rule, re-entry, steps, exits, sender, and
     `step_content` (which library email each step's message came from).
   - `get_journey_diagram` for the narrated path and duration.
   - `get_message` with a step's message id for any email whose subject or
     intent the report should name: that is what the step sends. Use
     `get_email` only when `get_message` isn't available, and say the library
     copy may differ.

3. Compare live and draft when they differ.
   - `version` is the current draft. On a `live` journey, `published_version`
     appears only when the draft has unpublished changes, and it is what
     people receive. `list_journey_versions` shows the full history.
   - When the read has no `published_version`, skip the versioned read. For a
     `draft` journey, report that it has never been live. For a `live` one,
     report that what is running matches the draft, so there is nothing
     unpublished.
   - Otherwise read `get_journey` with `version` set to `published_version` and
     diff it against the draft step by step. Say plainly that the draft is not
     live.

4. Check readiness.
   - `list_journey_step_types`: every stored step type is still offered with
     its required fields filled.
   - `get_journey_readiness`: record each passed or failed check.
   - Flag risks: an entry rule nobody can meet, missing exits on a long
     sequence, re-entry that could double-send.
   - Each step sends a copy of its email frozen when its message was minted.
     When the report names what an email says, read it with `get_message` and
     the step's message id, not the library email, which may have changed
     since. If `get_message` isn't available, read the library email and say
     plainly it may differ from what the step sends.

5. Add performance.
   - `get_journey_analytics` reads what the journey's Analytics page shows for
     the running version: who entered and left, the delivery funnel, the key
     metric's rate, each experiment's arms against control, and each
     optimizer's candidates. Default window is 30 days (`days` 1 to 90);
     narrow with `attribute` and `value` when the question is about one
     audience. Rates are 0 to 1; report them as percentages.
   - When the journey takes part in the workspace holdout (`holdout` on the
     read), the analytics include its lift over the people held back. Call a
     lift proven only when its `significance` is Yes; it is No whenever the
     smaller group has fewer than 100 people.
   - `get_program_analytics` answers "is the program working": incremental
     conversions and value across every journey that takes part. Journey rows
     overlap, so never add them up to get the program total. The headline's
     significance belongs to the result `confidence_tests` names.
   - If the journey has no key metric, say the report can't show conversions
     until one is set (deploy-campaign covers `set_journey_key_metric`).
   - Report only what these reads return. Never invent or estimate outcomes,
     revenue, or per-person activity.

## Output format

```text
Executive summary:
Journey, state, and version:
Who enters and how:
Sequence and emails used:
Live version vs draft:
Readiness:
Performance (window):
Experiments and optimizers:
Risks or issues:
Recommended next action:
Confidence level:
```

## Next actions

- copy changes (content-review)
- audience or entry-rule changes (audience-analysis)
- build or fix the draft (deploy-campaign)
- turning the journey on, pausing, or archiving: the marketer does that in
  JustAI
