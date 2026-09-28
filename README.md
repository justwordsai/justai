# JustAI Platform Plugin

The **JustAI Platform Plugin** bundles seven marketer-focused skills and connects them to the journey-only JustAI Platform MCP server. Use it to plan a campaign, build and validate an editable journey, review its content, and prepare it for a human-controlled lifecycle change.

> This is the **Platform** plugin for journey authoring. The [JustAI MCP](https://docs.justwords.ai/api/mcp/) covers the **worker** MCP server for dashboard-style template and resource exploration. They are complementary; you can connect both.

## What the Plugin Can Do

The plugin ships seven skills, each tuned to a specific moment in the campaign lifecycle:

| Skill                 | Use it when…                                                                         |
| --------------------- | ------------------------------------------------------------------------------------ |
| **campaign-brief**    | A campaign idea is still fuzzy and needs a concrete brief before a journey is built. |
| **deploy-campaign**   | The brief is decided and should be turned into an editable journey.                  |
| **campaign-testing**  | A journey needs validation, readiness checks, and a diagram review.                  |
| **audience-analysis** | Targeting is unclear and the audience needs pinning down before a journey is built.  |
| **content-review**    | A journey exists and its generated content needs review before a lifecycle change.   |
| **campaign-report**   | You need a marketer-readable review of a journey's configuration and readiness.      |
| **competitive-brief** | Messaging should be shaped against a specific competitor or category.                |

Behind those skills, the bundled MCP server (`platform.justwords.ai/mcp`) exposes audience preview and saving, journey authoring, validation, readiness, diagram, journey and Program analytics, email, and content tools. Tool schemas and parameter shapes are published directly by the server at session init.

Deliberately absent, so that a skill never plans around them:

- **Lifecycle mutation.** Nothing here turns a journey on, off, or archives it. That is a person's decision, made in the Journey Builder.
- **Run history.** No run inspection or per-person activity. Outcomes come only as the journey and Program analytics pages state them: rates, lift and how sure it is, over a window.
- **Individual profile lookup.** The audience tools expose observed attribute names and values plus aggregate counts, not arbitrary customer-profile browsing.
- **Hand-written scripts and implementation files.** Journeys are authored as steps. A client that needs the legacy script surface asks for it explicitly with `?profile=legacy-script`.

## Install

### Claude Code marketplace

```bash
# 1. Register the JustAI marketplace
claude plugin marketplace add justwordsai/justai

# 2. Install the plugin
claude plugin install justai@justai

# 3. Confirm it loaded
claude plugin details justai
```

`claude plugin details justai` should show seven skills and one MCP server.

### Local clone (development)

```bash
git clone https://github.com/justwordsai/justai.git
claude plugin marketplace add ./justai
claude plugin install justai@justai
```

Or load directly without registering a marketplace:

```bash
claude --plugin-dir ./justai/plugins/justai
```

## Authentication

The plugin's MCP server is at `https://platform.justwords.ai/mcp`. Sign in with OAuth on first connection:

1. The MCP client opens a JustAI authorization page.
2. You sign in with your JustAI account.
3. JustAI stores the resolved user and account scope for the MCP grant.
4. The MCP client receives an OAuth token scoped to that account.

### Claude Desktop

Point the MCP server entry at `https://platform.justwords.ai/mcp`. Claude Desktop launches the JustAI sign-in flow automatically on first use.

```json
{
  "mcpServers": {
    "justai-platform": {
      "command": "npx",
      "args": ["mcp-remote", "https://platform.justwords.ai/mcp"]
    }
  }
}
```

## Example Prompts

These work well as starting points. The plugin will route each into the right skill automatically.

```text
Create a win-back campaign for dormant silver users, deploy it as a draft
journey, validate it, and show its diagram.
```

```text
Update my onboarding campaign, then re-check its readiness and show me the
diagram before I turn it on.
```

```text
Design a multi-touch onboarding sequence with email and push for new
signups, then show which steps fit the current runtime.
```

```text
Analyze my silver-tier audience and recommend the best campaign approach.
```

```text
Review the copy quality of my active journeys before I make a lifecycle change.
```

```text
Review how my upsell journey is set up and tell me whether it is ready to turn on.
```

```text
Build a competitive brief against [competitor] to inform our next campaign
messaging.
```

## Troubleshooting

| Issue                                               | Fix                                                                                                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `claude plugin install` cannot find `justai@justai` | Make sure `claude plugin marketplace add justwordsai/justai` ran successfully first.                                                                                     |
| MCP server reports 401 unauthorized                 | Your OAuth token has expired or was revoked. Re-run the sign-in flow from your MCP client (Claude Desktop disconnects and reconnects the server) to issue a fresh token. |
| The assistant offers no journey tools               | The connection is on the legacy script profile. Journeys are the default — remove any `?profile=legacy-script` from the server URL and reconnect.                        |
| A journey will not validate                         | Ask for a readiness check: it names the failing step and why. Then ask which step types this organization can author — a brief may call for one it does not have.        |
| An email is not offered to a journey step           | Only library emails can be referenced. Ask the assistant to list the library, and publish the draft in the app if the one you want is unpublished.                       |
| The assistant will not turn a journey on            | By design — lifecycle is human-controlled. Review the diagram and readiness it produces, then make the change yourself in the Journey Builder.                           |

## See Also

- Full reference: <https://docs.justwords.ai/api/platform-plugin/>
- [JustAI MCP](https://docs.justwords.ai/api/mcp/) — worker MCP for template, resource, and saved-view exploration.
- [Generate](https://docs.justwords.ai/api/generate/) and [Batch Generate](https://docs.justwords.ai/api/batch-generate/) — direct API endpoints for LLM-backed copy generation.

## License

BUSL-1.1 — see [LICENSE](./LICENSE).
