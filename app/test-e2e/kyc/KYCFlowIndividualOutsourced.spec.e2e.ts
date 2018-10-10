import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualForm } from "./fixtures";
import { fillForm } from "../utils/forms";

describe("KYC Personal flow with manual verification", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("went through KYC flow with personal data", () => {
    // go to kyc select and then individual page
    cy.visit(kycRoutes.start);
    cy.get(tid("kyc-start-go-to-personal")).awaitedClick();
    cy.url().should("eq", `https://localhost:9090${kycRoutes.individualStart}`);

    // fill and submit the form
    fillForm(kycInvidualForm);

    // go to the outsource option
    cy.get(tid("kyc-go-to-outsourced-verification")).awaitedClick();

    // we should now be on the outsourced page
    cy.url().should("eq", `https://localhost:9090${kycRoutes.individualInstantId}`);
  });
});
