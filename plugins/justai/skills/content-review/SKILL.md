---
name: content-review
description: Review generated email or push content before activation. Use after a script exists and has at least one representative execution, or when auditing the prompt and copy inside an existing script.
---

# Content Review

Use this skill after a script has been deployed or updated.

## Workflow

1. Gather the material to review.
   - Use `list_scripts` and `get_script` to find the script.
   - If there is no recent representative run, call `execute_script`.
   - Use `get_run` to inspect the resulting content and outcome.

2. Review the copy on four dimensions.
   - Voice and tone
   - Clarity and scannability
   - CTA strength
   - Compliance or claim risk

3. Review the script prompt itself when needed.
   - Is the provider-scoped generate call specific enough, such as
     `iterable.email.generate(...)` or `customerio.email.generate(...)`?
   - Is the requested tone clear?
   - Does the prompt ask for the right CTA and level of personalization?

4. Summarize findings by priority.
   - What is good already
   - What should change before activation
   - Whether the script is ready as-is, needs copy edits, or needs another test

## Review notes

- There is no bulk sampling tool. If you need variety, run `execute_script`
  against a few representative users.
- Lead with marketer language, not raw traces.
- Only show the source or generated payloads when they help explain a finding.

## Output format

```text
Overall assessment:
Ready to activate:
Strengths:
Top issues:
Recommended edits:
Retest recommendation:
```
