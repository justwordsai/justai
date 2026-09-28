execution()
  .bind("profile", iterable.user.get({ userId: $.context.user.id }))
  .stopWhen(
    ({ bindings }) => !bindings.profile.attributes.email,
    { campaign: "silver-win-back", status: "skipped", reason: "no_email" },
    "missing_contact",
  )
  .bind(
    "draft",
    iterable.email.generate({
      prompt:
        "Write a warm, low-pressure win-back email for a dormant Silver-tier member. Offer a 14-day Pro trial with no credit card required. Reference their favorite_feature if available. Tone: familiar, not salesy.",
      user: $.profile.attributes,
      length: "short",
    }),
  )
  .bind(
    "delivery",
    iterable.email.send({
      to: $.profile.attributes.email,
      subject: $.draft.subject,
      body: $.draft.body,
    }),
  )
  .respond({
    campaign: "silver-win-back",
    userId: $.profile.attributes.userId,
    segment: $.profile.attributes.segment,
    subject: $.draft.subject,
    sendStatus: $.delivery.status,
    messageId: $.delivery.messageId,
  });
