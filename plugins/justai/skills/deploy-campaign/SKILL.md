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
- Treat `README.md`, the entrypoint, and its matching test file as one campaign
  bundle whenever behavior changes.
- Default new scripts and material behavior changes to native semantic blocks
  with `defineBlock(...)` and `compose(rootBlock)`. Continue with plan-only
  output only when maintaining an existing plan-only script or when an
  intentionally low-level workflow has no useful marketer-facing semantic
  structure; state that reason explicitly.
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
   - Call `get_block_registry` before creating a new script. When its trusted
     blocks can represent the requested journey, use the block configuration
     tools instead of writing generated JavaScript.

3. Author or revise the script bundle.
   - The entrypoint contains one expression and should return native
     semantic-block output from `compose(...)`. A direct execution plan is a
     compatibility escape hatch for existing plan-only maintenance or an
     intentionally low-level workflow without useful marketer-facing semantic
     structure; do not choose it merely because it is shorter.
   - Use hardcoded values when they are intentionally fixed for the campaign.
     Use parameter helpers plus `parameters.json` when the value is a business
     knob a marketer may reasonably ask to adjust later.
   - Prefer `$` refs such as `$.context.user.id` and `$.profile.attributes.email`.
   - Use `contains(items, value)` or callback `.includes(value)` checks for
     runtime membership: array membership (suppression-list guardrails) or
     substring matching when the field is a string (for example
     `signupSource.includes("partner")`).
   - Reference resolution is strict: reading a runtime path that does not
     exist fails the run with `Reference '<path>' could not be resolved`.
     When a profile attribute is legitimately optional — consent flags,
     variant markers, fields only set after a user action — use optional
     chaining inside the callback so a missing attribute resolves to
     `undefined` instead of failing:
     `({ bindings }) => bindings.profile.attributes?.pushConsent === true`.
     A `?.` anywhere in the chain marks the whole reference lenient, and a
     lenient `.includes(...)` collection that is missing contains nothing.
     If a run or test fails with `Reference '<path>' could not be resolved`,
     first check the path for typos; if the path is right, the attribute is
     optional and the read needs `?.`. Ternaries and bare `?` are still
     unsupported inside callbacks.
   - Use stable IDs for side-effecting, durable, and UI-visible steps.
   - Attach a short plain-language description to each step explaining what
     it does and why. The workflow panel and the run-detail timeline both
     surface those descriptions alongside the auto-derived labels, so they
     let marketers and on-call debuggers read the script without
     reverse-engineering the arguments. The annotated starter scripts are
     the reference for placement.
   - Add or update `index.test.js` for meaningful sends, suppressions,
     branches, waits, exits, or loops.
   - Author ordinary saved tests with `scenario(name).description(...)` by
     default so the validation UI records a visual path and a marketer-readable
     explanation. Use `scenario(name).run(options)` for custom assertions that
     need the full run result; reserve `runScriptCase(...)` for harness-level
     cases that cannot use scenarios.
   - Add or update `README.md` with the marketer-readable strategy summary.

   Use the platform's built-in semantic block API by default for new scripts
   and material behavior changes:

   - Define blocks with `defineBlock({ type, name, schema, lower? })` and return
     `compose(rootBlock)` from the entrypoint.
   - Do not copy, define, or adapt inline replacements for `defineBlock` or
     `compose`. Do not return `compose(rootBlock).plan`. Those patterns retain
     an executable plan but discard the native manifest and provenance that
     power the block-based Workflow view.
   - Give every block a unique stable `id` plus marketer-readable `label` and
     `summary` metadata. Put editable or inspectable content in `schema`, and
     use `lower(...)` to translate executable blocks to the execution DSL.
   - For an ordered list of steps (send, wait, send, ...), give each step its
     own block with its own `lower()` and sequence them in the container with
     `lowerInto(plan, child)`. A step block returns an `execution()...` fragment
     without `.respond()`; only the container responds. Do not fold every step's
     lowering into the container or branch on a child's fields (e.g.
     `"emails" in step`) — each block owns its lowering so every runtime step
     stays traceable to an editable block.
   - Treat the live server authoring guide as canonical for block signatures;
     the minimal example below is only a shape reference.

4. Validate and save.
   - For a journey fully covered by the trusted registry, call
     `validate_block_configuration`, then `create_script_from_blocks`. The
     saved `blocks.json` is the editable source and the server generates
     `index.js`; never edit those two representations independently.
   - Update an existing block-authored journey with
     `update_script_from_blocks`; do not patch its generated files directly.
   - Use `validate_script` before saving when practical.
   - For the preferred native-block path, require `manifest` and `provenance`
     in the successful validation result. A valid result without them means
     the script compiled through the plan-only compatibility path; do not
     accept that for a new script or material behavior change unless the
     documented escape hatch applies.
   - Use `create_script` for new code-authored campaigns that cannot be
     represented by the trusted block registry.
   - For recurring or lifecycle campaigns where a user must not re-enter while
     a previous run is still live, set
     `entry_policy: { mode: "single_live_run", identity_key: "user_id" }` via
     `create_script` or `update_script`. The default allows repeat entries, and
     blocked triggers come back skipped, not failed.
   - For happy-path existing-campaign edits, prefer the OpenAPI `execute`
     tool with a short codemode program that calls `codemode.request(...)` to
     begin the edit session, patch files, validate, save, and return a compact
     summary. This keeps repeated validation from creating extra saved versions
     without requiring several separate MCP tool calls.
   - Use `begin_script_edit`, `patch_script_edit`, `validate_script_edit`, and
     `save_script_edit` directly when you need step-by-step recovery or need to
     inspect the working bundle between calls.
   - Before saving a preferred native-block edit, call
     `get_script_edit_visualization` and require a non-null `manifest`; inspect
     the manifest for every authored block. Use `provenance.blocks` to confirm
     mappings only for blocks that own lowered execution steps. Semantic-only
     or delegating wrapper blocks can be present in the manifest without a
     provenance entry.
   - Use `update_script` only for a small one-shot existing-campaign update
     where the full desired patch is already known.
   - After saving native blocks, call `get_script_visualization` and repeat the
     manifest/provenance check against the stored version before reporting that
     the Workflow UI is block-based.

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
   - For preferred native-block scripts, verify both representations: tests
     exercise the lowered plan, while `get_script_visualization` proves the
     complete authored manifest and applicable block-to-step provenance
     survived storage. Do not require semantic-only blocks to appear in
     `provenance.blocks`.
   - Use `execute_script` with one representative user when the user asks for a
     live preview or when generated content needs review.
   - Use `get_run`, `list_runs`, `get_test_run`, or `list_test_runs` to inspect
     saved results before reporting back.

6. Explain outcome and next action.
   - Summarize what changed, what was tested, whether tests passed, and whether
     the script remains draft or changed state.
   - If activation is next, use `get_script_readiness` and ask for explicit
     approval before activating.

## Preferred native block shape

Start from this shape for new scripts and material behavior changes. Confirm
the exact live signatures in the MCP server description before authoring:

```javascript
(() => {
  const Email = defineBlock({
    type: "message",
    name: "Email",
    schema: {
      to: { type: "string", label: "Recipient" },
      subject: { type: "string", label: "Subject" },
      body: { type: "string", label: "Body" },
    },
    lower({ values }) {
      return execution()
        .do(
          "send_welcome",
          iterable.email.send({
            to: values.to,
            subject: values.subject,
            body: values.body,
          }),
        )
        .respond({ status: "sent" });
    },
  });

  const Workflow = defineBlock({
    type: "workflow",
    name: "Workflow",
    schema: { body: { type: "block", label: "Message" } },
    lower({ values, lower }) {
      return lower(values.body);
    },
  });

  return compose(
    Workflow({
      id: "welcome_workflow",
      label: "Welcome workflow",
      summary: "Sends one welcome email.",
      body: Email({
        id: "welcome_email",
        label: "Welcome email",
        summary: "The welcome message sent to a new member.",
        to: "preview@example.com",
        subject: "Welcome",
        body: "Thanks for joining us.",
      }),
    }),
  );
})();
```

## Sequencing step blocks with lowerInto

When a container holds an ordered list of steps, each step is its own block with
its own `lower()`, and the container sequences them with `lowerInto`. Each step
block returns an `execution()` fragment without `.respond()`; only the container
responds. `lowerInto` appends the child's steps in order, namespaces its step
ids by block id, and attributes them to the child in provenance — so every block
owns its steps and the container owns none. Prefer this over one block lowering
the whole journey.

```javascript
(() => {
  const SendEmail = defineBlock({
    type: "send-email",
    name: "SendEmail",
    schema: { templateId: { type: "string", label: "Delivery template" } },
    lower({ values }) {
      return execution().deliver("send", {
        userId: $.context.user.id,
        templateId: values.templateId,
      });
    },
  });

  const Wait = defineBlock({
    type: "wait",
    name: "Wait",
    schema: { ms: { type: "number", label: "Delay (ms)" } },
    lower({ values }) {
      return execution().sleep("pause", values.ms);
    },
  });

  const Journey = defineBlock({
    type: "journey",
    name: "Journey",
    schema: { steps: { type: "blocks", label: "Steps" } },
    lower({ values, lowerInto }) {
      return values.steps
        .reduce((plan, step) => lowerInto(plan, step), execution())
        .respond({ outcome: "complete" });
    },
  });

  return compose(
    Journey({
      id: "welcome_journey",
      label: "Welcome journey",
      summary: "Welcome email, a wait, then a nudge.",
      steps: [
        SendEmail({ id: "welcome", label: "Welcome", templateId: "welcome" }),
        Wait({ id: "gap", label: "Wait a day", ms: 86400000 }),
        SendEmail({ id: "nudge", label: "Nudge", templateId: "nudge" }),
      ],
    }),
  );
})();
```

## Plan-only compatibility shape

Use direct `execution()...respond(...)` output only when maintaining an
existing plan-only script or when an intentionally low-level workflow has no
useful marketer-facing semantic structure. Do not choose it merely because it
is shorter. This form has no native manifest or provenance.

```javascript
(() => {
  return execution()
    .bind(
      "load_profile",
      "profile",
      iterable.user.get({ userId: $.context.user.id }),
    )
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
})();
```
