import {
  assertErrorModal,
  assertWaitForLatestEmailSentWithSalt,
  assertUserInDashboard,
  clearEmailServer,
  mockApiUrl,
  typeEmailPassword,
  typeLightwalletRecoveryPhrase,
  tid,
} from "../utils";
import { recoverRoutes } from "../../components/walletSelector/walletRecover/recoverRoutes";

describe("Wallet recover", () => {
  const words = [
    "argue",
    "resemble",
    "sustain",
    "tattoo",
    "know",
    "goat",
    "parade",
    "idea",
    "science",
    "okay",
    "loan",
    "float",
    "solution",
    "used",
    "order",
    "dune",
    "essay",
    "achieve",
    "illness",
    "keen",
    "guitar",
    "stumble",
    "idea",
    "strike",
  ];

  const expectedGeneratedAddress = "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3";

  it("should recover wallet from saved phrases", () => {
    const email = "john-smith@example.com";
    clearEmailServer();

    cy.visit(`${recoverRoutes.seed}`);

    typeLightwalletRecoveryPhrase(words);

    cy.get(tid("wallet-selector-register-email")).type(email);
    cy.get(tid("wallet-selector-register-password")).type("strongpassword");
    cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword{enter}");

    cy.get(tid("recovery-success-btn-go-dashboard")).awaitedClick();

    assertWaitForLatestEmailSentWithSalt(email);

    cy.contains(tid("my-neu-widget-neumark-balance"), "151848.6894 NEU");

    cy.contains(tid("my-wallet-widget-eur-token-large-value"), "0.00 nEUR");
    cy.contains(tid("my-wallet-widget-eur-token-value"), "0.00 EUR");

    // remove this for now...
    // cy.contains(tid("my-wallet-widget-eth-token-large-value"), "ETH999 938.8591");
    // cy.contains(tid("my-wallet-widget-eth-token-value"), "483 930 410.24 EUR");

    cy.get(tid("authorized-layout-settings-button")).awaitedClick();

    cy.get(tid("account-address.your.ether-address.input")).should(
      "have.value",
      expectedGeneratedAddress,
    );
  });

  it("should return an error when recovering seed and using an already verified email", () => {
    const words = [
      "argue",
      "resemble",
      "sustain",
      "tattoo",
      "know",
      "goat",
      "parade",
      "idea",
      "science",
      "okay",
      "loan",
      "float",
      "solution",
      "used",
      "order",
      "dune",
      "essay",
      "achieve",
      "illness",
      "keen",
      "guitar",
      "stumble",
      "idea",
      "strike",
    ];

    //@see https://github.com/Neufund/platform-backend/tree/master/deploy#dev-fixtures
    const email = "0xE6Ad2@neufund.org";
    const password = "strongpassword";

    cy.visit(`${recoverRoutes.seed}`);
    typeLightwalletRecoveryPhrase(words);
    typeEmailPassword(email, password);

    cy.wait(2000);
    assertErrorModal();
  });

  it("should recover user with same email if its the same user", () => {
    //@see https://github.com/Neufund/platform-backend/tree/master/deploy#dev-fixtures
    const words = [
      "juice",
      "chest",
      "position",
      "grace",
      "weather",
      "matter",
      "turn",
      "delay",
      "space",
      "abuse",
      "winter",
      "slice",
      "tell",
      "flip",
      "use",
      "between",
      "crouch",
      "shop",
      "open",
      "leg",
      "elegant",
      "bracket",
      "lamp",
      "day",
    ];

    const email = "0xE6Ad2@neufund.org";
    const password = "strongpassword";
    clearEmailServer();

    cy.visit(`${recoverRoutes.seed}`);
    typeLightwalletRecoveryPhrase(words);
    typeEmailPassword(email, password);

    assertWaitForLatestEmailSentWithSalt(email.toLowerCase());

    cy.get(tid("recovery-success-btn-go-dashboard")).awaitedClick();

    assertUserInDashboard();
  });

  it("should recover existing user with verified email from saved phrases and change email", () => {
    //@see https://github.com/Neufund/platform-backend/tree/master/deploy#dev-fixtures
    const words = [
      "juice",
      "chest",
      "position",
      "grace",
      "weather",
      "matter",
      "turn",
      "delay",
      "space",
      "abuse",
      "winter",
      "slice",
      "tell",
      "flip",
      "use",
      "between",
      "crouch",
      "shop",
      "open",
      "leg",
      "elegant",
      "bracket",
      "lamp",
      "day",
    ];
    const email = "john-smith@example.com";
    clearEmailServer();

    cy.visit(`${recoverRoutes.seed}`);

    typeLightwalletRecoveryPhrase(words);

    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "DELETE" });

    cy.get(tid("wallet-selector-register-email")).type(email);
    cy.get(tid("wallet-selector-register-password")).type("strongpassword");
    cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword{enter}");

    cy.get(tid("recovery-success-btn-go-dashboard")).awaitedClick();

    assertWaitForLatestEmailSentWithSalt(email);

    assertUserInDashboard();
  });
});
