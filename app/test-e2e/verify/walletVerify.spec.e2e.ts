import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { logoutViaTopRightButton, goToDashboard } from "../utils";

describe("Invest with change", () => {
  it("do", () => {
    const TEST_LINK =
      "https://localhost:9090/email-verify?code=b7fb21ea-b248-4bc3-8500-b3f2b8644c17&email=pavloblack%40hotmail.com&user_type=investor&wallet_type=light&wallet_subtype=unknown&salt=XzNJFpdkgjOxrUXPFD6NmzkUGGpUmuA5vjrt1xyMFd4%3D";

    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();
      logoutViaTopRightButton();
      goToDashboard();
      cy.get(tid("light-wallet-login-with-email-email-field")).then(registerEmailNode => {
        const registerEmail = registerEmailNode.text();
        cy.log("Email used for registering:", registerEmail);
        // Use activation link
        cy.visit(TEST_LINK);
        cy.get(tid("light-wallet-login-with-email-email-field")).then(activationEmailNode => {
          const activationEmail = activationEmailNode.text();
          expect(activationEmail).to.not.equal(registerEmail);
        });
      });
    });
  });
});
