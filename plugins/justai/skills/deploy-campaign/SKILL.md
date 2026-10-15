---
name: deploy-campaign
description: Build or change a JustAI journey from a settled plan (entry rule, sending profile, emails, waits, branches, exits), then validate it and check readiness. Use when a marketer asks to build, set up, create, or change a journey, wants approved copy wired into its steps, asks whether a journey is ready to go live, explicitly asks to publish a draft, requests publication without confirmation, or asks for an unsupported journey step or substitute. Not for shaping a vague idea (use campaign-brief).
---

# Deploy campaign

Build and change journeys from a plan the marketer has already settled. Work in
the marketer's language; step ids and field names stay behind the scenes.

If the JustAI tools aren't available, ask the marketer to connect JustAI from
this plugin's Connectors settings (on Team and Enterprise plans an Owner adds
the connector first; in Claude Code, run `/mcp` and sign in). Write nothing
until it is connected.

## Rules

- Start every authoring pass with `list_journey_step_types`. Compose only the
  step types and fields it returns; the catalog differs by organization.
- A missing step type, profile field, event, or email is named and refused.
  Do not approximate missing behavior with a neighboring capability. If the
  requested behavior is undefined, clarify it before any authoring write.
  A request for the closest substitute does not define what it should do.
- A missing sending profile blocks publication, not building a draft. Never
  invent one; a draft may omit it as described below.
- Every email step sends a message minted with `use_email_in_message`. Put the
  returned message id in the step's `message.messageId`. Mint once per step,
  even when two steps send the same email; never invent or reuse an id.
- A minted message is a frozen copy. Editing the library email later does not
  change what a step sends until that step gets a newly minted message.
- A journey is complete only when the stored write returns valid and its
  readiness and diagram have been checked.
- A build is several separate saves, not one. If a later call fails, re-read
  what already saved and tell the marketer what exists before retrying, so a
  retry does not create a second journey or email.
- Journeys are created off. Turning a journey on, pausing, and archiving happen
  only in JustAI; no tool here does them. Publish a draft only when the
  marketer asks (see below). Never delete journeys.

## Before you build

1. **Sending profile.** Call `list_delivery_profiles`, keep only profiles that
   are ready to send, and ask which one to use when more than one fits. Never
   pick a profile the marketer has not seen. If none is ready or chosen, omit
   `delivery` and build the draft. Tell the marketer to choose a sending profile
   in Journey settings before turning it on.
2. **Entry rule.** Confirm how people enter (audience-analysis lists the rule
   kinds). For an event, confirm the exact name and fields with
   `list_custom_events` (follow the cursor to the end before calling an event
   missing) and `get_custom_event`. For a segment, use the id `save_segment`
   returned or one the marketer gives you. A `save_segment` audience enters
   only through `segment_scheduled`; `segment_entered` needs a fixed segment
   id from the marketer.
3. **Emails.** For each touchpoint, reuse a library email (`list_emails`,
   `get_email`) or build one:
   - Read the org's rules first: `list_brand_guidelines`, `get_brand_guideline`.
   - `get_email_layouts`, then `create_email` with the layout and its values.
   - For custom HTML, `check_email_html` before `write_email_html`.
   - Images come from `list_images`; use only returned URLs. Use
     `import_image` only for an image URL the marketer supplied.
   - For a variant of an existing email, `duplicate_email` and edit the copy.
     For many variants of one email, such as one per image, call
     `create_email_variants` once with all of them (up to 100 per call).
     For many variants of one SMS or push template, `create_sms_variants` and
     `create_push_variants` work the same way.

## Create a journey

1. Call `create_journey` with a marketer-readable name, the chosen `delivery`
   when available, the entry rule, exits, and sender. When the starting event is
   tracked for one person but is about another, such as a gift tracked under its sender, set
   `entry.recipient` to the event field that holds the other person's address.
   Use `validate_journey` while composing the steps; it writes nothing.
2. Mint one message per email step with `use_email_in_message`, passing the
   `journey_id` that `create_journey` returned.
3. Call `update_journey` with the full step list and `expected_version` from
   the create result. If every message already exists, you may pass the steps
   to `create_journey` directly instead.
4. Read the returned validation. Do not claim success unless it is valid.
5. Run the readiness check below and report the journey, its version, a short
   diagram, and any blockers.

## Change a journey

1. Find it with `list_journeys`, then read it with `get_journey`.
2. Every change to a live journey goes to its draft, including the entry rule
   and re-entry setting. People keep receiving the live version, so a live
   journey does not need pausing to be edited.
3. Preserve the complete step list and change only what was requested. For a
   label-only change use `rename_journey_step` instead.
4. To change copy, edit the library email (`patch_email`, `edit_email_html`,
   `edit_email_blocks`), mint a new message, and replace only that step's
   message id.
5. Call `update_journey` with `expected_version` set to the version just read.
   If it is refused as stale, re-read and reapply; never overwrite blindly.
6. Re-read the journey and confirm unrelated steps are unchanged, then run the
   readiness check.
7. Say the change is in the draft and not yet live. Report old value, new value,
   and the resulting version in one short summary.

## Readiness check

Use after any write, or when the marketer asks whether a journey is ready.

1. `get_journey` for entry, steps, exits, sender, and `step_content` (which
   email each step's message came from).
2. `list_journey_step_types`: every stored step type is still offered, with its
   required fields filled.
3. `get_journey_readiness`: record each passed or failed check.
4. `get_journey_diagram`: compare the narrated path with the plan: order,
   waits, branches, exits, and the emails each step sends.

Report concrete blockers in marketer language. Ready is not permission: say
that turning the journey on is the marketer's call, made in JustAI.

## Publish a draft

A publish request starts a review. It is not confirmation to publish, even if
it asks you to skip confirmation. `publish_journey` changes what people receive.
Approval of a tool call by the host is not the marketer's confirmation of the
reviewed changes.

1. Read it with `get_journey`. Only a `live` or `paused` journey publishes.
   A `draft` journey has never been live, so stop. There is nothing to publish,
   and turning it on happens in JustAI. Publishing a `paused` journey keeps it
   paused; it uses the published version when turned back on in JustAI.
2. On a `live` or `paused` journey, `published_version` appears only when the
   draft has unpublished changes. It is the published version, and `version`
   is the draft. When it is absent, the current draft is already the published
   version, so stop and say there is nothing to publish.
3. Read `get_journey` with `version` set to `published_version` and diff the
   two reads step by step: entry rule, steps added, removed, or reordered,
   waits, exits, and which email each step sends.
4. Run the readiness check. If it fails, show the diff and blockers, then stop
   without publishing. Otherwise show the ready diff and ask the marketer to
   confirm that specific version. Wait for a new affirmative reply. An earlier
   instruction or a request to bypass confirmation does not count.
5. Only after that clear yes, call `publish_journey` with `expected_version`
   set to the draft version just read.
6. Report the published version and whether the journey is live or still
   paused. People already in the journey finish on the version they started.

## Measure a journey

- `get_journey` returns `holdout` (whether people entering are drawn against the workspace holdout) and `key_metric` (the event its analytics lead with).
- Taking part is part of the journey. Change it with `update_journey` and `holdout: "measured"` or `"everyone"`, which writes the draft like any other edit.
- The key metric is not part of any version. `set_journey_key_metric` applies at once, with no publish. Pick the event from `list_custom_events`.
- `get_journey_analytics` reads what the journey's Analytics page shows, and `get_program_analytics` reads the Program page. Report a lift as proven only when its `significance` is Yes. On the Program headline, that significance belongs to the result `confidence_tests` names.
- The share held back belongs to the workspace. Read it with `get_workspace_holdout`. `set_workspace_holdout` changes who receives every measured journey and draws everyone again, so call it only when the marketer names the share they want.

## Unsupported requests

If the plan needs behavior absent from the catalog or not yet defined, make no
authoring writes. Explain the missing behavior and offer concrete alternatives
from the catalog. Wait for the marketer to choose one and provide its real
configuration before changing anything.

Never invent an event name, campaign id, or configured step to stand in for
missing behavior. A similar label or a successful validation does not prove
that two steps do the same thing. Creating a custom event is appropriate only
when the marketer has actually specified an event, its purpose, and its fields,
not as an automatic replacement for an unknown step.
