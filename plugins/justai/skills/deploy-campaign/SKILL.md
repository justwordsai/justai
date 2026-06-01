---
name: deploy-campaign
description: Turn an approved marketer brief into a JustAI Platform campaign script, saved tests, and a draft deployment. Use when a user wants to create, update, test, launch, pause, inspect, or explain a campaign through the JustAI Platform MCP.
---

# Deploy Campaign

Use this skill when the marketer has approved the campaign direction and wants
the work turned into a real JustAI Platform script.

## Core rules

- Keep the marketer-facing explanation in campaign language first: audience,
  channel, message, timing, state, test result, and next action.
- Treat `README.md`, `index.js`, and `index.test.js` as one campaign bundle
  whenever behavior changes.
- Hardcoded literals are allowed for fixed campaign structure and values the
  marketer is unlikely to tune. Prefer script parameters for audience IDs,
  cadence values, thresholds, prompts, content IDs, channel/provider choices,
  or other knobs the user is likely to change now or in the future; store saved
  overrides in `parameters.json`.
- New or changed scripts stay `draft` unless the user explicitly asks for
  activation.
- Do not delete scripts unless the user explicitly asks for deletion.
- Scripts are managed through platform MCP tools, not local repo files. For
  script-only work, save with platform MCP tools and report script id/version;
  do not create a git branch, commit, or PR unless changing repo code.
- If activation is requested, call `get_script_readiness` first and explain any
  blockers before calling `set_script_state`.

## Workflow

1. Understand the brief.
   - Infer the campaign goal, target audience, channel, offer, timing, and
     whether the user wants a draft, test, pause, archive, or activation.
   - Ask only for details that block implementation.
   - For updates, inspections, pauses, or activation, start with `list_scripts`
     and `get_script`.

2. Discover what the platform supports right now. Do this every authoring
   pass — the platform evolves and stale assumptions break scripts at
   validation time.
   - Call `get_platform_context` to enumerate the available namespaces, tool
     names, and runtime limits for the current org.
   - Read each candidate tool's `inputSchema` and `description` from MCP
     `tools/list`. The `inputSchema` carries required/optional fields and
     types; the `description` carries behavioral notes (live vs mock, what
     triggers a live send, deterministic vs random output, synthetic
     fallbacks).
   - For DSL method signatures (`.bind`, `.do`, `.sleep`, etc.) and calling
     conventions, read the **server-level `description`** the OpenAPI MCP
     server publishes — the platform appends `generateAuthoringGuide(...)`
     output to it, so the live DSL surface is in there.
   - Pick provider-scoped tools per the provider the org has configured.

3. Author or revise the script bundle.
   - `index.js` contains one execution DSL builder expression.
   - Use hardcoded values when they are intentionally fixed for the campaign.
     Use parameter helpers plus `parameters.json` when the value is a business
     knob a marketer may reasonably ask to adjust later.
   - Prefer `$` refs such as `$.context.user.id` and `$.profile.attributes.email`.
   - Use stable IDs for side-effecting, durable, and UI-visible steps.
   - Attach a short plain-language description to each step explaining what
     it does and why. The workflow panel and the run-detail timeline both
     surface those descriptions alongside the auto-derived labels, so they
     let marketers and on-call debuggers read the script without
     reverse-engineering the arguments. The annotated starter scripts are
     the reference for placement.
   - Add or update `index.test.js` for meaningful sends, suppressions,
     branches, waits, exits, or loops.
   - Add or update `README.md` with the marketer-readable strategy summary.

4. Validate and save.
   - Use `validate_script` before saving when practical.
   - Use `create_script` for new campaigns.
   - For happy-path existing-campaign edits, prefer the OpenAPI `execute`
     tool with a short codemode program that calls `codemode.request(...)` to
     begin the edit session, patch files, validate, save, and return a compact
     summary. This keeps repeated validation from creating extra saved versions
     without requiring several separate MCP tool calls.
   - Use `begin_script_edit`, `patch_script_edit`, `validate_script_edit`, and
     `save_script_edit` directly when you need step-by-step recovery or need to
     inspect the working bundle between calls.
   - Use `update_script` only for a small one-shot existing-campaign update
     where the full desired patch is already known.

Codemode edit wrapper shape:

```javascript
const edit = await codemode.request({
  method: "POST",
  path: `/v1/scripts/${scriptId}/edit-sessions`,
});

const patched = await codemode.request({
  method: "PATCH",
  path: `/v1/script-edits/${edit.edit_id}`,
  body: { files },
});

const validation = await codemode.request({
  method: "POST",
  path: `/v1/script-edits/${edit.edit_id}/validate`,
});
if (!validation.valid) {
  return {
    saved: false,
    edit_id: edit.edit_id,
    changed_paths: patched.changed_paths,
    validation,
  };
}

const saved = await codemode.request({
  method: "POST",
  path: `/v1/script-edits/${edit.edit_id}/save`,
});

return {
  saved: true,
  edit_id: edit.edit_id,
  changed_paths: patched.changed_paths,
  version: saved.saved_script?.version,
};
```

5. QA every behavior change.
   - Use `run_script_tests`.
   - Use `execute_script` with one representative user when the user asks for a
     live preview or when generated content needs review.
   - Use `get_run`, `list_runs`, `get_test_run`, or `list_test_runs` to inspect
     saved results before reporting back.

6. Explain outcome and next action.
   - Summarize what changed, what was tested, whether tests passed, and whether
     the script remains draft or changed state.
   - If activation is next, use `get_script_readiness` and ask for explicit
     approval before activating.

## Minimal script shape

This illustrates how primitives compose into a script bundle. Treat it as
workflow scaffolding only — for exact parameter shapes, DSL signatures, and
behavioral notes (live vs mock, what triggers a live send, etc.), read the
MCP `tools/list` schemas and the OpenAPI server `description` for the connected
platform. Hand-maintained references in this skill drift the moment the
platform changes; the runtime sources don't.

```javascript
(() => {
  return execution()
    .bind("load_profile", "profile", iterable.user.get({ userId: $.context.user.id }))
    .bind(
      "draft_email",
      "emailDraft",
      iterable.email.generate({
        prompt:
          "Write a short win-back email with a clear return CTA for this user.",
        user: $.profile.attributes,
        length: "short",
      }),
    )
    .do(
      "send_email",
      iterable.email.send({
        to: $.profile.attributes.email,
        subject: $.emailDraft.subject,
        body: $.emailDraft.body,
      }),
    )
    .respond({
      campaign: "win-back",
      userId: $.context.user.id,
      email: $.profile.attributes.email,
      status: "sent",
    });
})()
```
