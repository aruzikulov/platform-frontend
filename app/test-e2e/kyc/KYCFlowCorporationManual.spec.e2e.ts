import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { fillForm } from "../utils/forms";

import {
  kycCorporateCompanyForm,
  kycCompanyDocsForm,
  kycLegalRepForm,
  kycLegalRepDocsForm,
} from "./fixtures";
import { acceptWallet } from "./util";

describe("KYC Small Business flow with manual verification", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("went through KYC Small Business flow", () => {
    // go to corporate start page
    cy.visit(kycRoutes.start);
    cy.get(tid("kyc-start-go-to-company")).awaitedClick();
    cy.get(tid("kyc-start-business-go-to-corporation")).awaitedClick();

    // fill out and submit business form
    fillForm(kycCorporateCompanyForm);
    fillForm(kycCompanyDocsForm);

    // uplaod legal rep data
    fillForm(kycLegalRepForm);
    fillForm(kycLegalRepDocsForm, { submit: false });

    // add a new beneficial owner entry
    cy.get(tid("kyc-beneficial-owner-add-new")).awaitedClick();
    // remove him again
    cy.get(tid("kyc-beneficial-owner-delete")).awaitedClick();

    // submit and accept
    cy.get(tid("kyc-company-legal-representative-upload-and-submit")).awaitedClick();
    acceptWallet();

    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending"));
  });
});
