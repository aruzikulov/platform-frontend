import { INV_EUR_ICBM_HAS_KYC_SEED } from "../constants";
import { etoFixtureAddressByName } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Invest with full icbm wallet", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      clearPendingTransactions: true,
    }).then(() => {
      cy.visit("/dashboard");
      // click invest now button
      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();
      cy.get(tid("investment-type.selector.BANK_TRANSFER")).check({ force: true });
      cy.get(tid("invest-modal-eur-field"))
        .clear()
        .type("123");
      cy.wait(1000);

      // no gas cost on bank transfer
      cy.get(tid("invest-modal-gas-cost")).should("contain", "ETH 0.0000");
      cy.get(tid("invest-modal-invest-now-button")).click();

      cy.get(tid("invest-modal-bank-transfer-summary-amount")).should($e =>
        expect($e.text().trim()).to.match(/123[\.|,]00/),
      );

      cy.get(tid("invest-modal-summary-confirm-button")).click();
      cy.get(tid("invest-modal-bank-transfer-details-title"));
      cy.get(tid("invest-modal-bank-transfer-details-amount")).should($e =>
        expect($e.text().trim()).to.match(/123[\.|,]00/),
      );
    });
  });
});
