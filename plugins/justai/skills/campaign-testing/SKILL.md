---
name: campaign-testing
description: Add, update, run, or repair saved campaign tests for a JustAI script. Use when a user wants reusable `index.test.js` coverage, regression fixes, or marketer-readable explanations of test failures.
---

# Campaign Testing

Use this skill when the user wants reusable saved tests, not just a one-off `execute_script` run.

## Core rule

Treat `index.js` and `index.test.js` as one change unit.

- When campaign behavior changes, update both files in the same edit session
  and save once.
- When creating a new campaign with meaningful branching, suppression, delays,
  event waits, or loops, prefer creating both files together.
- Do not add a separate "scenario suggestion" step unless the user explicitly asks for planning before authoring.

## Workflow

1. Inspect the current script bundle.
   - Use `list_scripts` and `get_script`.
   - Read both `index.js` and `index.test.js` when they exist.

2. Infer the coverage that matters.
   - Always include one happy-path test.
   - Add coverage for each meaningful `stopWhen(...)`, `if(...)`, `match(...)`,
     `exit(...)`, `sleep(...)`, `waitForEvent(...)`, or `forEach(...)` behavior.
   - Keep the explanation in marketer language first, then write the low-level test file.

3. Author or update `index.test.js`.
   - Tests must import from `@justai/platform-test-harness`.
   - Use `scenario(name)` for every ordinary saved test so each result records
     a workflow path the validation UI can show.
   - Add `.description(...)` with a short marketer-readable explanation of the
     customer situation and expected business outcome.
   - When a path crosses `waitForEvent(...)`, add a matching `.event(...)`
     fixture before the expectation. The fixture uses the event payload shape,
     such as `{ type: "profile_fields_changed", changes: { stage: { new:
     "ready" } } }`.
   - Use fluent expectations when they cover the outcome. When custom
     assertions need the full run, use `await scenario(name).run(options)` and
     assert against the returned result.
   - Use `runScriptCase(...)` only for harness-level edge cases that cannot be
     expressed with `scenario(...)`; it does not produce a visual scenario path.
   - Prefer small, focused cases over one giant fixture-heavy test.
   - Name tests after business outcomes, not internal implementation details.

4. Save script and tests together.
   - For a new campaign, call `create_script` with both files when appropriate.
   - For happy-path existing-campaign edits, prefer the OpenAPI `execute`
     tool with a short codemode program that calls `codemode.request(...)` to
     begin the edit session, patch `index.js` and/or `index.test.js`, validate,
     save, and return a compact summary.
   - Use `begin_script_edit`, `patch_script_edit`, `validate_script_edit`, and
     `save_script_edit` directly when you need step-by-step recovery or need to
     inspect the working bundle between calls.
   - Use `update_script` only for a small one-shot test-only update where no
     iterative validation is needed.

5. Run and inspect.
   - Use `run_script_tests`.
   - Use `get_test_run` or `list_test_runs` to inspect saved failures.
   - If the saved tests are still incomplete, explain the gap and update the file rather than leaving the script half-covered.

6. Repair carefully.
   - If a failure exposes a script bug, fix `index.js` and keep or strengthen the test.
   - If a failure exposes a stale test, update `index.test.js` without weakening the intended behavior.

## Test authoring rules

- Use the saved test harness imports from `@justai/platform-test-harness`.
- Default to `scenario(name).description(...)` rather than `runScriptCase(...)`.
- Keep scenario names short and descriptions readable by a marketer; avoid
  internal step ids, parameter keys, and implementation terms in either.
- Cover the main path plus the branches marketers actually care about.
- Prefer representative user fixtures over synthetic assertion-only tests with no business context.
- Keep assertions pointed at business outcomes: suppression, chosen branch, sent channel, returned status, wait/resume behavior, or exit reason.
- Never leave a `waitForEvent(...)` path without a matching `.event(...)`
  fixture; otherwise the test correctly ends as unfinished.
- For suppression-list guardrails, include at least one test where membership
  in the blocked list exits before send-side effects.
- Do not split script edits and test edits into unrelated turns when the user asked for one behavioral change.

## Output style

Lead with:

- what changed in campaign behavior
- what coverage was added or refreshed
- whether the saved tests passed
- what residual risk remains, if any
