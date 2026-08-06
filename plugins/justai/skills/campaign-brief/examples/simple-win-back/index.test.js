import { assert, describe, it, runScriptCase } from "@justai/platform-test-harness";

describe("silver-win-back", () => {
  it("sends the win-back email to a dormant Silver member", async () => {
    const run = await runScriptCase({
      user: {
        id: "u-silver-1",
        email: "u-silver-1@example.com",
        segment: "silver",
        favorite_feature: "calculator",
      },
      mocks: {
        "iterable.user.get": {
          attributes: {
            userId: "u-silver-1",
            email: "u-silver-1@example.com",
            segment: "silver",
            favorite_feature: "calculator",
          },
          events: [],
        },
        "iterable.email.generate": {
          subject: "We miss you — your Pro trial is on us",
          body: "Hey, come back and try Pro free for 14 days.",
        },
        "iterable.email.send": {
          status: "sent",
          messageId: "msg-test-001",
        },
      },
    });

    assert.equal(run.status, "completed");
    assert.equal(run.completion_kind, "response");

    assert.deepStrictEqual(run.response_body, {
      campaign: "silver-win-back",
      userId: "u-silver-1",
      segment: "silver",
      subject: "We miss you — your Pro trial is on us",
      sendStatus: "sent",
      messageId: "msg-test-001",
    });

    assert.equal(
      run.step_history.filter((step) => step.label === "iterable.email.send").length,
      1,
    );
  });

  it("suppresses the send when the user has no email on file", async () => {
    const run = await runScriptCase({
      user: { id: "u-silver-no-email", segment: "silver" },
      mocks: {
        "iterable.user.get": {
          attributes: {
            userId: "u-silver-no-email",
            email: null,
            segment: "silver",
          },
          events: [],
        },
      },
    });

    assert.equal(run.status, "completed");
    assert.equal(run.completion_kind, "stopWhen");
    assert.equal(run.exit_reason, "missing_contact");

    assert.deepStrictEqual(run.response_body, {
      campaign: "silver-win-back",
      status: "skipped",
      reason: "no_email",
    });

    assert.equal(
      run.step_history.filter((step) => step.label === "iterable.email.generate").length,
      0,
    );
    assert.equal(
      run.step_history.filter((step) => step.label === "iterable.email.send").length,
      0,
    );
  });
});
