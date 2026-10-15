---
name: content-review
description: Review, proofread, and tighten the emails a JustAI journey sends, checking copy against the organization's brand and tone guidelines, the journey's audience, and email rendering rules, then apply approved fixes. Use when a marketer asks to review, proofread, QA, or improve the copy in a journey or library email, to check it against brand guidelines before going live or publishing a draft, or to fetch or export every email a journey sends.
---

# Content review

Review the copy a journey sends, recommend the smallest specific fixes, and
apply only the ones the marketer approves.

If the JustAI tools aren't available, ask the marketer to connect JustAI from
this plugin's Connectors settings (on Team and Enterprise plans an Owner adds
the connector first; in Claude Code, run `/mcp` and sign in). Without it,
review only copy the marketer pastes in.

## Fetch

When the marketer asks to fetch, pull, or export a journey's emails — and not
to review or change them — return the copy each step sends. Do not edit, mint,
or publish.

1. Find the journey with `list_journeys` and read it with `get_journey`. Follow
   its step pages until the list is complete.
2. For every row in `step_content`, read the sent copy with `get_message` and
   that row's message id. Follow each body window until the HTML and plain text
   are complete.
3. Return every email: the step, subject, preheader, and the full HTML and
   plain text. Say which journey and version the copy came from.

## Read

For a library email that isn't in a journey, skip the journey lookup, the
sent-copy comparison, and minting a new message: read it with `get_email` and
`read_email_html`, review it, and apply approved fixes to the library email
only.

1. Load the rules. `list_brand_guidelines`, then `get_brand_guideline` for each
   one that applies. Every comment that rests on a rule cites it. When the org
   has none, say the review uses general best practice.
2. Find the journey with `list_journeys` and read it with `get_journey`. Its
   `step_content` maps each email step to its message and the library email it
   was minted from. Use `get_journey_diagram` for where each email sits.
3. Read what each step actually sends with `get_message` and the step's
   message id: the subject, preheader, HTML and plain text frozen when the
   message was minted. This is the copy customers receive, so review it. If
   `get_message` isn't available, review the current library email instead and
   say plainly it may differ from what the step sends.
4. Read the library email the message came from with `get_email` (subject,
   preheader, layout values) and `read_email_html` for the body, following
   `next_offset` to the end. If it differs from the sent copy, the library
   email changed after minting: say so, review the sent copy, and note the
   library edits separately. Fixes land in the library email and reach the
   step only through a new message (step 3 of "Apply approved fixes").

## Review

For each email, check:

- **Voice and claims**: matches the guidelines; every claim, number, and offer
  is supported; nothing the guidelines forbid.
- **Fit**: right for the audience entering the journey and for this step's
  place in the sequence; no repeated angle between consecutive emails.
- **Subject and preheader**: clear, distinct from each other, reasonable length.
- **Personalization**: every merge field exists in `list_segment_attributes`
  and has a sensible fallback when empty.
- **Links and CTA**: one clear primary action; no placeholder or broken links.
- **Images**: come from `list_images`; flag any hosted elsewhere.
- **Rendering**: run `check_email_html` on the body for blocking faults and
  compatibility warnings. It writes nothing.
- **Compliance**: sender identity, unsubscribe language, and nothing that reads
  as deceptive or suppression-sensitive.

Separate copy issues from journey issues (wrong order, missing exit, wrong
audience). Rank findings by impact and propose exact replacement text.

## Apply approved fixes

Only after the marketer approves specific changes:

1. Edit the library email: `patch_email` for subject, preheader, and layout
   values; `edit_email_html` or `edit_email_blocks` for body copy. For the same
   fix across many emails, preview it with `replace_email_text` first.
2. Re-read the email and confirm only the approved text changed.
3. To make the journey send the new copy, mint a new message with
   `use_email_in_message` (pass the journey id) and replace only that step's
   message id with `update_journey`, using `expected_version` from a fresh
   `get_journey`. On a live journey this lands in the draft.
4. Re-read the journey and check `get_journey_readiness`. Publishing the draft
   is the marketer's call (deploy-campaign covers it).

## Output format

```text
Journey and emails reviewed:
Guidelines applied:
Top issues (ranked, with suggested text):
Journey-level issues:
Sent copy vs library email (differences, if any):
Recommended next action:
```
