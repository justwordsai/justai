---
name: content-review
description: Review the emails and marketer-visible configuration inside an existing journey before a human changes its lifecycle state.
---

# Content review

Use this skill to review an existing journey without changing lifecycle state.

1. Find the journey with `list_journeys` and read it with `get_journey`.
2. Read the emails the journey actually references. A published email is an
   immutable snapshot, so a LIVE journey keeps sending the published version
   even after somebody edits the draft — review that published version, or the
   review approves copy nobody is receiving. If a newer draft exists, review it
   too, but present it separately and say which one is going out.
3. Review each message for clarity, voice, claim support, links, sender identity,
   suppression-sensitive language, and consistency with its place in the journey.
4. Check the journey with `get_journey_readiness` and show its path with
   `get_journey_diagram`.
5. Separate copy issues from journey-configuration issues and recommend the
   smallest specific edits.
6. If asked to apply journey edits, change only the requested steps, re-read the
   journey, and re-check readiness. If asked to edit an email, change only the
   requested draft fields and re-read the draft. A human must then publish it.
   Once the new published message ID is available, replace the journey's old
   message ID, re-read the journey and published email, and re-check readiness.

Activation, pausing, archiving, and returning to draft happen only in the
builder. This skill never uses implementation payloads.
