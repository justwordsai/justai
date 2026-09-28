---
name: campaign-testing
description: Validate a journey's stored configuration, readiness, diagram, and safe refusal behavior before a human changes lifecycle state.
---

# Campaign testing

Use this skill to test what can be proven safely from the journey surface.

1. Find the journey with `list_journeys` and read it with `get_journey`.
2. Read `list_journey_step_types` and confirm every stored step is still
   supported with the fields it requires.
3. Call `get_journey_readiness` and record every passed or failed check.
4. Call `get_journey_diagram` and compare the marketer-readable path with the
   requested sequence, waits, exits, entry rule, and referenced emails.
5. For a proposed change, use `validate_journey` before saving when useful.
6. After an approved content change, re-read the stored version and confirm
   unrelated steps are unchanged.

Report the journey id and version, readiness result, diagram, and concrete
blockers. Do not execute against real people and do not activate, pause,
archive, or return the journey to draft; lifecycle changes happen in the
builder.
