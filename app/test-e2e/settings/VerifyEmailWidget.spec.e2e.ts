import {
  assertWaitForLatestEmailSentWithSalt,
  assertUserInDashboard,
  assertVerifyEmailWidgetIsInNoEmailState,
  assertVerifyEmailWidgetIsInUnverifiedEmailState,
  assertVerifyEmailWidgetIsInVerfiedEmailState,
  clearEmailServer,
  confirmAccessModal,
  convertToUniqueEmail,
  goToSettings,
  registerWithLightWallet,
  verifyLatestUserEmail,
  tid,
} from "../utils";

describe("Verify Email Widget", () => {
  it("should change user email after register", () => {
    const firstEmail = "moe-wallet-backup-e2e@test.com";
    const secondEmail = convertToUniqueEmail(firstEmail);
    const password = "strongpassword";

    registerWithLightWallet(firstEmail, password);
    clearEmailServer();
    assertUserInDashboard();

    goToSettings();
    assertVerifyEmailWidgetIsInUnverifiedEmailState();
    cy.get(tid("verify-email-widget.change-email.button")).click();
    assertVerifyEmailWidgetIsInNoEmailState();

    cy.get(tid("verify-email-widget-form-email-input")).type(secondEmail);
    cy.get(tid("verify-email-widget-form-submit"))
      .wait(1500)
      .click();

    confirmAccessModal(password);

    // Email server takes time before getting the request
    assertWaitForLatestEmailSentWithSalt(secondEmail);
    verifyLatestUserEmail();

    assertVerifyEmailWidgetIsInVerfiedEmailState();
    assertVerifyEmailWidgetIsInUnverifiedEmailState(true);
    assertVerifyEmailWidgetIsInNoEmailState(true);
  });
});
