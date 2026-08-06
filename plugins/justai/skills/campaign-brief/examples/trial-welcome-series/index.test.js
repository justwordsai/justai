import { assert, describe, it, runScriptCase } from "@justai/platform-test-harness";

const mockSendSuccess = { status: "sent", messageId: "msg-test" };

const mockGenerateForDay = (day) => ({
  subject: `Day ${day} welcome subject`,
  body: `Day ${day} welcome body`,
});

describe("trial-welcome-calculator", () => {
  it("sends all four touchpoints for an educated rookie", async () => {
    const run = await runScriptCase({
      user: {
        id: "u-rookie-1",
        email: "u-rookie-1@example.com",
        segment: "pro_trial",
        experience_level: "educated_rookie",
      },
      mocks: {
        "iterable.user.get": {
          attributes: {
            userId: "u-rookie-1",
            email: "u-rookie-1@example.com",
            segment: "pro_trial",
            experience_level: "educated_rookie",
          },
          events: [],
        },
        "iterable.email.generate": mockGenerateForDay(0),
        "iterable.email.send": mockSendSuccess,
      },
    });

    assert.equal(run.status, "completed");
    assert.equal(run.completion_kind, "response");

    const body = run.response_body;
    assert.equal(body.campaign, "trial-welcome-calculator");
    assert.equal(body.userId, "u-rookie-1");
    assert.equal(body.experienceLevel, "educated_rookie");
    assert.equal(body.touchpoints.length, 4);
    assert.deepStrictEqual(
      body.touchpoints.map((t) => t.day),
      [0, 2, 4, 6],
    );
    body.touchpoints.forEach((touch) => {
      assert.equal(touch.status, "sent");
    });

    assert.equal(
      run.step_history.filter((step) => step.label === "iterable.email.send").length,
      4,
    );
    assert.equal(
      run.step_history.filter((step) => step.label === "iterable.email.generate").length,
      4,
    );
  });

  it("picks the uneducated_rookie prompt variant for a beginner", async () => {
    const run = await runScriptCase({
      user: {
        id: "u-beginner",
        email: "u-beginner@example.com",
        experience_level: "uneducated_rookie",
      },
      mocks: {
        "iterable.user.get": {
          attributes: {
            userId: "u-beginner",
            email: "u-beginner@example.com",
            experience_level: "uneducated_rookie",
          },
          events: [],
        },
        "iterable.email.generate": mockGenerateForDay(0),
        "iterable.email.send": mockSendSuccess,
      },
    });

    assert.equal(run.status, "completed");

    const generateCalls = run.step_history.filter(
      (step) => step.label === "iterable.email.generate",
    );
    assert.equal(generateCalls.length, 4);

    const firstPrompt = generateCalls[0]?.args?.prompt ?? "";
    assert.ok(
      firstPrompt.includes("new to real estate investing"),
      `expected uneducated_rookie prompt, got: ${firstPrompt}`,
    );
  });

  it("picks the experienced prompt variant for a seasoned investor", async () => {
    const run = await runScriptCase({
      user: {
        id: "u-pro",
        email: "u-pro@example.com",
        experience_level: "experienced",
      },
      mocks: {
        "iterable.user.get": {
          attributes: {
            userId: "u-pro",
            email: "u-pro@example.com",
            experience_level: "experienced",
          },
          events: [],
        },
        "iterable.email.generate": mockGenerateForDay(0),
        "iterable.email.send": mockSendSuccess,
      },
    });

    assert.equal(run.status, "completed");

    const generateCalls = run.step_history.filter(
      (step) => step.label === "iterable.email.generate",
    );
    const firstPrompt = generateCalls[0]?.args?.prompt ?? "";
    assert.ok(
      firstPrompt.includes("experienced real estate investor"),
      `expected experienced prompt, got: ${firstPrompt}`,
    );
  });

  it("suppresses the whole sequence when the user has no email on file", async () => {
    const run = await runScriptCase({
      user: { id: "u-no-email", experience_level: "educated_rookie" },
      mocks: {
        "iterable.user.get": {
          attributes: {
            userId: "u-no-email",
            email: null,
            experience_level: "educated_rookie",
          },
          events: [],
        },
      },
    });

    assert.equal(run.status, "completed");
    assert.equal(run.completion_kind, "stopWhen");
    assert.equal(run.exit_reason, "missing_contact");

    assert.deepStrictEqual(run.response_body, {
      campaign: "trial-welcome-calculator",
      status: "skipped",
      reason: "no_email",
    });

    assert.equal(
      run.step_history.filter((step) => step.label === "iterable.email.send").length,
      0,
    );
  });
});
