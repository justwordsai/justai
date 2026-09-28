---
name: deploy-campaign
description: Build or change an editable JustAI journey from an approved marketer brief, validate it, and leave every lifecycle decision to the human builder.
---

# Deploy campaign

Use this skill for marketer-authored journeys. It never authors implementation
files and never changes lifecycle state.

## Rules

- Start every authoring pass with `list_journey_step_types`.
- Compose only step types and fields returned by that tool.
- Use emails already in the library, referencing each by the message id the
  library reports as published.
- A new email can be drafted here, but a draft cannot be referenced by a journey
  step: it has no published message id until a person publishes it, and a step
  pointing at an unpublished email passes structural validation and then drops
  the send at runtime. So draft it, then STOP and ask the marketer to publish it
  before it goes into the journey.
- A missing step type, profile field, event, or email is named and refused. Do
  not approximate it with a neighboring capability.
- A journey is complete only when the stored write returns valid and its
  readiness and diagram have been checked.
- Activation, pausing, archiving, and returning to draft happen only in the
  builder. No agent tool performs them.
- Do not delete journeys.

## Create a journey

1. Read the brief and identify the entry rule, ordered steps, exits, sender,
   timing, and referenced emails.
2. Call `list_journey_step_types` and compare the request with the live catalog.
3. When useful while composing, call `validate_journey`; it writes nothing.
4. Call `create_journey` with a marketer-readable name, stable step ids, the
   entry rule, steps, exits, and sender. Every email step must name a published
   message id — if the brief needs an email nobody has published yet, stop and
   say which one.
5. Read the returned validation. Do not claim success unless it is valid.
6. Call `get_journey_readiness` and `get_journey_diagram`.
7. Report the journey id, version, concise diagram, and readiness blockers.
   Direct the marketer to the builder for lifecycle changes.

## Change a journey

1. Find it with `list_journeys`, then read it with `get_journey`.
2. Every change to a live journey goes to its draft, including `entry.when` and `entry.allow_reentry`. The running version keeps running and nobody receives anything different, so a live journey does not need pausing to be edited.
3. Preserve the complete step list and change only what was requested.
4. Call `update_journey` with `expected_version` set to the version just read.
5. Re-check validation, readiness, and the diagram.
6. Say that the change is in the draft and not yet live, and report the old value, new value and resulting version in one short summary.

## Publish a draft

Only when the marketer asks. `publish_journey` is the one journey call that changes what people receive, and deciding to is theirs — a journey looking finished is not a reason to make it.

1. Read it with `get_journey` and check `get_journey_readiness`. `published_version` on the read is what people are receiving now; `version` is the draft. They differ only when there is something unpublished.
2. Say which version is live and which the draft is, describe the draft's steps and entry rule as the read gives them, and confirm. Do not claim a change list — this surface reads the draft, not the running version, so a step-by-step diff would be invented.
3. Call `publish_journey` with `expected_version` set to the version just read.
4. Report the version now live, and that people already in the journey finish on the one they started.

## Measure a journey

- `get_journey` returns `holdout` (whether people entering are drawn against the workspace holdout) and `key_metric` (the event its analytics lead with).
- Taking part is part of the journey. Change it with `update_journey` and `holdout: "measured"` or `"everyone"`, which writes the draft like any other edit.
- The key metric is not part of any version. `set_journey_key_metric` applies at once, with no publish. Pick the event from `list_custom_events`.
- `get_journey_analytics` reads what the journey's Analytics page shows, and `get_program_analytics` reads the Program page. Report a lift as proven only when its `significance` is Yes. On the Program headline, that significance belongs to the result `confidence_tests` names.
- The share held back belongs to the workspace. Read it with `get_workspace_holdout`. `set_workspace_holdout` changes who receives every measured journey and draws everyone again, so call it only when the marketer names the share they want.

## Unsupported requests

If the request needs something absent from the catalog, write nothing. Name the
missing capability, say where it would need to be configured or implemented,
and offer only alternatives that are honestly supported.
