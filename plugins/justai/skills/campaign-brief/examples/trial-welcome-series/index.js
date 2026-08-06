const promptFor = (touchpoint) => ({
  uneducated_rookie: `Write a Day ${touchpoint} welcome email for a new Pro trial user who is new to real estate investing. Entry point: Calculator. Tone: reassuring, educational, concrete next step.`,
  educated_rookie: `Write a Day ${touchpoint} welcome email for a new Pro trial user with basic real estate knowledge. Entry point: Calculator. Tone: confident, practical, push toward their first analysis.`,
  experienced: `Write a Day ${touchpoint} welcome email for an experienced real estate investor starting a Pro trial. Entry point: Calculator. Tone: efficient, feature-depth forward, no hand-holding.`,
});

const generateForPersona = (touchpoint) =>
  iterable.email.generate({
    prompt: ({ bindings }) =>
      promptFor(touchpoint)[bindings.profile.attributes.experience_level],
    user: $.profile.attributes,
    length: "short",
  });

const sendTouchpoint = (draftKey) =>
  iterable.email.send({
    to: $.profile.attributes.email,
    subject: ({ bindings }) => bindings[draftKey].subject,
    body: ({ bindings }) => bindings[draftKey].body,
  });

execution()
  .bind("profile", iterable.user.get({ userId: $.context.user.id }))
  .stopWhen(
    ({ bindings }) => !bindings.profile.attributes.email,
    {
      campaign: "trial-welcome-calculator",
      status: "skipped",
      reason: "no_email",
    },
    "missing_contact",
  )

  // Day 0 — welcome
  .bind("draft1", generateForPersona(0))
  .bind("delivery1", sendTouchpoint("draft1"))
  .sleep(duration.days(2))

  // Day 2 — alerts setup
  .bind("draft2", generateForPersona(2))
  .bind("delivery2", sendTouchpoint("draft2"))
  .sleep(duration.days(2))

  // Day 4 — analyze real properties
  .bind("draft3", generateForPersona(4))
  .bind("delivery3", sendTouchpoint("draft3"))
  .sleep(duration.days(2))

  // Day 6 — Pro toolkit recap
  .bind("draft4", generateForPersona(6))
  .bind("delivery4", sendTouchpoint("draft4"))

  .respond({
    campaign: "trial-welcome-calculator",
    userId: $.profile.attributes.userId,
    segment: $.profile.attributes.segment,
    experienceLevel: $.profile.attributes.experience_level,
    touchpoints: [
      { day: 0, subject: $.draft1.subject, status: $.delivery1.status },
      { day: 2, subject: $.draft2.subject, status: $.delivery2.status },
      { day: 4, subject: $.draft3.subject, status: $.delivery3.status },
      { day: 6, subject: $.draft4.subject, status: $.delivery4.status },
    ],
  });
