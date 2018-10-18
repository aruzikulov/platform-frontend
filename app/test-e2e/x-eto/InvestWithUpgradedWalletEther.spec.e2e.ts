import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid } from "../utils/selectors";
import { INV_ETH_EUR_ICBM_HAS_KYC } from "../constants";
import { confirmAccessModal } from "../utils/index";

const PUBLIC_ETO_ID = "0x560687Db44b19Ce8347A2D35873Dd95269dDF6bC";

describe("Invest with euro token", () => {
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
      cy.get(tid("investment-type.selector.ICBM_ETH")).check({ force: true });
      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("10");
      cy.wait(1000);
      cy.get(tid("invest-modal-invest-now-button")).click();
      cy.get(tid("invest-modal-summary-confirm-button")).click();
      confirmAccessModal();
      cy.get(tid("investment-flow.success.title"));
      // TODO check smart contracts balances
    });
  });
});
