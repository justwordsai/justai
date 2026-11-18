# JustAI

JustAI helps marketers plan campaigns and build personalized email journeys.
This plugin brings JustAI into Claude: plan a campaign, size its audience, write
and review its emails, build the journey, and report on it, all from a
conversation. It works on claude.ai, in Cowork, and in Claude Code.

You need a JustAI account. Everything the plugin reads or changes happens in
your own JustAI workspace, with your permissions.

## What it does

The plugin includes six skills. Claude picks the right one from what you ask.

| Skill                 | Use it when…                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| **campaign-brief**    | A campaign idea is new or fuzzy and needs a signed-off brief: audience, goal, KPIs, sequence, copy. |
| **audience-analysis** | You need to decide who to target, size an audience, or save it as a segment.                        |
| **deploy-campaign**   | The plan is settled and the journey and its emails should be built, changed, or checked for readiness. |
| **content-review**    | A journey's emails need proofreading or a check against your brand and tone guidelines.            |
| **campaign-report**   | You want to know how a journey or the program is performing, or a report on setup, draft vs. live, and readiness. |
| **competitive-brief** | Messaging should be shaped against a specific competitor or category.                               |

What stays with you:

- **Turning journeys on, pausing, and archiving.** Claude never does these;
  you do them in JustAI. New journeys are always created off.
- **Publishing a draft.** Changes to a live journey go to its draft. Claude
  publishes a draft only when you ask, after showing you what changed and
  getting your confirmation.
- **Saving audiences.** Claude shows the audience size first and saves the
  segment only when you say so.

Claude reads audience sizes and profile field names, not individual customer
profiles. Journey reports read each journey's analytics and your program's
holdout results (rates, lift, and how sure it is, over a time window), not
per-person activity.

## Install

### claude.ai and Cowork

1. Open **Customize > Plugins** and add **JustAI**.
2. Open the plugin's **Connectors** tab and connect **JustAI**. Sign in with
   your JustAI account when prompted.

On Team and Enterprise plans, an Owner must add the JustAI connector for the
organization before members can connect it.

### Claude Code

```bash
claude plugin marketplace add justwordsai/justai
claude plugin install justai@justai
```

Start Claude Code, run `/mcp`, choose **justai-platform**, and sign in with
your JustAI account. A claude.ai install also syncs to Claude Code at the next
session start.

### Codex

Add the `justwordsai/justai` marketplace and install `justai`, then run
`codex mcp login justai-platform` and sign in with your JustAI account.

## Connecting

The plugin connects to `https://platform.justwords.ai/mcp`. The first time you
connect, JustAI opens a sign-in page. After you sign in and approve access,
Claude acts in the JustAI workspace you chose, with your permissions. You can
disconnect at any time from your Claude connector settings.

## Example prompts

```text
Plan a win-back campaign for customers who have not logged in for 30 days.
```

```text
How many customers on the trial plan have no company name on their profile?
Save that audience as "Incomplete trial profiles".
```

```text
Build the onboarding journey from this brief, validate it, and show me the diagram.
```

```text
Review the emails in my onboarding journey against our brand guidelines.
```

```text
What changed in my upsell journey's draft compared with what is live? Is it ready?
```

```text
Build a competitive brief against [competitor] for our next campaign.
```

## Data and privacy

- The plugin sends requests to JustAI only when Claude uses a JustAI tool.
  Each request carries what that task needs, such as an audience rule, email
  copy, or journey steps, and acts only in your signed-in workspace.
- Audience tools return counts and field values seen across your customers,
  not individual customer profiles.
- Writes are limited to your JustAI workspace: emails, segments, journeys
  (created off), and brand guidelines when you ask. Nothing is sent to your
  customers unless you turn a journey on or ask Claude to publish a live
  journey's draft.
- JustAI handles your data under its privacy policy:
  <https://www.getjust.ai/privacy-policy>.

## Troubleshooting

| Issue                                        | Fix                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Claude says the JustAI tools aren't available | Connect JustAI from the plugin's Connectors tab (claude.ai, Cowork) or run `/mcp` and sign in (Claude Code). |
| JustAI reports you are not authorized        | Your sign-in expired or was revoked. Disconnect and reconnect JustAI to sign in again.                       |
| A journey will not validate                  | Ask for a readiness check. It names the failing step and why.                                                |
| A step type from the brief is missing        | Ask which step types your workspace can build. Some depend on your JustAI plan and setup.                    |
| Claude will not turn a journey on            | By design. Review the readiness check and diagram, then turn it on yourself in JustAI.                       |

## Support

Email <support@justwords.ai>. Documentation: <https://docs.justwords.ai/api/platform-plugin/>.

## License

BUSL-1.1. See [LICENSE](./LICENSE).
