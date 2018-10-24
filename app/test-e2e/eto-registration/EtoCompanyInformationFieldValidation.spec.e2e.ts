import { etoRegisterRoutes } from "../../components/eto/registration/routes";
import { getFieldError } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { aboutFormRequired } from "./fixtures";

describe("Eto Company Information Field Validation", () => {
  beforeEach(() => createAndLoginNewUser({ type: "issuer", kyc: "business" }));

  it("should correctly validate required fields", () => {
    cy.visit(etoRegisterRoutes.companyInformation);
    cy.get(tid("eto.form.company-information")).should("exist");

    const requiredFields = Object.keys(aboutFormRequired);

    requiredFields.forEach(key => {
      getFieldError(tid("eto.form.company-information"), key).then(
        error => expect(error).to.be.empty,
      );
    });

    cy.get(tid("eto-registration-company-information-submit")).click();

    requiredFields.forEach(key => {
      getFieldError(tid("eto.form.company-information"), key).then(error =>
        expect(error).to.equal("This field is required"),
      );
    });
  });
});
