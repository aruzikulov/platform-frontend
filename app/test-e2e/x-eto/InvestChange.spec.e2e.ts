import { INV_ETH_EUR_ICBM_HAS_KYC } from "../constants";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

const PUBLIC_ETO_ID = "0x560687Db44b19Ce8347A2D35873Dd95269dDF6bC";

describe("Invest with change", () => {
  it("do", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_EUR_ICBM_HAS_KYC,
      clearPendingTransactions: true,
    }).then(() => {
      cy.visit("/dashboard");
      // click invest now button
      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();
      // select euro from icbm wallet
      cy.wait(1000);
      cy.get(tid("invest-modal-eur-field"))
        .clear()
        .type("500");
      cy.wait(1000);
      cy.get(tid("invest-modal-invest-now-button")).click();
      cy.get(tid("invest-modal-summary-change-button")).click();
      cy.get(tid("invest-modal-eur-field"))
        .clear()
        .type("800");
      cy.get(tid("invest-modal-invest-now-button")).click();

      cy.get(tid("invest-modal-summary-your-investment")).contains("€ 800");
    });
  });
});
