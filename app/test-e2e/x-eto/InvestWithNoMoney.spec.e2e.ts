import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid } from "../utils";
import { INV_EMPTY_HAS_KYC } from "../constants";
import { waitUntilEtoIsInState } from "./utils";

const PUBLIC_ETO_ID = "0x560687Db44b19Ce8347A2D35873Dd95269dDF6bC";

describe("Try and invest without money", () => {
  it("do", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EMPTY_HAS_KYC,
      clearPendingTransactions: true,
    }).then(() => {
      cy.visit("/dashboard");
      // click invest now button
      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();
      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("10");
      cy.wait(1000);
      cy.get(tid("invest-modal-invest-now-button")).should("be.disabled");
    });
  });
});
