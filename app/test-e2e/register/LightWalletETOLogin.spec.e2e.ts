import {
  assertEtoDashboard,
  convertToUniqueEmail,
  registerWithLightWalletETO,
  tid,
} from "../utils";

const password = "strongpassword";

const loginWithLightWalletETO = (testEmail: string, password: string) => {
  registerWithLightWalletETO(testEmail, password);
  assertEtoDashboard();

  cy.get(tid("Header-logout")).awaitedClick();

  cy.get(tid("Header-login-eto")).awaitedClick();

  cy.get(tid("wallet-selector-light")).awaitedClick();

  cy.contains(tid("light-wallet-login-with-email-email-field"), testEmail);

  cy.get(tid("light-wallet-login-with-email-password-field")).type(password);

  cy.get(tid("wallet-selector-nuewallet.login-button")).awaitedClick();

  assertEtoDashboard();
};

describe("Light Wallet ETO Login", () => {
  it("should register logout then login as an investor", () => {
    const testEmail = convertToUniqueEmail("moe@test.com");
    loginWithLightWalletETO(testEmail, password);
  });
  it("should login/logout as investor navigate to ETO then login/logout as issuer", () => {
    const testEmail = convertToUniqueEmail("moe@test.com");
    loginWithLightWalletETO(testEmail, password);
  });
});
