import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualForm } from "./fixtures";
import { uploadFileToFieldWithTid, fillForm } from "../utils/forms";
import { acceptWallet } from "./util";

describe("KYC Personal flow with manual verification", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("went through KYC flow with personal data", () => {
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
    uploadFileToFieldWithTid("kyc-personal-upload-dropzone");

    // submt request and accept with the wallet
    cy.get(tid("kyc-personal-upload-submit")).awaitedClick();
    acceptWallet();

    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending"));
  });
});
