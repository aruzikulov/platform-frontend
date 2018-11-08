import { INV_EUR_ICBM_HAS_KYC_SEED } from "../constants";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

const PUBLIC_ETO_ID = "0x560687Db44b19Ce8347A2D35873Dd95269dDF6bC";

describe("Invest with full icbm wallet", () => {
  it("do", () => {
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
      cy.wait(1000);

      cy.get(tid("invest-modal-eur-field"))
        .clear()
        .type("123");
      cy.wait(1000);

      cy.get(tid("invest-modal-gas-cost")).should($e => {
        expect($e.text()).to.contain("ETH 0.0000"); // no gas cost on bank transfer
      });
      cy.get(tid("invest-modal-invest-now-button")).click();

      cy.get(tid("invest-modal-bank-transfer-summary-amount")).should($m => {
        expect($m.text())
          .to.contain("123")
          .and.to.contain("€");
      });

      cy.get(tid("invest-modal-summary-confirm-button")).click();
      cy.get(tid("invest-modal-bank-transfer-details-title"));
      cy.get(tid("invest-modal-bank-transfer-details-amount")).should($m => {
        expect($m.text().trim())
          .to.contain("123")
          .and.length(6); // 123.00 or 123,00
      });
    });
  });
});
