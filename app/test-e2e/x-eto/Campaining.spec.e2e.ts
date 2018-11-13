import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { ISSUER_SETUP } from "../constants";
import { assertRegister, confirmAccessModal } from "../utils";
import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { etoFixtureAddressByName } from "../utils";

describe("Eto campaining state", () => {
  it("should show Register button when not logged in", () => {
    const ETO_ID = etoFixtureAddressByName("ETONoStartDate")!;

    cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
    cy.get(tid("eto.public-view")).should("exist");

    cy.get(tid("logged-out-campaigning-register")).click();

    assertRegister();
  });

  it("should show founders quote when logged in and campaigning date is not set", () => {
    const ETO_ID = etoFixtureAddressByName("ETONoStartDate")!;

    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
    }).then(() => {
      cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
      cy.get(tid("eto.public-view")).should("exist");

      cy.get(tid("eto-overview-status-founders-quote")).should("exist");
    });
  });

  it("should allow to pledge by investor", () => {
    // eto ID must match issuer SEED below
    const ETO_ID = etoFixtureAddressByName("ETOInSetupState")!;

    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
      seed: ISSUER_SETUP,
    }).then(() => {
      cy.visit(appRoutes.dashboard);

      cy.get(tid("eto-flow-start-bookbuilding")).click();

      confirmAccessModal();

      // give it a chance to settle before logging out
      cy.wait(5000);

      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
        cy.reload();
        fillForm({
          amount: "10000",
          consentToRevealEmail: {
            type: "radio",
            value: "true",
          },
          "eto-bookbuilding-back-now": { type: "submit" },
        });

        confirmAccessModal();

        cy.get(tid("eto-bookbuilding-amount-backed")).should("contain", "€10 000");
        cy.get(tid("eto-bookbuilding-investors-backed")).should("contain", "1");

        // give it a chance to settle before logging out
        cy.wait(5000);

        createAndLoginNewUser({
          type: "investor",
          kyc: "business",
        }).then(() => {
          cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
          cy.reload();
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
