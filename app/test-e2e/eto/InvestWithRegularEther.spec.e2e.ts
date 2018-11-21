import { confirmAccessModal } from "./../utils/index";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid } from "../utils/selectors";
import { INV_EUR_ICBM_HAS_KYC_SEED } from "../constants";
import { etoFixtureAddressByName } from "../utils";

describe("Invest with ethereum", () => {
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
      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("10");
      cy.wait(1000);
      cy.get(tid("invest-modal-invest-now-button")).click();
      cy.get(tid("invest-modal-summary-confirm-button")).click();
      confirmAccessModal();
      cy.get(tid("investment-flow.success.title"));
      // TODO check smart contracts balances})
    });
  });
});
