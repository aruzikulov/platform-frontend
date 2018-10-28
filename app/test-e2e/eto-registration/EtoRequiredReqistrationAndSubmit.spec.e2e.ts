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
    cy.visit("/documents");

    assertEtoDocuments();

    const documentsForm: TFormFixture = {
      "form.name.termsheet_template": {
        value: "example.pdf",
        method: "document",
        type: "custom",
      },
    };

    fillForm(documentsForm, { submit: false, methods: { document: uploadDocumentToFieldWithTid }});
  });
});
