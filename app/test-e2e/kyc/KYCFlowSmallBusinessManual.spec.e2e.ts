import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { fillForm } from "../utils/forms";
import {
  kycCompanyDocsForm,
  kycCompanyForm,
  kycLegalRepForm,
  kycLegalRepDocsForm,
} from "./fixtures";
import { acceptWallet } from "./util";

describe("KYC Small Business flow with manual verification", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("went through KYC Small Business flow", () => {
    // go to the small business starting page
    cy.visit(kycRoutes.start);
    cy.get(tid("kyc-start-go-to-company")).awaitedClick();
    cy.get(tid("kyc-start-company-go-to-small-business")).awaitedClick();
    cy.url().should("eq", `https://localhost:9090${kycRoutes.businessData}`);

    // fill out and submit business form
    fillForm(kycCompanyForm);
    fillForm(kycCompanyDocsForm);

    // fill out and submit legal rep forms
    fillForm(kycLegalRepForm);
    fillForm(kycLegalRepDocsForm);

    // accept the wallet
    acceptWallet();

    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending"));
  });
});
