---
name: competitive-brief
description: Research a competitor or crowded category and turn the findings into campaign positioning - a differentiation angle, proof points, phrases to use, and claims to avoid. Use when a campaign needs differentiation, comparison talking points, a response to a competitor's offer, or sharper message framing.
---

# Competitive brief

Use this skill when campaign messaging should be shaped by a competitor or a
crowded category. It works without JustAI connected; the connector only adds
the organization's own brand rules.

## Workflow

1. Define the competitive question.
   - Which competitor or category?
   - Which audience is comparing options?
   - What campaign is this meant to support?

2. Read the organization's own rules, if JustAI is connected.
   `list_brand_guidelines` and `get_brand_guideline`, so the angle does not
   contradict the brand's voice or its rules on comparative claims.

3. Gather sources.
   - If web search or fetch is available in this session, use it.
   - If it is not, ask the marketer for sources: competitor pages, pricing,
     recent emails or ads, reviews, sales notes. Work only from what they give.
   - Cite every claim with its source and date. Mark anything unverified.
     Never state competitor pricing or features without a dated source.

4. Research the comparison.
   - positioning and target audience
   - pricing and packaging
   - message themes and offers
   - weaknesses or gaps
   - claims that are risky to mirror

5. Turn research into campaign guidance.
   - core differentiation angle
   - supporting proof points (the brand's own, not assumed)
   - phrases to lean into
   - claims to avoid, and why

6. Offer to record it. Only if the marketer asks, save the phrases and claims
   rules as brand guidance with `save_brand_guideline`. It replaces a
   guideline with the same name, so read the existing one first and keep its
   unrelated rules.

## Output format

```text
Competitive context:
Sources (with dates):
Primary differentiation angle:
Supporting proof points:
Messaging to lean into:
Messaging to avoid:
Recommended campaign hook:
Next step:
```

## Handoffs

- `campaign-brief` when the campaign still needs a full brief; resume there at
  step 5 (message direction).
- `deploy-campaign` when the brief is settled and only the copy needs updating
  in the journey.
