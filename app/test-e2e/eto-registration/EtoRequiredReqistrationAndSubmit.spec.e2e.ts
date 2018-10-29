import { assertEtoDashboard, assertEtoDocuments, tid } from "../utils";
import { fillForm, TFormFixture, uploadDocumentToFieldWithTid } from "../utils/forms";
import { createAndLoginNewUser } from "../utils/userHelpers";
import {
  aboutFormRequired,
  aboutFormSubmit,
  equityTokenInfoForm,
  etoTermsRequiredForm,
  investmentTermsRequiredForm,
  legalInfoRequiredForm,
  mediaRequiredForm,
  votingRights,
} from "./fixtures";

const fillAndAssert = (section: string, sectionForm: TFormFixture) => {
  cy.get(tid(section, "button")).click();
  fillForm(sectionForm);
  assertEtoDashboard();
};

describe("Eto Forms", () => {
  beforeEach(() => createAndLoginNewUser({ type: "issuer", kyc: "business" }));
  it("should fill required fields and submit eto", () => {
    cy.visit("/dashboard");
    assertEtoDashboard();

    fillAndAssert("eto-progress-widget-about", {
      ...aboutFormRequired,
      ...aboutFormSubmit,
    });

    fillAndAssert("eto-progress-widget-legal-info", legalInfoRequiredForm);

    fillAndAssert("eto-progress-widget-investment-terms", investmentTermsRequiredForm);

    fillAndAssert("eto-progress-widget-eto-terms", etoTermsRequiredForm);

    fillAndAssert("eto-progress-widget-media", mediaRequiredForm);

    fillAndAssert("eto-progress-widget-equity-token-info", equityTokenInfoForm);

    fillAndAssert("eto-progress-widget-voting-right", votingRights);

    cy.get(tid("dashboard-upload-termsheet")).click();
    assertEtoDocuments();

    const documentsForm: TFormFixture = {
      "form.name.termsheet_template": {
        value: "example.pdf",
        method: "document",
        type: "custom",
      },
    };

    fillForm(documentsForm, { submit: false, methods: { document: uploadDocumentToFieldWithTid } });
  });
});
