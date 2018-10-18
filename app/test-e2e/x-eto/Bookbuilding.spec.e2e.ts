import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { ISSUER_SETUP } from "../constants";
import { confirmAccessModal } from "../utils";
import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

const BOOKBUILDING_ETO_ID = "0x0d69BfC43EB3500A8A747Df979C22e3609B62A20";

describe("Bookbuilding", () => {
  it("should allow to pledge by investor", () => {
    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
      seed: ISSUER_SETUP,
    }).then(() => {
      cy.visit(appRoutes.dashboard);

      cy.get(tid("eto-flow-start-bookbuilding")).click();

      confirmAccessModal();

      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        cy.visit(withParams(appRoutes.etoPublicView, { etoId: BOOKBUILDING_ETO_ID }));

        fillForm({
          amount: "10000",
          consentToRevealEmail: {
            type: "check",
            value: "",
          },
          "eto-bookbuilding-back-now": { type: "submit" },
        });

        confirmAccessModal();

        cy.get(tid("eto-bookbuilding-amount-backed")).should("contain", "€10 000");
        cy.get(tid("eto-bookbuilding-investors-backed")).should("contain", "1");

        createAndLoginNewUser({
          type: "investor",
          kyc: "business",
        }).then(() => {
          cy.visit(withParams(appRoutes.etoPublicView, { etoId: BOOKBUILDING_ETO_ID }));

          fillForm({
            amount: "15000",
            "eto-bookbuilding-back-now": { type: "submit" },
          });

          confirmAccessModal();

          cy.get(tid("eto-bookbuilding-amount-backed")).should("contain", "€25 000");
          cy.get(tid("eto-bookbuilding-investors-backed")).should("contain", "2");
        });
      });
    });
  });
});
