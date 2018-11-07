import { kycRoutes } from "../../components/kyc/routes";
import { confirmAccessModal, tid } from "../utils";
import { fillForm, uploadMultipleFilesToFieldWithTid } from "../utils/forms";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualForm } from "./fixtures";

describe("KYC Personal flow with manual verification", () => {
  it("went through KYC flow with personal data", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      // go to kyc select and then individual page
      cy.visit(kycRoutes.start);
      cy.get(tid("kyc-start-go-to-personal")).awaitedClick();
      cy.url().should("eq", `https://localhost:9090${kycRoutes.individualStart}`);

      // fill and submit the form
      fillForm(kycInvidualForm);

      // go to the manual verification with file upload
      cy.get(tid("kyc-go-to-manual-verification")).awaitedClick();
      cy.url().should("eq", `https://localhost:9090${kycRoutes.individualUpload}`);

      // upload file
      uploadMultipleFilesToFieldWithTid("kyc-personal-upload-dropzone", ["example.jpg"]);

      // submt request and accept with the wallet
      cy.get(tid("kyc-personal-upload-submit")).awaitedClick();
      confirmAccessModal();

      // panel should now be in pending state
      cy.get(tid("kyc-panel-pending"));
    });
  });
});
