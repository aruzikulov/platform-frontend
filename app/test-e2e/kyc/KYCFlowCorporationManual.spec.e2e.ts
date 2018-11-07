import { kycRoutes } from "../../components/kyc/routes";
import { confirmAccessModal, tid } from "../utils";
import { fillForm } from "../utils/forms";
import { createAndLoginNewUser } from "../utils/userHelpers";
import {
  kycCompanyDocsForm,
  kycCorporateCompanyForm,
  kycLegalRepDocsForm,
  kycLegalRepForm,
} from "./fixtures";

describe("KYC Small Business flow with manual verification", () => {
  it("went through KYC Small Business flow", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
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
      confirmAccessModal();

      // panel should now be in pending state
      cy.get(tid("kyc-panel-pending"));
    });
  });
});
