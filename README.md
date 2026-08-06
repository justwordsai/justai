# JustAI Platform Plugin

The **JustAI Platform Plugin** bundles seven marketer-focused skills and connects them to the JustAI Platform MCP server. Use it when you want an AI assistant that can plan a campaign, write the script, add stored tests, run them, review the generated copy, and report on past runs.

> This is the **Platform** plugin (campaign scripting). The [JustAI MCP](https://docs.justwords.ai/api/mcp/) covers the **worker** MCP server for dashboard-style template and resource exploration. They are complementary; you can connect both.

## What the Plugin Can Do

The plugin ships seven skills, each tuned to a specific moment in the campaign lifecycle:

| Skill | Use it when… |
| --- | --- |
| **campaign-brief** | A campaign idea is still fuzzy and needs a concrete brief before any script is written. |
| **deploy-campaign** | The brief is decided and should be turned into a real platform script. |
| **campaign-testing** | A script exists and needs stored tests added, updated, run, or repaired. |
| **audience-analysis** | Targeting is unclear and you need to inspect available users or segments first. |
| **content-review** | A script exists and its generated email or push copy needs review before activation. |
| **campaign-report** | You need a marketer-readable summary of recent runs. |
| **competitive-brief** | Messaging should be shaped against a specific competitor or category. |

Behind those skills, the plugin's bundled MCP server (`platform.justwords.ai/mcp`) exposes the script lifecycle, validation, execution, and run inspection tools the skills use. Tool schemas and parameter shapes are published directly by the MCP server at session init, so the assistant always has the live surface and you never see drift between docs and runtime.

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
      "args": [
        "mcp-remote",
        "https://platform.justwords.ai/mcp"
      ]
    }
  }
}
```

## Example Prompts

These work well as starting points. The plugin will route each into the right skill automatically.

```text
Create a win-back campaign for dormant silver users, deploy it as a draft
script, and test it for one representative user.
```

```text
Update my onboarding campaign and refresh its stored unit tests in the same
change before you run them.
```

```text
Design a multi-touch onboarding sequence with email and push for new
signups, then show which steps fit the current runtime.
```

```text
Analyze my silver-tier audience and recommend the best campaign approach.
```

```text
Review the copy quality of my active campaign scripts before I activate them.
```

```text
Show me a performance report on the last 10 runs of my upsell campaign.
```

```text
Build a competitive brief against [competitor] to inform our next campaign
messaging.
```

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `claude plugin install` cannot find `justai@justai` | Make sure `claude plugin marketplace add justwordsai/justai` ran successfully first. |
| MCP server reports 401 unauthorized | Your OAuth token has expired or was revoked. Re-run the sign-in flow from your MCP client (Claude Desktop disconnects and reconnects the server) to issue a fresh token. |
| Generated copy looks templated, not LLM-driven | The generate tools fall back to a canned template when no LLM key is configured server-side. Contact JustAI to confirm your org has LLM generation enabled. |
| Push sends never reach a device | Push is mocked in the current runtime — sends are logged with a fake delivery id. Production push delivery is a planned addition. |
| Scripts stay in `draft` after activation | Activation requires a readiness check to pass first. Ask the assistant to confirm readiness and address any blocked checks. |

## See Also

- Full reference: <https://docs.justwords.ai/api/platform-plugin/>
- [JustAI MCP](https://docs.justwords.ai/api/mcp/) — worker MCP for template, resource, and saved-view exploration.
- [Generate](https://docs.justwords.ai/api/generate/) and [Batch Generate](https://docs.justwords.ai/api/batch-generate/) — direct API endpoints for LLM-backed copy generation.

## License

BUSL-1.1 — see [LICENSE](./LICENSE).
