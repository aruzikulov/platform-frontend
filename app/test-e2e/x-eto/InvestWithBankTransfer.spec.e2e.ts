import { INV_EUR_ICBM_HAS_KYC_SEED } from "../constants";
import { confirmAccessModal } from "../utils/index";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

const PUBLIC_ETO_ID = "0xef2260A8e516393F313e0E659b1A3571e98D73eE";

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
        .type("1000");
      cy.wait(1000);

      cy.get(tid("invest-modal-invest-now-button")).click();
      cy.get(tid("invest-modal-summary-confirm-button")).click();
      cy.get(tid("investment-flow.success.title"));
      // TODO check smart contracts balances
    });
  });
});