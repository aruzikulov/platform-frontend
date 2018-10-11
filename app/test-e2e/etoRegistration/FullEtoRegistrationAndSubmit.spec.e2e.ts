import { assertEtoDashboard, tid } from "../utils";
import { fillForm, TFormFixture } from "../utils/forms";
import { createAndLoginNewUser } from "../utils/userHelpers";
import {
  aboutForm,
  equityTokenInfoForm,
  etoKeyIndividualsForm,
  etoTermsForm,
  investmentTermsForm,
  legalInfoForm,
  mediaForm,
  productVisionForm,
  riskForm,
  votingRights,
} from "./fixtures";

const fillAndAssert = (section: string, sectionForm: TFormFixture) => {
  cy.get(tid(section, "button")).click();
  fillForm(sectionForm);
  assertEtoDashboard();
  cy.get(`${tid(section)} ${tid("chart-circle.progress")}`).should("contain", "100%");
};

describe("Eto Forms", () => {
  beforeEach(() => createAndLoginNewUser({ type: "issuer", kyc: "business" }));
  it("will fill and submit them all", () => {
    cy.visit("/dashboard");
    assertEtoDashboard();

    fillAndAssert("eto-progress-widget-about", aboutForm);

    fillAndAssert("eto-progress-widget-legal-info", legalInfoForm);

    fillAndAssert("eto-progress-widget-investment-terms", investmentTermsForm);

    fillAndAssert("eto-progress-widget-eto-terms", etoTermsForm);

    cy.get(tid("eto-progress-widget-key-individuals", "button")).awaitedClick();
    // first click on all the add buttons to open the fields
    cy.get(tid("key-individuals-group-button-team")).click();
    cy.get(tid("key-individuals-group-button-advisors")).awaitedClick();
    cy.get(tid("key-individuals-group-button-keyAlliances")).awaitedClick();
    cy.get(tid("key-individuals-group-button-boardMembers")).awaitedClick();
    cy.get(tid("key-individuals-group-button-notableInvestors")).awaitedClick();
    cy.get(tid("key-individuals-group-button-keyCustomers")).awaitedClick();
    cy.get(tid("key-individuals-group-button-partners")).awaitedClick();
    fillForm(etoKeyIndividualsForm);
    assertEtoDashboard();
    cy.get(`${tid("eto-progress-widget-key-individuals")} ${tid("chart-circle.progress")}`).should(
      "contain",
      "100%",
    );

    fillAndAssert("eto-progress-widget-product-vision", productVisionForm);

    fillAndAssert("eto-progress-widget-media", mediaForm);

    fillAndAssert("eto-progress-widget-risk-assessment", riskForm);

    fillAndAssert("eto-progress-widget-equity-token-info", equityTokenInfoForm);

    fillAndAssert("eto-progress-widget-voting-right", votingRights);
  });
});
